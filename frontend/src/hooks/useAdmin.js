import { useApi, useMutation } from './useApi';
import { adminAPI, songsAPI, artistsAPI, albumsAPI, playlistsAPI } from '../services/api';

// Hook for admin dashboard stats
export const useAdminStats = () => {
  return useApi(() => adminAPI.getStats(), []);
};

// Hook for admin logs
export const useAdminLogs = (params = {}) => {
  return useApi(() => adminAPI.getLogs(params), [JSON.stringify(params)]);
};

// Hook for managing songs (admin)
export const useSongManagement = () => {
  const mutation = useMutation();

  const createSong = (songData) => {
    return mutation.mutate(
      () => songsAPI.create(songData),
      {
        successMessage: "Song created successfully",
        errorMessage: "Failed to create song"
      }
    );
  };

  const updateSong = (id, songData) => {
    return mutation.mutate(
      () => songsAPI.update(id, songData),
      {
        successMessage: "Song updated successfully",
        errorMessage: "Failed to update song"
      }
    );
  };

  const deleteSong = (id) => {
    return mutation.mutate(
      () => songsAPI.delete(id),
      {
        successMessage: "Song deleted successfully",
        errorMessage: "Failed to delete song"
      }
    );
  };

  return {
    createSong,
    updateSong,
    deleteSong,
    loading: mutation.loading,
    error: mutation.error
  };
};

// Hook for managing artists (admin)
export const useArtistManagement = () => {
  const mutation = useMutation();

  const createArtist = (artistData) => {
    return mutation.mutate(
      () => artistsAPI.create(artistData),
      {
        successMessage: "Artist created successfully",
        errorMessage: "Failed to create artist"
      }
    );
  };

  const updateArtist = (id, artistData) => {
    return mutation.mutate(
      () => artistsAPI.update(id, artistData),
      {
        successMessage: "Artist updated successfully",
        errorMessage: "Failed to update artist"
      }
    );
  };

  const deleteArtist = (id) => {
    return mutation.mutate(
      () => artistsAPI.delete(id),
      {
        successMessage: "Artist deleted successfully",
        errorMessage: "Failed to delete artist"
      }
    );
  };

  return {
    createArtist,
    updateArtist,
    deleteArtist,
    loading: mutation.loading,
    error: mutation.error
  };
};

// Hook for managing albums (admin)
export const useAlbumManagement = () => {
  const mutation = useMutation();

  const createAlbum = (albumData) => {
    return mutation.mutate(
      () => albumsAPI.create(albumData),
      {
        successMessage: "Album created successfully",
        errorMessage: "Failed to create album"
      }
    );
  };

  const updateAlbum = (id, albumData) => {
    return mutation.mutate(
      () => albumsAPI.update(id, albumData),
      {
        successMessage: "Album updated successfully",
        errorMessage: "Failed to update album"
      }
    );
  };

  const deleteAlbum = (id) => {
    return mutation.mutate(
      () => albumsAPI.delete(id),
      {
        successMessage: "Album deleted successfully",
        errorMessage: "Failed to delete album"
      }
    );
  };

  return {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    loading: mutation.loading,
    error: mutation.error
  };
};

// Hook for managing playlists (admin)
export const usePlaylistManagement = () => {
  const mutation = useMutation();

  const createPlaylist = (playlistData) => {
    return mutation.mutate(
      () => playlistsAPI.create(playlistData),
      {
        successMessage: "Playlist created successfully",
        errorMessage: "Failed to create playlist"
      }
    );
  };

  const updatePlaylist = (id, playlistData) => {
    return mutation.mutate(
      () => playlistsAPI.update(id, playlistData),
      {
        successMessage: "Playlist updated successfully",
        errorMessage: "Failed to update playlist"
      }
    );
  };

  const deletePlaylist = (id) => {
    return mutation.mutate(
      () => playlistsAPI.delete(id),
      {
        successMessage: "Playlist deleted successfully",
        errorMessage: "Failed to delete playlist"
      }
    );
  };

  const addSongToPlaylist = (playlistId, songId) => {
    return mutation.mutate(
      () => playlistsAPI.addSong(playlistId, songId),
      {
        successMessage: "Song added to playlist",
        errorMessage: "Failed to add song to playlist"
      }
    );
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    return mutation.mutate(
      () => playlistsAPI.removeSong(playlistId, songId),
      {
        successMessage: "Song removed from playlist",
        errorMessage: "Failed to remove song from playlist"
      }
    );
  };

  return {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    loading: mutation.loading,
    error: mutation.error
  };
};