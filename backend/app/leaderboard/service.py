from typing import Optional
from datetime import datetime, timedelta
from app.database import supabase


async def get_leaderboard(
    period: str = "all",
    limit: int = 10,
    current_user_id: Optional[str] = None
) -> dict:
    """Get donor leaderboard"""
    # Get all donors ordered by points
    query = supabase.table("users").select(
        "id, full_name, points, total_donations, avatar_url"
    ).eq("role", "donor").order("points", desc=True)
    
    # Note: For period filtering, we'd need to aggregate from donations table
    # This is a simplified implementation
    if period == "week":
        # In production, calculate points from last 7 days of donations
        pass
    elif period == "month":
        # In production, calculate points from last 30 days of donations
        pass
    
    response = query.execute()
    all_users = response.data
    
    # Build leaderboard with ranks
    leaderboard = []
    current_user_entry = None
    
    for idx, user in enumerate(all_users):
        entry = {
            "rank": idx + 1,
            "user_id": user["id"],
            "name": user["full_name"],
            "points": user["points"],
            "donations": user["total_donations"],
            "avatar_url": user. get("avatar_url"),
            "is_current_user": user["id"] == current_user_id
        }
        
        if user["id"] == current_user_id:
            current_user_entry = entry
        
        if idx < limit:
            leaderboard. append(entry)
    
    # If current user is not in top N, still include their entry separately
    if current_user_entry and current_user_entry["rank"] > limit:
        pass  # current_user_entry already set
    elif current_user_entry:
        # User is in top N, current_user_entry is already part of leaderboard
        pass
    
    return {
        "leaderboard": leaderboard,
        "current_user":  current_user_entry
    }