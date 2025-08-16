import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 seconds timeout

// Enhanced error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API request failed:', error.message);
    }
    
    // Throw meaningful error messages
    if (error.response) {
      throw new Error(`API Error: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error: Unable to connect to the server');
    } else {
      throw new Error('Request failed: ' + error.message);
    }
  }
);

// Songs API
export const songsAPI = {
  getAll: async (params = {}) => {
    const response = await axios.get(`${API}/songs`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API}/songs/${id}`);
    return response.data;
  },

  create: async (songData) => {
    const response = await axios.post(`${API}/songs`, songData);
    return response.data;
  },

  update: async (id, songData) => {
    const response = await axios.put(`${API}/songs/${id}`, songData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API}/songs/${id}`);
    return response.data;
  },

  search: async (query, limit = 50) => {
    const response = await axios.get(`${API}/songs/search`, {
      params: { q: query, limit }
    });
    return response.data;
  }
};

// Artists API
export const artistsAPI = {
  getAll: async (params = {}) => {
    const response = await axios.get(`${API}/artists`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API}/artists/${id}`);
    return response.data;
  },

  create: async (artistData) => {
    const response = await axios.post(`${API}/artists`, artistData);
    return response.data;
  },

  update: async (id, artistData) => {
    const response = await axios.put(`${API}/artists/${id}`, artistData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API}/artists/${id}`);
    return response.data;
  }
};

// Albums API
export const albumsAPI = {
  getAll: async (params = {}) => {
    const response = await axios.get(`${API}/albums`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API}/albums/${id}`);
    return response.data;
  },

  create: async (albumData) => {
    const response = await axios.post(`${API}/albums`, albumData);
    return response.data;
  },

  update: async (id, albumData) => {
    const response = await axios.put(`${API}/albums/${id}`, albumData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API}/albums/${id}`);
    return response.data;
  }
};

// Playlists API
export const playlistsAPI = {
  getAll: async (params = {}) => {
    const response = await axios.get(`${API}/playlists`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API}/playlists/${id}`);
    return response.data;
  },

  create: async (playlistData) => {
    const response = await axios.post(`${API}/playlists`, playlistData);
    return response.data;
  },

  update: async (id, playlistData) => {
    const response = await axios.put(`${API}/playlists/${id}`, playlistData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API}/playlists/${id}`);
    return response.data;
  },

  addSong: async (playlistId, songId) => {
    const response = await axios.post(`${API}/playlists/${playlistId}/songs?song_id=${songId}`);
    return response.data;
  },

  removeSong: async (playlistId, songId) => {
    const response = await axios.delete(`${API}/playlists/${playlistId}/songs/${songId}`);
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    const response = await axios.get(`${API}/admin/stats`);
    return response.data;
  },

  getLogs: async (params = {}) => {
    const response = await axios.get(`${API}/admin/logs`, { params });
    return response.data;
  }
};

// General API utility
export const apiUtils = {
  checkHealth: async () => {
    const response = await axios.get(`${API}/`);
    return response.data;
  }
};

// Upload API
export const uploadAPI = {
  uploadAudio: async (file) => {
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
    const response = await axios.post(`${API}/users/${userId}/like-song/${songId}`);
    return response.data;
  },

  followArtist: async (userId, artistId) => {
    const response = await axios.post(`${API}/users/${userId}/follow-artist/${artistId}`);
    return response.data;
  },

  saveAlbum: async (userId, albumId) => {
    const response = await axios.post(`${API}/users/${userId}/save-album/${albumId}`);
    return response.data;
  },

  getLikedSongs: async (userId, skip = 0, limit = 50) => {
    const response = await axios.get(`${API}/users/${userId}/liked-songs`, {
      params: { skip, limit }
    });
    return response.data;
  },

  getFollowedArtists: async (userId, skip = 0, limit = 50) => {
    const response = await axios.get(`${API}/users/${userId}/followed-artists`, {
      params: { skip, limit }
    });
    return response.data;
  },

  getSavedAlbums: async (userId, skip = 0, limit = 50) => {
    const response = await axios.get(`${API}/users/${userId}/saved-albums`, {
      params: { skip, limit }
    });
    return response.data;
  }
};

// Enhanced songs API with file upload
songsAPI.createWithFiles = async (songData) => {
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