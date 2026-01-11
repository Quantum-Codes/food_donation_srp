from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.config import get_settings
from app. database import supabase
from app. models.schemas import UserRole, TokenData, UserResponse
from typing import List

settings = get_settings()
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """Extract and validate JWT token, return user data"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token, 
            settings.jwt_secret_key, 
            algorithms=[settings.jwt_algorithm]
        )
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        
        if user_id is None: 
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # Fetch user from database
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    
    if not response.data:
        raise credentials_exception
    
    user = response.data[0]
    return user


async def get_current_active_user(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """Ensure user is active"""
    # Add any additional active checks here if needed
    return current_user


def require_role(allowed_roles: List[UserRole]):
    """Dependency factory to require specific roles"""
    async def role_checker(
        current_user: dict = Depends(get_current_active_user)
    ) -> dict:
        if current_user["role"] not in [role.value for role in allowed_roles]:
            raise HTTPException(
                status_code=status. HTTP_403_FORBIDDEN,
                detail="You don't have permission to perform this action"
            )
        return current_user
    return role_checker