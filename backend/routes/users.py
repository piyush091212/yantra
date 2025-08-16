from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from bson import ObjectId
from models.models import User, UserPreferences, UserAction, Song, Artist, Album, Playlist
from services.database_service import get_database

router = APIRouter(prefix="/users", tags=["users"])

async def get_db():
    return get_database()

@router.get("/{user_id}/preferences", response_model=UserPreferences)
async def get_user_preferences(user_id: str, db=Depends(get_db)):
    """Get user preferences (liked songs, followed artists, etc.)"""
    try:
        user = await db.users.find_one({"id": user_id})
        if not user:
            # Create user preferences if not exists
            preferences = {
                "user_id": user_id,
                "liked_songs": [],
                "followed_artists": [],
                "saved_albums": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.user_preferences.insert_one(preferences)
            return UserPreferences(**preferences)
        
        return UserPreferences(
            user_id=user_id,
            liked_songs=user.get("liked_songs", []),
            followed_artists=user.get("followed_artists", []),
            saved_albums=user.get("saved_albums", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/like-song/{song_id}")
async def toggle_like_song(user_id: str, song_id: str, db=Depends(get_db)):
    """Toggle like status for a song"""
    try:
        # Check if user exists, create if not
        user = await db.user_preferences.find_one({"user_id": user_id})
        if not user:
            user = {
                "user_id": user_id,
                "liked_songs": [],
                "followed_artists": [],
                "saved_albums": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.user_preferences.insert_one(user)
        
        liked_songs = user.get("liked_songs", [])
        is_liked = song_id in liked_songs
        
        if is_liked:
            liked_songs.remove(song_id)
            action = "unlike_song"
        else:
            liked_songs.append(song_id)
            action = "like_song"
        
        await db.user_preferences.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "liked_songs": liked_songs,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Log user action
        await db.user_actions.insert_one({
            "user_id": user_id,
            "action_type": action,
            "entity_type": "song",
            "entity_id": song_id,
            "timestamp": datetime.utcnow()
        })
        
        return {"message": f"Song {'unliked' if is_liked else 'liked'} successfully", "is_liked": not is_liked}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/follow-artist/{artist_id}")
async def toggle_follow_artist(user_id: str, artist_id: str, db=Depends(get_db)):
    """Toggle follow status for an artist"""
    try:
        user = await db.user_preferences.find_one({"user_id": user_id})
        if not user:
            user = {
                "user_id": user_id,
                "liked_songs": [],
                "followed_artists": [],
                "saved_albums": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.user_preferences.insert_one(user)
        
        followed_artists = user.get("followed_artists", [])
        is_following = artist_id in followed_artists
        
        if is_following:
            followed_artists.remove(artist_id)
            action = "unfollow_artist"
        else:
            followed_artists.append(artist_id)
            action = "follow_artist"
        
        await db.user_preferences.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "followed_artists": followed_artists,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Log user action
        await db.user_actions.insert_one({
            "user_id": user_id,
            "action_type": action,
            "entity_type": "artist",
            "entity_id": artist_id,
            "timestamp": datetime.utcnow()
        })
        
        return {"message": f"Artist {'unfollowed' if is_following else 'followed'} successfully", "is_following": not is_following}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/save-album/{album_id}")
async def toggle_save_album(user_id: str, album_id: str, db=Depends(get_db)):
    """Toggle save status for an album"""
    try:
        user = await db.user_preferences.find_one({"user_id": user_id})
        if not user:
            user = {
                "user_id": user_id,
                "liked_songs": [],
                "followed_artists": [],
                "saved_albums": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.user_preferences.insert_one(user)
        
        saved_albums = user.get("saved_albums", [])
        is_saved = album_id in saved_albums
        
        if is_saved:
            saved_albums.remove(album_id)
            action = "unsave_album"
        else:
            saved_albums.append(album_id)
            action = "save_album"
        
        await db.user_preferences.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "saved_albums": saved_albums,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Log user action
        await db.user_actions.insert_one({
            "user_id": user_id,
            "action_type": action,
            "entity_type": "album",
            "entity_id": album_id,
            "timestamp": datetime.utcnow()
        })
        
        return {"message": f"Album {'unsaved' if is_saved else 'saved'} successfully", "is_saved": not is_saved}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/liked-songs")
async def get_user_liked_songs(user_id: str, skip: int = 0, limit: int = 50, db=Depends(get_db)):
    """Get user's liked songs"""
    try:
        user = await db.user_preferences.find_one({"user_id": user_id})
        if not user:
            return {"songs": [], "total": 0}
        
        liked_song_ids = user.get("liked_songs", [])
        
        if not liked_song_ids:
            return {"songs": [], "total": 0}
        
        # Get songs from database
        songs_cursor = db.songs.find({"id": {"$in": liked_song_ids}}).skip(skip).limit(limit)
        songs = await songs_cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for song in songs:
            if "_id" in song:
                song["_id"] = str(song["_id"])
        
        return {"songs": songs, "total": len(liked_song_ids)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/followed-artists")
async def get_user_followed_artists(user_id: str, skip: int = 0, limit: int = 50, db=Depends(get_db)):
    """Get user's followed artists"""
    try:
        user = await db.user_preferences.find_one({"user_id": user_id})
        if not user:
            return {"artists": [], "total": 0}
        
        followed_artist_ids = user.get("followed_artists", [])
        
        if not followed_artist_ids:
            return {"artists": [], "total": 0}
        
        # Get artists from database
        artists_cursor = db.artists.find({"id": {"$in": followed_artist_ids}}).skip(skip).limit(limit)
        artists = await artists_cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for artist in artists:
            if "_id" in artist:
                artist["_id"] = str(artist["_id"])
        
        return {"artists": artists, "total": len(followed_artist_ids)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/saved-albums")
async def get_user_saved_albums(user_id: str, skip: int = 0, limit: int = 50, db=Depends(get_db)):
    """Get user's saved albums"""
    try:
        user = await db.user_preferences.find_one({"user_id": user_id})
        if not user:
            return {"albums": [], "total": 0}
        
        saved_album_ids = user.get("saved_albums", [])
        
        if not saved_album_ids:
            return {"albums": [], "total": 0}
        
        # Get albums from database
        albums_cursor = db.albums.find({"id": {"$in": saved_album_ids}}).skip(skip).limit(limit)
        albums = await albums_cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for album in albums:
            if "_id" in album:
                album["_id"] = str(album["_id"])
        
        return {"albums": albums, "total": len(saved_album_ids)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))