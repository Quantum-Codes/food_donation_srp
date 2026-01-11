from fastapi import APIRouter, Depends, Query
from app.models.schemas import LeaderboardResponse
from app.leaderboard. service import get_leaderboard
from app.auth.dependencies import get_current_active_user

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("", response_model=LeaderboardResponse)
async def get_donor_leaderboard(
    period: str = Query("all", description="Time period:  week, month, or all"),
    limit: int = Query(10, ge=1, le=100, description="Number of entries"),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Get donor leaderboard rankings.
    
    - **period**: Filter by time period (week, month, all)
    - **limit**: Number of top entries to return
    
    Always includes current user's rank even if not in top N.
    """
    result = await get_leaderboard(
        period=period,
        limit=limit,
        current_user_id=current_user["id"]
    )
    return result