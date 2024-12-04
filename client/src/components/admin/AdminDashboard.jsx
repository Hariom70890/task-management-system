import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser, logoutUser, registerUser, createUser } from '../../services/userServices';
import { getTask, createTask, deleteTask } from '../../services/taskService';
import { Users, LogOut, PlusCircle, Home, ClipboardList, Bell, Settings, Search, Calendar,Trash2 } from 'lucide-react';
import {Paper, InputBase, Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Chip, IconButton, Container, Box, MenuItem,TextField,FormControl,InputLabel,Select,Button
} from '@mui/material'; 
import CreateTaskForm from './CreateTaskForm';
import Swal from 'sweetalert2'
import TasksTable from './TaskTable';
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState( [] );
  const [page, setPage] = useState(1);
const rowsPerPage = 10;
  const [paginationInfo, setPaginationInfo] = useState({
  currentPage: 1,
  totalPages: 1,
  totalTasks: 0
}); 
   const [notifications] = useState([
    { id: 1, message: "New user registration", time: "2 mins ago" },
    { id: 2, message: "Task deadline approaching", time: "5 mins ago" },
    { id: 3, message: "System update completed", time: "10 mins ago" }
  ]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const [usersResponse, tasksResponse] = await Promise.all([
        getAllUsers(),
       getTask(page, rowsPerPage),
      ] );
      console.log("task:-",tasksResponse)
      setUsers(usersResponse.users);
      setTasks( tasksResponse.tasks );
      setPaginationInfo(tasksResponse.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Typography color="textSecondary" gutterBottom>{title}</Typography>
            <Typography variant="h4" style={{ color }}>{value}</Typography>
          </div>
          <Icon className="w-12 h-12 opacity-20" style={{ color }} />
        </div>
      </CardContent>
    </Card>
  );

  const NotificationPanel = () => (
    <Paper className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6">Recent Notifications</Typography>
        <Bell className="w-5 h-5 text-gray-400" />
      </div>
      <List>
        {notifications.map(notification => (
          <React.Fragment key={notification.id}>
            <ListItem>
              <ListItemText 
                primary={notification.message}
                secondary={notification.time}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  const SearchBar = () => (
    <Paper className="flex items-center w-full px-4 mb-6">
      <Search className="text-gray-400 w-5 h-5" />
      <InputBase
        placeholder="Search users, tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="ml-2 flex-1"
      />
    </Paper>
  );

 const handleCreateTask = async (taskData) => {
  try {
    await createTask(taskData);
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "Task has been successfully created!",
      showConfirmButton: false,
      timer: 1500,
    });
    fetchData();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while creating the task.",
      footer: "Please try again or contact support if the issue persists.",
    });
    console.error("Error creating task:", error);
  }
};

const handleDeleteUser = async (userId) => {
  const confirmDelete = await Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: "This action will permanently delete the user.",
    showCancelButton: true,
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "No, cancel",
  });

  if (confirmDelete.isConfirmed) {
    try {
      await deleteUser(userId);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "User deleted successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting the user.",
        footer: "Please try again or contact support if the issue persists.",
      });
      console.error("Error deleting user:", error);
    }
  }
};

const handleDeleteTask = async (taskId) => {
  const confirmDelete = await Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: "This action will permanently delete the task.",
    showCancelButton: true,
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "No, cancel",
  });

  if (confirmDelete.isConfirmed) {
    try {
      await deleteTask(taskId);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Task deleted successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting the task.",
        footer: "Please try again or contact support if the issue persists.",
      });
      console.error("Error deleting task:", error);
    }
  }
};


  const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
    <div
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer transition-colors ${
        active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

const UsersTable = ({ users, onDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Tasks</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id} hover>
            <TableCell>{user?.name}</TableCell>
            <TableCell>{user?.email}</TableCell>
            <TableCell>{user?.tasks?.length}</TableCell>
            <TableCell align="right">
              <IconButton 
                color="error" 
                onClick={() => onDelete(user._id)}
                size="small"
              >
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );
  
  const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}; 

  const CreateUserForm = ({ onSuccess }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser( userData )
      console.log("response:-",response)
      if ( response.status!==201) throw new Error( response.data.message ); 
      Swal.fire( {
        title: 'User created successfully',
        icon: 'success', 
      })
      setUserData({ name: '', email: '', password: '', role: 'user' });
      if (onSuccess) onSuccess();
    } catch ( err ) {
      Swal.fire( {
        title: 'Error',
        text: err.message,
        icon: 'error', 
      })
      setError(err.message);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              required
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <select
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transform transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <SearchBar />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard title="Total Users" value={users.length} icon={Users} color="#3B82F6" />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard title="Total Tasks" value={tasks.length} icon={ClipboardList} color="#10B981" />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard title="Active Projects" value="12" icon={Calendar} color="#F59E0B" />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard title="Completed Tasks" value="45" icon={PlusCircle} color="#6366F1" />
              </Grid>
            </Grid>
            <Grid container spacing={3} className="mt-6">
              <Grid item xs={12} lg={6}>
                <Paper className="p-6">
                  <Typography variant="h6" gutterBottom>Task Priority Distribution</Typography>
                  <div className="h-64">
                    {/* Chart placeholder - implement with recharts */}
                    <Typography color="textSecondary">Chart will be displayed here</Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} lg={6}>
                <NotificationPanel />
              </Grid>
            </Grid>
          </div>
        );
      case "users":
        return <UsersTable users={users} onDelete={handleDeleteUser} />;
      case "tasks":
        return <TasksTable
  tasks={tasks}
  onDelete={handleDeleteTask}
  totalTasks={paginationInfo.totalTasks}
  page={page}
  setPage={setPage}
  rowsPerPage={rowsPerPage}
/>;
      case "create-task":
        return <CreateTaskForm users={users} onSubmit={handleCreateTask} />;
      case "create-user":
        return <CreateUserForm onSuccess={fetchData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Paper className="w-64" elevation={3}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <Typography variant="h6">Admin Portal</Typography>
          </div>
          <List>
            <SidebarLink
              icon={Home}
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <SidebarLink
              icon={Users}
              label="Users"
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
            />
            <SidebarLink
              icon={ClipboardList}
              label="Tasks"
              active={activeTab === "tasks"}
              onClick={() => setActiveTab("tasks")}
            />
            <SidebarLink
              icon={PlusCircle}
              label="Create Task"
              active={activeTab === "create-task"}
              onClick={() => setActiveTab("create-task")}
            />
            <SidebarLink
              icon={PlusCircle}
              label="Create User"
              active={activeTab === "create-user"}
              onClick={() => setActiveTab("create-user")}
            />
            <SidebarLink
              icon={LogOut}
              label="Logout"
              onClick={() => {
                logoutUser();
                navigate('/login');
              }}
            />
          </List>
        </div>
      </Paper>
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;