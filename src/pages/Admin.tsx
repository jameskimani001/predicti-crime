
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Database, 
  Shield, 
  Settings, 
  PlusCircle, 
  Edit, 
  Trash2, 
  EyeIcon, 
  Brain
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

// Mock users for user management tab
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@predicti.crime', role: 'admin', status: 'active' },
  { id: '2', name: 'Police Officer', email: 'officer@predicti.crime', role: 'law_enforcement', status: 'active' },
  { id: '3', name: 'Public User', email: 'public@predicti.crime', role: 'public', status: 'active' },
  { id: '4', name: 'Detective Smith', email: 'smith@predicti.crime', role: 'law_enforcement', status: 'active' },
  { id: '5', name: 'Data Analyst', email: 'analyst@predicti.crime', role: 'admin', status: 'inactive' },
];

// Mock models for model management tab
const mockModels = [
  { id: '1', name: 'Crime Type Classification', type: 'Classification', accuracy: 87.5, lastTrained: '2023-05-15', status: 'active' },
  { id: '2', name: 'Hotspot Detection', type: 'Clustering', accuracy: 92.3, lastTrained: '2023-05-18', status: 'active' },
  { id: '3', name: 'Crime Trend Forecasting', type: 'Time Series', accuracy: 81.9, lastTrained: '2023-05-12', status: 'active' },
  { id: '4', name: 'Offender Recidivism', type: 'Regression', accuracy: 79.2, lastTrained: '2023-05-01', status: 'inactive' },
  { id: '5', name: 'Suspect Profiling', type: 'Classification', accuracy: 84.5, lastTrained: '2023-04-28', status: 'development' },
];

// Get role badge
const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-crime-veryhigh">Admin</Badge>;
    case 'law_enforcement':
      return <Badge className="bg-primary">Law Enforcement</Badge>;
    case 'public':
      return <Badge variant="outline">Public</Badge>;
    default:
      return <Badge>{role}</Badge>;
  }
};

// Get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'inactive':
      return <Badge variant="outline">Inactive</Badge>;
    case 'development':
      return <Badge className="bg-yellow-500">In Development</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const Admin: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage users, data, and system settings
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" /> User Management
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center">
            <Database className="h-4 w-4 mr-2" /> Data Management
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center">
            <Brain className="h-4 w-4 mr-2" /> Model Management
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" /> System Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" /> Add User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage crime data, sources, and integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Crime Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">1,248</div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">Manage</Button>
                      <Button variant="outline" size="sm">Import</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Data Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">5</div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">Manage</Button>
                      <Button variant="outline" size="sm">Add New</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">System Backups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">12</div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Backup Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Model Management</CardTitle>
                <CardDescription>Manage AI prediction models</CardDescription>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Model
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Last Trained</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell>{model.type}</TableCell>
                      <TableCell>{model.accuracy}%</TableCell>
                      <TableCell>{model.lastTrained}</TableCell>
                      <TableCell>{getStatusBadge(model.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-primary">
                            Train
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Security</CardTitle>
              <CardDescription>Manage system security and access controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Security Audit Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">Last: 2h ago</div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">View Logs</Button>
                      <Button variant="outline" size="sm">Run Audit</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Access Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">3 Active</div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>All systems operational</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">API</p>
                        <p className="font-medium">Operational</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Database</p>
                        <p className="font-medium">Operational</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ML Pipeline</p>
                        <p className="font-medium">Operational</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Auth Service</p>
                        <p className="font-medium">Operational</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
