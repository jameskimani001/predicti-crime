
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

// User role types
export type UserRole = 'admin' | 'law_enforcement' | 'public';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Auth context value type
interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Creating the context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@predicti.crime',
    password: 'admin123',
    role: 'admin' as UserRole,
  },
  {
    id: '2',
    name: 'Police Officer',
    email: 'officer@predicti.crime',
    password: 'officer123',
    role: 'law_enforcement' as UserRole,
  },
  {
    id: '3',
    name: 'Public User',
    email: 'public@predicti.crime',
    password: 'public123',
    role: 'public' as UserRole,
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('crimeUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('crimeUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user with matching credentials
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Create user object without password
      const { password, ...userWithoutPassword } = foundUser;
      
      // Save user to state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('crimeUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password.',
      });
    }

    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('crimeUser');
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
