import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.timeout = 10000;

// Create axios interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
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
    try {
      const response = await axios.get(`${API}/`);
      return response.data;
    } catch (error) {
      throw new Error('Backend not available');
    }
  }
};