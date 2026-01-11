from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Literal
from datetime import datetime
from enum import Enum


# Enums
class UserRole(str, Enum):
    donor = "donor"
    staff = "staff"
    admin = "admin"


class DonationStatus(str, Enum):
    pending = "pending"
    active = "active"
    completed = "completed"
    declined = "declined"


class Priority(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


class Volume(str, Enum):
    small = "small"
    medium = "medium"
    large = "large"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.donor
    ngo_id: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    ngo_id: Optional[str] = None
    ngo_name: Optional[str] = None
    points: int = 0
    total_donations:  int = 0
    active_donations: int = 0
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    avatar_url: Optional[str] = None


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: str
    role: UserRole


class AuthResponse(BaseModel):
    user: UserResponse
    token: str


# Donation Schemas
class DonationCreate(BaseModel):
    address: str = Field(..., min_length=5)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    volume: Volume
    priority: Priority
    description: Optional[str] = None


class DonationResponse(BaseModel):
    id: str
    donor_id: str
    donor_name: str
    image_url: Optional[str] = None
    address: str
    latitude: float
    longitude: float
    volume: Volume
    volume_servings: int
    priority: Priority
    status: DonationStatus
    points: int
    description: Optional[str] = None
    decline_reason: Optional[str] = None
    assigned_ngo_id: Optional[str] = None
    completed_by_staff_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DonationStatusUpdate(BaseModel):
    status: DonationStatus
    decline_reason: Optional[str] = None


class DonationListResponse(BaseModel):
    donations: List[DonationResponse]
    pagination: dict
    counts: dict


# NGO Schemas
class NGOBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    address: str = Field(..., min_length=5)
    email: EmailStr
    phone: Optional[str] = None
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class NGOCreate(NGOBase):
    pass


class NGOUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    address: Optional[str] = Field(None, min_length=5)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class NGOResponse(BaseModel):
    id: str
    name: str
    address:  str
    email: str
    phone: Optional[str] = None
    latitude: float
    longitude: float
    staff_count: int = 0
    completed_pickups: int = 0
    active_pickups: int = 0
    created_at: datetime

    class Config: 
        from_attributes = True


# Leaderboard Schemas
class LeaderboardEntry(BaseModel):
    rank: int
    user_id:  str
    name: str
    points: int
    donations: int
    avatar_url: Optional[str] = None
    is_current_user: bool = False


class LeaderboardResponse(BaseModel):
    leaderboard: List[LeaderboardEntry]
    current_user:  Optional[LeaderboardEntry] = None


# Admin Stats Schemas
class PlatformStats(BaseModel):
    total_donations: int
    active_donations:  int
    completed_donations: int
    declined_donations: int
    total_donors: int
    total_ngos: int
    total_staff: int
    points_awarded: int


class ActivityLog(BaseModel):
    id: str
    action: str
    description: str
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    target_id: Optional[str] = None
    created_at: datetime


class ActivityLogResponse(BaseModel):
    activities: List[ActivityLog]


# User Stats
class UserStats(BaseModel):
    total_donations: int
    active_donations:  int
    completed_donations: int
    points:  int
    rank: int
    joined_at: datetime


# Error Response
class ErrorResponse(BaseModel):
    error: dict