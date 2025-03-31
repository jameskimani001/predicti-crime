
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Users, 
  MoreHorizontal, 
  Plus, 
  Brain, 
  Trash, 
  Edit, 
  Filter 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import UserForm from '@/components/UserForm';
import ModelForm from '@/components/ModelForm';

// Mock users for user management tab
const initialUsers = [
  {
    id: '1',
    name: 'John Kamau',
    email: 'john.kamau@example.com',
    role: 'admin',
    status: 'active'
  },
  {
    id: '2',
    name: 'Wanjiru Njeri',
    email: 'wanjiru@example.com',
    role: 'law_enforcement',
    status: 'active'
  },
  {
    id: '3',
    name: 'David Omondi',
    email: 'david@example.com',
    role: 'public',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Grace Wangari',
    email: 'grace@example.com',
    role: 'law_enforcement',
    status: 'active'
  },
  {
    id: '5',
    name: 'James Mwangi',
    email: 'james@example.com',
    role: 'public',
    status: 'active'
  }
];

// Mock models for the ML models tab
const initialModels = [
  {
    id: '1',
    name: 'Nairobi Crime Predictor',
    type: 'Classification',
    accuracy: 87.5,
    lastTrained: '2023-04-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Hotspot Detector v2',
    type: 'Clustering',
    accuracy: 82.3,
    lastTrained: '2023-03-28',
    status: 'active'
  },
  {
    id: '3',
    name: 'Carjacking Risk Analyzer',
    type: 'Regression',
    accuracy: 79.8,
    lastTrained: '2023-05-02',
    status: 'development'
  },
  {
    id: '4',
    name: 'Seasonal Crime Forecaster',
    type: 'Time Series',
    accuracy: 85.1,
    lastTrained: '2023-04-10',
    status: 'inactive'
  }
];

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(initialUsers);
  const [models, setModels] = useState(initialModels);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modelTypeFilter, setModelTypeFilter] = useState('all');
  const [modelStatusFilter, setModelStatusFilter] = useState('all');

  // If not admin, redirect
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to access the admin panel.</p>
      </div>
    );
  }

  // User CRUD operations
  const handleAddUser = (userData: any) => {
    const newUser = {
      ...userData,
      id: (users.length + 1).toString() // Generate simple ID (in real app, would come from backend)
    };
    
    setUsers([...users, newUser]);
    
    toast({
      title: 'User Added',
      description: `${newUser.name} has been added successfully.`,
    });
  };

  const handleUpdateUser = (userData: any) => {
    setUsers(users.map(user => 
      user.id === userData.id ? userData : user
    ));
    
    toast({
      title: 'User Updated',
      description: `${userData.name}'s information has been updated.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: 'User Deleted',
      description: 'The user has been deleted from the system.',
    });
  };

  // Model CRUD operations
  const handleAddModel = (modelData: any) => {
    const newModel = {
      ...modelData,
      id: (models.length + 1).toString() // Generate simple ID
    };
    
    setModels([...models, newModel]);
    
    toast({
      title: 'Model Added',
      description: `${newModel.name} has been added to the system.`,
    });
  };

  const handleUpdateModel = (modelData: any) => {
    setModels(models.map(model => 
      model.id === modelData.id ? modelData : model
    ));
    
    toast({
      title: 'Model Updated',
      description: `${modelData.name} has been updated.`,
    });
  };

  const handleDeleteModel = (modelId: string) => {
    setModels(models.filter(model => model.id !== modelId));
    
    toast({
      title: 'Model Deleted',
      description: 'The model has been removed from the system.',
    });
  };

  // Filter users based on selected filters
  const filteredUsers = users.filter(user => {
    return (roleFilter === 'all' || user.role === roleFilter) &&
           (statusFilter === 'all' || user.status === statusFilter);
  });

  // Filter models based on selected filters
  const filteredModels = models.filter(model => {
    return (modelTypeFilter === 'all' || model.type === modelTypeFilter) &&
           (modelStatusFilter === 'all' || model.status === modelStatusFilter);
  });

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-red-500">Admin</Badge>;
      case 'law_enforcement':
        return <Badge variant="default" className="bg-blue-500">Law Enforcement</Badge>;
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
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="default" className="bg-gray-500">Inactive</Badge>;
      case 'development':
        return <Badge variant="default" className="bg-yellow-500">Development</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage users, predictive models, and system settings
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center">
            <Brain className="h-4 w-4 mr-2" /> Predictive Models
          </TabsTrigger>
        </TabsList>
        
        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" /> Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Fill out the form below to add a new user to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <UserForm onSubmit={handleAddUser} />
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Manage user accounts and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div>
                  <Label htmlFor="role-filter">Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="law_enforcement">Law Enforcement</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="md:self-end">
                  <Filter className="h-4 w-4 mr-2" /> Apply Filters
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No users found matching the selected filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => {
                                      e.preventDefault();
                                      setEditingUser(user);
                                    }}>
                                      <Edit className="h-4 w-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit User</DialogTitle>
                                      <DialogDescription>
                                        Update user information and permissions.
                                      </DialogDescription>
                                    </DialogHeader>
                                    {editingUser && (
                                      <UserForm user={editingUser} onSubmit={handleUpdateUser} />
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                      <Trash className="h-4 w-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this user? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Predictive Models Tab */}
        <TabsContent value="models">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Predictive Models</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" /> Add Model
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Model</DialogTitle>
                      <DialogDescription>
                        Add details of a new predictive model to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <ModelForm onSubmit={handleAddModel} />
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Manage machine learning models for crime prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div>
                  <Label htmlFor="model-type-filter">Model Type</Label>
                  <Select value={modelTypeFilter} onValueChange={setModelTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Classification">Classification</SelectItem>
                      <SelectItem value="Clustering">Clustering</SelectItem>
                      <SelectItem value="Regression">Regression</SelectItem>
                      <SelectItem value="Time Series">Time Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model-status-filter">Status</Label>
                  <Select value={modelStatusFilter} onValueChange={setModelStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="development">In Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="md:self-end">
                  <Filter className="h-4 w-4 mr-2" /> Apply Filters
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Last Trained</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModels.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No models found matching the selected filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredModels.map((model) => (
                        <TableRow key={model.id}>
                          <TableCell>{model.name}</TableCell>
                          <TableCell>{model.type}</TableCell>
                          <TableCell>{model.accuracy}%</TableCell>
                          <TableCell>{new Date(model.lastTrained).toLocaleDateString('en-KE')}</TableCell>
                          <TableCell>{getStatusBadge(model.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => {
                                      e.preventDefault();
                                      setEditingModel(model);
                                    }}>
                                      <Edit className="h-4 w-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Model</DialogTitle>
                                      <DialogDescription>
                                        Update model information and settings.
                                      </DialogDescription>
                                    </DialogHeader>
                                    {editingModel && (
                                      <ModelForm model={editingModel} onSubmit={handleUpdateModel} />
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                      <Trash className="h-4 w-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Model</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this model? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteModel(model.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
