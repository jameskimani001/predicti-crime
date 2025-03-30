
import React from 'react';
import { useCrimeData } from '@/contexts/CrimeDataContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, AlertTriangle, Search, FileText } from 'lucide-react';
import Layout from '@/components/Layout';

const Hotspots: React.FC = () => {
  const { crimeHotspots, isLoading } = useCrimeData();

  // Get risk level color class
  const getRiskColor = (level: 'low' | 'medium' | 'high' | 'veryhigh') => {
    switch (level) {
      case 'low': return 'bg-crime-low';
      case 'medium': return 'bg-crime-medium';
      case 'high': return 'bg-crime-high';
      case 'veryhigh': return 'bg-crime-veryhigh';
      default: return 'bg-crime-low';
    }
  };

  // Get risk level badge
  const getRiskBadge = (level: 'low' | 'medium' | 'high' | 'veryhigh') => {
    switch (level) {
      case 'low': return <Badge className="bg-crime-low">Low Risk</Badge>;
      case 'medium': return <Badge className="bg-crime-medium">Medium Risk</Badge>;
      case 'high': return <Badge className="bg-crime-high">High Risk</Badge>;
      case 'veryhigh': return <Badge className="bg-crime-veryhigh">Very High Risk</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crime Hotspots</h1>
        <p className="text-muted-foreground">
          View and analyze predicted crime hotspot areas
        </p>
      </div>

      {/* Full Map */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Map className="mr-2 h-5 w-5" /> Crime Hotspot Map
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-crime-low mr-1"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-crime-medium mr-1"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-crime-high mr-1"></div>
                <span>High</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-crime-veryhigh mr-1"></div>
                <span>Very High</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[500px]" />
          ) : (
            <div className="h-[500px] w-full bg-slate-100 rounded-md relative">
              {/* Placeholder for full map - in a real app, this would be implemented with Leaflet or Google Maps */}
              {crimeHotspots.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  <span>No hotspot data available</span>
                </div>
              ) : (
                <div className="h-full w-full relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-muted-foreground">
                      Interactive map would be displayed here
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-2 rounded text-xs">
                    Los Angeles area (demo)
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hotspot Details */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Hotspot Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-48" />
            ))
          : crimeHotspots.map((hotspot) => (
              <Card key={hotspot.id} className="overflow-hidden">
                <div className={`h-2 ${getRiskColor(hotspot.riskLevel)}`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{hotspot.location.address}</CardTitle>
                    {getRiskBadge(hotspot.riskLevel)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Predicted Incidents:</span>
                    <span className="font-medium">{hotspot.predictedIncidents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Radius:</span>
                    <span className="font-medium">{hotspot.radius} km</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Common Crime Types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {hotspot.crimeTypes.map((type, index) => (
                        <Badge key={index} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex mt-2 pt-2 border-t text-sm">
                    <button className="text-primary flex items-center mr-4">
                      <Search className="h-4 w-4 mr-1" /> Details
                    </button>
                    <button className="text-primary flex items-center">
                      <FileText className="h-4 w-4 mr-1" /> Reports
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
        }
      </div>
    </div>
  );
};

export default Hotspots;
