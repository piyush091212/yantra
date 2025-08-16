-- YantraTune Sample Data for Supabase/PostgreSQL
-- This file contains sample data to populate the music streaming application

-- Insert Artists
INSERT INTO artists (id, name, bio, avatar_url, created_at, updated_at) VALUES 
('a1e2b3c4-5d6f-7g8h-9i0j-1k2l3m4n5o6p', 'The Weeknd', 'Canadian singer, songwriter, and record producer known for his musical versatility.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop', NOW(), NOW()),
('b2f3c4d5-6e7f-8g9h-0i1j-2k3l4m5n6o7p', 'Ed Sheeran', 'English singer-songwriter known for his acoustic folk and pop music.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', NOW(), NOW()),
('c3g4d5e6-7f8g-9h0i-1j2k-3l4m5n6o7p8q', 'Queen', 'Legendary British rock band formed in London in 1970.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', NOW(), NOW()),
('d4h5e6f7-8g9h-0i1j-2k3l-4m5n6o7p8q9r', 'Olivia Rodrigo', 'American singer-songwriter and actress known for pop-rock and alternative pop music.', 'https://images.unsplash.com/photo-1494790108755-2616b612b913?w=300&h=300&fit=crop', NOW(), NOW()),
('e5i6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s', 'Harry Styles', 'English singer, songwriter, and actor. Former member of One Direction.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop', NOW(), NOW());

-- Insert Albums
INSERT INTO albums (id, title, artist_id, cover_url, release_date, created_at, updated_at) VALUES 
('f6j7g8h9-0i1j-2k3l-4m5n-6o7p8q9r0s1t', 'After Hours', 'a1e2b3c4-5d6f-7g8h-9i0j-1k2l3m4n5o6p', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', '2020-03-20', NOW(), NOW()),
('g7k8h9i0-1j2k-3l4m-5n6o-7p8q9r0s1t2u', '÷ (Divide)', 'b2f3c4d5-6e7f-8g9h-0i1j-2k3l4m5n6o7p', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', '2017-03-03', NOW(), NOW()),
('h8l9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'A Night at the Opera', 'c3g4d5e6-7f8g-9h0i-1j2k-3l4m5n6o7p8q', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', '1975-11-21', NOW(), NOW()),
('i9m0j1k2-3l4m-5n6o-7p8q-9r0s1t2u3v4w', 'Sour', 'd4h5e6f7-8g9h-0i1j-2k3l-4m5n6o7p8q9r', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', '2021-05-21', NOW(), NOW()),
('j0n1k2l3-4m5n-6o7p-8q9r-0s1t2u3v4w5x', 'Fine Line', 'e5i6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', '2019-12-13', NOW(), NOW());

-- Insert Songs
INSERT INTO songs (id, title, artist_id, album_id, duration, genre, audio_url, cover_url, created_at, updated_at) VALUES 
('k1o2l3m4-5n6o-7p8q-9r0s-1t2u3v4w5x6y', 'Blinding Lights', 'a1e2b3c4-5d6f-7g8h-9i0j-1k2l3m4n5o6p', 'f6j7g8h9-0i1j-2k3l-4m5n-6o7p8q9r0s1t', '3:20', 'Pop', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', NOW(), NOW()),
('l2p3m4n5-6o7p-8q9r-0s1t-2u3v4w5x6y7z', 'Shape of You', 'b2f3c4d5-6e7f-8g9h-0i1j-2k3l4m5n6o7p', 'g7k8h9i0-1j2k-3l4m-5n6o-7p8q9r0s1t2u', '3:53', 'Pop', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', NOW(), NOW()),
('m3q4n5o6-7p8q-9r0s-1t2u-3v4w5x6y7z8a', 'Bohemian Rhapsody', 'c3g4d5e6-7f8g-9h0i-1j2k-3l4m5n6o7p8q', 'h8l9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', '5:55', 'Rock', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', NOW(), NOW()),
('n4r5o6p7-8q9r-0s1t-2u3v-4w5x6y7z8a9b', 'Good 4 U', 'd4h5e6f7-8g9h-0i1j-2k3l-4m5n6o7p8q9r', 'i9m0j1k2-3l4m-5n6o-7p8q-9r0s1t2u3v4w', '2:58', 'Pop Rock', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', NOW(), NOW()),
('o5s6p7q8-9r0s-1t2u-3v4w-5x6y7z8a9b0c', 'Watermelon Sugar', 'e5i6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s', 'j0n1k2l3-4m5n-6o7p-8q9r-0s1t2u3v4w5x', '2:54', 'Pop', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', NOW(), NOW()),
('p6t7q8r9-0s1t-2u3v-4w5x-6y7z8a9b0c1d', 'Heartbreak on the Map', 'a1e2b3c4-5d6f-7g8h-9i0j-1k2l3m4n5o6p', 'f6j7g8h9-0i1j-2k3l-4m5n-6o7p8q9r0s1t', '3:45', 'R&B', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', NOW(), NOW()),
('q7u8r9s0-1t2u-3v4w-5x6y-7z8a9b0c1d2e', 'Perfect', 'b2f3c4d5-6e7f-8g9h-0i1j-2k3l4m5n6o7p', 'g7k8h9i0-1j2k-3l4m-5n6o-7p8q9r0s1t2u', '4:23', 'Pop', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', NOW(), NOW()),
('r8v9s0t1-2u3v-4w5x-6y7z-8a9b0c1d2e3f', 'We Will Rock You', 'c3g4d5e6-7f8g-9h0i-1j2k-3l4m5n6o7p8q', 'h8l9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', '2:02', 'Rock', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', NOW(), NOW());

-- Insert Playlists
INSERT INTO playlists (id, name, cover_url, description, created_at, updated_at) VALUES 
('s9w0t1u2-3v4w-5x6y-7z8a-9b0c1d2e3f4g', 'Today''s Top Hits', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', 'The biggest hits right now', NOW(), NOW()),
('t0x1u2v3-4w5x-6y7z-8a9b-0c1d2e3f4g5h', 'Chill Vibes', 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop', 'Relax and unwind with these chill tracks', NOW(), NOW()),
('u1y2v3w4-5x6y-7z8a-9b0c-1d2e3f4g5h6i', 'Workout Mix', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', 'High energy tracks for your workout', NOW(), NOW()),
('v2z3w4x5-6y7z-8a9b-0c1d-2e3f4g5h6i7j', 'Rock Classics', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', 'Timeless rock anthems', NOW(), NOW());

-- Insert Playlist Songs (linking songs to playlists)
INSERT INTO playlist_songs (id, playlist_id, song_id, order_index, created_at) VALUES 
('w3a4x5y6-7z8a-9b0c-1d2e-3f4g5h6i7j8k', 's9w0t1u2-3v4w-5x6y-7z8a-9b0c1d2e3f4g', 'k1o2l3m4-5n6o-7p8q-9r0s-1t2u3v4w5x6y', 1, NOW()), -- Blinding Lights in Top Hits
('x4b5y6z7-8a9b-0c1d-2e3f-4g5h6i7j8k9l', 's9w0t1u2-3v4w-5x6y-7z8a-9b0c1d2e3f4g', 'l2p3m4n5-6o7p-8q9r-0s1t-2u3v4w5x6y7z', 2, NOW()), -- Shape of You in Top Hits
('y5c6z7a8-9b0c-1d2e-3f4g-5h6i7j8k9l0m', 's9w0t1u2-3v4w-5x6y-7z8a-9b0c1d2e3f4g', 'n4r5o6p7-8q9r-0s1t-2u3v-4w5x6y7z8a9b', 3, NOW()), -- Good 4 U in Top Hits
('z6d7a8b9-0c1d-2e3f-4g5h-6i7j8k9l0m1n', 't0x1u2v3-4w5x-6y7z-8a9b-0c1d2e3f4g5h', 'o5s6p7q8-9r0s-1t2u-3v4w-5x6y7z8a9b0c', 1, NOW()), -- Watermelon Sugar in Chill Vibes
('a7e8b9c0-1d2e-3f4g-5h6i-7j8k9l0m1n2o', 't0x1u2v3-4w5x-6y7z-8a9b-0c1d2e3f4g5h', 'q7u8r9s0-1t2u-3v4w-5x6y-7z8a9b0c1d2e', 2, NOW()), -- Perfect in Chill Vibes
('b8f9c0d1-2e3f-4g5h-6i7j-8k9l0m1n2o3p', 'u1y2v3w4-5x6y-7z8a-9b0c-1d2e3f4g5h6i', 'k1o2l3m4-5n6o-7p8q-9r0s-1t2u3v4w5x6y', 1, NOW()), -- Blinding Lights in Workout Mix
('c9g0d1e2-3f4g-5h6i-7j8k-9l0m1n2o3p4q', 'u1y2v3w4-5x6y-7z8a-9b0c-1d2e3f4g5h6i', 'n4r5o6p7-8q9r-0s1t-2u3v-4w5x6y7z8a9b', 2, NOW()), -- Good 4 U in Workout Mix
('d0h1e2f3-4g5h-6i7j-8k9l-0m1n2o3p4q5r', 'v2z3w4x5-6y7z-8a9b-0c1d-2e3f4g5h6i7j', 'm3q4n5o6-7p8q-9r0s-1t2u-3v4w5x6y7z8a', 1, NOW()), -- Bohemian Rhapsody in Rock Classics
('e1i2f3g4-5h6i-7j8k-9l0m-1n2o3p4q5r6s', 'v2z3w4x5-6y7z-8a9b-0c1d-2e3f4g5h6i7j', 'r8v9s0t1-2u3v-4w5x-6y7z-8a9b0c1d2e3f', 2, NOW()); -- We Will Rock You in Rock Classics

-- Insert Admin Logs
INSERT INTO admin_logs (id, admin_name, action, entity_type, entity_id, timestamp) VALUES 
('f2j3g4h5-6i7j-8k9l-0m1n-2o3p4q5r6s7t', 'System', 'add', 'song', 'k1o2l3m4-5n6o-7p8q-9r0s-1t2u3v4w5x6y', NOW() - INTERVAL '2 hours'),
('g3k4h5i6-7j8k-9l0m-1n2o-3p4q5r6s7t8u', 'System', 'add', 'artist', 'a1e2b3c4-5d6f-7g8h-9i0j-1k2l3m4n5o6p', NOW() - INTERVAL '5 hours'),
('h4l5i6j7-8k9l-0m1n-2o3p-4q5r6s7t8u9v', 'System', 'add', 'playlist', 's9w0t1u2-3v4w-5x6y-7z8a-9b0c1d2e3f4g', NOW() - INTERVAL '1 day'),
('i5m6j7k8-9l0m-1n2o-3p4q-5r6s7t8u9v0w', 'System', 'add', 'album', 'f6j7g8h9-0i1j-2k3l-4m5n-6o7p8q9r0s1t', NOW() - INTERVAL '3 days');

-- Note: Make sure to create the tables first using the schema in contracts.md before running this data insertion script.
-- Run this script in your Supabase SQL Editor or PostgreSQL database.