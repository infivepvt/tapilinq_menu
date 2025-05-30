import { useEffect, useState } from "react";
import { User } from "../data/mockData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
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
  Key,
} from "lucide-react";
import useGetUsers from "../hooks/useGetUsers";
import useAddUser from "../hooks/useAddUser";
import toast from "react-hot-toast";
import useEditUser from "../hooks/useEditUser";
import useDeleteUser from "../hooks/useDeleteUser";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "cashier",
    password: "",
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "cashier",
      password: "",
    });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setShowModal(true);
  };

  const { addUser } = useAddUser();
  const { editUser } = useEditUser();
  const { deleteUser } = useDeleteUser();
  const [reload, setReload] = useState(false);

  const handleDelete = async (id: any) => {
    try {
      await deleteUser(id);
      toast.success("User deleted");
      setReload(!reload);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      try {
        await editUser(formData, editingUser.id);
        toast.success("User updated");
        setReload(!reload);
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      try {
        await addUser(formData);
        toast.success("New user added");
        setReload(!reload);
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    // In a real app, this would call an API to add or update the user
    setShowModal(false);
  };

  const { getUsers } = useGetUsers();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, [reload]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage staff accounts and permissions
          </p>
        </div>

        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleAddUser}
          className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary-dark dark:text-primary-foreground dark:hover:bg-primary-dark/90"
        >
          Add New User
        </Button>
      </div>

      {/* Search box */}
      {/* <div className="max-w-md">
        <Input
          placeholder="Search users..."
          leftIcon={
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          rightIcon={
            searchTerm ? (
              <button onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            ) : undefined
          }
        />
      </div> */}

      {/* Users table */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Users List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover mr-2"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/20 dark:bg-primary-dark/20 flex items-center justify-center text-primary dark:text-primary-dark text-sm font-bold mr-2">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "primary"
                            : user.role === "cashier"
                            ? "warning"
                            : "success"
                        }
                        className={
                          user.role === "admin"
                            ? "bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground"
                            : user.role === "cashier"
                            ? "bg-warning dark:bg-warning-dark text-warning-foreground dark:text-warning-foreground"
                            : "bg-success dark:bg-success-dark text-success-foreground dark:text-success-foreground"
                        }
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {parseInt(user.id) !== 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Pencil className="h-3.5 w-3.5" />}
                            onClick={() => handleEditUser(user)}
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Edit
                          </Button>
                        )}
                        {user.role !== "admin" && (
                          <Button
                            onClick={() => handleDelete(user.id)}
                            size="sm"
                            variant="outline"
                            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70">
          <div
            className="fixed inset-0"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative rounded-lg bg-white dark:bg-gray-800 shadow-lg w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  leftIcon={
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  }
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  leftIcon={
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  }
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                      <UsersIcon className="h-4 w-4" />
                    </div>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as
                            | "admin"
                            | "cashier"
                            | "waiter",
                        })
                      }
                      className="flex h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 py-1 text-sm text-gray-900 dark:text-gray-100 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="cashier">Cashier</option>
                    </select>
                  </div>
                </div>

                <Input
                  label={
                    editingUser
                      ? "New Password (leave empty to keep current)"
                      : "Password"
                  }
                  type="password"
                  placeholder={editingUser ? "••••••••" : "Create a password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!editingUser}
                  leftIcon={
                    <Key className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  }
                  disabled={editingUser !== null}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    leftIcon={<UserCheck className="h-4 w-4" />}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary-dark dark:text-primary-foreground dark:hover:bg-primary-dark/90"
                  >
                    {editingUser ? "Update User" : "Add User"}
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
