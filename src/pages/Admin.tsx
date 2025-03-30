
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Users, 
  Database, 
  Shield, 
  Settings, 
  PlusCircle, 
  Edit, 
  Trash2, 
  EyeIcon, 
  Brain,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Mock users for user management tab
const initialUsers = [
  { id: '1', name: 'Admin User', email: 'admin@predicti.crime', role: 'admin', status: 'active' },
  { id: '2', name: 'Police Officer', email: 'officer@predicti.crime', role: 'law_enforcement', status: 'active' },
  { id: '3', name: 'Public User', email: 'public@predicti.crime', role: 'public', status: 'active' },
  { id: '4', name: 'Detective Smith', email: 'smith@predicti.crime', role: 'law_enforcement', status: 'active' },
  { id: '5', name: 'Data Analyst', email: 'analyst@predicti.crime', role: 'admin', status: 'inactive' },
];

// Mock models for model management tab
const initialModels = [
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
  const [users, setUsers] = useState(initialUsers);
  const [models, setModels] = useState(initialModels);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  
  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // User CRUD Operations
  const handleAddUser = (userData: any) => {
    const newUser = {
      id: (users.length + 1).toString(),
      ...userData
    };
    setUsers([...users, newUser]);
    toast({
      title: "User Added",
      description: `${userData.name} has been added successfully.`,
    });
  };

  const handleUpdateUser = (userData: any) => {
    const updatedUsers = users.map(u => u.id === userData.id ? userData : u);
    setUsers(updatedUsers);
    toast({
      title: "User Updated",
      description: `${userData.name}'s information has been updated.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;
    
    if (userToDelete.role === 'admin' && userToDelete.status === 'active') {
      // Count active admins
      const activeAdmins = users.filter(u => u.role === 'admin' && u.status === 'active').length;
      if (activeAdmins <= 1) {
        toast({
          title: "Cannot Delete User",
          description: "Cannot delete the last active admin user.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: `The user has been removed from the system.`,
    });
  };

  // Model CRUD Operations
  const handleAddModel = (modelData: any) => {
    const newModel = {
      id: (models.length + 1).toString(),
      lastTrained: new Date().toISOString().split('T')[0],
      ...modelData
    };
    setModels([...models, newModel]);
    toast({
      title: "Model Added",
      description: `${modelData.name} has been added successfully.`,
    });
  };

  const handleUpdateModel = (modelData: any) => {
    const updatedModels = models.map(m => m.id === modelData.id ? modelData : m);
    setModels(updatedModels);
    toast({
      title: "Model Updated",
      description: `${modelData.name} has been updated.`,
    });
  };

  const handleDeleteModel = (modelId: string) => {
    setModels(models.filter(m => m.id !== modelId));
    toast({
      title: "Model Deleted",
      description: `The model has been removed from the system.`,
    });
  };

  const handleTrainModel = (modelId: string) => {
    setIsTrainingModel(true);
    
    // Simulate training delay
    setTimeout(() => {
      const updatedModels = models.map(m => {
        if (m.id === modelId) {
          const newAccuracy = Math.min(99.9, m.accuracy + (Math.random() * 2));
          return {
            ...m,
            accuracy: parseFloat(newAccuracy.toFixed(1)),
            lastTrained: new Date().toISOString().split('T')[0]
          };
        }
        return m;
      });
      
      setModels(updatedModels);
      setIsTrainingModel(false);
      
      toast({
        title: "Model Training Complete",
        description: `The model has been trained successfully.`,
      });
    }, 3000);
  };

  // Data Management functions
  const handleBackup = () => {
    toast({
      title: "Backup Created",
      description: "Database backup has been created successfully.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "System cache has been cleared successfully.",
    });
  };

  // System security functions
  const handleRunAudit = () => {
    toast({
      title: "Security Audit Started",
      description: "Security audit is now running. You'll be notified once complete.",
    });
    
    setTimeout(() => {
      toast({
        title: "Security Audit Complete",
        description: "No security vulnerabilities found.",
      });
    }, 3000);
  };

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <UserForm onSubmit={handleAddUser} />
                </DialogContent>
              </Dialog>
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
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => {
                                setSelectedUser(user);
                                setIsViewMode(false);
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <UserForm user={selectedUser} onSubmit={handleUpdateUser} />
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive" onClick={() => setSelectedUser(user)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete User</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p>Are you sure you want to delete user "{selectedUser?.name}"?</p>
                                <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    handleDeleteUser(selectedUser?.id);
                                    document.querySelector('[data-dialog-close]')?.click();
                                  }}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => {
                                setSelectedUser(user);
                                setIsViewMode(true);
                              }}>
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <div className="font-medium">{selectedUser.name}</div>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <div className="font-medium">{selectedUser.email}</div>
                                    </div>
                                    <div>
                                      <Label>Role</Label>
                                      <div>{getRoleBadge(selectedUser.role)}</div>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <div>{getStatusBadge(selectedUser.status)}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button>Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Records Management",
                          description: "Navigating to crime records management.",
                        });
                      }}>Manage</Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Import Started",
                          description: "Crime records import process has begun.",
                        });
                      }}>Import</Button>
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
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Data Sources",
                          description: "Navigating to data sources management.",
                        });
                      }}>Manage</Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "New Data Source",
                          description: "Add a new data source to the system.",
                        });
                      }}>Add New</Button>
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
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Backup History",
                          description: "Viewing system backup history.",
                        });
                      }}>View</Button>
                      <Button variant="outline" size="sm" onClick={handleBackup}>Backup Now</Button>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Model
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Model</DialogTitle>
                  </DialogHeader>
                  <ModelForm onSubmit={handleAddModel} />
                </DialogContent>
              </Dialog>
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
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell>{model.type}</TableCell>
                      <TableCell>{model.accuracy}%</TableCell>
                      <TableCell>{model.lastTrained}</TableCell>
                      <TableCell>{getStatusBadge(model.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => {
                                setSelectedModel(model);
                                setIsViewMode(true);
                              }}>
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Model Details</DialogTitle>
                              </DialogHeader>
                              {selectedModel && (
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <div className="font-medium">{selectedModel.name}</div>
                                    </div>
                                    <div>
                                      <Label>Type</Label>
                                      <div className="font-medium">{selectedModel.type}</div>
                                    </div>
                                    <div>
                                      <Label>Accuracy</Label>
                                      <div className="font-medium">{selectedModel.accuracy}%</div>
                                    </div>
                                    <div>
                                      <Label>Last Trained</Label>
                                      <div className="font-medium">{selectedModel.lastTrained}</div>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <div>{getStatusBadge(selectedModel.status)}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Performance Metrics</Label>
                                    <div className="mt-2 p-4 border rounded-md bg-muted">
                                      <p><strong>Precision:</strong> {(selectedModel.accuracy * 0.98).toFixed(1)}%</p>
                                      <p><strong>Recall:</strong> {(selectedModel.accuracy * 0.96).toFixed(1)}%</p>
                                      <p><strong>F1 Score:</strong> {(selectedModel.accuracy * 0.97).toFixed(1)}%</p>
                                      <p><strong>Training Time:</strong> {Math.floor(Math.random() * 60) + 30} minutes</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button>Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedModel(model)}>
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Model</DialogTitle>
                              </DialogHeader>
                              {selectedModel && (
                                <ModelForm model={selectedModel} onSubmit={handleUpdateModel} />
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-primary"
                            onClick={() => handleTrainModel(model.id)}
                            disabled={isTrainingModel}
                          >
                            {isTrainingModel ? 'Training...' : 'Train'}
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive" onClick={() => setSelectedModel(model)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Model</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p>Are you sure you want to delete the model "{selectedModel?.name}"?</p>
                                <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    handleDeleteModel(selectedModel?.id);
                                    document.querySelector('[data-dialog-close]')?.click();
                                  }}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Security Logs",
                          description: "Viewing security audit logs.",
                        });
                      }}>View Logs</Button>
                      <Button variant="outline" size="sm" onClick={handleRunAudit}>Run Audit</Button>
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
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Access Policies",
                          description: "Viewing system access policies.",
                        });
                      }}>View</Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Configure Policies",
                          description: "Configuring system access policies.",
                        });
                      }}>Configure</Button>
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
          
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Manage system maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Backup Database</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                      Last backup: May 23, 2023, 03:45 AM
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleBackup}>Create Backup</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Clear Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                      Cache size: 256 MB
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleClearCache}>Clear Cache</Button>
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
