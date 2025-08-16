#!/usr/bin/env python3
"""
Populate the database with sample music data
This script creates sample artists, albums, songs, and playlists
"""

import requests
import json
import sys
import time

# Backend URL from environment
BACKEND_URL = "https://dj36kcua08ir5.cloudfront.net"
API = f"{BACKEND_URL}/api"

def check_backend_health():
    """Check if backend is running"""
    try:
        response = requests.get(f"{API}/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running")
            return True
    except Exception as e:
        print(f"❌ Backend not available: {e}")
        return False
    return False

def create_artists():
    """Create sample artists"""
    artists_data = [
        {
            "name": "The Weeknd",
            "bio": "Canadian singer, songwriter, and record producer known for his musical versatility and dark themes.",
            "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
        },
        {
            "name": "Ed Sheeran", 
            "bio": "English singer-songwriter known for his acoustic folk and pop music, heartfelt lyrics.",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
        },
        {
            "name": "Queen",
            "bio": "Legendary British rock band formed in London in 1970, fronted by Freddie Mercury.",
            "avatar_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=face"
        },
        {
            "name": "Billie Eilish",
            "bio": "American singer-songwriter known for her unique style and whispered vocal delivery.",
            "avatar_url": "https://images.unsplash.com/photo-1494790108755-2616c96e2e5f?w=300&h=300&fit=crop&crop=face"
        },
        {
            "name": "Dua Lipa",
            "bio": "English singer-songwriter known for her disco-pop and dance-pop music.",
            "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
        }
    ]
    
    created_artists = []
    print("\n📀 Creating Artists...")
    
    for artist_data in artists_data:
        try:
            response = requests.post(f"{API}/artists", json=artist_data, timeout=10)
            if response.status_code == 201:
                artist = response.json()
                created_artists.append(artist)
                print(f"✅ Created artist: {artist['name']} (ID: {artist['id']})")
            else:
                print(f"❌ Failed to create artist {artist_data['name']}: {response.text}")
        except Exception as e:
            print(f"❌ Error creating artist {artist_data['name']}: {e}")
    
    return created_artists

def create_albums(artists):
    """Create sample albums"""
    if not artists:
        print("No artists available for creating albums")
        return []
        
    # Create artist lookup by name
    artist_lookup = {artist["name"]: artist["id"] for artist in artists}
    
    albums_data = [
        {
            "title": "After Hours",
            "artist_id": artist_lookup.get("The Weeknd"),
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            "release_date": "2020-03-20"
        },
        {
            "title": "÷ (Divide)",
            "artist_id": artist_lookup.get("Ed Sheeran"),
            "cover_url": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop", 
            "release_date": "2017-03-03"
        },
        {
            "title": "A Night at the Opera",
            "artist_id": artist_lookup.get("Queen"),
            "cover_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
            "release_date": "1975-11-21"
        },
        {
            "title": "Happier Than Ever",
            "artist_id": artist_lookup.get("Billie Eilish"),
            "cover_url": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
            "release_date": "2021-07-30"
        }
    ]
    
    created_albums = []
    print("\n💿 Creating Albums...")
    
    for album_data in albums_data:
        if not album_data["artist_id"]:
            continue
            
        try:
            response = requests.post(f"{API}/albums", json=album_data, timeout=10)
            if response.status_code == 201:
                album = response.json()
                created_albums.append(album)
                print(f"✅ Created album: {album['title']} (ID: {album['id']})")
            else:
                print(f"❌ Failed to create album {album_data['title']}: {response.text}")
        except Exception as e:
            print(f"❌ Error creating album {album_data['title']}: {e}")
    
    return created_albums

def create_songs(artists, albums):
    """Create sample songs"""
    if not artists:
        print("No artists available for creating songs")
        return []
        
    # Create lookups
    artist_lookup = {artist["name"]: artist["id"] for artist in artists}
    album_lookup = {album["title"]: album["id"] for album in albums}
    
    songs_data = [
        {
            "title": "Blinding Lights",
            "artist_id": artist_lookup.get("The Weeknd"),
            "album_id": album_lookup.get("After Hours"),
            "duration": "3:20",
            "genre": "Synthwave",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
        },
        {
            "title": "Shape of You",
            "artist_id": artist_lookup.get("Ed Sheeran"),
            "album_id": album_lookup.get("÷ (Divide)"),
            "duration": "3:53", 
            "genre": "Pop",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            "cover_url": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop"
        },
        {
            "title": "Bohemian Rhapsody",
            "artist_id": artist_lookup.get("Queen"),
            "album_id": album_lookup.get("A Night at the Opera"),
            "duration": "5:55",
            "genre": "Rock", 
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            "cover_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"
        },
        {
            "title": "Happier Than Ever",
            "artist_id": artist_lookup.get("Billie Eilish"),
            "album_id": album_lookup.get("Happier Than Ever"),
            "duration": "4:58",
            "genre": "Alternative",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", 
            "cover_url": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop"
        },
        {
            "title": "Perfect",
            "artist_id": artist_lookup.get("Ed Sheeran"),
            "album_id": album_lookup.get("÷ (Divide)"),
            "duration": "4:23",
            "genre": "Pop",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            "cover_url": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop"
        },
        {
            "title": "Levitating",
            "artist_id": artist_lookup.get("Dua Lipa"),
            "album_id": None,
            "duration": "3:23",
            "genre": "Disco Pop",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
            "cover_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop"
        },
        {
            "title": "Bad Guy",
            "artist_id": artist_lookup.get("Billie Eilish"),
            "album_id": None,
            "duration": "3:14",
            "genre": "Electropop",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
            "cover_url": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop"
        },
        {
            "title": "We Will Rock You",
            "artist_id": artist_lookup.get("Queen"),
            "album_id": None,
            "duration": "2:02",
            "genre": "Rock",
            "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
            "cover_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"
        }
    ]
    
    created_songs = []
    print("\n🎵 Creating Songs...")
    
    for song_data in songs_data:
        if not song_data["artist_id"]:
            continue
            
        try:
            response = requests.post(f"{API}/songs", json=song_data, timeout=10)
            if response.status_code == 201:
                song = response.json()
                created_songs.append(song)
                print(f"✅ Created song: {song['title']} (ID: {song['id']})")
            else:
                print(f"❌ Failed to create song {song_data['title']}: {response.text}")
        except Exception as e:
            print(f"❌ Error creating song {song_data['title']}: {e}")
    
    return created_songs

def create_playlists():
    """Create sample playlists"""
    playlists_data = [
        {
            "name": "Today's Top Hits",
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            "description": "The biggest hits right now"
        },
        {
            "name": "Chill Vibes", 
            "cover_url": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop",
            "description": "Relax and unwind with these chill tracks"
        },
        {
            "name": "Workout Mix",
            "cover_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
            "description": "High energy tracks for your workout"
        },
        {
            "name": "Rock Legends",
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            "description": "Classic rock songs from legendary artists"
        },
        {
            "name": "Pop Essentials",
            "cover_url": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
            "description": "Essential pop songs everyone should know"
        }
    ]
    
    created_playlists = []
    print("\n📋 Creating Playlists...")
    
    for playlist_data in playlists_data:
        try:
            response = requests.post(f"{API}/playlists", json=playlist_data, timeout=10)
            if response.status_code == 201:
                playlist = response.json()
                created_playlists.append(playlist)
                print(f"✅ Created playlist: {playlist['name']} (ID: {playlist['id']})")
            else:
                print(f"❌ Failed to create playlist {playlist_data['name']}: {response.text}")
        except Exception as e:
            print(f"❌ Error creating playlist {playlist_data['name']}: {e}")
    
    return created_playlists

def main():
    """Main function to populate database"""
    print("🎵 Starting Database Population...")
    
    # Check backend health
    if not check_backend_health():
        print("❌ Backend is not available. Please ensure the backend service is running.")
        sys.exit(1)
    
    # Create data in correct order (due to foreign key constraints)
    artists = create_artists()
    time.sleep(1)  # Small delay between operations
    
    albums = create_albums(artists)
    time.sleep(1)
    
    songs = create_songs(artists, albums)
    time.sleep(1)
    
    playlists = create_playlists()
    
    # Summary
    print(f"\n🎯 Database Population Complete!")
    print(f"   📀 Artists: {len(artists)}")
    print(f"   💿 Albums: {len(albums)}")
    print(f"   🎵 Songs: {len(songs)}")
    print(f"   📋 Playlists: {len(playlists)}")
    print(f"\n✅ Your music database is ready to use!")

if __name__ == "__main__":
    main()