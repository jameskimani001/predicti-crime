
import React from 'react';
import { useCrimeData } from '@/contexts/CrimeDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import CrimeStatCard from '@/components/CrimeStatCard';
import CrimeHotspotMap from '@/components/CrimeHotspotMap';
import RecentCrimesList from '@/components/RecentCrimesList';
import PredictionModelCard from '@/components/PredictionModelCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { crimeStats, crimeHotspots, crimeRecords, isLoading, fetchCrimeData } = useCrimeData();

  // Filtering recent crimes
  const recentCrimes = crimeRecords.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {user ? `Welcome back, ${user.name}` : 'Crime prediction and analysis dashboard'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto" 
          onClick={() => fetchCrimeData()}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-32" />
            ))
          : crimeStats.map((stat, index) => (
              <CrimeStatCard key={index} stat={stat} />
            ))
        }
      </div>

      {/* Map and Recent Crimes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[480px] col-span-2" />
            <Skeleton className="h-[480px]" />
          </>
        ) : (
          <>
            <CrimeHotspotMap hotspots={crimeHotspots} />
            <RecentCrimesList crimes={recentCrimes} />
          </>
        )}
      </div>

      {/* Only show prediction model info for admin and law enforcement */}
      {user && (user.role === 'admin' || user.role === 'law_enforcement') && (
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <PredictionModelCard />
          )}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
