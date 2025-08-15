import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { usePlayer } from '../../context/PlayerContext';

const MiniPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 z-50 mb-16 md:mb-0">
      {/* Mobile Mini Player */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center flex-1 min-w-0">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-12 h-12 rounded-md object-cover flex-shrink-0"
            />
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-white font-medium text-sm truncate">{currentSong.title}</p>
              <p className="text-zinc-400 text-xs truncate">{currentSong.artist}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={playPrevious}
              className="text-white hover:text-white p-1"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:text-white p-1"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={playNext}
              className="text-white hover:text-white p-1"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="w-full">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Desktop Player */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0 max-w-sm">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-14 h-14 rounded-md object-cover"
          />
          <div className="ml-4 min-w-0 flex-1">
            <p className="text-white font-medium truncate">{currentSong.title}</p>
            <p className="text-zinc-400 text-sm truncate">{currentSong.artist}</p>
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={playPrevious}
              className="text-white hover:text-white"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:text-white"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={playNext}
              className="text-white hover:text-white"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-zinc-400 w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-zinc-400 w-12">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 flex-1 justify-end max-w-sm">
          <Volume2 className="w-4 h-4 text-zinc-400" />
          <Slider
            value={[volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;