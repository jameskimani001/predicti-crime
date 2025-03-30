
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Bell, Map, Clock, CheckCircle, Eye } from 'lucide-react';
import { Navigate } from 'react-router-dom';

// Mock alerts data
const mockAlerts = [
  {
    id: '1',
    title: 'Significant crime increase in Downtown',
    location: 'Downtown District',
    timestamp: '2023-05-25T14:30:00',
    priority: 'high',
    status: 'new',
    description: 'There has been a 30% increase in theft incidents in the downtown area over the past 48 hours.'
  },
  {
    id: '2',
    title: 'New crime pattern detected',
    location: 'Residential Area North',
    timestamp: '2023-05-24T10:15:00',
    priority: 'medium',
    status: 'new',
    description: 'A new pattern of car break-ins has been detected in the northern residential area.'
  },
  {
    id: '3',
    title: 'Monthly crime report generated',
    location: 'System-wide',
    timestamp: '2023-05-23T08:00:00',
    priority: 'low',
    status: 'read',
    description: 'The monthly crime statistics report for April 2023 has been generated and is ready for review.'
  },
  {
    id: '4',
    title: 'Potential drug activity hotspot',
    location: 'Park District',
    timestamp: '2023-05-22T22:45:00',
    priority: 'high',
    status: 'read',
    description: 'Multiple reports of suspicious activity indicate a potential drug dealing hotspot forming in the central park area.'
  },
  {
    id: '5',
    title: 'Prediction model accuracy improved',
    location: 'System-wide',
    timestamp: '2023-05-21T16:20:00',
    priority: 'medium',
    status: 'read',
    description: 'The crime prediction model has been retrained with new data, resulting in a 5% improvement in accuracy.'
  }
];

// Get priority badge
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge className="bg-crime-veryhigh">High Priority</Badge>;
    case 'medium':
      return <Badge className="bg-crime-medium">Medium Priority</Badge>;
    case 'low':
      return <Badge className="bg-crime-low">Low Priority</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Alerts: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not law enforcement
  if (!user || (user.role !== 'law_enforcement' && user.role !== 'admin')) {
    return <Navigate to="/" />;
  }

  // Filter alerts by status
  const newAlerts = mockAlerts.filter(alert => alert.status === 'new');
  const readAlerts = mockAlerts.filter(alert => alert.status === 'read');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
        <p className="text-muted-foreground">
          Monitor important alerts and notifications about crime activities
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Alert Settings</CardTitle>
          <CardDescription>Configure your alert preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive alerts via email</div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-muted-foreground">Receive alerts via SMS</div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-muted-foreground">Receive in-app push alerts</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="new">
        <TabsList className="mb-4">
          <TabsTrigger value="new" className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" /> New Alerts ({newAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" /> All Alerts ({mockAlerts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="space-y-4">
          {newAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium">No new alerts</p>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            newAlerts.map((alert) => (
              <Card key={alert.id} className="relative overflow-hidden">
                {alert.priority === 'high' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-crime-veryhigh"></div>
                )}
                {alert.priority === 'medium' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-crime-medium"></div>
                )}
                {alert.priority === 'low' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-crime-low"></div>
                )}
                
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{alert.title}</h2>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Map className="h-4 w-4 mr-1" />
                        <span>{alert.location}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDate(alert.timestamp)}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      {getPriorityBadge(alert.priority)}
                    </div>
                  </div>
                  
                  <p className="mb-4">{alert.description}</p>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" /> Mark as Read
                    </Button>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {mockAlerts.map((alert) => (
            <Card key={alert.id} className={`relative overflow-hidden ${alert.status === 'read' ? 'opacity-80' : ''}`}>
              {alert.priority === 'high' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-crime-veryhigh"></div>
              )}
              {alert.priority === 'medium' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-crime-medium"></div>
              )}
              {alert.priority === 'low' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-crime-low"></div>
              )}
              
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold">{alert.title}</h2>
                      {alert.status === 'read' && (
                        <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Map className="h-4 w-4 mr-1" />
                      <span>{alert.location}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(alert.timestamp)}</span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    {getPriorityBadge(alert.priority)}
                  </div>
                </div>
                
                <p className="mb-4">{alert.description}</p>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;
