from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from models.models import Song, SongCreate, SongUpdate, AdminLogCreate
from services.database_service import db_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/songs", tags=["songs"])

@router.get("/", response_model=List[Song])
async def get_songs(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    genre: Optional[str] = Query(default=None),
    recent: Optional[bool] = Query(default=False),
    popular: Optional[bool] = Query(default=False)
):
    """Get all songs with optional filtering"""
    try:
        songs = await db_service.get_songs(limit=limit, offset=offset, genre=genre)
        
        # For simplicity, recent and popular just return the same results for now
        # In a real app, you'd have play_count, last_played fields etc.
        if recent or popular:
            songs = songs[:5]  # Return top 5 for featured sections
            
        return songs
    except Exception as e:
        logger.error(f"Error fetching songs: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/search")
async def search_songs(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(default=50, ge=1, le=100)
):
    """Search songs by title, artist, album, or genre"""
    try:
        results = await db_service.search(query=q, limit=limit)
        return results
    except Exception as e:
        logger.error(f"Error searching songs: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{song_id}", response_model=Song)
async def get_song(song_id: str):
    """Get a single song by ID"""
    try:
        song = await db_service.get_song_by_id(song_id)
        if not song:
            raise HTTPException(status_code=404, detail="Song not found")
        return song
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching song {song_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=Song)
async def create_song(song: SongCreate):
    """Create a new song (admin only)"""
    try:
        # Create the song
        new_song = await db_service.create_song(song)
        if not new_song:
            raise HTTPException(status_code=400, detail="Failed to create song")
        
        # Log the admin action
        log = AdminLogCreate(
            action="add",
            entity_type="song",
            entity_id=new_song.id,
            entity_name=new_song.title
        )
        await db_service.log_admin_action(log)
        
        return new_song
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating song: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{song_id}", response_model=Song)
async def update_song(song_id: str, song: SongUpdate):
    """Update a song (admin only)"""
    try:
        # Check if song exists
        existing_song = await db_service.get_song_by_id(song_id)
        if not existing_song:
            raise HTTPException(status_code=404, detail="Song not found")
        
        # Update the song
        updated_song = await db_service.update_song(song_id, song)
        if not updated_song:
            raise HTTPException(status_code=400, detail="Failed to update song")
        
        # Log the admin action
        log = AdminLogCreate(
            action="update",
            entity_type="song",
            entity_id=song_id,
            entity_name=updated_song.title
        )
        await db_service.log_admin_action(log)
        
        return updated_song
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating song {song_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{song_id}")
async def delete_song(song_id: str):
    """Delete a song (admin only)"""
    try:
        # Check if song exists
        existing_song = await db_service.get_song_by_id(song_id)
        if not existing_song:
            raise HTTPException(status_code=404, detail="Song not found")
        
        # Delete the song
        success = await db_service.delete_song(song_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to delete song")
        
        # Log the admin action
        log = AdminLogCreate(
            action="delete",
            entity_type="song",
            entity_id=song_id,
            entity_name=existing_song.title
        )
        await db_service.log_admin_action(log)
        
        return {"message": "Song deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting song {song_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")