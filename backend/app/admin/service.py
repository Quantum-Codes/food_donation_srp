from typing import List
from app.database import supabase


async def get_platform_stats() -> dict:
    """Get platform-wide statistics"""
    # Get donation counts
    donations = supabase.table("donations").select("status, points").execute()
    
    total_donations = len(donations.data)
    active_donations = len([d for d in donations.data if d["status"] == "active"])
    completed_donations = len([d for d in donations.data if d["status"] == "completed"])
    declined_donations = len([d for d in donations.data if d["status"] == "declined"])
    
    # Calculate total points awarded (from completed donations)
    points_awarded = sum(d["points"] for d in donations.data if d["status"] == "completed")
    
    # Get user counts
    users = supabase.table("users").select("role").execute()
    total_donors = len([u for u in users.data if u["role"] == "donor"])
    total_staff = len([u for u in users.data if u["role"] == "staff"])
    
    # Get NGO count
    ngos = supabase.table("ngos").select("id", count="exact").execute()
    total_ngos = ngos.count if ngos.count else 0
    
    return {
        "total_donations":  total_donations,
        "active_donations": active_donations,
        "completed_donations": completed_donations,
        "declined_donations": declined_donations,
        "total_donors": total_donors,
        "total_ngos": total_ngos,
        "total_staff": total_staff,
        "points_awarded": points_awarded
    }


async def get_activity_log(limit: int = 10, page: int = 1) -> List[dict]:
    """Get recent platform activity"""
    offset = (page - 1) * limit
    
    response = supabase.table("activity_log").select("*").order(
        "created_at", desc=True
    ).range(offset, offset + limit - 1).execute()
    
    return response.data


async def get_user_stats(user_id: str) -> dict:
    """Get statistics for a specific user (donor)"""
    # Get user data
    user_response = supabase.table("users").select(
        "points, total_donations, active_donations, created_at"
    ).eq("id", user_id).execute()
    
    if not user_response.data:
        return None
    
    user = user_response.data[0]
    
    # Get completed donations count
    donations = supabase.table("donations").select("status").eq("donor_id", user_id).execute()
    completed_donations = len([d for d in donations.data if d["status"] == "completed"])
    
    # Calculate rank
    all_donors = supabase.table("users").select("id, points").eq(
        "role", "donor"
    ).order("points", desc=True).execute()
    
    rank = 1
    for idx, donor in enumerate(all_donors.data):
        if donor["id"] == user_id: 
            rank = idx + 1
            break
    
    return {
        "total_donations": user["total_donations"],
        "active_donations": user["active_donations"],
        "completed_donations": completed_donations,
        "points":  user["points"],
        "rank": rank,
        "joined_at": user["created_at"]
    }