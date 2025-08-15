"""
Initialize Supabase database tables for YantraTune
This script creates the required tables in your Supabase PostgreSQL database
"""

from supabase import Client
from database.supabase_client import get_supabase_admin
import logging

logger = logging.getLogger(__name__)

def create_tables():
    """Create all required tables in Supabase"""
    supabase = get_supabase_admin()
    
    # SQL statements to create tables
    create_tables_sql = """
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Create artists table
    CREATE TABLE IF NOT EXISTS artists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create albums table
    CREATE TABLE IF NOT EXISTS albums (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
        cover_url TEXT,
        release_date DATE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create songs table
    CREATE TABLE IF NOT EXISTS songs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
        album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
        duration VARCHAR(10),
        genre VARCHAR(100),
        audio_url TEXT,
        cover_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create playlists table
    CREATE TABLE IF NOT EXISTS playlists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        cover_url TEXT,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create playlist_songs junction table
    CREATE TABLE IF NOT EXISTS playlist_songs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
        song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(playlist_id, song_id)
    );

    -- Create admin_logs table
    CREATE TABLE IF NOT EXISTS admin_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        admin_name VARCHAR(255) DEFAULT 'Admin',
        action VARCHAR(50) CHECK (action IN ('add', 'update', 'delete')),
        entity_type VARCHAR(50) CHECK (entity_type IN ('song', 'album', 'playlist', 'artist')),
        entity_id UUID,
        entity_name VARCHAR(255),
        timestamp TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
    CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
    CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
    CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id);
    CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
    CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id ON playlist_songs(song_id);
    CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs(timestamp);

    -- Enable Row Level Security (RLS) - Optional for public access
    -- ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
    -- ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
    -- ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
    -- ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
    -- ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
    """
    
    # Execute the SQL to create tables
    try:
        # Note: Supabase Python client doesn't directly execute raw SQL
        # We'll handle table creation through the Supabase dashboard SQL editor
        logger.info("Tables should be created through Supabase SQL editor")
        logger.info("Please run the SQL in create_tables_sql in your Supabase dashboard")
        return True
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        return False

def insert_sample_data():
    """Insert sample data into the database"""
    supabase = get_supabase_admin()
    
    try:
        # Insert sample artists
        artists_data = [
            {
                "name": "The Weeknd",
                "bio": "Canadian singer, songwriter, and record producer known for his musical versatility.",
                "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
            },
            {
                "name": "Ed Sheeran", 
                "bio": "English singer-songwriter known for his acoustic folk and pop music.",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
            },
            {
                "name": "Queen",
                "bio": "Legendary British rock band formed in London in 1970.",
                "avatar_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
            }
        ]
        
        artist_result = supabase.table("artists").insert(artists_data).execute()
        logger.info(f"Inserted {len(artist_result.data)} artists")
        
        # Get artist IDs for foreign key references
        artists = supabase.table("artists").select("*").execute()
        artist_lookup = {artist["name"]: artist["id"] for artist in artists.data}
        
        # Insert sample albums
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
            }
        ]
        
        album_result = supabase.table("albums").insert(albums_data).execute()
        logger.info(f"Inserted {len(album_result.data)} albums")
        
        # Get album IDs
        albums = supabase.table("albums").select("*").execute()
        album_lookup = {album["title"]: album["id"] for album in albums.data}
        
        # Insert sample songs
        songs_data = [
            {
                "title": "Blinding Lights",
                "artist_id": artist_lookup.get("The Weeknd"),
                "album_id": album_lookup.get("After Hours"),
                "duration": "3:20",
                "genre": "Pop",
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
                "album_id": None,
                "duration": "5:55",
                "genre": "Rock", 
                "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
            },
            {
                "title": "Good 4 U",
                "artist_id": artist_lookup.get("Ed Sheeran"),
                "album_id": None,
                "duration": "2:58",
                "genre": "Pop Rock",
                "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", 
                "cover_url": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop"
            },
            {
                "title": "Watermelon Sugar",
                "artist_id": artist_lookup.get("Ed Sheeran"),
                "album_id": None,
                "duration": "2:54",
                "genre": "Pop",
                "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                "cover_url": "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop"
            }
        ]
        
        song_result = supabase.table("songs").insert(songs_data).execute()
        logger.info(f"Inserted {len(song_result.data)} songs")
        
        # Insert sample playlists
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
            }
        ]
        
        playlist_result = supabase.table("playlists").insert(playlists_data).execute()
        logger.info(f"Inserted {len(playlist_result.data)} playlists")
        
        return True
        
    except Exception as e:
        logger.error(f"Error inserting sample data: {e}")
        return False

if __name__ == "__main__":
    print("Creating tables...")
    create_tables()
    print("Inserting sample data...")
    insert_sample_data()
    print("Database initialization complete!")