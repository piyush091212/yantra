import React, { useState } from "react";
import "./App.css";
import { PlayerProvider } from './context/PlayerContext';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Layout/Navbar';
import BottomNavigation from './components/Layout/BottomNavigation';
import MiniPlayer from './components/Player/MiniPlayer';
import Home from './components/Views/Home';
import Search from './components/Views/Search';
import Library from './components/Views/Library';
import Admin from './components/Views/Admin';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view !== 'search') {
      setSearchQuery('');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'search':
        return <Search 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          onNavigate={handleNavigate}
        />;
      case 'library':
        return <Library />;
      case 'admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  return (
    <PlayerProvider>
      <div className="App h-screen bg-black flex flex-col">
        <Navbar 
          onNavigate={handleNavigate}
          currentView={currentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <main className="flex-1 overflow-hidden">
          {renderCurrentView()}
        </main>
        
        <MiniPlayer />
        <BottomNavigation onNavigate={handleNavigate} currentView={currentView} />
        <Toaster />
      </div>
    </PlayerProvider>
  );
}

export default App;