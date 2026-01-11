from fastapi import APIRouter, Depends, status
from typing import List
from app.models.schemas import NGOCreate, NGOUpdate, NGOResponse, UserRole
from app.ngos. service import (
    create_ngo, get_all_ngos, get_ngo_by_id, update_ngo, delete_ngo
)
from app.auth.dependencies import require_role

router = APIRouter(prefix="/ngos", tags=["NGOs"])


@router.get("", response_model=List[NGOResponse])
async def list_ngos(
    current_user: dict = Depends(require_role([UserRole.admin]))
):
    """Get all NGOs (Admin only)."""
    ngos = await get_all_ngos()
    return ngos


@router.post("", response_model=NGOResponse, status_code=status.HTTP_201_CREATED)
async def create_new_ngo(
    ngo_data: NGOCreate,
    current_user: dict = Depends(require_role([UserRole.admin]))
):
    """
    Create a new NGO (Admin only).
    
    - **name**: Organization name
    - **address**: Physical address
    - **email**: Contact email (must be unique)
    - **phone**: Optional phone number
    - **latitude/longitude**: Location coordinates
    """
    ngo = await create_ngo(ngo_data)
    return ngo


@router.get("/{ngo_id}", response_model=NGOResponse)
async def get_ngo(
    ngo_id: str,
    current_user: dict = Depends(require_role([UserRole.admin]))
):
    """Get NGO details by ID (Admin only)."""
    ngo = await get_ngo_by_id(ngo_id)
    return ngo


@router.put("/{ngo_id}", response_model=NGOResponse)
async def update_ngo_details(
    ngo_id: str,
    ngo_update: NGOUpdate,
    current_user: dict = Depends(require_role([UserRole. admin]))
):
    """Update NGO details (Admin only)."""
    ngo = await update_ngo(ngo_id, ngo_update)
    return ngo


@router.delete("/{ngo_id}")
async def delete_ngo_by_id(
    ngo_id: str,
    current_user: dict = Depends(require_role([UserRole.admin]))
):
    """
    Delete an NGO (Admin only).
    
    Cannot delete NGOs with active staff members.
    """
    result = await delete_ngo(ngo_id)
    return result