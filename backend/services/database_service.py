from database.supabase_client import get_supabase_client, get_supabase_admin
from models.models import *
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.supabase_admin = get_supabase_admin()

    # Artists
    async def get_artists(self, limit: int = 100, offset: int = 0) -> List[Artist]:
        try:
            result = self.supabase.table("artists").select("*").range(offset, offset + limit - 1).execute()
            return [Artist(**artist) for artist in result.data]
        except Exception as e:
            logger.error(f"Error fetching artists: {e}")
            return []

    async def get_artist_by_id(self, artist_id: str) -> Optional[Artist]:
        try:
            result = self.supabase.table("artists").select("*").eq("id", artist_id).execute()
            if result.data:
                return Artist(**result.data[0])
            return None
        except Exception as e:
            logger.error(f"Error fetching artist {artist_id}: {e}")
            return None

    async def create_artist(self, artist: ArtistCreate) -> Optional[Artist]:
        try:
            result = self.supabase_admin.table("artists").insert(artist.model_dump()).execute()
            if result.data:
                return Artist(**result.data[0])
            return None
        except Exception as e:
            logger.error(f"Error creating artist: {e}")
            return None

    async def update_artist(self, artist_id: str, artist: ArtistUpdate) -> Optional[Artist]:
        try:
            update_data = {k: v for k, v in artist.model_dump().items() if v is not None}
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.supabase_admin.table("artists").update(update_data).eq("id", artist_id).execute()
            if result.data:
                return Artist(**result.data[0])
            return None
        except Exception as e:
            logger.error(f"Error updating artist {artist_id}: {e}")
            return None

    async def delete_artist(self, artist_id: str) -> bool:
        try:
            self.supabase_admin.table("artists").delete().eq("id", artist_id).execute()
            return True
        except Exception as e:
            logger.error(f"Error deleting artist {artist_id}: {e}")
            return False

    # Albums  
    async def get_albums(self, limit: int = 100, offset: int = 0) -> List[Album]:
        try:
            result = self.supabase.table("albums").select("*, artist:artists(*)").range(offset, offset + limit - 1).execute()
            albums = []
            for album_data in result.data:
                album_dict = {**album_data}
                if album_dict.get('artist'):
                    album_dict['artist'] = Artist(**album_dict['artist'])
                albums.append(Album(**album_dict))
            return albums
        except Exception as e:
            logger.error(f"Error fetching albums: {e}")
            return []

    async def get_album_by_id(self, album_id: str) -> Optional[Album]:
        try:
            result = self.supabase.table("albums").select("*, artist:artists(*)").eq("id", album_id).execute()
            if result.data:
                album_data = result.data[0]
                if album_data.get('artist'):
                    album_data['artist'] = Artist(**album_data['artist'])
                return Album(**album_data)
            return None
        except Exception as e:
            logger.error(f"Error fetching album {album_id}: {e}")
            return None

    async def create_album(self, album: AlbumCreate) -> Optional[Album]:
        try:
            album_data = album.model_dump()
            # Convert date to string if present
            if album_data.get('release_date'):
                album_data['release_date'] = album_data['release_date'].isoformat()
            
            result = self.supabase_admin.table("albums").insert(album_data).execute()
            if result.data:
                return await self.get_album_by_id(result.data[0]['id'])
            return None
        except Exception as e:
            logger.error(f"Error creating album: {e}")
            return None

    async def update_album(self, album_id: str, album: AlbumUpdate) -> Optional[Album]:
        try:
            update_data = {k: v for k, v in album.model_dump().items() if v is not None}
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.supabase_admin.table("albums").update(update_data).eq("id", album_id).execute()
            if result.data:
                return await self.get_album_by_id(album_id)
            return None
        except Exception as e:
            logger.error(f"Error updating album {album_id}: {e}")
            return None

    async def delete_album(self, album_id: str) -> bool:
        try:
            self.supabase_admin.table("albums").delete().eq("id", album_id).execute()
            return True
        except Exception as e:
            logger.error(f"Error deleting album {album_id}: {e}")
            return False

    # Songs
    async def get_songs(self, limit: int = 100, offset: int = 0, genre: Optional[str] = None) -> List[Song]:
        try:
            query = self.supabase.table("songs").select("*, artist:artists(*), album:albums(*)")
            
            if genre:
                query = query.eq("genre", genre)
                
            result = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
            
            songs = []
            for song_data in result.data:
                song_dict = {**song_data}
                if song_dict.get('artist'):
                    song_dict['artist'] = Artist(**song_dict['artist'])
                if song_dict.get('album'):
                    song_dict['album'] = Album(**song_dict['album'])
                songs.append(Song(**song_dict))
            return songs
        except Exception as e:
            logger.error(f"Error fetching songs: {e}")
            return []

    async def get_song_by_id(self, song_id: str) -> Optional[Song]:
        try:
            result = self.supabase.table("songs").select("*, artist:artists(*), album:albums(*)").eq("id", song_id).execute()
            if result.data:
                song_data = result.data[0]
                if song_data.get('artist'):
                    song_data['artist'] = Artist(**song_data['artist'])
                if song_data.get('album'):
                    song_data['album'] = Album(**song_data['album'])
                return Song(**song_data)
            return None
        except Exception as e:
            logger.error(f"Error fetching song {song_id}: {e}")
            return None

    async def create_song(self, song: SongCreate) -> Optional[Song]:
        try:
            result = self.supabase_admin.table("songs").insert(song.model_dump()).execute()
            if result.data:
                return await self.get_song_by_id(result.data[0]['id'])
            return None
        except Exception as e:
            logger.error(f"Error creating song: {e}")
            return None

    async def update_song(self, song_id: str, song: SongUpdate) -> Optional[Song]:
        try:
            update_data = {k: v for k, v in song.model_dump().items() if v is not None}
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.supabase_admin.table("songs").update(update_data).eq("id", song_id).execute()
            if result.data:
                return await self.get_song_by_id(song_id)
            return None
        except Exception as e:
            logger.error(f"Error updating song {song_id}: {e}")
            return None

    async def delete_song(self, song_id: str) -> bool:
        try:
            self.supabase_admin.table("songs").delete().eq("id", song_id).execute()
            return True
        except Exception as e:
            logger.error(f"Error deleting song {song_id}: {e}")
            return False

    # Playlists
    async def get_playlists(self, limit: int = 100, offset: int = 0) -> List[Playlist]:
        try:
            # First get playlists
            result = self.supabase.table("playlists").select("*").range(offset, offset + limit - 1).execute()
            
            playlists = []
            for playlist_data in result.data:
                # Get song count for each playlist
                song_count_result = self.supabase.table("playlist_songs").select("id").eq("playlist_id", playlist_data['id']).execute()
                playlist_data['song_count'] = len(song_count_result.data)
                playlists.append(Playlist(**playlist_data))
            
            return playlists
        except Exception as e:
            logger.error(f"Error fetching playlists: {e}")
            return []

    async def get_playlist_by_id(self, playlist_id: str) -> Optional[Playlist]:
        try:
            # Get playlist
            playlist_result = self.supabase.table("playlists").select("*").eq("id", playlist_id).execute()
            if not playlist_result.data:
                return None
            
            playlist_data = playlist_result.data[0]
            
            # Get playlist songs with song details
            songs_result = self.supabase.table("playlist_songs").select("*, song:songs(*, artist:artists(*), album:albums(*))").eq("playlist_id", playlist_id).order("order_index").execute()
            
            songs = []
            for ps in songs_result.data:
                song_data = ps['song']
                if song_data.get('artist'):
                    song_data['artist'] = Artist(**song_data['artist'])
                if song_data.get('album'):
                    song_data['album'] = Album(**song_data['album'])
                songs.append(Song(**song_data))
            
            playlist_data['songs'] = songs
            playlist_data['song_count'] = len(songs)
            
            return Playlist(**playlist_data)
        except Exception as e:
            logger.error(f"Error fetching playlist {playlist_id}: {e}")
            return None

    async def create_playlist(self, playlist: PlaylistCreate) -> Optional[Playlist]:
        try:
            result = self.supabase_admin.table("playlists").insert(playlist.model_dump()).execute()
            if result.data:
                return await self.get_playlist_by_id(result.data[0]['id'])
            return None
        except Exception as e:
            logger.error(f"Error creating playlist: {e}")
            return None

    async def update_playlist(self, playlist_id: str, playlist: PlaylistUpdate) -> Optional[Playlist]:
        try:
            update_data = {k: v for k, v in playlist.model_dump().items() if v is not None}
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.supabase_admin.table("playlists").update(update_data).eq("id", playlist_id).execute()
            if result.data:
                return await self.get_playlist_by_id(playlist_id)
            return None
        except Exception as e:
            logger.error(f"Error updating playlist {playlist_id}: {e}")
            return None

    async def delete_playlist(self, playlist_id: str) -> bool:
        try:
            self.supabase_admin.table("playlists").delete().eq("id", playlist_id).execute()
            return True
        except Exception as e:
            logger.error(f"Error deleting playlist {playlist_id}: {e}")
            return False

    # Playlist Songs
    async def add_song_to_playlist(self, playlist_id: str, song_id: str, order_index: Optional[int] = None) -> bool:
        try:
            if order_index is None:
                # Get current max order_index
                result = self.supabase.table("playlist_songs").select("order_index").eq("playlist_id", playlist_id).order("order_index", desc=True).limit(1).execute()
                order_index = (result.data[0]['order_index'] if result.data else 0) + 1

            playlist_song = PlaylistSongCreate(
                playlist_id=playlist_id,
                song_id=song_id,
                order_index=order_index
            )
            
            self.supabase_admin.table("playlist_songs").insert(playlist_song.model_dump()).execute()
            return True
        except Exception as e:
            logger.error(f"Error adding song {song_id} to playlist {playlist_id}: {e}")
            return False

    async def remove_song_from_playlist(self, playlist_id: str, song_id: str) -> bool:
        try:
            self.supabase_admin.table("playlist_songs").delete().eq("playlist_id", playlist_id).eq("song_id", song_id).execute()
            return True
        except Exception as e:
            logger.error(f"Error removing song {song_id} from playlist {playlist_id}: {e}")
            return False

    # Search
    async def search(self, query: str, limit: int = 50) -> SearchResultsResponse:
        try:
            # Search songs
            songs_result = self.supabase.table("songs").select("*, artist:artists(*), album:albums(*)").or_(f"title.ilike.%{query}%,genre.ilike.%{query}%").limit(limit).execute()
            
            songs = []
            for song_data in songs_result.data:
                if song_data.get('artist'):
                    song_data['artist'] = Artist(**song_data['artist'])
                if song_data.get('album'):
                    song_data['album'] = Album(**song_data['album'])
                songs.append(Song(**song_data))

            # Search artists
            artists_result = self.supabase.table("artists").select("*").ilike("name", f"%{query}%").limit(limit).execute()
            artists = [Artist(**artist) for artist in artists_result.data]

            # Search albums
            albums_result = self.supabase.table("albums").select("*, artist:artists(*)").ilike("title", f"%{query}%").limit(limit).execute()
            albums = []
            for album_data in albums_result.data:
                if album_data.get('artist'):
                    album_data['artist'] = Artist(**album_data['artist'])
                albums.append(Album(**album_data))

            # Search playlists
            playlists_result = self.supabase.table("playlists").select("*").or_(f"name.ilike.%{query}%,description.ilike.%{query}%").limit(limit).execute()
            playlists = [Playlist(**playlist) for playlist in playlists_result.data]

            return SearchResultsResponse(
                songs=songs,
                artists=artists,
                albums=albums,
                playlists=playlists
            )
        except Exception as e:
            logger.error(f"Error searching for '{query}': {e}")
            return SearchResultsResponse(songs=[], artists=[], albums=[], playlists=[])

    # Stats
    async def get_stats(self) -> StatsResponse:
        try:
            songs_count = len(self.supabase.table("songs").select("id").execute().data)
            artists_count = len(self.supabase.table("artists").select("id").execute().data)
            albums_count = len(self.supabase.table("albums").select("id").execute().data)
            playlists_count = len(self.supabase.table("playlists").select("id").execute().data)

            return StatsResponse(
                total_songs=songs_count,
                total_artists=artists_count,
                total_albums=albums_count,
                total_playlists=playlists_count
            )
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return StatsResponse(total_songs=0, total_artists=0, total_albums=0, total_playlists=0)

    # Admin Logs
    async def log_admin_action(self, log: AdminLogCreate) -> Optional[AdminLog]:
        try:
            result = self.supabase_admin.table("admin_logs").insert(log.model_dump()).execute()
            if result.data:
                return AdminLog(**result.data[0])
            return None
        except Exception as e:
            logger.error(f"Error logging admin action: {e}")
            return None

    async def get_admin_logs(self, limit: int = 100, offset: int = 0) -> List[AdminLog]:
        try:
            result = self.supabase.table("admin_logs").select("*").range(offset, offset + limit - 1).order("timestamp", desc=True).execute()
            return [AdminLog(**log) for log in result.data]
        except Exception as e:
            logger.error(f"Error fetching admin logs: {e}")
            return []

# Singleton instance
db_service = DatabaseService()