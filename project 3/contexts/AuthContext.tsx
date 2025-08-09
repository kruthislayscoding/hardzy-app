import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (phone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock initialization - in real app, this would check Firebase Auth state
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const signIn = async (phone: string) => {
    setIsLoading(true);
    // Mock Firebase Auth phone sign in
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const verifyOTP = async (otp: string) => {
    setIsLoading(true);
    // Mock OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'user_123',
      name: '',
      email: '',
      phone: '+91 9876543210',
      profileComplete: false,
      address: {
        street: '',
        city: '',
        pincode: ''
      },
      createdAt: new Date().toISOString()
    };
    
    setUser(mockUser);
    setIsLoading(false);
  };

  const signOut = async () => {
    setUser(null);
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profileData, profileComplete: true };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      verifyOTP,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};