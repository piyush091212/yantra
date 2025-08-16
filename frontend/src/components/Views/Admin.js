import React, { useState } from 'react';
import { Plus, Edit, Trash2, Music, User, Disc, ListMusic, Upload, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { mockSongs, mockArtists, mockAlbums, mockPlaylists } from '../../data/mock';

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Separate modal states for each type
  const [isSongDialogOpen, setIsSongDialogOpen] = useState(false);
  const [isArtistDialogOpen, setIsArtistDialogOpen] = useState(false);
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  
  // Form states
  const [songForm, setSongForm] = useState({
    title: '', artist: '', album: '', duration: '', genre: '', audioFile: null, coverImage: null
  });
  const [artistForm, setArtistForm] = useState({
    name: '', bio: '', avatarImage: null
  });
  const [albumForm, setAlbumForm] = useState({
    title: '', artist: '', coverImage: null, releaseDate: ''
  });
  const [playlistForm, setPlaylistForm] = useState({
    name: '', description: '', coverImage: null
  });

  const handleSaveSong = async () => {
    // TODO: Implement actual API call
    toast({
      title: "Song saved successfully",
      description: `"${songForm.title}" has been added to your library.`
    });
    setSongForm({ title: '', artist: '', album: '', duration: '', genre: '', audioFile: null, coverImage: null });
    setIsSongDialogOpen(false);
  };

  const handleSaveArtist = async () => {
    // TODO: Implement actual API call
    toast({
      title: "Artist saved successfully",
      description: `"${artistForm.name}" has been added to your library.`
    });
    setArtistForm({ name: '', bio: '', avatarImage: null });
    setIsArtistDialogOpen(false);
  };

  const handleSaveAlbum = async () => {
    // TODO: Implement actual API call
    toast({
      title: "Album saved successfully",
      description: `"${albumForm.title}" has been added to your library.`
    });
    setAlbumForm({ title: '', artist: '', coverImage: null, releaseDate: '' });
    setIsAlbumDialogOpen(false);
  };

  const handleSavePlaylist = async () => {
    // TODO: Implement actual API call
    toast({
      title: "Playlist saved successfully",
      description: `"${playlistForm.name}" has been created.`
    });
    setPlaylistForm({ name: '', description: '', coverImage: null });
    setIsPlaylistDialogOpen(false);
  };

  const handleDelete = (type, item) => {
    toast({
      title: `${type} deleted`,
      description: `Successfully deleted "${item.title || item.name}".`,
      variant: "destructive"
    });
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
        src={song.coverUrl}
        alt={song.title}
        className="w-12 h-12 rounded-md object-cover"
      />
      <div className="ml-4 flex-1 min-w-0">
        <p className="font-medium text-white truncate">{song.title}</p>
        <p className="text-sm text-zinc-400 truncate">{song.artist} • {song.album}</p>
      </div>
      <div className="hidden md:block text-sm text-zinc-400 ml-4">
        {song.duration}
      </div>
      <div className="hidden md:block text-sm text-zinc-400 ml-4">
        {song.genre}
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditingItem(song)}
          className="text-zinc-400 hover:text-white p-2"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete('Song', song)}
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
            <Label htmlFor="title">Song Title</Label>
            <Input
              id="title"
              value={songForm.title}
              onChange={(e) => setSongForm({...songForm, title: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter song title"
            />
          </div>
          <div>
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              value={songForm.artist}
              onChange={(e) => setSongForm({...songForm, artist: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter artist name"
            />
          </div>
          <div>
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              value={songForm.album}
              onChange={(e) => setSongForm({...songForm, album: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter album name"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={songForm.duration}
              onChange={(e) => setSongForm({...songForm, duration: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="e.g. 3:25"
            />
          </div>
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={songForm.genre}
              onChange={(e) => setSongForm({...songForm, genre: e.target.value})}
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
              onChange={(e) => setSongForm({...songForm, coverImage: e.target.files[0]})}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="audioFile">Audio File</Label>
            <Input
              id="audioFile"
              type="file"
              accept="audio/*"
              onChange={(e) => setSongForm({...songForm, audioFile: e.target.files[0]})}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsSongDialogOpen(false)}
            className="border-zinc-700 text-white hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSaveSong} className="bg-green-600 hover:bg-green-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Song
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
            <Label htmlFor="artistName">Artist Name</Label>
            <Input
              id="artistName"
              value={artistForm.name}
              onChange={(e) => setArtistForm({...artistForm, name: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter artist name"
            />
          </div>
          <div>
            <Label htmlFor="artistBio">Biography</Label>
            <Textarea
              id="artistBio"
              value={artistForm.bio}
              onChange={(e) => setArtistForm({...artistForm, bio: e.target.value})}
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
              onChange={(e) => setArtistForm({...artistForm, avatarImage: e.target.files[0]})}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsArtistDialogOpen(false)}
            className="border-zinc-700 text-white hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSaveArtist} className="bg-green-600 hover:bg-green-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Artist
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
            <Label htmlFor="albumTitle">Album Title</Label>
            <Input
              id="albumTitle"
              value={albumForm.title}
              onChange={(e) => setAlbumForm({...albumForm, title: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter album title"
            />
          </div>
          <div>
            <Label htmlFor="albumArtist">Artist</Label>
            <Input
              id="albumArtist"
              value={albumForm.artist}
              onChange={(e) => setAlbumForm({...albumForm, artist: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter artist name"
            />
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
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSaveAlbum} className="bg-green-600 hover:bg-green-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Album
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
            <Label htmlFor="playlistName">Playlist Name</Label>
            <Input
              id="playlistName"
              value={playlistForm.name}
              onChange={(e) => setPlaylistForm({...playlistForm, name: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Enter playlist name"
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
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSavePlaylist} className="bg-green-600 hover:bg-green-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Playlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

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
                value={mockSongs.length}
                icon={Music}
                color="text-green-500"
              />
              <StatsCard
                title="Artists"
                value={mockArtists.length}
                icon={User}
                color="text-blue-500"
              />
              <StatsCard
                title="Albums"
                value={mockAlbums.length}
                icon={Disc}
                color="text-purple-500"
              />
              <StatsCard
                title="Playlists"
                value={mockPlaylists.length}
                icon={ListMusic}
                color="text-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-zinc-300">Added "Blinding Lights" to library</p>
                      <span className="text-xs text-zinc-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-zinc-300">Created playlist "Today's Top Hits"</p>
                      <span className="text-xs text-zinc-500">5 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-sm text-zinc-300">Added artist "Ed Sheeran"</p>
                      <span className="text-xs text-zinc-500">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsSongDialogOpen(true)}
                      className="h-20 flex-col border-zinc-700 text-white hover:text-white"
                    >
                      <Music className="w-6 h-6 mb-2" />
                      Add Song
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsArtistDialogOpen(true)}
                      className="h-20 flex-col border-zinc-700 text-white hover:text-white"
                    >
                      <User className="w-6 h-6 mb-2" />
                      Add Artist
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAlbumDialogOpen(true)}
                      className="h-20 flex-col border-zinc-700 text-white hover:text-white"
                    >
                      <Disc className="w-6 h-6 mb-2" />
                      Add Album
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsPlaylistDialogOpen(true)}
                      className="h-20 flex-col border-zinc-700 text-white hover:text-white"
                    >
                      <ListMusic className="w-6 h-6 mb-2" />
                      Add Playlist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="songs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Songs ({mockSongs.length})</h2>
              <Button 
                onClick={() => setIsSongDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Song
              </Button>
            </div>
            <div className="space-y-4">
              {mockSongs.map((song) => (
                <SongManagementRow key={song.id} song={song} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artists">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Artists ({mockArtists.length})</h2>
              <Button 
                onClick={() => setIsArtistDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Artist
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockArtists.map((artist) => (
                <Card key={artist.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={artist.avatarUrl}
                        alt={artist.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{artist.name}</h3>
                        <p className="text-sm text-zinc-400 truncate">{artist.songCount} songs</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white p-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete('Artist', artist)}
                          className="text-zinc-400 hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Albums ({mockAlbums.length})</h2>
              <Button 
                onClick={() => setIsAlbumDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Album
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAlbums.map((album) => (
                <Card key={album.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button variant="ghost" size="sm" className="bg-black bg-opacity-50 text-white hover:text-white p-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete('Album', album)}
                          className="bg-black bg-opacity-50 text-white hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playlists">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Playlists ({mockPlaylists.length})</h2>
              <Button 
                onClick={() => setIsPlaylistDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Playlist
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPlaylists.map((playlist) => (
                <Card key={playlist.id} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button variant="ghost" size="sm" className="bg-black bg-opacity-50 text-white hover:text-white p-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete('Playlist', playlist)}
                          className="bg-black bg-opacity-50 text-white hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
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
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <AddSongDialog />
        <AddArtistDialog />
        <AddAlbumDialog />
        <AddPlaylistDialog />
      </div>
    </div>
  );
};

export default Admin;