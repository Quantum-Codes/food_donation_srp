from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, status
from typing import Optional
from app.models.schemas import (
    DonationCreate, DonationResponse, DonationListResponse,
    DonationStatusUpdate, UserRole
)
from app.donations.service import (
    create_donation, get_donations, get_donation_by_id,
    get_donations_for_map, update_donation_status
)
from app.auth.dependencies import get_current_active_user, require_role

router = APIRouter(prefix="/donations", tags=["Donations"])


@router.post("", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
async def create_new_donation(
    address: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    volume: str = Form(...),
    priority: str = Form(...),
    description: Optional[str] = Form(None),
    image:  Optional[UploadFile] = File(None),
    current_user: dict = Depends(require_role([UserRole.donor]))
):
    """
    Create a new food donation.
    
    - **address**:  Pickup address
    - **latitude/longitude**: Coordinates for map
    - **volume**: small (<20), medium (20-50), or large (50+) servings
    - **priority**: high, medium, or low
    - **description**: Optional description of the food
    - **image**:  Optional food image (PNG/JPG, max 10MB)
    """
    from app.models.schemas import Volume, Priority
    
    donation_data = DonationCreate(
        address=address,
        latitude=latitude,
        longitude=longitude,
        volume=Volume(volume),
        priority=Priority(priority),
        description=description
    )
    
    # Handle image upload (simplified - in production, upload to cloud storage)
    image_url = None
    if image:
        # TODO: Upload to Supabase Storage or external service
        # For now, just skip image handling
        pass
    
    donation = await create_donation(donation_data, current_user["id"], image_url)
    return donation


@router.get("", response_model=DonationListResponse)
async def list_donations(
    status:  Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    sort:  str = Query("created_at", description="Sort by field"),
    order: str = Query("desc", description="Sort order (asc/desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Get list of donations.
    
    - Donors see only their own donations
    - Staff see active/pending donations for pickup
    - Admins see all donations
    """
    result = await get_donations(
        user_id=current_user["id"],
        user_role=current_user["role"],
        status_filter=status,
        priority_filter=priority,
        sort_by=sort,
        order=order,
        page=page,
        limit=limit
    )
    return result


@router.get("/map")
async def get_map_donations(
    current_user: dict = Depends(require_role([UserRole.staff, UserRole.admin]))
):
    """
    Get donations with coordinates for map view (Staff/Admin only).
    
    Returns active and pending donations with location data.
    """
    donations = await get_donations_for_map(current_user. get("ngo_id"))
    return {"donations": donations}


@router. get("/{donation_id}", response_model=DonationResponse)
async def get_donation(
    donation_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get a single donation by ID."""
    donation = await get_donation_by_id(
        donation_id,
        current_user["id"],
        current_user["role"]
    )
    return donation


@router.patch("/{donation_id}/status", response_model=DonationResponse)
async def update_status(
    donation_id: str,
    status_update: DonationStatusUpdate,
    current_user: dict = Depends(require_role([UserRole.staff]))
):
    """
    Update donation status (Staff only).
    
    Valid transitions:
    - pending → active (accept for pickup)
    - pending → declined (decline donation)
    - active → completed (pickup completed)
    - active → declined (cancel pickup)
    """
    donation = await update_donation_status(
        donation_id,
        status_update,
        current_user["id"],
        current_user["full_name"]
    )
    return donation