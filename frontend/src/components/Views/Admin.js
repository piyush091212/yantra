import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Music, User, Disc, ListMusic, Upload, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { songsAPI, artistsAPI, albumsAPI, playlistsAPI, uploadAPI } from '../../services/api';

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data state management - this fixes the flicker issue
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Separate modal states for each type
  const [isSongDialogOpen, setIsSongDialogOpen] = useState(false);
  const [isArtistDialogOpen, setIsArtistDialogOpen] = useState(false);
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);
  
  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit states
  const [editingItem, setEditingItem] = useState(null);
  const [editItemType, setEditItemType] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form states
  const [songForm, setSongForm] = useState({
    title: '', artist_id: '', album_id: '', duration: '', genre: '', audioFile: null, coverImage: null
  });
  const [artistForm, setArtistForm] = useState({
    name: '', bio: '', avatarImage: null
  });
  const [albumForm, setAlbumForm] = useState({
    title: '', artist_id: '', coverImage: null, releaseDate: ''
  });
  const [playlistForm, setPlaylistForm] = useState({
    name: '', description: '', coverImage: null
  });

  // Optimized form change handlers using functional updates to prevent re-renders
  const handleSongFormChange = useCallback((field, value) => {
    setSongForm(prev => ({...prev, [field]: value}));
  }, []);

  const handleArtistFormChange = useCallback((field, value) => {
    setArtistForm(prev => ({...prev, [field]: value}));
  }, []);

  const handleAlbumFormChange = useCallback((field, value) => {
    setAlbumForm(prev => ({...prev, [field]: value}));
  }, []);

  const handlePlaylistFormChange = useCallback((field, value) => {
    setPlaylistForm(prev => ({...prev, [field]: value}));
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [songsData, artistsData, albumsData, playlistsData] = await Promise.all([
        songsAPI.getAll(),
        artistsAPI.getAll(),
        albumsAPI.getAll(),
        playlistsAPI.getAll()
      ]);
      
      setSongs(songsData);
      setArtists(artistsData);
      setAlbums(albumsData);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when modal opens
  const resetSongForm = () => {
    setSongForm({
      title: '', artist_id: '', album_id: '', duration: '', genre: '', audioFile: null, coverImage: null
    });
  };

  const resetArtistForm = () => {
    setArtistForm({
      name: '', bio: '', avatarImage: null
    });
  };

  const resetAlbumForm = () => {
    setAlbumForm({
      title: '', artist_id: '', coverImage: null, releaseDate: ''
    });
  };

  const resetPlaylistForm = () => {
    setPlaylistForm({
      name: '', description: '', coverImage: null
    });
  };

  // Handle modal opening with form reset
  const handleOpenSongDialog = () => {
    resetSongForm();
    setEditingItem(null);
    setIsSongDialogOpen(true);
  };

  const handleOpenArtistDialog = () => {
    resetArtistForm();
    setEditingItem(null);
    setIsArtistDialogOpen(true);
  };

  const handleOpenAlbumDialog = () => {
    resetAlbumForm();
    setEditingItem(null);
    setIsAlbumDialogOpen(true);
  };

  const handleOpenPlaylistDialog = () => {
    resetPlaylistForm();
    setEditingItem(null);
    setIsPlaylistDialogOpen(true);
  };

  // Edit handlers
  const handleEditSong = (song) => {
    setEditingItem(song);
    setEditItemType('song');
    setSongForm({
      title: song.title || '',
      artist_id: song.artist_id || '',
      album_id: song.album_id || '',
      duration: song.duration || '',
      genre: song.genre || '',
      audioFile: null,
      coverImage: null
    });
    setIsEditDialogOpen(true);
  };

  const handleEditArtist = (artist) => {
    setEditingItem(artist);
    setEditItemType('artist');
    setArtistForm({
      name: artist.name || '',
      bio: artist.bio || '',
      avatarImage: null
    });
    setIsEditDialogOpen(true);
  };

  const handleEditAlbum = (album) => {
    setEditingItem(album);
    setEditItemType('album');
    setAlbumForm({
      title: album.title || '',
      artist_id: album.artist_id || '',
      coverImage: null,
      releaseDate: album.release_date ? album.release_date.split('T')[0] : ''
    });
    setIsEditDialogOpen(true);
  };

  const handleEditPlaylist = (playlist) => {
    setEditingItem(playlist);
    setEditItemType('playlist');
    setPlaylistForm({
      name: playlist.name || '',
      description: playlist.description || '',
      coverImage: null
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveSong = async (isEdit = false) => {
    setIsSaving(true);
    try {
      // Validate required fields
      if (!songForm.title || !songForm.artist_id) {
        toast({
          title: "Validation Error",
          description: "Title and Artist are required.",
          variant: "destructive"
        });
        return;
      }

      let result;
      if (isEdit && editingItem) {
        // Update existing song
        const updateData = {
          title: songForm.title,
          artist_id: songForm.artist_id,
          album_id: songForm.album_id || null,
          duration: songForm.duration,
          genre: songForm.genre
        };
        
        result = await songsAPI.update(editingItem.id, updateData);
        
        // Update songs list
        setSongs(prevSongs => 
          prevSongs.map(song => 
            song.id === editingItem.id ? result : song
          )
        );
        
        toast({
          title: "Song updated successfully",
          description: `"${songForm.title}" has been updated.`
        });
      } else {
        // Create new song with files
        if (!songForm.audioFile) {
          toast({
            title: "Validation Error",
            description: "Audio file is required for new songs.",
            variant: "destructive"
          });
          return;
        }

        result = await songsAPI.createWithFiles({
          title: songForm.title,
          artist_id: songForm.artist_id,
          album_id: songForm.album_id || null,
          duration: songForm.duration,
          genre: songForm.genre,
          audioFile: songForm.audioFile,
          coverImage: songForm.coverImage
        });

        // Add to songs list
        setSongs(prevSongs => [result, ...prevSongs]);

        toast({
          title: "Song saved successfully",
          description: `"${songForm.title}" has been added to your library.`
        });
      }
      
      // Reset form and close modal
      setSongForm({ title: '', artist_id: '', album_id: '', duration: '', genre: '', audioFile: null, coverImage: null });
      setIsSongDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      
    } catch (error) {
      toast({
        title: "Error saving song",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveArtist = async (isEdit = false) => {
    setIsSaving(true);
    try {
      // Validate required fields
      if (!artistForm.name) {
        toast({
          title: "Validation Error",
          description: "Artist name is required.",
          variant: "destructive"
        });
        return;
      }

      let result;
      if (isEdit && editingItem) {
        // Update existing artist
        let avatarUrl = editingItem.avatar_url; // Keep existing URL
        
        // Upload new avatar image if provided
        if (artistForm.avatarImage) {
          const uploadResult = await uploadAPI.uploadImage(artistForm.avatarImage);
          avatarUrl = uploadResult.url;
        }

        const updateData = {
          name: artistForm.name,
          bio: artistForm.bio,
          avatar_url: avatarUrl
        };

        result = await artistsAPI.update(editingItem.id, updateData);
        
        // Update artists list
        setArtists(prevArtists => 
          prevArtists.map(artist => 
            artist.id === editingItem.id ? result : artist
          )
        );

        toast({
          title: "Artist updated successfully",
          description: `"${artistForm.name}" has been updated.`
        });
      } else {
        // Create new artist
        let avatarUrl = null;
        
        // Upload avatar image if provided
        if (artistForm.avatarImage) {
          const uploadResult = await uploadAPI.uploadImage(artistForm.avatarImage);
          avatarUrl = uploadResult.url;
        }

        result = await artistsAPI.create({
          name: artistForm.name,
          bio: artistForm.bio,
          avatar_url: avatarUrl
        });

        // Add to artists list
        setArtists(prevArtists => [result, ...prevArtists]);

        toast({
          title: "Artist saved successfully",
          description: `"${artistForm.name}" has been added to your library.`
        });
      }
      
      // Reset form and close modal
      setArtistForm({ name: '', bio: '', avatarImage: null });
      setIsArtistDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      
    } catch (error) {
      toast({
        title: "Error saving artist",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAlbum = async (isEdit = false) => {
    setIsSaving(true);
    try {
      // Validate required fields
      if (!albumForm.title || !albumForm.artist_id) {
        toast({
          title: "Validation Error",
          description: "Album title and Artist ID are required.",
          variant: "destructive"
        });
        return;
      }

      let result;
      if (isEdit && editingItem) {
        // Update existing album
        let coverUrl = editingItem.cover_url; // Keep existing URL
        
        // Upload cover image if provided
        if (albumForm.coverImage) {
          const uploadResult = await uploadAPI.uploadImage(albumForm.coverImage);
          coverUrl = uploadResult.url;
        }

        const updateData = {
          title: albumForm.title,
          artist_id: albumForm.artist_id,
          cover_url: coverUrl,
          release_date: albumForm.releaseDate
        };

        result = await albumsAPI.update(editingItem.id, updateData);
        
        // Update albums list
        setAlbums(prevAlbums => 
          prevAlbums.map(album => 
            album.id === editingItem.id ? result : album
          )
        );

        toast({
          title: "Album updated successfully",
          description: `"${albumForm.title}" has been updated.`
        });
      } else {
        // Create new album
        let coverUrl = null;
        
        // Upload cover image if provided
        if (albumForm.coverImage) {
          const uploadResult = await uploadAPI.uploadImage(albumForm.coverImage);
          coverUrl = uploadResult.url;
        }

        result = await albumsAPI.create({
          title: albumForm.title,
          artist_id: albumForm.artist_id,
          cover_url: coverUrl,
          release_date: albumForm.releaseDate
        });

        // Add to albums list
        setAlbums(prevAlbums => [result, ...prevAlbums]);

        toast({
          title: "Album saved successfully",
          description: `"${albumForm.title}" has been added to your library.`
        });
      }
      
      // Reset form and close modal
      setAlbumForm({ title: '', artist_id: '', coverImage: null, releaseDate: '' });
      setIsAlbumDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      
    } catch (error) {
      toast({
        title: "Error saving album",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePlaylist = async (isEdit = false) => {
    setIsSaving(true);
    try {
      // Validate required fields
      if (!playlistForm.name) {
        toast({
          title: "Validation Error",
          description: "Playlist name is required.",
          variant: "destructive"
        });
        return;
      }

      let result;
      if (isEdit && editingItem) {
        // Update existing playlist
        let coverUrl = editingItem.cover_url; // Keep existing URL
        
        // Upload cover image if provided
        if (playlistForm.coverImage) {
          const uploadResult = await uploadAPI.uploadImage(playlistForm.coverImage);
          coverUrl = uploadResult.url;
        }

        const updateData = {
          name: playlistForm.name,
          description: playlistForm.description,
          cover_url: coverUrl
        };

        result = await playlistsAPI.update(editingItem.id, updateData);
        
        // Update playlists list
        setPlaylists(prevPlaylists => 
          prevPlaylists.map(playlist => 
            playlist.id === editingItem.id ? result : playlist
          )
        );

        toast({
          title: "Playlist updated successfully",
          description: `"${playlistForm.name}" has been updated.`
        });
      } else {
        // Create new playlist
        let coverUrl = null;
        
        // Upload cover image if provided
        if (playlistForm.coverImage) {
          const uploadResult = await uploadAPI.uploadImage(playlistForm.coverImage);
          coverUrl = uploadResult.url;
        }

        result = await playlistsAPI.create({
          name: playlistForm.name,
          description: playlistForm.description,
          cover_url: coverUrl
        });

        // Add to playlists list
        setPlaylists(prevPlaylists => [result, ...prevPlaylists]);

        toast({
          title: "Playlist saved successfully",
          description: `"${playlistForm.name}" has been created.`
        });
      }
      
      // Reset form and close modal
      setPlaylistForm({ name: '', description: '', coverImage: null });
      setIsPlaylistDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      
    } catch (error) {
      toast({
        title: "Error saving playlist",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handlers - actual API calls
  const handleDeleteSong = async (song) => {
    if (!window.confirm(`Are you sure you want to delete "${song.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await songsAPI.delete(song.id);
      
      // Remove from songs list
      setSongs(prevSongs => prevSongs.filter(s => s.id !== song.id));
      
      toast({
        title: "Song deleted",
        description: `Successfully deleted "${song.title}".`,
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error deleting song",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteArtist = async (artist) => {
    if (!window.confirm(`Are you sure you want to delete "${artist.name}"? This will also delete all songs and albums by this artist. This action cannot be undone.`)) {
      return;
    }

    try {
      await artistsAPI.delete(artist.id);
      
      // Remove from artists list
      setArtists(prevArtists => prevArtists.filter(a => a.id !== artist.id));
      
      // Also remove songs and albums by this artist
      setSongs(prevSongs => prevSongs.filter(s => s.artist_id !== artist.id));
      setAlbums(prevAlbums => prevAlbums.filter(a => a.artist_id !== artist.id));
      
      toast({
        title: "Artist deleted",
        description: `Successfully deleted "${artist.name}" and all associated content.`,
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error deleting artist",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAlbum = async (album) => {
    if (!window.confirm(`Are you sure you want to delete "${album.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await albumsAPI.delete(album.id);
      
      // Remove from albums list
      setAlbums(prevAlbums => prevAlbums.filter(a => a.id !== album.id));
      
      toast({
        title: "Album deleted",
        description: `Successfully deleted "${album.title}".`,
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error deleting album",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePlaylist = async (playlist) => {
    if (!window.confirm(`Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await playlistsAPI.delete(playlist.id);
      
      // Remove from playlists list
      setPlaylists(prevPlaylists => prevPlaylists.filter(p => p.id !== playlist.id));
      
      toast({
        title: "Playlist deleted",
        description: `Successfully deleted "${playlist.name}".`,
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error deleting playlist",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-zinc-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Icon className={`w-5 h-5 ${color} mr-3`} />
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </CardContent>
    </Card>
  );

  const SongManagementRow = ({ song }) => (
    <div className="flex items-center p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
      <img
        src={song.cover_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'}
        alt={song.title}
        className="w-12 h-12 rounded-md object-cover"
      />
      <div className="ml-4 flex-1 min-w-0">
        <p className="font-medium text-white truncate">{song.title}</p>
        <p className="text-sm text-zinc-400 truncate">
          {song.artist?.name || 'Unknown Artist'} • {song.album?.title || 'No Album'}
        </p>
      </div>
      <div className="hidden md:block text-sm text-zinc-400 ml-4">
        {song.duration || 'N/A'}
      </div>
      <div className="hidden md:block text-sm text-zinc-400 ml-4">
        {song.genre || 'N/A'}
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditSong(song)}
          className="text-zinc-400 hover:text-white p-2"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteSong(song)}
          className="text-zinc-400 hover:text-red-400 p-2"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const AddSongDialog = () => (
    <Dialog open={isSongDialogOpen} onOpenChange={setIsSongDialogOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          <div>
            <Label htmlFor="title">Song Title *</Label>
            <Input
              id="title"
              value={songForm.title}
              onChange={(e) => handleSongFormChange('title', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter song title"
              required
            />
          </div>
          <div>
            <Label htmlFor="artist_id">Artist ID *</Label>
            <Input
              id="artist_id"
              value={songForm.artist_id}
              onChange={(e) => handleSongFormChange('artist_id', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter artist ID"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">Available artists: {artists.map(a => `${a.name} (${a.id.slice(0, 8)}...)`).join(', ')}</p>
          </div>
          <div>
            <Label htmlFor="album_id">Album ID (Optional)</Label>
            <Input
              id="album_id"
              value={songForm.album_id}
              onChange={(e) => handleSongFormChange('album_id', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter album ID (optional)"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={songForm.duration}
              onChange={(e) => handleSongFormChange('duration', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="e.g. 3:25"
            />
          </div>
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={songForm.genre}
              onChange={(e) => handleSongFormChange('genre', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter genre"
            />
          </div>
          <div>
            <Label htmlFor="coverImage">Cover Image</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleSongFormChange('coverImage', e.target.files[0])}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="audioFile">Audio File *</Label>
            <Input
              id="audioFile"
              type="file"
              accept="audio/*"
              onChange={(e) => handleSongFormChange('audioFile', e.target.files[0])}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsSongDialogOpen(false)}
            className="border-zinc-700 text-white hover:text-white"
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={() => handleSaveSong(false)} 
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Song
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AddArtistDialog = () => (
    <Dialog open={isArtistDialogOpen} onOpenChange={setIsArtistDialogOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Artist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="artistName">Artist Name *</Label>
            <Input
              id="artistName"
              value={artistForm.name}
              onChange={(e) => handleArtistFormChange('name', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter artist name"
              required
            />
          </div>
          <div>
            <Label htmlFor="artistBio">Biography</Label>
            <Textarea
              id="artistBio"
              value={artistForm.bio}
              onChange={(e) => handleArtistFormChange('bio', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter artist biography"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="artistAvatar">Artist Photo</Label>
            <Input
              id="artistAvatar"
              type="file"
              accept="image/*"
              onChange={(e) => handleArtistFormChange('avatarImage', e.target.files[0])}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsArtistDialogOpen(false)}
            className="border-zinc-700 text-white hover:text-white"
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={() => handleSaveArtist(false)} 
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Artist
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AddAlbumDialog = () => (
    <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="albumTitle">Album Title *</Label>
            <Input
              id="albumTitle"
              value={albumForm.title}
              onChange={(e) => handleAlbumFormChange('title', e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter album title"
              required
            />
          </div>
          <div>
            <Label htmlFor="albumArtistId">Artist ID *</Label>
            <Input
              id="albumArtistId"
              value={albumForm.artist_id}
              onChange={(e) => setAlbumForm({...albumForm, artist_id: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter artist ID"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">Available artists: {artists.map(a => `${a.name} (${a.id.slice(0, 8)}...)`).join(', ')}</p>
          </div>
          <div>
            <Label htmlFor="releaseDate">Release Date</Label>
            <Input
              id="releaseDate"
              type="date"
              value={albumForm.releaseDate}
              onChange={(e) => setAlbumForm({...albumForm, releaseDate: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="albumCover">Album Cover</Label>
            <Input
              id="albumCover"
              type="file"
              accept="image/*"
              onChange={(e) => setAlbumForm({...albumForm, coverImage: e.target.files[0]})}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsAlbumDialogOpen(false)}
            className="border-zinc-700 text-white hover:text-white"
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={() => handleSaveAlbum(false)} 
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Album
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AddPlaylistDialog = () => (
    <Dialog open={isPlaylistDialogOpen} onOpenChange={setIsPlaylistDialogOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="playlistName">Playlist Name *</Label>
            <Input
              id="playlistName"
              value={playlistForm.name}
              onChange={(e) => setPlaylistForm({...playlistForm, name: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter playlist name"
              required
            />
          </div>
          <div>
            <Label htmlFor="playlistDescription">Description</Label>
            <Textarea
              id="playlistDescription"
              value={playlistForm.description}
              onChange={(e) => setPlaylistForm({...playlistForm, description: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter playlist description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="playlistCover">Playlist Cover</Label>
            <Input
              id="playlistCover"
              type="file"
              accept="image/*"
              onChange={(e) => setPlaylistForm({...playlistForm, coverImage: e.target.files[0]})}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsPlaylistDialogOpen(false)}
            className="border-zinc-700 text-white hover:text-white"
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={() => handleSavePlaylist(false)} 
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Playlist
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Edit Dialog - Universal edit modal
  const EditDialog = () => {
    const renderEditForm = () => {
      switch (editItemType) {
        case 'song':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="editTitle">Song Title *</Label>
                <Input
                  id="editTitle"
                  value={songForm.title}
                  onChange={(e) => setSongForm({...songForm, title: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter song title"
                />
              </div>
              <div>
                <Label htmlFor="editArtistId">Artist ID *</Label>
                <Input
                  id="editArtistId"
                  value={songForm.artist_id}
                  onChange={(e) => handleSongFormChange('artist_id', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter artist ID"
                />
              </div>
              <div>
                <Label htmlFor="editAlbumId">Album ID</Label>
                <Input
                  id="editAlbumId"
                  value={songForm.album_id}
                  onChange={(e) => handleSongFormChange('album_id', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter album ID"
                />
              </div>
              <div>
                <Label htmlFor="editDuration">Duration</Label>
                <Input
                  id="editDuration"
                  value={songForm.duration}
                  onChange={(e) => handleSongFormChange('duration', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="e.g. 3:25"
                />
              </div>
              <div>
                <Label htmlFor="editGenre">Genre</Label>
                <Input
                  id="editGenre"
                  value={songForm.genre}
                  onChange={(e) => handleSongFormChange('genre', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter genre"
                />
              </div>
              <div>
                <Label htmlFor="editCoverImage">Cover Image (optional)</Label>
                <Input
                  id="editCoverImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSongFormChange('coverImage', e.target.files[0])}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          );
        case 'artist':
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editArtistName">Artist Name *</Label>
                <Input
                  id="editArtistName"
                  value={artistForm.name}
                  onChange={(e) => setArtistForm({...artistForm, name: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter artist name"
                />
              </div>
              <div>
                <Label htmlFor="editArtistBio">Biography</Label>
                <Textarea
                  id="editArtistBio"
                  value={artistForm.bio}
                  onChange={(e) => setArtistForm({...artistForm, bio: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter artist biography"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="editArtistAvatar">Artist Photo (optional)</Label>
                <Input
                  id="editArtistAvatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setArtistForm({...artistForm, avatarImage: e.target.files[0]})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          );
        case 'album':
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editAlbumTitle">Album Title *</Label>
                <Input
                  id="editAlbumTitle"
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({...albumForm, title: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter album title"
                />
              </div>
              <div>
                <Label htmlFor="editAlbumArtistId">Artist ID *</Label>
                <Input
                  id="editAlbumArtistId"
                  value={albumForm.artist_id}
                  onChange={(e) => setAlbumForm({...albumForm, artist_id: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter artist ID"
                />
              </div>
              <div>
                <Label htmlFor="editReleaseDate">Release Date</Label>
                <Input
                  id="editReleaseDate"
                  type="date"
                  value={albumForm.releaseDate}
                  onChange={(e) => setAlbumForm({...albumForm, releaseDate: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="editAlbumCover">Album Cover (optional)</Label>
                <Input
                  id="editAlbumCover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAlbumForm({...albumForm, coverImage: e.target.files[0]})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          );
        case 'playlist':
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editPlaylistName">Playlist Name *</Label>
                <Input
                  id="editPlaylistName"
                  value={playlistForm.name}
                  onChange={(e) => setPlaylistForm({...playlistForm, name: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter playlist name"
                />
              </div>
              <div>
                <Label htmlFor="editPlaylistDescription">Description</Label>
                <Textarea
                  id="editPlaylistDescription"
                  value={playlistForm.description}
                  onChange={(e) => setPlaylistForm({...playlistForm, description: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Enter playlist description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="editPlaylistCover">Playlist Cover (optional)</Label>
                <Input
                  id="editPlaylistCover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPlaylistForm({...playlistForm, coverImage: e.target.files[0]})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    const handleSave = () => {
      switch (editItemType) {
        case 'song':
          handleSaveSong(true);
          break;
        case 'artist':
          handleSaveArtist(true);
          break;
        case 'album':
          handleSaveAlbum(true);
          break;
        case 'playlist':
          handleSavePlaylist(true);
          break;
        default:
          break;
      }
    };

    return (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {editItemType === 'song' ? 'Song' : editItemType === 'artist' ? 'Artist' : editItemType === 'album' ? 'Album' : 'Playlist'}
            </DialogTitle>
          </DialogHeader>
          {renderEditForm()}
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-zinc-700 text-white hover:text-white"
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update {editItemType === 'song' ? 'Song' : editItemType === 'artist' ? 'Artist' : editItemType === 'album' ? 'Album' : 'Playlist'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Upload className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black text-white overflow-auto pb-32 md:pb-24">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-zinc-800 mb-6">
            <TabsTrigger value="overview" className="text-white data-[state=active]:text-black">Overview</TabsTrigger>
            <TabsTrigger value="songs" className="text-white data-[state=active]:text-black">Songs</TabsTrigger>
            <TabsTrigger value="artists" className="text-white data-[state=active]:text-black">Artists</TabsTrigger>
            <TabsTrigger value="albums" className="text-white data-[state=active]:text-black">Albums</TabsTrigger>
            <TabsTrigger value="playlists" className="text-white data-[state=active]:text-black">Playlists</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Songs"
                value={songs.length}
                icon={Music}
                color="text-green-500"
              />
              <StatsCard
                title="Artists"
                value={artists.length}
                icon={User}
                color="text-blue-500"
              />
              <StatsCard
                title="Albums"
                value={albums.length}
                icon={Disc}
                color="text-purple-500"
              />
              <StatsCard
                title="Playlists"
                value={playlists.length}
                icon={ListMusic}
                color="text-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={handleOpenSongDialog}
                      className="h-20 flex-col border-zinc-700 text-white hover:text-white"
                    >
                      <Music className="w-6 h-6 mb-2" />
                      Add Song
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleOpenArtistDialog}
                      className="h-20 flex-col border-zinc-700 text-white hover:text-white"
                    >
                      <User className="w-6 h-6 mb-2" />
                      Add Artist
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleOpenAlbumDialog}
                      className="h-20 flex-col border-zinc-700 text-white hover:text-white"
                    >
                      <Disc className="w-6 h-6 mb-2" />
                      Add Album
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleOpenPlaylistDialog}
                      className="h-20 flex-col border-zinc-700 text-white hover:text-white"
                    >
                      <ListMusic className="w-6 h-6 mb-2" />
                      Add Playlist
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-zinc-300">Database populated with {songs.length} songs</p>
                      <span className="text-xs text-zinc-500">now</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-zinc-300">Added {artists.length} artists to library</p>
                      <span className="text-xs text-zinc-500">now</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-sm text-zinc-300">Created {albums.length} albums</p>
                      <span className="text-xs text-zinc-500">now</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="songs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Songs ({songs.length})</h2>
              <Button 
                onClick={handleOpenSongDialog}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Song
              </Button>
            </div>
            <div className="space-y-4">
              {songs.map((song) => (
                <SongManagementRow key={song.id} song={song} />
              ))}
              {songs.length === 0 && (
                <div className="text-center py-8 text-zinc-400">
                  No songs found. Click "Add Song" to get started.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="artists">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Artists ({artists.length})</h2>
              <Button 
                onClick={handleOpenArtistDialog}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Artist
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist) => (
                <Card key={artist.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={artist.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'}
                        alt={artist.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{artist.name}</h3>
                        <p className="text-sm text-zinc-400 truncate">{songs.filter(s => s.artist_id === artist.id).length} songs</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditArtist(artist)}
                          className="text-zinc-400 hover:text-white p-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteArtist(artist)}
                          className="text-zinc-400 hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {artists.length === 0 && (
                <div className="col-span-full text-center py-8 text-zinc-400">
                  No artists found. Click "Add Artist" to get started.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="albums">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Albums ({albums.length})</h2>
              <Button 
                onClick={handleOpenAlbumDialog}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Album
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <Card key={album.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={album.cover_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'}
                        alt={album.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditAlbum(album)}
                          className="bg-black bg-opacity-50 text-white hover:text-white p-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteAlbum(album)}
                          className="bg-black bg-opacity-50 text-white hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white truncate">{album.title}</h3>
                      <p className="text-sm text-zinc-400 truncate">{album.artist?.name || 'Unknown Artist'}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {album.release_date ? new Date(album.release_date).getFullYear() : 'Unknown'} • {songs.filter(s => s.album_id === album.id).length} songs
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {albums.length === 0 && (
                <div className="col-span-full text-center py-8 text-zinc-400">
                  No albums found. Click "Add Album" to get started.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="playlists">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Playlists ({playlists.length})</h2>
              <Button 
                onClick={handleOpenPlaylistDialog}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Playlist
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <Card key={playlist.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={playlist.cover_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'}
                        alt={playlist.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditPlaylist(playlist)}
                          className="bg-black bg-opacity-50 text-white hover:text-white p-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePlaylist(playlist)}
                          className="bg-black bg-opacity-50 text-white hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                      <p className="text-sm text-zinc-400 truncate">{playlist.description}</p>
                      <p className="text-xs text-zinc-500 mt-1">{playlist.song_count || 0} songs</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {playlists.length === 0 && (
                <div className="col-span-full text-center py-8 text-zinc-400">
                  No playlists found. Click "Add Playlist" to get started.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <AddSongDialog />
        <AddArtistDialog />
        <AddAlbumDialog />
        <AddPlaylistDialog />
        <EditDialog />
      </div>
    </div>
  );
};

export default Admin;