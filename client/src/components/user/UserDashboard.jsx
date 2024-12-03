import React, { useState, useEffect } from 'react';
import { getUserTasks, updateTask } from '../../services/taskService';
import { logoutUser } from '../../services/userServices';
import { CheckCircle, Clock, AlertTriangle, CheckSquare, Calendar, LogOut } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    try {
      setLoading(true);
      const response = await getUserTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    try {
      await updateTask(taskId, { status: updatedStatus });
      await fetchUserTasks();
      togglePopup();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const togglePopup = () => setIsActive(!isActive);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckSquare className="w-4 h-4 text-green-500" />;
      case 'inprogress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTaskProgress = (task) => {
    const start = new Date(task.startdate);
    const end = new Date(task.enddate);
    const today = new Date();
    const total = end - start;
    const progress = today - start;
    const percentage = Math.min(Math.max((progress / total) * 100, 0), 100);
    return percentage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-blue-600 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Task Management
              </h1>
            </div>
            <button
              onClick={() => {
                logoutUser();
                navigate('/login')
              }
              }
              className="flex items-center space-x-2 px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transform hover:scale-105 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timeline</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{task.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(task.startdate).toLocaleDateString()} - {new Date(task.enddate).toLocaleDateString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${getTaskProgress(task)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                          task.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status.toLowerCase() === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getStatusIcon(task.status)}
                          <span>{task.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setTaskId(task._id);
                            togglePopup();
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {isActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-96 transform transition-all duration-300 scale-100">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Status</h2>
              <div className="mb-6">
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select status...</option>
                  <option value="Pending">Pending</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                  onClick={handleUpdateTask}
                >
                  Update
                </button>
                <button
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
                  onClick={togglePopup}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;