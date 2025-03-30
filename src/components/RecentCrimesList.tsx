
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, MapPin } from 'lucide-react';
import { CrimeRecord } from '@/contexts/CrimeDataContext';

interface RecentCrimesListProps {
  crimes: CrimeRecord[];
}

const RecentCrimesList: React.FC<RecentCrimesListProps> = ({ crimes }) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge variant
  const getStatusBadge = (status: 'open' | 'investigating' | 'resolved') => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">{status}</Badge>;
      case 'investigating':
        return <Badge variant="default" className="bg-yellow-500">{status}</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" /> Recent Crime Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {crimes.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No recent crime reports available
            </div>
          ) : (
            crimes.map((crime) => (
              <div 
                key={crime.id} 
                className="border rounded-md p-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{crime.type}</h3>
                  <div>
                    {getStatusBadge(crime.status)}
                  </div>
                </div>
                <p className="text-sm line-clamp-2 mb-2">{crime.description}</p>
                <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{crime.location.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDate(crime.datetime)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCrimesList;
