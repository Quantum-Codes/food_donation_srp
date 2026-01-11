from fastapi import APIRouter, Depends, status
from app.models.schemas import (
    UserCreate, UserLogin, UserResponse, AuthResponse, UserUpdate
)
from app.auth.service import register_user, login_user, get_user_by_id
from app.auth.dependencies import get_current_active_user
from app.database import supabase

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user.
    
    - **email**: Valid email address
    - **full_name**: User's full name (2-255 characters)
    - **password**: Strong password (min 8 chars, uppercase, lowercase, number)
    - **role**: donor (default) or staff
    - **ngo_id**: Required if role is staff
    """
    result = await register_user(user_data)
    return result


@router.post("/login", response_model=AuthResponse)
async def login(login_data: UserLogin):
    """
    Authenticate user and get access token.
    
    - **email**:  Registered email address
    - **password**: User's password
    - **remember_me**: If true, token expires in 7 days instead of 24 hours
    """
    result = await login_user(login_data)
    return result


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(current_user: dict = Depends(get_current_active_user)):
    """
    Logout current user.
    
    Note: With JWT, logout is handled client-side by discarding the token. 
    This endpoint is provided for API completeness.
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_active_user)):
    """Get current authenticated user's profile."""
    user = await get_user_by_id(current_user["id"])
    return user


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_active_user)
):
    """Update current user's profile."""
    update_data = user_update.model_dump(exclude_unset=True)
    
    if update_data: 
        update_data["updated_at"] = "now()"
        supabase.table("users").update(update_data).eq("id", current_user["id"]).execute()
    
    user = await get_user_by_id(current_user["id"])
    return user