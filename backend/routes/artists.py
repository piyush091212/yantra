from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.models import Artist, ArtistCreate, ArtistUpdate, AdminLogCreate
from services.database_service import db_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/artists", tags=["artists"])

@router.get("/", response_model=List[Artist])
async def get_artists(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0)
):
    """Get all artists"""
    try:
        artists = await db_service.get_artists(limit=limit, offset=offset)
        return artists
    except Exception as e:
        logger.error(f"Error fetching artists: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{artist_id}", response_model=Artist)
async def get_artist(artist_id: str):
    """Get a single artist by ID"""
    try:
        artist = await db_service.get_artist_by_id(artist_id)
        if not artist:
            raise HTTPException(status_code=404, detail="Artist not found")
        return artist
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching artist {artist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=Artist)
async def create_artist(artist: ArtistCreate):
    """Create a new artist (admin only)"""
    try:
        new_artist = await db_service.create_artist(artist)
        if not new_artist:
            raise HTTPException(status_code=400, detail="Failed to create artist")
        
        # Log the admin action
        log = AdminLogCreate(
            action="add",
            entity_type="artist",
            entity_id=new_artist.id,
            entity_name=new_artist.name
        )
        await db_service.log_admin_action(log)
        
        return new_artist
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating artist: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{artist_id}", response_model=Artist)
async def update_artist(artist_id: str, artist: ArtistUpdate):
    """Update an artist (admin only)"""
    try:
        existing_artist = await db_service.get_artist_by_id(artist_id)
        if not existing_artist:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        updated_artist = await db_service.update_artist(artist_id, artist)
        if not updated_artist:
            raise HTTPException(status_code=400, detail="Failed to update artist")
        
        # Log the admin action
        log = AdminLogCreate(
            action="update",
            entity_type="artist",
            entity_id=artist_id,
            entity_name=updated_artist.name
        )
        await db_service.log_admin_action(log)
        
        return updated_artist
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating artist {artist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{artist_id}")
async def delete_artist(artist_id: str):
    """Delete an artist (admin only)"""
    try:
        existing_artist = await db_service.get_artist_by_id(artist_id)
        if not existing_artist:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        success = await db_service.delete_artist(artist_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to delete artist")
        
        # Log the admin action
        log = AdminLogCreate(
            action="delete",
            entity_type="artist",
            entity_id=artist_id,
            entity_name=existing_artist.name
        )
        await db_service.log_admin_action(log)
        
        return {"message": "Artist deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting artist {artist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")