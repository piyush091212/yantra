import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('yantratune_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('yantratune_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock login - in real app this would call your auth API
      if (email && password) {
        const userData = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0],
          isAdmin: email === 'admin@yantratune.com',
          joinedAt: new Date().toISOString(),
          preferences: {
            recommendationsEnabled: true,
            favoriteGenres: [],
            recentlyPlayed: [],
            likedSongs: [],
            playlists: []
          }
        };

        setUser(userData);
        localStorage.setItem('yantratune_user', JSON.stringify(userData));
        
        toast({
          title: "Welcome to YantraTune!",
          description: `Logged in as ${userData.name}`,
        });

        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      if (name && email && password) {
        const userData = {
          id: Date.now().toString(),
          email,
          name,
          isAdmin: false,
          joinedAt: new Date().toISOString(),
          preferences: {
            recommendationsEnabled: true,
            favoriteGenres: [],
            recentlyPlayed: [],
            likedSongs: [],
            playlists: []
          }
        };

        setUser(userData);
        localStorage.setItem('yantratune_user', JSON.stringify(userData));
        
        toast({
          title: "Account Created!",
          description: `Welcome to YantraTune, ${userData.name}!`,
        });

        return { success: true };
      } else {
        throw new Error('All fields are required');
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yantratune_user');
    toast({
      title: "Logged Out",
      description: "See you next time!",
    });
  };

  const updateUserPreferences = (preferences) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      }
    };

    setUser(updatedUser);
    localStorage.setItem('yantratune_user', JSON.stringify(updatedUser));
  };

  const addToRecentlyPlayed = (song) => {
    if (!user) return;

    const recentlyPlayed = user.preferences.recentlyPlayed || [];
    const filtered = recentlyPlayed.filter(s => s.id !== song.id);
    const updated = [song, ...filtered].slice(0, 10); // Keep last 10

    updateUserPreferences({ recentlyPlayed: updated });
  };

  const toggleLikedSong = (songId) => {
    if (!user) return;

    const likedSongs = user.preferences.likedSongs || [];
    const isLiked = likedSongs.includes(songId);
    const updated = isLiked 
      ? likedSongs.filter(id => id !== songId)
      : [...likedSongs, songId];

    updateUserPreferences({ likedSongs: updated });
    
    return !isLiked; // Return new liked state
  };

  const isAdmin = () => {
    return user?.isAdmin === true;
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUserPreferences,
    addToRecentlyPlayed,
    toggleLikedSong,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};