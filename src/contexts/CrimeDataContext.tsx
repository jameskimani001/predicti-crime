
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
      description: 'Kenyan crime data has been refreshed successfully.',
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
