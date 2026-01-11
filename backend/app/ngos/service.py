from typing import Optional, List
from fastapi import HTTPException, status
from app.database import supabase
from app. models.schemas import NGOCreate, NGOUpdate


async def create_ngo(ngo_data: NGOCreate) -> dict:
    """Create a new NGO"""
    # Check if email already exists
    existing = supabase.table("ngos").select("id").eq("email", ngo_data.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="NGO with this email already exists"
        )
    
    ngo_dict = {
        "name": ngo_data.name,
        "address": ngo_data.address,
        "email": ngo_data.email,
        "phone": ngo_data.phone,
        "latitude": ngo_data.latitude,
        "longitude": ngo_data.longitude,
        "staff_count": 0,
        "completed_pickups": 0,
        "active_pickups": 0,
    }
    
    response = supabase.table("ngos").insert(ngo_dict).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create NGO"
        )
    
    # Log activity
    ngo = response.data[0]
    supabase.table("activity_log").insert({
        "action": "ngo_created",
        "description": f"New NGO added: {ngo_data.name}",
        "target_id": ngo["id"],
        "target_type": "ngo"
    }).execute()
    
    return ngo


async def get_all_ngos() -> List[dict]:
    """Get all NGOs"""
    response = supabase.table("ngos").select("*").order("created_at", desc=True).execute()
    return response.data


async def get_ngo_by_id(ngo_id:  str) -> dict:
    """Get NGO by ID"""
    response = supabase.table("ngos").select("*").eq("id", ngo_id).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NGO not found"
        )
    
    return response.data[0]


async def update_ngo(ngo_id: str, ngo_update: NGOUpdate) -> dict:
    """Update NGO details"""
    # Check NGO exists
    existing = supabase.table("ngos").select("id").eq("id", ngo_id).execute()
    if not existing.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NGO not found"
        )
    
    # Check email uniqueness if changing email
    if ngo_update.email:
        email_check = supabase.table("ngos").select("id").eq("email", ngo_update.email).neq("id", ngo_id).execute()
        if email_check.data:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Another NGO with this email already exists"
            )
    
    update_data = ngo_update.model_dump(exclude_unset=True)
    
    if update_data: 
        update_data["updated_at"] = "now()"
        supabase.table("ngos").update(update_data).eq("id", ngo_id).execute()
    
    return await get_ngo_by_id(ngo_id)


async def delete_ngo(ngo_id: str) -> dict:
    """Delete an NGO"""
    # Check NGO exists
    ngo = await get_ngo_by_id(ngo_id)
    
    # Check for active staff
    if ngo["staff_count"] > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete NGO with active staff members"
        )
    
    # Soft delete or hard delete
    supabase.table("ngos").delete().eq("id", ngo_id).execute()
    
    return {"message": "NGO deleted successfully"}