import React, { useState } from 'react';
import { useCrimeData } from '@/contexts/CrimeDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  EyeIcon,
  PlusCircle,
  List,
  Download,
  CalendarIcon,
  UserCircle2,
  Edit
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import CrimeReportForm from '@/components/CrimeReportForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { CrimeRecord } from '@/contexts/CrimeDataContext';

const Reports: React.FC = () => {
  const { crimeRecords, isLoading, updateCrimeStatus } = useCrimeData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCrime, setSelectedCrime] = useState<CrimeRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'open' | 'investigating' | 'resolved'>('open');

  const canEditStatus = user && (user.role === 'admin' || user.role === 'law_enforcement');

  const filteredCrimes = crimeRecords.filter((crime) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      crime.type.toLowerCase().includes(query) ||
      crime.location.address.toLowerCase().includes(query) ||
      crime.description.toLowerCase().includes(query) ||
      crime.status.toLowerCase().includes(query);
    
    return statusFilter === 'all' 
      ? matchesQuery 
      : matchesQuery && crime.status === statusFilter;
  });

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

  const getSeverityBadge = (severity: number) => {
    if (severity >= 8) {
      return <Badge className="bg-crime-veryhigh">High Severity</Badge>;
    } else if (severity >= 5) {
      return <Badge className="bg-crime-medium">Medium Severity</Badge>;
    } else {
      return <Badge className="bg-crime-low">Low Severity</Badge>;
    }
  };

  const viewCrimeDetails = (crime: CrimeRecord) => {
    setSelectedCrime(crime);
    setDialogOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Type', 'Location', 'Date/Time', 'Status', 'Severity', 'Description'];
    const csvContent = [
      headers.join(','),
      ...filteredCrimes.map(crime => [
        `"${crime.type}"`,
        `"${crime.location.address}"`,
        `"${formatDate(crime.datetime)}"`,
        `"${crime.status}"`,
        crime.severity,
        `"${crime.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `crime-reports-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `${filteredCrimes.length} crime reports have been exported to CSV.`,
    });
  };

  const handleStatusUpdate = async () => {
    if (selectedCrime && newStatus) {
      try {
        await updateCrimeStatus(selectedCrime.id, newStatus);
        setSelectedCrime({
          ...selectedCrime,
          status: newStatus
        });
        setStatusDialogOpen(false);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to update status',
          description: 'There was an error updating the crime status.',
        });
      }
    }
  };

  const openStatusChangeDialog = () => {
    if (selectedCrime) {
      setNewStatus(selectedCrime.status);
      setStatusDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crime Reports</h1>
        <p className="text-muted-foreground">
          View crime reports and submit new incidents
        </p>
      </div>

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="view" className="flex items-center">
            <List className="mr-2 h-4 w-4" /> View Reports
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" /> Report Crime
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('open')}>
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('investigating')}>
                  Investigating
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('resolved')}>
                  Resolved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={exportToCSV} disabled={filteredCrimes.length === 0}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
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
                <Card key={crime.id} className="hover:shadow-md transition-shadow">
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
                    
                    <p className="mb-4 line-clamp-2">{crime.description}</p>
                    
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => viewCrimeDetails(crime)}
                      >
                        <EyeIcon className="h-4 w-4 mr-2" /> View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Crime Report</CardTitle>
            </CardHeader>
            <CardContent>
              <CrimeReportForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          {selectedCrime && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl">
                  <FileText className="h-5 w-5 mr-2" />
                  {selectedCrime.type} Report
                </DialogTitle>
                <DialogDescription>
                  Case ID: {selectedCrime.id.slice(0, 8).toUpperCase()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    {getStatusBadge(selectedCrime.status)}
                    {getSeverityBadge(selectedCrime.severity)}
                  </div>
                  
                  {canEditStatus && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={openStatusChangeDialog}
                      className="flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Change Status
                    </Button>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedCrime.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" /> Location
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedCrime.location.address}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      Coordinates: {selectedCrime.location.lat.toFixed(4)}, {selectedCrime.location.lng.toFixed(4)}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" /> Date & Time
                    </h3>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedCrime.datetime)}</p>
                  </div>
                </div>
                
                {selectedCrime.witness && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <UserCircle2 className="h-4 w-4 mr-2" /> Witness Information
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedCrime.witness}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Case Status</DialogTitle>
            <DialogDescription>
              Change the status of this crime report.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as 'open' | 'investigating' | 'resolved')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
