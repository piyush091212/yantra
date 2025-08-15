# YantraTune - Backend Integration Contracts

## Database Schema (Supabase PostgreSQL)

### Core Tables

#### songs
```sql
- id (UUID, PK)
- title (VARCHAR)
- artist_id (UUID, FK -> artists.id)
- album_id (UUID, FK -> albums.id)  
- duration (VARCHAR)
- genre (VARCHAR)
- audio_url (TEXT) // Supabase Storage URL
- cover_url (TEXT) // Supabase Storage URL
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### artists
```sql
- id (UUID, PK)
- name (VARCHAR)
- bio (TEXT)
- avatar_url (TEXT) // Supabase Storage URL
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### albums
```sql
- id (UUID, PK)
- title (VARCHAR)
- artist_id (UUID, FK -> artists.id)
- cover_url (TEXT) // Supabase Storage URL
- release_date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### playlists
```sql
- id (UUID, PK)
- name (VARCHAR)
- cover_url (TEXT)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### playlist_songs
```sql
- id (UUID, PK)
- playlist_id (UUID, FK -> playlists.id)
- song_id (UUID, FK -> songs.id)
- order_index (INTEGER)
- created_at (TIMESTAMP)
```

#### admin_logs
```sql
- id (UUID, PK)
- admin_name (VARCHAR)
- action (ENUM: add, delete, update)
- entity_type (ENUM: song, album, playlist, artist)
- entity_id (UUID)
- timestamp (TIMESTAMP)
```

## API Contracts

### Songs API
- `GET /api/songs` - Get all songs with pagination
- `GET /api/songs/:id` - Get single song
- `POST /api/songs` - Create new song (admin)
- `PUT /api/songs/:id` - Update song (admin)
- `DELETE /api/songs/:id` - Delete song (admin)
- `GET /api/songs/search?q=query` - Search songs

### Artists API
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get artist with songs
- `POST /api/artists` - Create artist (admin)
- `PUT /api/artists/:id` - Update artist (admin)
- `DELETE /api/artists/:id` - Delete artist (admin)

### Albums API  
- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get album with songs
- `POST /api/albums` - Create album (admin)
- `PUT /api/albums/:id` - Update album (admin)
- `DELETE /api/albums/:id` - Delete album (admin)

### Playlists API
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist with songs
- `POST /api/playlists` - Create playlist (admin)
- `PUT /api/playlists/:id` - Update playlist (admin)
- `DELETE /api/playlists/:id` - Delete playlist (admin)
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

### Upload API
- `POST /api/upload/audio` - Upload audio file
- `POST /api/upload/image` - Upload cover/avatar image

### Admin API
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/logs` - Get activity logs

## Frontend Integration Plan

### Mock Data Replacement
Current mock data in `/src/data/mock.js` will be replaced with API calls:

#### Home Component
- Replace `mockSongs` → `GET /api/songs?limit=5&sort=popular`
- Replace `mockPlaylists` → `GET /api/playlists?featured=true`
- Replace `mockRecentlyPlayed` → `GET /api/songs?recent=true`

#### Search Component  
- Replace search filtering → `GET /api/songs/search?q=${query}`
- Add artist/album search → `GET /api/artists/search?q=${query}`

#### Library Component
- Replace `mockSongs` → `GET /api/songs`
- Replace `mockArtists` → `GET /api/artists`
- Replace `mockAlbums` → `GET /api/albums`  
- Replace `mockPlaylists` → `GET /api/playlists`

#### Admin Component
- Replace stats → `GET /api/admin/stats`
- Add CRUD operations → `POST/PUT/DELETE /api/{entity}`
- Add activity logging → `GET /api/admin/logs`

### Player Context Updates
- Update `playSong()` to handle database IDs
- Add playlist management with database IDs
- Store recently played in backend

## File Upload Strategy
- Use Supabase Storage buckets:
  - `/songs` - for MP3 files
  - `/covers` - for album/song covers  
  - `/avatars` - for artist images
- Implement chunked uploads for large audio files
- Generate signed URLs for secure access

## Environment Variables
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Migration Strategy
1. Set up Supabase project and database tables
2. Create backend API endpoints
3. Test APIs with sample data
4. Update frontend components one by one
5. Replace PlayerContext mock functionality
6. Implement file upload features
7. Add admin CRUD operations

## Testing Checklist
- [ ] Database connection and queries
- [ ] All API endpoints working
- [ ] File upload functionality  
- [ ] Frontend-backend integration
- [ ] Music player with real data
- [ ] Search functionality
- [ ] Admin panel CRUD operations
- [ ] Error handling and validation