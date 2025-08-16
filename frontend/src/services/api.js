import axios from 'axios';
import { mockSongs, mockArtists, mockAlbums, mockPlaylists } from '../data/mock';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.timeout = 5000; // Reduced timeout

// Global state for API availability
let useApiData = true;

// Create axios interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log errors in development, not in console for users
    if (process.env.NODE_ENV === 'development') {
      console.warn('API request failed, falling back to mock data');
    }
    
    // If it's a network error or 500, fallback to mock data
    if (!error.response || error.response.status >= 500 || error.code === 'ERR_NETWORK') {
      useApiData = false;
    }
    return Promise.reject(error);
  }
);

// Helper function to check if we should use API or mock data
const shouldUseApi = async () => {
  if (!useApiData) return false;
  
  try {
    const response = await axios.get(`${API}/`, { timeout: 2000 });
    return response.status === 200;
  } catch (error) {
    useApiData = false;
    return false;
  }
};

// Songs API
export const songsAPI = {
  getAll: async (params = {}) => {
    if (!(await shouldUseApi())) {
      // Fallback to mock data
      let songs = [...mockSongs];
      if (params.recent) songs = songs.slice(0, 3);
      if (params.popular) songs = songs.slice(0, 5);
      if (params.limit) songs = songs.slice(0, params.limit);
      return songs;
    }
    
    const response = await axios.get(`${API}/songs`, { params });
    return response.data;
  },

  getById: async (id) => {
    if (!(await shouldUseApi())) {
      return mockSongs.find(song => song.id === id) || null;
    }
    
    const response = await axios.get(`${API}/songs/${id}`);
    return response.data;
  },

  create: async (songData) => {
    if (!(await shouldUseApi())) {
      // Mock creation - just return the data with a new ID
      return { ...songData, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }
    
    const response = await axios.post(`${API}/songs`, songData);
    return response.data;
  },

  update: async (id, songData) => {
    if (!(await shouldUseApi())) {
      const existing = mockSongs.find(song => song.id === id);
      return existing ? { ...existing, ...songData, updated_at: new Date().toISOString() } : null;
    }
    
    const response = await axios.put(`${API}/songs/${id}`, songData);
    return response.data;
  },

  delete: async (id) => {
    if (!(await shouldUseApi())) {
      return { message: "Song deleted successfully (mock)" };
    }
    
    const response = await axios.delete(`${API}/songs/${id}`);
    return response.data;
  },

  search: async (query, limit = 50) => {
    if (!(await shouldUseApi())) {
      // Mock search
      const q = query.toLowerCase();
      const songs = mockSongs.filter(song => 
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        song.album.toLowerCase().includes(q) ||
        song.genre.toLowerCase().includes(q)
      ).slice(0, limit);
      
      const artists = mockArtists.filter(artist => 
        artist.name.toLowerCase().includes(q)
      ).slice(0, limit);
      
      const albums = mockAlbums.filter(album => 
        album.title.toLowerCase().includes(q) ||
        album.artist.toLowerCase().includes(q)
      ).slice(0, limit);
      
      const playlists = mockPlaylists.filter(playlist => 
        playlist.name.toLowerCase().includes(q) ||
        playlist.description.toLowerCase().includes(q)
      ).slice(0, limit);
      
      return { songs, artists, albums, playlists };
    }
    
    const response = await axios.get(`${API}/songs/search`, {
      params: { q: query, limit }
    });
    return response.data;
  }
};

// Artists API
export const artistsAPI = {
  getAll: async (params = {}) => {
    if (!(await shouldUseApi())) {
      let artists = [...mockArtists];
      if (params.limit) artists = artists.slice(0, params.limit);
      return artists;
    }
    
    const response = await axios.get(`${API}/artists`, { params });
    return response.data;
  },

  getById: async (id) => {
    if (!(await shouldUseApi())) {
      return mockArtists.find(artist => artist.id === id) || null;
    }
    
    const response = await axios.get(`${API}/artists/${id}`);
    return response.data;
  },

  create: async (artistData) => {
    if (!(await shouldUseApi())) {
      return { ...artistData, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }
    
    const response = await axios.post(`${API}/artists`, artistData);
    return response.data;
  },

  update: async (id, artistData) => {
    if (!(await shouldUseApi())) {
      const existing = mockArtists.find(artist => artist.id === id);
      return existing ? { ...existing, ...artistData, updated_at: new Date().toISOString() } : null;
    }
    
    const response = await axios.put(`${API}/artists/${id}`, artistData);
    return response.data;
  },

  delete: async (id) => {
    if (!(await shouldUseApi())) {
      return { message: "Artist deleted successfully (mock)" };
    }
    
    const response = await axios.delete(`${API}/artists/${id}`);
    return response.data;
  }
};

// Albums API
export const albumsAPI = {
  getAll: async (params = {}) => {
    if (!(await shouldUseApi())) {
      let albums = [...mockAlbums];
      if (params.limit) albums = albums.slice(0, params.limit);
      return albums;
    }
    
    const response = await axios.get(`${API}/albums`, { params });
    return response.data;
  },

  getById: async (id) => {
    if (!(await shouldUseApi())) {
      return mockAlbums.find(album => album.id === id) || null;
    }
    
    const response = await axios.get(`${API}/albums/${id}`);
    return response.data;
  },

  create: async (albumData) => {
    if (!(await shouldUseApi())) {
      return { ...albumData, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }
    
    const response = await axios.post(`${API}/albums`, albumData);
    return response.data;
  },

  update: async (id, albumData) => {
    if (!(await shouldUseApi())) {
      const existing = mockAlbums.find(album => album.id === id);
      return existing ? { ...existing, ...albumData, updated_at: new Date().toISOString() } : null;
    }
    
    const response = await axios.put(`${API}/albums/${id}`, albumData);
    return response.data;
  },

  delete: async (id) => {
    if (!(await shouldUseApi())) {
      return { message: "Album deleted successfully (mock)" };
    }
    
    const response = await axios.delete(`${API}/albums/${id}`);
    return response.data;
  }
};

// Playlists API
export const playlistsAPI = {
  getAll: async (params = {}) => {
    if (!(await shouldUseApi())) {
      let playlists = [...mockPlaylists];
      if (params.featured) playlists = playlists.slice(0, 3);
      if (params.limit) playlists = playlists.slice(0, params.limit);
      return playlists;
    }
    
    const response = await axios.get(`${API}/playlists`, { params });
    return response.data;
  },

  getById: async (id) => {
    if (!(await shouldUseApi())) {
      const playlist = mockPlaylists.find(playlist => playlist.id === id);
      if (playlist) {
        // Add songs to playlist
        const playlistSongs = mockSongs.filter(song => playlist.songs?.includes(song.id));
        return { ...playlist, songs: playlistSongs, song_count: playlistSongs.length };
      }
      return null;
    }
    
    const response = await axios.get(`${API}/playlists/${id}`);
    return response.data;
  },

  create: async (playlistData) => {
    if (!(await shouldUseApi())) {
      return { ...playlistData, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), songs: [], song_count: 0 };
    }
    
    const response = await axios.post(`${API}/playlists`, playlistData);
    return response.data;
  },

  update: async (id, playlistData) => {
    if (!(await shouldUseApi())) {
      const existing = mockPlaylists.find(playlist => playlist.id === id);
      return existing ? { ...existing, ...playlistData, updated_at: new Date().toISOString() } : null;
    }
    
    const response = await axios.put(`${API}/playlists/${id}`, playlistData);
    return response.data;
  },

  delete: async (id) => {
    if (!(await shouldUseApi())) {
      return { message: "Playlist deleted successfully (mock)" };
    }
    
    const response = await axios.delete(`${API}/playlists/${id}`);
    return response.data;
  },

  addSong: async (playlistId, songId) => {
    if (!(await shouldUseApi())) {
      return { message: "Song added to playlist (mock)" };
    }
    
    const response = await axios.post(`${API}/playlists/${playlistId}/songs?song_id=${songId}`);
    return response.data;
  },

  removeSong: async (playlistId, songId) => {
    if (!(await shouldUseApi())) {
      return { message: "Song removed from playlist (mock)" };
    }
    
    const response = await axios.delete(`${API}/playlists/${playlistId}/songs/${songId}`);
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    if (!(await shouldUseApi())) {
      return {
        total_songs: mockSongs.length,
        total_artists: mockArtists.length,
        total_albums: mockAlbums.length,
        total_playlists: mockPlaylists.length
      };
    }
    
    const response = await axios.get(`${API}/admin/stats`);
    return response.data;
  },

  getLogs: async (params = {}) => {
    if (!(await shouldUseApi())) {
      // Mock admin logs
      return [
        {
          id: "1",
          admin_name: "Admin",
          action: "add",
          entity_type: "song",
          entity_id: "1",
          entity_name: "Blinding Lights",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2",
          admin_name: "Admin", 
          action: "add",
          entity_type: "playlist",
          entity_id: "1",
          entity_name: "Today's Top Hits",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          admin_name: "Admin",
          action: "add", 
          entity_type: "artist",
          entity_id: "2",
          entity_name: "Ed Sheeran",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
    
    const response = await axios.get(`${API}/admin/logs`, { params });
    return response.data;
  }
};

// General API utility
export const apiUtils = {
  checkHealth: async () => {
    try {
      const response = await axios.get(`${API}/`);
      return response.data;
    } catch (error) {
      throw new Error('Backend not available');
    }
  }
};

// Upload API
export const uploadAPI = {
  uploadAudio: async (file) => {
    if (!(await shouldUseApi())) {
      // Mock upload - return a fake URL
      return {
        filename: file.name,
        url: `https://mock-audio-url.com/${file.name}`,
        message: "Audio file uploaded successfully (mock)"
      };
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API}/uploads/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000 // 60 seconds for file uploads
    });
    return response.data;
  },

  uploadImage: async (file) => {
    if (!(await shouldUseApi())) {
      // Mock upload - return a fake URL
      return {
        filename: file.name,
        url: `https://mock-image-url.com/${file.name}`,
        message: "Cover image uploaded successfully (mock)"
      };
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API}/uploads/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000 // 30 seconds for image uploads
    });
    return response.data;
  }
};

// User Preferences API
export const userAPI = {
  likeSong: async (userId, songId) => {
    if (!(await shouldUseApi())) {
      return { message: "Song liked successfully (mock)", is_liked: true };
    }
    
    const response = await axios.post(`${API}/users/${userId}/like-song/${songId}`);
    return response.data;
  },

  followArtist: async (userId, artistId) => {
    if (!(await shouldUseApi())) {
      return { message: "Artist followed successfully (mock)", is_following: true };
    }
    
    const response = await axios.post(`${API}/users/${userId}/follow-artist/${artistId}`);
    return response.data;
  },

  saveAlbum: async (userId, albumId) => {
    if (!(await shouldUseApi())) {
      return { message: "Album saved successfully (mock)", is_saved: true };
    }
    
    const response = await axios.post(`${API}/users/${userId}/save-album/${albumId}`);
    return response.data;
  },

  getLikedSongs: async (userId, skip = 0, limit = 50) => {
    if (!(await shouldUseApi())) {
      // Mock liked songs - return subset of mock songs
      const likedSongs = mockSongs.slice(0, 3);
      return { songs: likedSongs, total: likedSongs.length };
    }
    
    const response = await axios.get(`${API}/users/${userId}/liked-songs`, {
      params: { skip, limit }
    });
    return response.data;
  },

  getFollowedArtists: async (userId, skip = 0, limit = 50) => {
    if (!(await shouldUseApi())) {
      // Mock followed artists - return subset of mock artists
      const followedArtists = mockArtists.slice(0, 2);
      return { artists: followedArtists, total: followedArtists.length };
    }
    
    const response = await axios.get(`${API}/users/${userId}/followed-artists`, {
      params: { skip, limit }
    });
    return response.data;
  },

  getSavedAlbums: async (userId, skip = 0, limit = 50) => {
    if (!(await shouldUseApi())) {
      // Mock saved albums - return subset of mock albums
      const savedAlbums = mockAlbums.slice(0, 2);
      return { albums: savedAlbums, total: savedAlbums.length };
    }
    
    const response = await axios.get(`${API}/users/${userId}/saved-albums`, {
      params: { skip, limit }
    });
    return response.data;
  }
};

// Enhanced songs API with file upload
songsAPI.createWithFiles = async (songData) => {
  if (!(await shouldUseApi())) {
    // Mock creation with files
    return { 
      ...songData, 
      id: Date.now().toString(), 
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString(),
      audio_url: songData.audioFile ? `https://mock-audio-url.com/${songData.audioFile.name}` : null,
      cover_url: songData.coverImage ? `https://mock-image-url.com/${songData.coverImage.name}` : null
    };
  }
  
  const formData = new FormData();
  formData.append('title', songData.title);
  formData.append('artist_id', songData.artist_id);
  if (songData.album_id) formData.append('album_id', songData.album_id);
  if (songData.duration) formData.append('duration', songData.duration);
  if (songData.genre) formData.append('genre', songData.genre);
  if (songData.audioFile) formData.append('audio_file', songData.audioFile);
  if (songData.coverImage) formData.append('cover_image', songData.coverImage);
  
  const response = await axios.post(`${API}/songs/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000 // 2 minutes for file uploads
  });
  return response.data;
};