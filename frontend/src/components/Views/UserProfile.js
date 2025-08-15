import React, { useState } from 'react';
import { User, Heart, Clock, Calendar, Music, Edit2, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { useAuth } from '../../context/AuthContext';
import { useSongs } from '../../hooks/useMusic';
import { usePlayer } from '../../context/PlayerContext';

const UserProfile = () => {
  const { user, updateUserPreferences, toggleLikedSong } = useAuth();
  const { data: allSongs } = useSongs();
  const { playSong } = usePlayer();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  if (!user) return null;

  const likedSongs = (allSongs || []).filter(song => 
    user.preferences?.likedSongs?.includes(song.id)
  );

  const recentlyPlayed = user.preferences?.recentlyPlayed || [];

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    setIsEditing(false);
    console.log('Profile updated:', editForm);
  };

  const handleToggleRecommendations = (enabled) => {
    updateUserPreferences({ recommendationsEnabled: enabled });
  };

  const handlePlaySong = (song, songList = []) => {
    playSong(song, songList.length > 0 ? songList : [song]);
  };

  const SongRow = ({ song, showRemove = false }) => (
    <div className="flex items-center p-3 rounded-lg hover:bg-zinc-800 transition-colors group">
      <div 
        className="flex items-center flex-1 cursor-pointer"
        onClick={() => handlePlaySong(song, showRemove ? likedSongs : recentlyPlayed)}
      >
        <img
          src={song.coverUrl || song.cover_url}
          alt={song.title}
          className="w-10 h-10 rounded-md object-cover"
        />
        <div className="ml-4 flex-1 min-w-0">
          <p className="font-medium text-white truncate">{song.title}</p>
          <p className="text-zinc-400 text-sm truncate">{song.artist || song.artist?.name}</p>
        </div>
        <div className="text-zinc-400 text-sm ml-4 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {song.duration}
        </div>
      </div>
      
      {showRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleLikedSong(song.id)}
          className="opacity-0 group-hover:opacity-100 ml-2 text-red-400 hover:text-red-300 p-2"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black text-white overflow-auto pb-32 md:pb-24">
      <div className="p-6">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="bg-green-500 rounded-full p-6">
              <User className="w-16 h-16 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
              <p className="text-zinc-400 mb-2">{user.email}</p>
              <p className="text-zinc-500 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Joined {new Date(user.joinedAt).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="border-zinc-700 text-white hover:text-white"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {isEditing && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="bg-zinc-700 border-zinc-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="bg-zinc-700 border-zinc-600 text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="border-zinc-700 text-white hover:text-white">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{likedSongs.length}</p>
                  <p className="text-xs text-zinc-400">Liked Songs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{recentlyPlayed.length}</p>
                  <p className="text-xs text-zinc-400">Recently Played</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Music className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{user.preferences?.playlists?.length || 0}</p>
                  <p className="text-xs text-zinc-400">Playlists</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-xs text-zinc-400">Days Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <Card className="bg-zinc-800 border-zinc-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="recommendations" className="text-white">Enable Recommendations</Label>
                <p className="text-sm text-zinc-400">Get personalized music suggestions</p>
              </div>
              <Switch
                id="recommendations"
                checked={user.preferences?.recommendationsEnabled || false}
                onCheckedChange={handleToggleRecommendations}
              />
            </div>
          </CardContent>
        </Card>

        {/* Music History */}
        <Tabs defaultValue="liked" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800 mb-6">
            <TabsTrigger value="liked" className="text-white data-[state=active]:text-black">
              Liked Songs ({likedSongs.length})
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-white data-[state=active]:text-black">
              Recently Played ({recentlyPlayed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liked">
            {likedSongs.length > 0 ? (
              <div className="space-y-2">
                {likedSongs.map((song) => (
                  <SongRow key={song.id} song={song} showRemove={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No liked songs yet</h3>
                <p className="text-zinc-400">Start liking songs to see them here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            {recentlyPlayed.length > 0 ? (
              <div className="space-y-2">
                {recentlyPlayed.map((song) => (
                  <SongRow key={`recent-${song.id}`} song={song} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No recently played songs</h3>
                <p className="text-zinc-400">Start listening to music to see your history</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;