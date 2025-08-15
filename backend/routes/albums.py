from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.models import Album, AlbumCreate, AlbumUpdate, AdminLogCreate
from services.database_service import db_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/albums", tags=["albums"])

@router.get("/", response_model=List[Album])
async def get_albums(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0)
):
    """Get all albums"""
    try:
        albums = await db_service.get_albums(limit=limit, offset=offset)
        return albums
    except Exception as e:
        logger.error(f"Error fetching albums: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{album_id}", response_model=Album)
async def get_album(album_id: str):
    """Get a single album by ID"""
    try:
        album = await db_service.get_album_by_id(album_id)
        if not album:
            raise HTTPException(status_code=404, detail="Album not found")
        return album
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching album {album_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=Album)
async def create_album(album: AlbumCreate):
    """Create a new album (admin only)"""
    try:
        new_album = await db_service.create_album(album)
        if not new_album:
            raise HTTPException(status_code=400, detail="Failed to create album")
        
        # Log the admin action
        log = AdminLogCreate(
            action="add",
            entity_type="album",
            entity_id=new_album.id,
            entity_name=new_album.title
        )
        await db_service.log_admin_action(log)
        
        return new_album
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating album: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{album_id}", response_model=Album)
async def update_album(album_id: str, album: AlbumUpdate):
    """Update an album (admin only)"""
    try:
        existing_album = await db_service.get_album_by_id(album_id)
        if not existing_album:
            raise HTTPException(status_code=404, detail="Album not found")
        
        updated_album = await db_service.update_album(album_id, album)
        if not updated_album:
            raise HTTPException(status_code=400, detail="Failed to update album")
        
        # Log the admin action
        log = AdminLogCreate(
            action="update",
            entity_type="album",
            entity_id=album_id,
            entity_name=updated_album.title
        )
        await db_service.log_admin_action(log)
        
        return updated_album
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating album {album_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{album_id}")
async def delete_album(album_id: str):
    """Delete an album (admin only)"""
    try:
        existing_album = await db_service.get_album_by_id(album_id)
        if not existing_album:
            raise HTTPException(status_code=404, detail="Album not found")
        
        success = await db_service.delete_album(album_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to delete album")
        
        # Log the admin action
        log = AdminLogCreate(
            action="delete",
            entity_type="album",
            entity_id=album_id,
            entity_name=existing_album.title
        )
        await db_service.log_admin_action(log)
        
        return {"message": "Album deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting album {album_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")