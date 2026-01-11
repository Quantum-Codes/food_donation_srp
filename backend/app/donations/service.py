from typing import Optional, List
from datetime import datetime, timedelta
from fastapi import HTTPException, status, UploadFile
from app.database import supabase
from app. models.schemas import (
    DonationCreate, DonationStatus, DonationStatusUpdate, 
    Volume, Priority, UserRole
)


def calculate_points(volume: Volume, priority: Priority) -> int:
    """Calculate points based on volume and priority"""
    volume_points = {"small": 15, "medium": 25, "large": 50}
    priority_bonus = {"high": 10, "medium": 5, "low": 0}
    return volume_points[volume. value] + priority_bonus[priority.value]


def calculate_servings(volume: Volume) -> int:
    """Calculate estimated servings based on volume"""
    servings = {"small": 15, "medium": 35, "large": 75}
    return servings[volume.value]


async def create_donation(
    donation_data: DonationCreate,
    donor_id: str,
    image_url: Optional[str] = None
) -> dict:
    """Create a new donation"""
    # Get donor info
    donor_response = supabase.table("users").select("full_name").eq("id", donor_id).execute()
    if not donor_response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donor not found"
        )
    
    donor_name = donor_response.data[0]["full_name"]
    
    # Calculate points and servings
    points = calculate_points(donation_data.volume, donation_data.priority)
    servings = calculate_servings(donation_data.volume)
    
    # Find nearest NGO (simple implementation - can be enhanced with distance calculation)
    ngos_response = supabase.table("ngos").select("id").limit(1).execute()
    assigned_ngo_id = ngos_response.data[0]["id"] if ngos_response.data else None
    
    donation_dict = {
        "donor_id": donor_id,
        "donor_name": donor_name,
        "image_url": image_url,
        "address": donation_data.address,
        "latitude": donation_data.latitude,
        "longitude": donation_data. longitude,
        "volume": donation_data.volume. value,
        "volume_servings": servings,
        "priority": donation_data.priority. value,
        "status": DonationStatus.pending.value,
        "points":  points,
        "description": donation_data.description,
        "assigned_ngo_id": assigned_ngo_id,
    }
    
    response = supabase.table("donations").insert(donation_dict).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create donation"
        )
    
    donation = response.data[0]
    
    # Update donor's active donations count
    supabase. rpc("increment_user_active_donations", {"user_id_param": donor_id}).execute()
    
    # Update NGO's active pickups if assigned
    if assigned_ngo_id:
        supabase. rpc("increment_ngo_active_pickups", {"ngo_id_param": assigned_ngo_id}).execute()
    
    # Log activity
    supabase.table("activity_log").insert({
        "action":  "donation_created",
        "description": "New donation created",
        "user_id": donor_id,
        "user_name": donor_name,
        "target_id": donation["id"],
        "target_type": "donation"
    }).execute()
    
    return donation


async def get_donations(
    user_id: str,
    user_role: str,
    status_filter: Optional[str] = None,
    priority_filter: Optional[str] = None,
    sort_by: str = "created_at",
    order: str = "desc",
    page: int = 1,
    limit: int = 20
) -> dict:
    """Get donations list based on user role and filters"""
    query = supabase.table("donations").select("*", count="exact")
    
    # Role-based filtering
    if user_role == "donor":
        query = query.eq("donor_id", user_id)
    elif user_role == "staff":
        # Staff see active and pending donations
        query = query. in_("status", ["active", "pending"])
    # Admin sees all
    
    # Apply filters
    if status_filter: 
        query = query.eq("status", status_filter)
    
    if priority_filter:
        query = query.eq("priority", priority_filter)
    
    # Sorting
    query = query.order(sort_by, desc=(order == "desc"))
    
    # Pagination
    offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    response = query.execute()
    
    # Get counts for donor
    counts = {}
    if user_role == "donor": 
        count_query = supabase.table("donations").select("status", count="exact").eq("donor_id", user_id)
        all_donations = supabase.table("donations").select("status").eq("donor_id", user_id).execute()
        
        counts = {
            "all":  len(all_donations.data),
            "pending": len([d for d in all_donations. data if d["status"] == "pending"]),
            "active":  len([d for d in all_donations.data if d["status"] == "active"]),
            "completed": len([d for d in all_donations.data if d["status"] == "completed"]),
            "declined": len([d for d in all_donations.data if d["status"] == "declined"]),
        }
    else: 
        # For staff/admin, get overall counts
        all_donations = supabase.table("donations").select("status").execute()
        counts = {
            "all": len(all_donations.data),
            "pending":  len([d for d in all_donations.data if d["status"] == "pending"]),
            "active": len([d for d in all_donations.data if d["status"] == "active"]),
            "completed": len([d for d in all_donations.data if d["status"] == "completed"]),
            "declined": len([d for d in all_donations. data if d["status"] == "declined"]),
        }
    
    total = response.count if response.count else 0
    
    return {
        "donations": response.data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit
        },
        "counts": counts
    }


async def get_donation_by_id(donation_id: str, user_id: str, user_role: str) -> dict:
    """Get a single donation by ID"""
    response = supabase.table("donations").select("*").eq("id", donation_id).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    
    donation = response.data[0]
    
    # Check permission
    if user_role == "donor" and donation["donor_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this donation"
        )
    
    return donation


async def get_donations_for_map(ngo_id: Optional[str] = None) -> List[dict]:
    """Get donations with coordinates for map view"""
    query = supabase.table("donations").select("*").in_("status", ["active", "pending"])
    
    response = query.execute()
    
    return response.data


async def update_donation_status(
    donation_id: str,
    status_update: DonationStatusUpdate,
    staff_id: str,
    staff_name: str
) -> dict:
    """Update donation status (staff only)"""
    # Get current donation
    response = supabase.table("donations").select("*").eq("id", donation_id).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    
    donation = response.data[0]
    current_status = donation["status"]
    new_status = status_update.status. value
    
    # Validate status transition
    valid_transitions = {
        "pending":  ["active", "declined"],
        "active": ["completed", "declined"],
    }
    
    if current_status not in valid_transitions or new_status not in valid_transitions. get(current_status, []):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot transition from {current_status} to {new_status}"
        )
    
    # Prepare update
    update_data = {
        "status": new_status,
        "updated_at": datetime.utcnow().isoformat(),
    }
    
    if new_status == "declined":
        update_data["decline_reason"] = status_update. decline_reason
    
    if new_status == "completed":
        update_data["completed_at"] = datetime.utcnow().isoformat()
        update_data["completed_by_staff_id"] = staff_id
    
    # Update donation
    supabase.table("donations").update(update_data).eq("id", donation_id).execute()
    
    # Handle side effects
    donor_id = donation["donor_id"]
    ngo_id = donation["assigned_ngo_id"]
    
    if new_status == "completed":
        # Award points to donor
        points = donation["points"]
        supabase.rpc("award_points_to_user", {
            "user_id_param": donor_id,
            "points_param": points
        }).execute()
        
        # Increment donor's total donations
        supabase.rpc("increment_user_total_donations", {"user_id_param": donor_id}).execute()
        
        # Update NGO stats
        if ngo_id:
            supabase.rpc("complete_ngo_pickup", {"ngo_id_param": ngo_id}).execute()
    
    elif new_status == "declined": 
        # Decrement donor's active donations
        supabase.rpc("decrement_user_active_donations", {"user_id_param": donor_id}).execute()
        
        # Update NGO stats
        if ngo_id:
            supabase.rpc("decrement_ngo_active_pickups", {"ngo_id_param": ngo_id}).execute()
    
    elif new_status == "active": 
        # Just transition, no special handling needed
        pass
    
    # Decrement active donations when no longer active
    if current_status in ["pending", "active"] and new_status in ["completed", "declined"]: 
        supabase.rpc("decrement_user_active_donations", {"user_id_param":  donor_id}).execute()
    
    # Log activity
    action = f"donation_{new_status}"
    description = f"Donation {new_status}"
    if new_status == "completed":
        description = f"Donation completed!  Donor awarded {donation['points']} points."
    
    supabase.table("activity_log").insert({
        "action": action,
        "description": description,
        "user_id": staff_id,
        "user_name": staff_name,
        "target_id": donation_id,
        "target_type":  "donation"
    }).execute()
    
    # Fetch and return updated donation
    updated = supabase.table("donations").select("*").eq("id", donation_id).execute()
    return updated.data[0]