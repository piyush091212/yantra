from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="YantraTune Mock API", version="1.0.0")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
mock_data = {
    "songs": [
        {
            "id": "1", "title": "Blinding Lights", "artist_id": "1", "album_id": "1",
            "duration": "3:20", "genre": "Pop",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
        },
        {
            "id": "2", "title": "Shape of You", "artist_id": "2", "album_id": "2",
            "duration": "3:53", "genre": "Pop",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            "cover_url": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop"
        }
    ],
    "artists": [
        {
            "id": "1", "name": "The Weeknd", "bio": "Canadian singer-songwriter",
            "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
        },
        {
            "id": "2", "name": "Ed Sheeran", "bio": "English singer-songwriter",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
        }
    ],
    "albums": [
        {
            "id": "1", "title": "After Hours", "artist_id": "1",
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            "release_date": "2020-03-20"
        },
        {
            "id": "2", "title": "÷ (Divide)", "artist_id": "2",
            "cover_url": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop",
            "release_date": "2017-03-03"
        }
    ],
    "playlists": [
        {
            "id": "1", "name": "Today's Top Hits",
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            "description": "The biggest hits right now"
        }
    ]
}

@app.get("/api/")
async def health_check():
    return {"message": "YantraTune Mock API is running!", "version": "1.0.0"}

@app.get("/api/songs")
async def get_songs():
    return mock_data["songs"]

@app.get("/api/artists")
async def get_artists():
    return mock_data["artists"]

@app.get("/api/albums")
async def get_albums():
    return mock_data["albums"]

@app.get("/api/playlists")
async def get_playlists():
    return mock_data["playlists"]

@app.post("/api/songs")
async def create_song(song_data: dict):
    new_id = str(len(mock_data["songs"]) + 1)
    song_data["id"] = new_id
    mock_data["songs"].append(song_data)
    return song_data

@app.post("/api/artists")
async def create_artist(artist_data: dict):
    new_id = str(len(mock_data["artists"]) + 1)
    artist_data["id"] = new_id
    mock_data["artists"].append(artist_data)
    return artist_data

@app.post("/api/albums")
async def create_album(album_data: dict):
    new_id = str(len(mock_data["albums"]) + 1)
    album_data["id"] = new_id
    mock_data["albums"].append(album_data)
    return album_data

@app.post("/api/playlists")
async def create_playlist(playlist_data: dict):
    new_id = str(len(mock_data["playlists"]) + 1)
    playlist_data["id"] = new_id
    mock_data["playlists"].append(playlist_data)
    return playlist_data

@app.get("/api/admin/stats")
async def get_admin_stats():
    return {
        "total_songs": len(mock_data["songs"]),
        "total_artists": len(mock_data["artists"]),
        "total_albums": len(mock_data["albums"]),
        "total_playlists": len(mock_data["playlists"])
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)