// Mock data for YantraTune

export const mockSongs = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    genre: "Pop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "3:53",
    genre: "Pop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverUrl: "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop",
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    genre: "Rock",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "Sour",
    duration: "2:58",
    genre: "Pop Rock",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    coverUrl: "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop",
    createdAt: "2024-01-12"
  },
  {
    id: "5",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    genre: "Pop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    createdAt: "2024-01-11"
  }
];

export const mockArtists = [
  {
    id: "1",
    name: "The Weeknd",
    bio: "Canadian singer, songwriter, and record producer known for his musical versatility.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    songCount: 25
  },
  {
    id: "2",
    name: "Ed Sheeran",
    bio: "English singer-songwriter known for his acoustic folk and pop music.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    songCount: 18
  },
  {
    id: "3",
    name: "Queen",
    bio: "Legendary British rock band formed in London in 1970.",
    avatarUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    songCount: 35
  }
];

export const mockAlbums = [
  {
    id: "1",
    title: "After Hours",
    artist: "The Weeknd",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    releaseDate: "2020-03-20",
    songCount: 14
  },
  {
    id: "2",
    title: "÷ (Divide)",
    artist: "Ed Sheeran",
    coverUrl: "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop",
    releaseDate: "2017-03-03",
    songCount: 16
  }
];

export const mockPlaylists = [
  {
    id: "1",
    name: "Today's Top Hits",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    description: "The biggest hits right now",
    songCount: 50,
    songs: ["1", "2", "4", "5"]
  },
  {
    id: "2",
    name: "Chill Vibes",
    coverUrl: "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&h=300&fit=crop",
    description: "Relax and unwind with these chill tracks",
    songCount: 32,
    songs: ["3", "5"]
  },
  {
    id: "3",
    name: "Workout Mix",
    coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    description: "High energy tracks for your workout",
    songCount: 28,
    songs: ["1", "4"]
  }
];

export const mockRecentlyPlayed = [
  mockSongs[0],
  mockSongs[2],
  mockSongs[4]
];