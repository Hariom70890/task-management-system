import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser, logoutUser } from "../../services/userServices";
import { getTask, createTask, deleteTask } from "../../services/taskService";
import { Users, LogOut, PlusCircle, Home, ClipboardList } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {useNavigate} from "react-router-dom";

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      active
        ? "bg-white text-black font-bold"
        : "hover:bg-gray-700 text-gray-300"
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const UsersTable = ({ users, onDelete }) => (
  <div className="overflow-x-auto bg-gray-900 shadow-md rounded-lg">
    <table className="w-full border-collapse text-gray-300">
      <thead className="bg-gray-700 text-gray-300">
        <tr>
          <th className="px-6 py-3 text-left">Name</th>
          <th className="px-6 py-3 text-left">Email</th>
          <th className="px-6 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {users.map((user) => (
          <tr key={user._id} className="hover:bg-gray-700">
            <td className="px-6 py-4">{user.name}</td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4 text-right">
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-600 text-white"
                onClick={() => onDelete(user._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
  </div>
);

const TasksTable = ({ tasks, onDelete }) => (
  <div className="overflow-x-auto bg-gray-900 shadow-md rounded-lg">
    <table className="w-full border-collapse text-gray-300">
      <thead className="bg-gray-700 text-gray-300">
        <tr>
          <th className="px-6 py-3 text-left">Title</th>
          <th className="px-6 py-3 text-left">Description</th>
          <th className="px-6 py-3 text-left">Priority</th>
          <th className="px-6 py-3 text-left">Assigned To</th>
          <th className="px-6 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {tasks.map((task) => (
          <tr key={task._id} className="hover:bg-gray-700">
            <td className="px-6 py-4 font-medium">{task.title}</td>
            <td className="px-6 py-4">{task.description}</td>
            <td className="px-6 py-4">
              <span className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="capitalize">{task.priority}</span>
              </span>
            </td>
            <td className="px-6 py-4">
              {task.assignedTo?.name || "Unassigned"}
            </td>
            <td className="px-6 py-4 text-right">
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-600 text-white"
                onClick={() => onDelete(task._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CreateTaskForm = ({ users, onSubmit }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "low",
    assignedTo: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newTask);
    setNewTask({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      priority: "low",
      assignedTo: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-300">
      <Input
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        required
        className="bg-gray-800 text-white"
      />
      <Textarea
        placeholder="Task Description"
        value={newTask.description}
        onChange={(e) =>
          setNewTask({ ...newTask, description: e.target.value })
        }
        required
        className="bg-gray-800 text-white"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          value={newTask.startDate}
          onChange={(e) =>
            setNewTask({ ...newTask, startDate: e.target.value })
          }
          required
          className="bg-gray-800 text-white"
        />
        <Input
          type="date"
          value={newTask.endDate}
          onChange={(e) =>
            setNewTask({ ...newTask, endDate: e.target.value })
          }
          required
          className="bg-gray-800 text-white"
        />
      </div>
      <Select
        value={newTask.priority}
        onValueChange={(value) =>
          setNewTask({ ...newTask, priority: value })
        }
      >
        <SelectTrigger className="bg-gray-800 text-white">
          <SelectValue placeholder="Select Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={newTask.assignedTo}
        onValueChange={(value) =>
          setNewTask({ ...newTask, assignedTo: value })
        }
      >
        <SelectTrigger className="bg-gray-800 text-white">
          <SelectValue placeholder="Assign To" />
        </SelectTrigger>
        <SelectContent>
          {users?.map((user) => (
            <SelectItem key={user._id} value={user._id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="submit"
        className="w-full bg-green-600 text-white hover:bg-green-700"
      >
        Create Task
      </Button>
    </form>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, tasksResponse] = await Promise.all([
        getAllUsers(),
        getTask(),
      ]);
      setUsers(usersResponse.users);
      setTasks(tasksResponse.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      fetchData();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        fetchData();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        fetchData();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{users.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{tasks.length}</p>
              </CardContent>
            </Card>
          </div>
        );
      case "users":
        return <UsersTable users={users} onDelete={handleDeleteUser} />;
      case "tasks":
        return <TasksTable tasks={tasks} onDelete={handleDeleteTask} />;
      case "create-task":
        return <CreateTaskForm users={users} onSubmit={handleCreateTask} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <aside className="w-64 bg-gray-800">
        <div className="p-4">
          <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
          <nav className="mt-6 space-y-4">
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
              icon={LogOut}
              label="Logout"
              onClick={() => {
                logoutUser() 
                setActiveTab( "dashboard" );
                navigate('/login')
              }}
            />
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
