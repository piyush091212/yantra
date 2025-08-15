-- YantraTune Database Schema for Supabase PostgreSQL
-- Copy and paste this SQL into your Supabase SQL Editor

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

-- Insert sample data
INSERT INTO artists (name, bio, avatar_url) VALUES 
('The Weeknd', 'Canadian singer, songwriter, and record producer known for his musical versatility.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'),
('Ed Sheeran', 'English singer-songwriter known for his acoustic folk and pop music.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'),
('Queen', 'Legendary British rock band formed in London in 1970.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop');

-- Insert sample albums (using artist IDs from above)
INSERT INTO albums (title, artist_id, cover_url, release_date) VALUES 
('After Hours', (SELECT id FROM artists WHERE name = 'The Weeknd'), 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', '2020-03-20'),
('÷ (Divide)', (SELECT id FROM artists WHERE name = 'Ed Sheeran'), 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', '2017-03-03');

-- Insert sample songs
INSERT INTO songs (title, artist_id, album_id, duration, genre, audio_url, cover_url) VALUES 
('Blinding Lights', (SELECT id FROM artists WHERE name = 'The Weeknd'), (SELECT id FROM albums WHERE title = 'After Hours'), '3:20', 'Pop', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'),
('Shape of You', (SELECT id FROM artists WHERE name = 'Ed Sheeran'), (SELECT id FROM albums WHERE title = '÷ (Divide)'), '3:53', 'Pop', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop'),
('Bohemian Rhapsody', (SELECT id FROM artists WHERE name = 'Queen'), NULL, '5:55', 'Rock', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'),
('Good 4 U', (SELECT id FROM artists WHERE name = 'Ed Sheeran'), NULL, '2:58', 'Pop Rock', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop'),
('Watermelon Sugar', (SELECT id FROM artists WHERE name = 'Ed Sheeran'), NULL, '2:54', 'Pop', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop');

-- Insert sample playlists
INSERT INTO playlists (name, cover_url, description) VALUES 
('Today''s Top Hits', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', 'The biggest hits right now'),
('Chill Vibes', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', 'Relax and unwind with these chill tracks'),
('Workout Mix', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', 'High energy tracks for your workout');

-- Add songs to playlists
INSERT INTO playlist_songs (playlist_id, song_id, order_index) VALUES 
((SELECT id FROM playlists WHERE name = 'Today''s Top Hits'), (SELECT id FROM songs WHERE title = 'Blinding Lights'), 1),
((SELECT id FROM playlists WHERE name = 'Today''s Top Hits'), (SELECT id FROM songs WHERE title = 'Shape of You'), 2),
((SELECT id FROM playlists WHERE name = 'Chill Vibes'), (SELECT id FROM songs WHERE title = 'Bohemian Rhapsody'), 1),
((SELECT id FROM playlists WHERE name = 'Workout Mix'), (SELECT id FROM songs WHERE title = 'Good 4 U'), 1);