import React from 'react';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '../../context/AuthContext';

const UserMenu = ({ onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-green-600 text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-xs text-zinc-400 truncate">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-zinc-700" />
        
        <DropdownMenuItem 
          className="text-white hover:bg-zinc-700 cursor-pointer"
          onClick={() => onNavigate('profile')}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-white hover:bg-zinc-700 cursor-pointer"
          onClick={() => onNavigate('settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        {isAdmin() && (
          <>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem 
              className="text-white hover:bg-zinc-700 cursor-pointer"
              onClick={() => onNavigate('admin')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem 
          className="text-white hover:bg-zinc-700 cursor-pointer"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;