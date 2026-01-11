from fastapi import APIRouter, Depends, Query
from typing import List
from app.models. schemas import (
    PlatformStats, ActivityLogResponse, UserStats, UserRole
)
from app.admin.service import get_platform_stats, get_activity_log, get_user_stats
from app.auth.dependencies import get_current_active_user, require_role

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=PlatformStats)
async def get_stats(
    current_user: dict = Depends(require_role([UserRole.admin]))
):
    """Get platform-wide statistics (Admin only)."""
    stats = await get_platform_stats()
    return stats


@router.get("/activity", response_model=ActivityLogResponse)
async def get_activity(
    limit: int = Query(10, ge=1, le=100, description="Number of entries"),
    page: int = Query(1, ge=1, description="Page number"),
    current_user: dict = Depends(require_role([UserRole.admin]))
):
    """Get recent platform activity log (Admin only)."""
    activities = await get_activity_log(limit=limit, page=page)
    return {"activities": activities}


# User stats endpoint (for donors to see their own stats)
@router.get("/users/me/stats", response_model=UserStats, tags=["Users"])
async def get_my_stats(
    current_user: dict = Depends(require_role([UserRole.donor]))
):
    """Get current user's statistics (Donor only)."""
    stats = await get_user_stats(current_user["id"])
    return stats