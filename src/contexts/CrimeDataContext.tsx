
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

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
}

// Mock data
const MOCK_CRIME_RECORDS: CrimeRecord[] = [
  {
    id: '1',
    type: 'Theft',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: '123 Main St, Los Angeles, CA'
    },
    datetime: '2023-05-15T14:30:00',
    severity: 6,
    description: 'Shoplifting incident at local convenience store',
    status: 'resolved'
  },
  {
    id: '2',
    type: 'Assault',
    location: {
      lat: 34.0548,
      lng: -118.2500,
      address: '456 Park Ave, Los Angeles, CA'
    },
    datetime: '2023-05-16T22:15:00',
    severity: 8,
    description: 'Physical altercation outside nightclub',
    status: 'investigating'
  },
  {
    id: '3',
    type: 'Burglary',
    location: {
      lat: 34.0575,
      lng: -118.2400,
      address: '789 Residential Blvd, Los Angeles, CA'
    },
    datetime: '2023-05-18T03:45:00',
    severity: 7,
    description: 'Home invasion during nighttime hours',
    status: 'open'
  },
  {
    id: '4',
    type: 'Theft',
    location: {
      lat: 34.0530,
      lng: -118.2420,
      address: '321 Shopping Center, Los Angeles, CA'
    },
    datetime: '2023-05-20T13:10:00',
    severity: 5,
    description: 'Theft of personal items at shopping mall',
    status: 'investigating'
  },
  {
    id: '5',
    type: 'Vandalism',
    location: {
      lat: 34.0500,
      lng: -118.2450,
      address: '555 Public Park, Los Angeles, CA'
    },
    datetime: '2023-05-21T19:30:00',
    severity: 4,
    description: 'Graffiti and property damage at public park',
    status: 'open'
  }
];

const MOCK_CRIME_STATS: CrimeStat[] = [
  {
    type: 'Theft',
    count: 432,
    trend: 'increasing',
    percentChange: 12
  },
  {
    type: 'Assault',
    count: 187,
    trend: 'decreasing',
    percentChange: 8
  },
  {
    type: 'Burglary',
    count: 215,
    trend: 'stable',
    percentChange: 2
  },
  {
    type: 'Vandalism',
    count: 310,
    trend: 'increasing',
    percentChange: 15
  },
  {
    type: 'Robbery',
    count: 118,
    trend: 'decreasing',
    percentChange: 10
  }
];

const MOCK_CRIME_HOTSPOTS: CrimeHotspot[] = [
  {
    id: '1',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Downtown District'
    },
    radius: 0.8,
    riskLevel: 'high',
    crimeTypes: ['Theft', 'Assault'],
    predictedIncidents: 28
  },
  {
    id: '2',
    location: {
      lat: 34.0575,
      lng: -118.2400,
      address: 'Residential Area North'
    },
    radius: 0.5,
    riskLevel: 'medium',
    crimeTypes: ['Burglary', 'Theft'],
    predictedIncidents: 15
  },
  {
    id: '3',
    location: {
      lat: 34.0500,
      lng: -118.2500,
      address: 'Entertainment District'
    },
    radius: 0.6,
    riskLevel: 'veryhigh',
    crimeTypes: ['Assault', 'Robbery', 'Vandalism'],
    predictedIncidents: 42
  },
  {
    id: '4',
    location: {
      lat: 34.0470,
      lng: -118.2430,
      address: 'Shopping District South'
    },
    radius: 0.4,
    riskLevel: 'low',
    crimeTypes: ['Theft'],
    predictedIncidents: 8
  }
];

// Create the context
const CrimeDataContext = createContext<CrimeDataContextValue | undefined>(undefined);

export const CrimeDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [crimeRecords, setCrimeRecords] = useState<CrimeRecord[]>([]);
  const [crimeStats, setCrimeStats] = useState<CrimeStat[]>([]);
  const [crimeHotspots, setCrimeHotspots] = useState<CrimeHotspot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCrimeData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Set mock data
    setCrimeRecords(MOCK_CRIME_RECORDS);
    setCrimeStats(MOCK_CRIME_STATS);
    setCrimeHotspots(MOCK_CRIME_HOTSPOTS);
    
    setIsLoading(false);
    
    toast({
      title: 'Data Updated',
      description: 'Crime data has been refreshed successfully.',
    });
  };

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
        fetchCrimeData
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
