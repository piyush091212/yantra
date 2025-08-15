from fastapi import APIRouter, HTTPException, Query
from typing import List
from models.models import Playlist, PlaylistCreate, PlaylistUpdate, AdminLogCreate
from services.database_service import db_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/playlists", tags=["playlists"])

@router.get("/", response_model=List[Playlist])
async def get_playlists(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    featured: bool = Query(default=False)
):
    """Get all playlists"""
    try:
        playlists = await db_service.get_playlists(limit=limit, offset=offset)
        
        # For simplicity, featured just returns the first few playlists
        if featured:
            playlists = playlists[:3]
            
        return playlists
    except Exception as e:
        logger.error(f"Error fetching playlists: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{playlist_id}", response_model=Playlist)
async def get_playlist(playlist_id: str):
    """Get a single playlist by ID with its songs"""
    try:
        playlist = await db_service.get_playlist_by_id(playlist_id)
        if not playlist:
            raise HTTPException(status_code=404, detail="Playlist not found")
        return playlist
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching playlist {playlist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=Playlist)
async def create_playlist(playlist: PlaylistCreate):
    """Create a new playlist (admin only)"""
    try:
        new_playlist = await db_service.create_playlist(playlist)
        if not new_playlist:
            raise HTTPException(status_code=400, detail="Failed to create playlist")
        
        # Log the admin action
        log = AdminLogCreate(
            action="add",
            entity_type="playlist",
            entity_id=new_playlist.id,
            entity_name=new_playlist.name
        )
        await db_service.log_admin_action(log)
        
        return new_playlist
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating playlist: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{playlist_id}", response_model=Playlist)
async def update_playlist(playlist_id: str, playlist: PlaylistUpdate):
    """Update a playlist (admin only)"""
    try:
        existing_playlist = await db_service.get_playlist_by_id(playlist_id)
        if not existing_playlist:
            raise HTTPException(status_code=404, detail="Playlist not found")
        
        updated_playlist = await db_service.update_playlist(playlist_id, playlist)
        if not updated_playlist:
            raise HTTPException(status_code=400, detail="Failed to update playlist")
        
        # Log the admin action
        log = AdminLogCreate(
            action="update",
            entity_type="playlist",
            entity_id=playlist_id,
            entity_name=updated_playlist.name
        )
        await db_service.log_admin_action(log)
        
        return updated_playlist
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating playlist {playlist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{playlist_id}")
async def delete_playlist(playlist_id: str):
    """Delete a playlist (admin only)"""
    try:
        existing_playlist = await db_service.get_playlist_by_id(playlist_id)
        if not existing_playlist:
            raise HTTPException(status_code=404, detail="Playlist not found")
        
        success = await db_service.delete_playlist(playlist_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to delete playlist")
        
        # Log the admin action
        log = AdminLogCreate(
            action="delete",
            entity_type="playlist",
            entity_id=playlist_id,
            entity_name=existing_playlist.name
        )
        await db_service.log_admin_action(log)
        
        return {"message": "Playlist deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting playlist {playlist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/{playlist_id}/songs")
async def add_song_to_playlist(playlist_id: str, song_id: str):
    """Add a song to a playlist"""
    try:
        # Check if playlist exists
        playlist = await db_service.get_playlist_by_id(playlist_id)
        if not playlist:
            raise HTTPException(status_code=404, detail="Playlist not found")
        
        # Check if song exists
        song = await db_service.get_song_by_id(song_id)
        if not song:
            raise HTTPException(status_code=404, detail="Song not found")
        
        success = await db_service.add_song_to_playlist(playlist_id, song_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to add song to playlist")
        
        return {"message": "Song added to playlist successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding song {song_id} to playlist {playlist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{playlist_id}/songs/{song_id}")
async def remove_song_from_playlist(playlist_id: str, song_id: str):
    """Remove a song from a playlist"""
    try:
        success = await db_service.remove_song_from_playlist(playlist_id, song_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to remove song from playlist")
        
        return {"message": "Song removed from playlist successfully"}
    except Exception as e:
        logger.error(f"Error removing song {song_id} from playlist {playlist_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")