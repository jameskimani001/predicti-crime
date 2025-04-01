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
  register: (name: string, email: string, password: string) => Promise<void>;
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

// Storage key for users
const USERS_STORAGE_KEY = 'crimeUsers';
const CURRENT_USER_KEY = 'crimeUser';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<Array<typeof MOCK_USERS[0]>>([]);

  // Initialize users from localStorage and merge with mock users
  useEffect(() => {
    // Load registered users
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    let parsedUsers: Array<typeof MOCK_USERS[0]> = [];
    
    if (storedUsers) {
      try {
        parsedUsers = JSON.parse(storedUsers);
      } catch (e) {
        console.error('Error parsing stored users:', e);
      }
    }
    
    // Combine mock users with registered users, avoiding duplicates
    const allUsers = [...MOCK_USERS];
    parsedUsers.forEach(storedUser => {
      if (!allUsers.some(u => u.email === storedUser.email)) {
        allUsers.push(storedUser);
      }
    });
    
    setUsers(allUsers);
    
    // Check for current logged in user
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    if (users.length > MOCK_USERS.length) {
      // Only save custom users, not the mock ones
      const customUsers = users.filter(
        user => !MOCK_USERS.some(mockUser => mockUser.email === user.email)
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(customUsers));
    }
  }, [users]);

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'Email already in use.',
      });
      setIsLoading(false);
      throw new Error('Email already in use');
    }
    
    // Create new user with 'public' role
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: 'public' as UserRole, // Default role for new users is 'public'
    };
    
    // Add to users array
    setUsers(prev => [...prev, newUser]);
    
    toast({
      title: 'Registration Successful',
      description: 'Your account has been created. You can now log in.',
    });
    
    setIsLoading(false);
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user with matching credentials
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Create user object without password
      const { password, ...userWithoutPassword } = foundUser;
      
      // Save user to state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
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
      throw new Error('Invalid credentials');
    }

    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
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
