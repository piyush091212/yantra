import React, { useState, useEffect } from 'react';
import { Play, Clock, Music, User, Disc, Heart, Plus, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { mockSongs, mockArtists, mockAlbums, mockPlaylists } from '../../data/mock';
import { userAPI, playlistsAPI } from '../../services/api';

const Library = () => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('liked');
  
  // Data states
  const [likedSongs, setLikedSongs] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's library data
  useEffect(() => {
    const fetchLibraryData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Fetch user's liked songs, followed artists, saved albums
        const [likedResponse, followedResponse, savedResponse, playlistsResponse] = await Promise.all([
          userAPI.getLikedSongs(user.id),
          userAPI.getFollowedArtists(user.id),
          userAPI.getSavedAlbums(user.id),
          playlistsAPI.getAll({ created_by: user.id }) // Assuming playlists API supports filtering by creator
        ]);
        
        setLikedSongs(likedResponse.songs || []);
        setFollowedArtists(followedResponse.artists || []);
        setSavedAlbums(savedResponse.albums || []);
        setUserPlaylists(Array.isArray(playlistsResponse) ? playlistsResponse : []);
        
      } catch (error) {
        // Fallback to mock data on error
        console.warn('Failed to fetch library data, using mock data');
        setLikedSongs(mockSongs.slice(0, 3)); // Mock some liked songs
        setFollowedArtists(mockArtists.slice(0, 2)); // Mock some followed artists
        setSavedAlbums(mockAlbums.slice(0, 2)); // Mock some saved albums
        setUserPlaylists(mockPlaylists.slice(0, 2)); // Mock user playlists
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, [user?.id]);

  const handlePlaySong = (song) => {
    playSong(song, likedSongs);
  };

  const handlePlayPlaylist = (playlist) => {
    const playlistSongs = playlist.songs || [];
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const toggleLike = async (songId) => {
    if (!user?.id) return;
    
    try {
      const result = await userAPI.likeSong(user.id, songId);
      
      // Update local state
      if (result.is_liked) {
        // Add song to liked songs if not already there
        const songExists = likedSongs.find(song => song.id === songId);
        if (!songExists) {
          // In a real app, you'd fetch the full song data
          const mockSong = mockSongs.find(song => song.id === songId);
          if (mockSong) {
            setLikedSongs(prev => [...prev, mockSong]);
          }
        }
      } else {
        // Remove song from liked songs
        setLikedSongs(prev => prev.filter(song => song.id !== songId));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const SongRow = ({ song, showLikeButton = false }) => {
    const isCurrentSong = currentSong?.id === song.id;
    const isLiked = likedSongs.has(song.id);
    
    return (
      <div 
        className={`group flex items-center p-3 rounded-lg hover:bg-zinc-800 transition-colors ${
          isCurrentSong ? 'bg-zinc-800' : ''
        }`}
      >
        <div 
          className="flex items-center flex-1 cursor-pointer"
          onClick={() => handlePlaySong(song)}
        >
          <div className="w-12 flex justify-center">
            <Play className={`w-4 h-4 text-white ${
              isCurrentSong && isPlaying ? 'text-green-500' : ''
            }`} />
          </div>
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-10 h-10 rounded-md object-cover ml-2"
          />
          <div className="ml-4 flex-1 min-w-0">
            <p className={`font-medium truncate ${
              isCurrentSong ? 'text-green-500' : 'text-white'
            }`}>
              {song.title}
            </p>
            <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
          </div>
          <div className="hidden md:block text-zinc-400 text-sm ml-4">
            {song.album}
          </div>
          <div className="text-zinc-400 text-sm ml-4 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {song.duration}
          </div>
        </div>
        
        {showLikeButton && (
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleLike(song.id)}
              className={`p-2 ${isLiked ? 'text-green-500 hover:text-green-400' : 'text-zinc-400 hover:text-white'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 text-zinc-400 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem className="text-white">Add to playlist</DropdownMenuItem>
                <DropdownMenuItem className="text-white">Add to queue</DropdownMenuItem>
                <DropdownMenuItem className="text-white">Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    );
  };

  const PlaylistCard = ({ playlist }) => (
    <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors cursor-pointer group">
      <CardContent className="p-0">
        <div className="relative" onClick={() => handlePlayPlaylist(playlist)}>
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-t-lg flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 bg-green-500 hover:bg-green-600 text-white border-0"
            >
              <Play className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
          <p className="text-sm text-zinc-400 truncate">{playlist.description}</p>
          <p className="text-xs text-zinc-500 mt-1">{playlist.songCount} songs</p>
        </div>
      </CardContent>
    </Card>
  );

  const ArtistCard = ({ artist }) => (
    <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors cursor-pointer">
      <CardContent className="p-4 text-center">
        <img
          src={artist.avatarUrl}
          alt={artist.name}
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
        />
        <h3 className="font-semibold text-white truncate">{artist.name}</h3>
        <p className="text-sm text-zinc-400">{artist.songCount} songs</p>
        <Button variant="outline" size="sm" className="mt-3 border-zinc-600 text-white hover:text-white">
          <User className="w-4 h-4 mr-2" />
          Follow
        </Button>
      </CardContent>
    </Card>
  );

  const AlbumCard = ({ album }) => (
    <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors cursor-pointer group">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-t-lg flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 bg-green-500 hover:bg-green-600 text-white border-0"
            >
              <Play className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white truncate">{album.title}</h3>
          <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
          <p className="text-xs text-zinc-500 mt-1">
            {new Date(album.releaseDate).getFullYear()} • {album.songCount} songs
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const likedSongsData = mockSongs.filter(song => likedSongs.has(song.id));

  return (
    <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black text-white overflow-auto pb-32 md:pb-24">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Library</h1>
          <Button variant="outline" className="border-zinc-700 text-white hover:text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-zinc-800 mb-6">
            <TabsTrigger value="songs" className="text-white data-[state=active]:text-black">
              <Music className="w-4 h-4 mr-2" />
              Songs
            </TabsTrigger>
            <TabsTrigger value="playlists" className="text-white data-[state=active]:text-black">Playlists</TabsTrigger>
            <TabsTrigger value="artists" className="text-white data-[state=active]:text-black">Artists</TabsTrigger>
            <TabsTrigger value="albums" className="text-white data-[state=active]:text-black">Albums</TabsTrigger>
            <TabsTrigger value="liked" className="text-white data-[state=active]:text-black">
              <Heart className="w-4 h-4 mr-2" />
              Liked
            </TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">All Songs ({mockSongs.length})</h2>
              <Button variant="outline" size="sm" className="border-zinc-700 text-white hover:text-white">
                <Play className="w-4 h-4 mr-2" />
                Play All
              </Button>
            </div>
            {mockSongs.map((song) => (
              <SongRow key={song.id} song={song} showLikeButton={true} />
            ))}
          </TabsContent>

          <TabsContent value="playlists">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Playlists ({mockPlaylists.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artists">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Followed Artists ({mockArtists.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {mockArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Saved Albums ({mockAlbums.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked" className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Liked Songs ({likedSongsData.length})</h2>
              <Button variant="outline" size="sm" className="border-zinc-700 text-white hover:text-white">
                <Play className="w-4 h-4 mr-2" />
                Play All
              </Button>
            </div>
            {likedSongsData.length > 0 ? (
              likedSongsData.map((song) => (
                <SongRow key={song.id} song={song} showLikeButton={true} />
              ))
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No liked songs yet</h3>
                <p className="text-zinc-400">Start liking songs to see them here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;