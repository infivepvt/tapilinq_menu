import { useState } from 'react';
import { users, User } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { 
  Search, 
  X, 
  Plus, 
  Pencil, 
  Trash2, 
  UserCheck,
  Mail,
  User as UserIcon,
  Users as UsersIcon,
  Key
} from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'waiter',
    password: '',
  });
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'waiter',
      password: '',
    });
    setShowModal(true);
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to add or update the user
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage staff accounts and permissions</p>
        </div>
        
        <Button 
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleAddUser}
        >
          Add New User
        </Button>
      </div>

      {/* Search box */}
      <div className="max-w-md">
        <Input
          placeholder="Search users..."
          leftIcon={<Search className="h-4 w-4" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          rightIcon={
            searchTerm ? (
              <button onClick={() => setSearchTerm('')}>
                <X className="h-4 w-4" />
              </button>
            ) : undefined
          }
        />
      </div>

      {/* Users list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="bg-primary/10 h-20"></div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center -mt-12 mb-4">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-16 w-16 rounded-full border-4 border-card object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full border-4 border-card bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <h3 className="mt-2 text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
                <Badge 
                  variant={user.role === 'admin' ? 'primary' : user.role === 'cashier' ? 'warning' : 'success'}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button 
                  size="sm"
                  variant="outline"
                  leftIcon={<Pencil className="h-3.5 w-3.5" />}
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </Button>
                {user.role !== 'admin' && (
                  <Button 
                    size="sm"
                    variant="outline"
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div 
            className="fixed inset-0"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative rounded-lg bg-card shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  leftIcon={<UserIcon className="h-4 w-4" />}
                />
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                    </div>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'cashier' | 'waiter' })}
                      className="flex h-9 w-full rounded-md border border-input bg-background pl-10 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="cashier">Cashier</option>
                      <option value="waiter">Waiter</option>
                    </select>
                  </div>
                </div>
                
                <Input
                  label={editingUser ? "New Password (leave empty to keep current)" : "Password"}
                  type="password"
                  placeholder={editingUser ? "••••••••" : "Create a password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  leftIcon={<Key className="h-4 w-4" />}
                />
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" leftIcon={<UserCheck className="h-4 w-4" />}>
                    {editingUser ? 'Update User' : 'Add User'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;