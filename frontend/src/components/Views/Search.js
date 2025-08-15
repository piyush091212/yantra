import React, { useState } from 'react';
import { Play, Clock, User, Disc, ListMusic } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { usePlayer } from '../../context/PlayerContext';
import { useSearch } from '../../hooks/useMusic';

const Search = ({ searchQuery }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [activeTab, setActiveTab] = useState('all');
  const { searchResults, loading } = useSearch(searchQuery);

  const handlePlaySong = (song, songList = []) => {
    playSong(song, songList.length > 0 ? songList : searchResults.songs);
  };

  const SongRow = ({ song }) => {
    const isCurrentSong = currentSong?.id === song.id;
    
    return (
      <div 
        className={`group flex items-center p-3 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer ${
          isCurrentSong ? 'bg-zinc-800' : ''
        }`}
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
    );
  };

  const ArtistCard = ({ artist }) => (
    <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{artist.name}</h3>
            <p className="text-sm text-zinc-400 truncate">{artist.bio}</p>
            <p className="text-xs text-zinc-500 mt-1">{artist.songCount} songs</p>
          </div>
          <Button variant="outline" size="sm" className="border-zinc-600 text-white hover:text-white">
            <User className="w-4 h-4 mr-2" />
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AlbumCard = ({ album }) => (
    <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">
      <CardContent className="p-0">
        <div className="flex">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-20 h-20 object-cover rounded-l-lg"
          />
          <div className="p-4 flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{album.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
            <p className="text-xs text-zinc-500 mt-1">
              {new Date(album.releaseDate).getFullYear()} • {album.songCount} songs
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PlaylistCard = ({ playlist }) => (
    <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">
      <CardContent className="p-0">
        <div className="flex">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-20 h-20 object-cover rounded-l-lg"
          />
          <div className="p-4 flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
            <p className="text-sm text-zinc-400 truncate">{playlist.description}</p>
            <p className="text-xs text-zinc-500 mt-1">{playlist.songCount} songs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const NoResults = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎵</div>
      <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
      <p className="text-zinc-400">Try searching with different keywords</p>
    </div>
  );

  const hasResults = filteredResults.songs.length > 0 || 
                   filteredResults.artists.length > 0 || 
                   filteredResults.albums.length > 0 || 
                   filteredResults.playlists.length > 0;

  if (!searchQuery.trim()) {
    return (
      <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black text-white overflow-auto pb-32 md:pb-24">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">Search YantraTune</h2>
            <p className="text-zinc-400">Find your favorite songs, artists, albums, and playlists</p>
          </div>

          {/* Browse Categories */}
          <section>
            <h3 className="text-xl font-bold mb-6">Browse Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Pop', color: 'bg-pink-600', icon: '🎵' },
                { name: 'Rock', color: 'bg-red-600', icon: '🎸' },
                { name: 'Hip Hop', color: 'bg-purple-600', icon: '🎤' },
                { name: 'Electronic', color: 'bg-blue-600', icon: '🎛️' },
                { name: 'Jazz', color: 'bg-yellow-600', icon: '🎺' },
                { name: 'Classical', color: 'bg-green-600', icon: '🎻' },
                { name: 'Country', color: 'bg-orange-600', icon: '🤠' },
                { name: 'R&B', color: 'bg-indigo-600', icon: '🎹' }
              ].map((category) => (
                <Card key={category.name} className={`${category.color} border-0 cursor-pointer hover:scale-105 transition-transform`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h4 className="font-semibold text-white">{category.name}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black text-white overflow-auto pb-32 md:pb-24">
        <div className="p-6">
          <NoResults />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black text-white overflow-auto pb-32 md:pb-24">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          Search results for "{searchQuery}"
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-800 mb-6">
            <TabsTrigger value="all" className="text-white data-[state=active]:text-black">All</TabsTrigger>
            <TabsTrigger value="songs" className="text-white data-[state=active]:text-black">Songs</TabsTrigger>
            <TabsTrigger value="artists" className="text-white data-[state=active]:text-black">Artists</TabsTrigger>
            <TabsTrigger value="albums" className="text-white data-[state=active]:text-black">Albums</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {/* Top Result */}
            {filteredResults.songs.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4">Top result</h3>
                <Card className="bg-zinc-800 border-zinc-700 p-6 max-w-md cursor-pointer hover:bg-zinc-700 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img
                      src={filteredResults.songs[0].coverUrl}
                      alt={filteredResults.songs[0].title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1">
                        {filteredResults.songs[0].title}
                      </h4>
                      <p className="text-zinc-400">{filteredResults.songs[0].artist}</p>
                      <Button
                        className="mt-3 bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handlePlaySong(filteredResults.songs[0])}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                    </div>
                  </div>
                </Card>
              </section>
            )}

            {/* Songs */}
            {filteredResults.songs.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4">Songs</h3>
                <div className="space-y-2">
                  {filteredResults.songs.slice(0, 5).map((song) => (
                    <SongRow key={song.id} song={song} />
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {filteredResults.artists.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4">Artists</h3>
                <div className="space-y-4">
                  {filteredResults.artists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          <TabsContent value="songs">
            <div className="space-y-2">
              {filteredResults.songs.map((song) => (
                <SongRow key={song.id} song={song} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artists">
            <div className="space-y-4">
              {filteredResults.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums">
            <div className="space-y-4">
              {filteredResults.albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Search;