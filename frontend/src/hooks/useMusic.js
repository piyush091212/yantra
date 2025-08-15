import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { songsAPI, artistsAPI, albumsAPI, playlistsAPI } from '../services/api';

// Hook for fetching songs
export const useSongs = (params = {}) => {
  return useApi(() => songsAPI.getAll(params), [JSON.stringify(params)]);
};

// Hook for fetching artists  
export const useArtists = (params = {}) => {
  return useApi(() => artistsAPI.getAll(params), [JSON.stringify(params)]);
};

// Hook for fetching albums
export const useAlbums = (params = {}) => {
  return useApi(() => albumsAPI.getAll(params), [JSON.stringify(params)]);
};

// Hook for fetching playlists
export const usePlaylists = (params = {}) => {
  return useApi(() => playlistsAPI.getAll(params), [JSON.stringify(params)]);
};

// Hook for fetching featured content for home page
export const useFeaturedContent = () => {
  const { data: songs, loading: songsLoading } = useSongs({ limit: 5, popular: true });
  const { data: playlists, loading: playlistsLoading } = usePlaylists({ featured: true });
  const { data: recentSongs, loading: recentLoading } = useSongs({ limit: 3, recent: true });

  const loading = songsLoading || playlistsLoading || recentLoading;

  return {
    songs: songs || [],
    playlists: playlists || [],
    recentSongs: recentSongs || [],
    loading
  };
};

// Hook for search functionality
export const useSearch = (query) => {
  const [searchResults, setSearchResults] = useState({
    songs: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.trim().length < 1) {
      setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
      return;
    }

    const searchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await songsAPI.search(query.trim());
        setSearchResults(results);
      } catch (err) {
        setError(err);
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { searchResults, loading, error };
};