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