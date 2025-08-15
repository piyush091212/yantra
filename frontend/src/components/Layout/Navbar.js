import React from 'react';
import { Search, Home, Library, Settings, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Navbar = ({ onNavigate, currentView, searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between p-4">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-white">YantraTune</h1>
          <nav className="flex space-x-4">
            <Button
              variant={currentView === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className="text-white hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              variant={currentView === 'search' ? 'default' : 'ghost'}
              onClick={() => onNavigate('search')}
              className="text-white hover:text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              variant={currentView === 'library' ? 'default' : 'ghost'}
              onClick={() => onNavigate('library')}
              className="text-white hover:text-white"
            >
              <Library className="w-4 h-4 mr-2" />
              Library
            </Button>
            <Button
              variant={currentView === 'admin' ? 'default' : 'ghost'}
              onClick={() => onNavigate('admin')}
              className="text-white hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </nav>
        </div>
        
        {currentView === 'search' && (
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation - Top bar */}
      <div className="md:hidden flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-white">YantraTune</h1>
        {currentView === 'admin' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('add-song')}
            className="border-zinc-700 text-white hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Mobile Search Bar */}
      {currentView === 'search' && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;