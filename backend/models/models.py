from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
import uuid

# Base models for database entities

class ArtistBase(BaseModel):
    name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class ArtistCreate(ArtistBase):
    pass

class ArtistUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class Artist(ArtistBase):
    id: str
    created_at: datetime
    updated_at: datetime

class AlbumBase(BaseModel):
    title: str
    artist_id: str
    cover_url: Optional[str] = None
    release_date: Optional[date] = None

class AlbumCreate(AlbumBase):
    pass

class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    artist_id: Optional[str] = None
    cover_url: Optional[str] = None
    release_date: Optional[date] = None

class Album(AlbumBase):
    id: str
    created_at: datetime
    updated_at: datetime
    artist: Optional[Artist] = None

class SongBase(BaseModel):
    title: str
    artist_id: str
    album_id: Optional[str] = None
    duration: Optional[str] = None
    genre: Optional[str] = None
    audio_url: Optional[str] = None
    cover_url: Optional[str] = None

class SongCreate(SongBase):
    pass

class SongUpdate(BaseModel):
    title: Optional[str] = None
    artist_id: Optional[str] = None
    album_id: Optional[str] = None
    duration: Optional[str] = None
    genre: Optional[str] = None
    audio_url: Optional[str] = None
    cover_url: Optional[str] = None

class Song(SongBase):
    id: str
    created_at: datetime
    updated_at: datetime
    artist: Optional[Artist] = None
    album: Optional[Album] = None

class PlaylistBase(BaseModel):
    name: str
    cover_url: Optional[str] = None
    description: Optional[str] = None

class PlaylistCreate(PlaylistBase):
    pass

class PlaylistUpdate(BaseModel):
    name: Optional[str] = None
    cover_url: Optional[str] = None
    description: Optional[str] = None

class Playlist(PlaylistBase):
    id: str
    created_at: datetime
    updated_at: datetime
    songs: Optional[List[Song]] = []
    song_count: Optional[int] = 0

class PlaylistSongBase(BaseModel):
    playlist_id: str
    song_id: str
    order_index: Optional[int] = 0

class PlaylistSongCreate(PlaylistSongBase):
    pass

class PlaylistSong(PlaylistSongBase):
    id: str
    created_at: datetime

class AdminLogBase(BaseModel):
    admin_name: Optional[str] = "Admin"
    action: str  # add, update, delete
    entity_type: str  # song, album, playlist, artist
    entity_id: str
    entity_name: Optional[str] = None

class AdminLogCreate(AdminLogBase):
    pass

class AdminLog(AdminLogBase):
    id: str
    timestamp: datetime

# Response models
class StatsResponse(BaseModel):
    total_songs: int
    total_artists: int
    total_albums: int
    total_playlists: int

class SearchResultsResponse(BaseModel):
    songs: List[Song]
    artists: List[Artist]
    albums: List[Album]
    playlists: List[Playlist]

# Upload models
class UploadResponse(BaseModel):
    filename: str
    url: str
    message: str

# User preference models
class UserBase(BaseModel):
    email: str
    name: str
    is_admin: Optional[bool] = False

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    joined_at: datetime
    liked_songs: Optional[List[str]] = []
    followed_artists: Optional[List[str]] = []
    saved_albums: Optional[List[str]] = []
    created_playlists: Optional[List[str]] = []

class UserPreferences(BaseModel):
    user_id: str
    liked_songs: Optional[List[str]] = []
    followed_artists: Optional[List[str]] = []
    saved_albums: Optional[List[str]] = []

class UserAction(BaseModel):
    user_id: str
    action_type: str  # like_song, follow_artist, save_album, create_playlist
    entity_type: str  # song, artist, album, playlist
    entity_id: str