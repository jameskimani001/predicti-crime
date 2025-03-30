
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, AlertTriangle } from 'lucide-react';
import { CrimeHotspot } from '@/contexts/CrimeDataContext';

interface CrimeHotspotMapProps {
  hotspots: CrimeHotspot[];
}

const CrimeHotspotMap: React.FC<CrimeHotspotMapProps> = ({ hotspots }) => {
  // Calculate map dimensions (would be replaced with actual map implementation)
  const mapWidth = 960;
  const mapHeight = 400;

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

  // Get size based on predicted incidents
  const getHotspotSize = (incidents: number) => {
    if (incidents < 10) return 20;
    if (incidents < 20) return 30;
    if (incidents < 30) return 40;
    return 50;
  };

  // In a real implementation, we would use a mapping library like Leaflet or Google Maps
  // This is a simplified placeholder visualization
  return (
    <Card className="col-span-2">
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
        <div className="crime-map bg-slate-100 relative overflow-hidden">
          {/* Map would be here - showing a placeholder with hotspot markers */}
          {hotspots.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <AlertTriangle className="mr-2 h-5 w-5" />
              <span>No hotspot data available</span>
            </div>
          ) : (
            <div className="h-full w-full relative">
              {/* These would be actual map markers in a real implementation */}
              {hotspots.map((hotspot) => {
                // Simplified positioning based on lat/lng - would use actual map projections
                // This is just for visual representation
                const left = ((hotspot.location.lng + 118.2600) * 5000) % mapWidth;
                const top = ((hotspot.location.lat - 34.0400) * 5000) % mapHeight;
                const size = getHotspotSize(hotspot.predictedIncidents);
                
                return (
                  <div
                    key={hotspot.id}
                    className={`absolute rounded-full ${getRiskColor(hotspot.riskLevel)} opacity-75 flex items-center justify-center`}
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                      width: `${size}px`,
                      height: `${size}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={`${hotspot.location.address} - Risk: ${hotspot.riskLevel} - Predicted incidents: ${hotspot.predictedIncidents}`}
                  >
                    <span className="text-xs font-bold text-white">{hotspot.predictedIncidents}</span>
                  </div>
                );
              })}
              <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-2 rounded text-xs">
                Hotspot map - Los Angeles area (demo)
              </div>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          <p>This map shows predicted crime hotspots based on historical data and our ML model.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrimeHotspotMap;
