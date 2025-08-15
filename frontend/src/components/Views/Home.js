import React from 'react';
import { Play, Clock, Music } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { usePlayer } from '../../context/PlayerContext';
import { mockSongs, mockPlaylists, mockRecentlyPlayed } from '../../data/mock';

const Home = () => {
  const { playSong, currentSong, isPlaying } = usePlayer();

  const handlePlaySong = (song) => {
    playSong(song, mockSongs);
  };

  const handlePlayPlaylist = (playlist) => {
    const playlistSongs = mockSongs.filter(song => 
      playlist.songs.includes(song.id)
    );
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const SongRow = ({ song, index, showIndex = false }) => {
    const isCurrentSong = currentSong?.id === song.id;
    
    return (
      <div 
        className={`group flex items-center p-3 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer ${
          isCurrentSong ? 'bg-zinc-800' : ''
        }`}
        onClick={() => handlePlaySong(song)}
      >
        <div className="w-12 flex justify-center">
          {showIndex && !isCurrentSong && (
            <span className="text-zinc-400 text-sm group-hover:hidden">
              {index + 1}
            </span>
          )}
          <Play className={`w-4 h-4 text-white ${
            showIndex && !isCurrentSong ? 'hidden group-hover:block' : 'block'
          } ${isCurrentSong && isPlaying ? 'text-green-500' : ''}`} />
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

  return (
    <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black text-white overflow-auto pb-32 md:pb-24">
      <div className="p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Good evening</h1>
          <p className="text-xl text-zinc-300">What do you want to listen to today?</p>
        </div>

        {/* Featured Playlists */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Featured Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>

        {/* Recently Played */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recently Played</h2>
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Show all
            </Button>
          </div>
          <div className="space-y-2">
            {mockRecentlyPlayed.map((song, index) => (
              <SongRow key={song.id} song={song} index={index} />
            ))}
          </div>
        </section>

        {/* Top Charts */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Charts</h2>
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Show all
            </Button>
          </div>
          <div className="space-y-2">
            {mockSongs.slice(0, 5).map((song, index) => (
              <SongRow key={song.id} song={song} index={index} showIndex={true} />
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Music Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-400">Total Songs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Music className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">{mockSongs.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-400">Playlists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Music className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{mockPlaylists.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-400">Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Music className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-2xl font-bold">3</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-zinc-400">Albums</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Music className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="text-2xl font-bold">2</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;