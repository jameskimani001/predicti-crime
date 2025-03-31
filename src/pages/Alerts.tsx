
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCrimeData } from '@/contexts/CrimeDataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Bell, Map, Clock, CheckCircle, Eye } from 'lucide-react';
import { Navigate } from 'react-router-dom';

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
  const { notifications, markNotificationAsRead } = useCrimeData();
  
  // Redirect if not law enforcement
  if (!user || (user.role !== 'law_enforcement' && user.role !== 'admin')) {
    return <Navigate to="/" />;
  }

  // Filter alerts by read status
  const unreadNotifications = notifications.filter(notification => !notification.isRead);
  
  // Get priority badge for notification
  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'new_report':
        return <Badge className="bg-crime-veryhigh">New Report</Badge>;
      case 'status_change':
        return <Badge className="bg-crime-medium">Status Change</Badge>;
      case 'system':
        return <Badge className="bg-crime-low">System</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

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
            <AlertTriangle className="h-4 w-4 mr-2" /> New Alerts ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" /> All Alerts ({notifications.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="space-y-4">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium">No new alerts</p>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            unreadNotifications.map((notification) => (
              <Card key={notification.id} className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-crime-veryhigh"></div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{notification.title}</h2>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDate(notification.timestamp)}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      {getNotificationBadge(notification.type)}
                    </div>
                  </div>
                  
                  <p className="mb-4">{notification.message}</p>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
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
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-muted-foreground">You don't have any notifications yet</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={`relative overflow-hidden ${notification.isRead ? 'opacity-80' : ''}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-crime-veryhigh"></div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center">
                        <h2 className="text-xl font-semibold">{notification.title}</h2>
                        {notification.isRead && (
                          <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDate(notification.timestamp)}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      {getNotificationBadge(notification.type)}
                    </div>
                  </div>
                  
                  <p className="mb-4">{notification.message}</p>
                  
                  <div className="flex justify-end">
                    {!notification.isRead ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> Mark as Read
                      </Button>
                    ) : null}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;
