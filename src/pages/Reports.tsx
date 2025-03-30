
import React, { useState } from 'react';
import { useCrimeData } from '@/contexts/CrimeDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  EyeIcon 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Reports: React.FC = () => {
  const { crimeRecords, isLoading } = useCrimeData();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter crimes based on search query
  const filteredCrimes = crimeRecords.filter((crime) => {
    const query = searchQuery.toLowerCase();
    return (
      crime.type.toLowerCase().includes(query) ||
      crime.location.address.toLowerCase().includes(query) ||
      crime.description.toLowerCase().includes(query) ||
      crime.status.toLowerCase().includes(query)
    );
  });

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
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

  // Get severity badge
  const getSeverityBadge = (severity: number) => {
    if (severity >= 8) {
      return <Badge className="bg-crime-veryhigh">High Severity</Badge>;
    } else if (severity >= 5) {
      return <Badge className="bg-crime-medium">Medium Severity</Badge>;
    } else {
      return <Badge className="bg-crime-low">Low Severity</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crime Reports</h1>
        <p className="text-muted-foreground">
          View and analyze crime reports and incidents
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search reports by type, location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
      ) : filteredCrimes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No crime reports found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCrimes.map((crime) => (
            <Card key={crime.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center mb-2 md:mb-0">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-xl font-semibold">{crime.type}</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(crime.status)}
                    {getSeverityBadge(crime.severity)}
                  </div>
                </div>
                
                <p className="mb-4">{crime.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{crime.location.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{formatDate(crime.datetime)}</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <EyeIcon className="h-4 w-4 mr-2" /> View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
