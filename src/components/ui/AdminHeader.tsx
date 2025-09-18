// components/AdminHeader.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AdminHeader: React.FC = () => {
  const { session, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during logout',
        variant: 'destructive',
      });
    }
  };

  if (!session) return null;

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto px-5 lg:px-20">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{session.username}</span>
            </span>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};