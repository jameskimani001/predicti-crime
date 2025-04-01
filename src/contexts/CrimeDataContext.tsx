import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Define crime data types
export interface CrimeRecord {
  id: string;
  type: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  datetime: string;
  severity: number;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  witness?: string;
}

export interface NewCrimeReport {
  type: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  datetime: string;
  description: string;
  severity: number;
  witness?: string;
}

export interface CrimeStat {
  type: string;
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  percentChange: number;
}

export interface CrimeHotspot {
  id: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  radius: number;
  riskLevel: 'low' | 'medium' | 'high' | 'veryhigh';
  crimeTypes: string[];
  predictedIncidents: number;
}

interface CrimeDataContextValue {
  crimeRecords: CrimeRecord[];
  crimeStats: CrimeStat[];
  crimeHotspots: CrimeHotspot[];
  isLoading: boolean;
  fetchCrimeData: () => Promise<void>;
  submitCrimeReport: (report: NewCrimeReport) => Promise<void>;
  updateCrimeStatus: (id: string, status: 'open' | 'investigating' | 'resolved') => Promise<void>;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'new_report' | 'status_change' | 'system';
}

// Mock Kenyan data
const MOCK_CRIME_RECORDS: CrimeRecord[] = [
  {
    id: '1',
    type: 'Robbery',
    location: {
      lat: -1.2921,
      lng: 36.8219,
      address: 'CBD, Nairobi, Kenya'
    },
    datetime: '2023-05-15T14:30:00',
    severity: 7,
    description: 'Armed robbery at a mobile money shop',
    status: 'investigating'
  },
  {
    id: '2',
    type: 'Assault',
    location: {
      lat: -1.2864,
      lng: 36.8172,
      address: 'Westlands, Nairobi, Kenya'
    },
    datetime: '2023-05-16T22:15:00',
    severity: 6,
    description: 'Physical altercation outside a nightclub',
    status: 'open'
  },
  {
    id: '3',
    type: 'Carjacking',
    location: {
      lat: -1.3031,
      lng: 36.7073,
      address: 'Karen, Nairobi, Kenya'
    },
    datetime: '2023-05-18T03:45:00',
    severity: 8,
    description: 'Armed carjacking incident at residential gate',
    status: 'investigating'
  },
  {
    id: '4',
    type: 'Theft',
    location: {
      lat: -1.2697,
      lng: 36.8569,
      address: 'Eastleigh, Nairobi, Kenya'
    },
    datetime: '2023-05-20T13:10:00',
    severity: 5,
    description: 'Pickpocketing incident at a shopping center',
    status: 'resolved'
  },
  {
    id: '5',
    type: 'Fraud',
    location: {
      lat: -1.2921,
      lng: 36.8219,
      address: 'CBD, Nairobi, Kenya'
    },
    datetime: '2023-05-21T19:30:00',
    severity: 6,
    description: 'Mobile money fraud scheme targeting several victims',
    status: 'open'
  }
];

const MOCK_CRIME_STATS: CrimeStat[] = [
  {
    type: 'Robbery',
    count: 342,
    trend: 'increasing',
    percentChange: 15
  },
  {
    type: 'Assault',
    count: 187,
    trend: 'decreasing',
    percentChange: 8
  },
  {
    type: 'Carjacking',
    count: 126,
    trend: 'increasing',
    percentChange: 22
  },
  {
    type: 'Theft',
    count: 310,
    trend: 'stable',
    percentChange: 3
  },
  {
    type: 'Fraud',
    count: 205,
    trend: 'increasing',
    percentChange: 18
  }
];

const MOCK_CRIME_HOTSPOTS: CrimeHotspot[] = [
  {
    id: '1',
    location: {
      lat: -1.2921,
      lng: 36.8219,
      address: 'Nairobi CBD'
    },
    radius: 0.8,
    riskLevel: 'high',
    crimeTypes: ['Theft', 'Robbery'],
    predictedIncidents: 32
  },
  {
    id: '2',
    location: {
      lat: -1.2697,
      lng: 36.8569,
      address: 'Eastleigh Area'
    },
    radius: 0.6,
    riskLevel: 'veryhigh',
    crimeTypes: ['Robbery', 'Theft', 'Assault'],
    predictedIncidents: 45
  },
  {
    id: '3',
    location: {
      lat: -1.2864,
      lng: 36.8172,
      address: 'Westlands District'
    },
    radius: 0.5,
    riskLevel: 'medium',
    crimeTypes: ['Fraud', 'Theft'],
    predictedIncidents: 18
  },
  {
    id: '4',
    location: {
      lat: -1.3031,
      lng: 36.7073,
      address: 'Karen Residential Area'
    },
    radius: 0.4,
    riskLevel: 'low',
    crimeTypes: ['Carjacking', 'Robbery'],
    predictedIncidents: 10
  }
];

// Create the context
const CrimeDataContext = createContext<CrimeDataContextValue | undefined>(undefined);

// Load data from localStorage or use initial mock data
const getSavedCrimeRecords = (): CrimeRecord[] => {
  try {
    const savedRecords = localStorage.getItem('crimeRecords');
    return savedRecords ? JSON.parse(savedRecords) : MOCK_CRIME_RECORDS;
  } catch (error) {
    console.error("Error loading crime records from localStorage:", error);
    return MOCK_CRIME_RECORDS;
  }
};

const getSavedNotifications = (): Notification[] => {
  try {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  } catch (error) {
    console.error("Error loading notifications from localStorage:", error);
    return [];
  }
};

export const CrimeDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [crimeRecords, setCrimeRecords] = useState<CrimeRecord[]>(getSavedCrimeRecords());
  const [crimeStats, setCrimeStats] = useState<CrimeStat[]>(MOCK_CRIME_STATS);
  const [crimeHotspots, setCrimeHotspots] = useState<CrimeHotspot[]>(MOCK_CRIME_HOTSPOTS);
  const [notifications, setNotifications] = useState<Notification[]>(getSavedNotifications());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('crimeRecords', JSON.stringify(crimeRecords));
  }, [crimeRecords]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const fetchCrimeData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use saved records instead of always setting to mock data
    if (crimeRecords.length === 0) {
      setCrimeRecords(getSavedCrimeRecords());
    }
    
    setCrimeStats(MOCK_CRIME_STATS);
    setCrimeHotspots(MOCK_CRIME_HOTSPOTS);
    
    setIsLoading(false);
    
    toast({
      title: 'Data Updated',
      description: 'Kenyan crime data has been refreshed successfully.',
    });
  };

  // Submit a new crime report
  const submitCrimeReport = async (report: NewCrimeReport) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a new crime record
    const newCrimeRecord: CrimeRecord = {
      id: uuidv4(),
      ...report,
      status: 'open',
    };
    
    // Update crime records
    const updatedRecords = [newCrimeRecord, ...crimeRecords];
    setCrimeRecords(updatedRecords);
    
    // Save to localStorage immediately to prevent loss on refresh
    localStorage.setItem('crimeRecords', JSON.stringify(updatedRecords));
    
    // Create notification for admin and law enforcement
    const newNotification: Notification = {
      id: uuidv4(),
      title: `New ${report.type} Report`,
      message: `A new ${report.type} was reported at ${report.location.address}. Severity: ${report.severity}/10.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'new_report'
    };
    
    // Add notification
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    
    // Save notifications to localStorage immediately
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    setIsLoading(false);
    
    // Trigger a push notification (in a real app, this would be done on the server)
    if (Notification.permission === 'granted') {
      new Notification('New Crime Report', {
        body: `A new ${report.type} was reported at ${report.location.address}.`,
        icon: '/favicon.ico'
      });
    }
  };

  // Update a crime record status
  const updateCrimeStatus = async (id: string, status: 'open' | 'investigating' | 'resolved') => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update crime records
    const updatedRecords = crimeRecords.map(record => 
      record.id === id ? { ...record, status } : record
    );
    
    setCrimeRecords(updatedRecords);
    
    // Save to localStorage immediately to prevent loss on refresh
    localStorage.setItem('crimeRecords', JSON.stringify(updatedRecords));
    
    // Create notification for status change
    const updatedCrime = updatedRecords.find(record => record.id === id);
    
    if (updatedCrime) {
      const newNotification: Notification = {
        id: uuidv4(),
        title: `Case Status Updated`,
        message: `The status for ${updatedCrime.type} at ${updatedCrime.location.address} has been changed to ${status}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'status_change'
      };
      
      // Add notification
      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      
      // Save notifications to localStorage immediately
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    }
    
    setIsLoading(false);
    
    toast({
      title: "Status Updated",
      description: `The crime report status has been changed to ${status}.`,
    });
  };

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    
    // Save updated notifications to localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchCrimeData();
  }, []);

  return (
    <CrimeDataContext.Provider
      value={{
        crimeRecords,
        crimeStats,
        crimeHotspots,
        isLoading,
        fetchCrimeData,
        submitCrimeReport,
        updateCrimeStatus,
        notifications,
        markNotificationAsRead
      }}
    >
      {children}
    </CrimeDataContext.Provider>
  );
};

// Custom hook to use the crime data context
export const useCrimeData = () => {
  const context = useContext(CrimeDataContext);
  if (context === undefined) {
    throw new Error('useCrimeData must be used within a CrimeDataProvider');
  }
  return context;
};
