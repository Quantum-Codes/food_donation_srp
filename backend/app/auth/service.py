from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from app.config import get_settings
from app.database import supabase, supabase_admin
from app.models.schemas import UserCreate, UserLogin, UserRole
from fastapi import HTTPException, status

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password:  str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else: 
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.jwt_secret_key, 
        algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


def validate_password_strength(password: str) -> bool:
    """Check password meets requirements"""
    if len(password) < 8:
        return False
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    return has_upper and has_lower and has_digit


async def register_user(user_data: UserCreate) -> dict:
    """Register a new user"""
    # Validate password strength
    if not validate_password_strength(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters with uppercase, lowercase, and numbers"
        )
    
    # Check if email already exists
    existing = supabase.table("users").select("id").eq("email", user_data.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # If staff, verify NGO exists
    ngo_name = None
    if user_data.role == UserRole.staff:
        if not user_data.ngo_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Staff registration requires an NGO ID"
            )
        ngo_response = supabase.table("ngos").select("id, name").eq("id", user_data.ngo_id).execute()
        if not ngo_response.data:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid NGO ID"
            )
        ngo_name = ngo_response.data[0]["name"]
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    
    user_dict = {
        "email": user_data.email,
        "full_name": user_data. full_name,
        "password_hash": hashed_password,
        "role": user_data. role.value,
        "ngo_id": user_data. ngo_id if user_data.role == UserRole.staff else None,
        "points": 0,
        "total_donations": 0,
        "active_donations": 0,
    }
    
    response = supabase.table("users").insert(user_dict).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    user = response.data[0]
    
    # Update NGO staff count if staff
    if user_data.role == UserRole.staff:
        supabase.rpc("increment_ngo_staff_count", {"ngo_id_param": user_data.ngo_id}).execute()
    
    # Log activity
    supabase.table("activity_log").insert({
        "action": "user_registered",
        "description": f"New {user_data.role.value} signup",
        "user_id":  user["id"],
        "user_name": user["full_name"]
    }).execute()
    
    # Create token
    token = create_access_token(
        data={"sub": user["id"], "role": user["role"]}
    )
    
    user["ngo_name"] = ngo_name
    
    return {"user": user, "token": token}


async def login_user(login_data: UserLogin) -> dict:
    """Authenticate user and return token"""
    # Find user by email
    response = supabase.table("users").select("*").eq("email", login_data.email).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = response.data[0]
    
    # Verify password
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Get NGO name if staff
    ngo_name = None
    if user["role"] == "staff" and user["ngo_id"]:
        ngo_response = supabase.table("ngos").select("name").eq("id", user["ngo_id"]).execute()
        if ngo_response.data:
            ngo_name = ngo_response.data[0]["name"]
    
    # Create token with extended expiry if remember_me
    expires_delta = timedelta(days=7) if login_data.remember_me else None
    token = create_access_token(
        data={"sub": user["id"], "role": user["role"]},
        expires_delta=expires_delta
    )
    
    # Remove password hash from response
    user.pop("password_hash", None)
    user["ngo_name"] = ngo_name
    
    return {"user": user, "token": token}


async def get_user_by_id(user_id: str) -> dict:
    """Get user by ID"""
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = response.data[0]
    user. pop("password_hash", None)
    
    # Get NGO name if staff
    if user["role"] == "staff" and user["ngo_id"]:
        ngo_response = supabase.table("ngos").select("name").eq("id", user["ngo_id"]).execute()
        if ngo_response.data:
            user["ngo_name"] = ngo_response.data[0]["name"]
    
    return user