import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Container,
  Modal,
  Select,
  MenuItem,
  LinearProgress,
  CircularProgress,
  Chip,
  AppBar,
  Toolbar,
  Stack,
  FormControl,
  styled
} from '@mui/material';
import { CheckCircle, Clock, AlertTriangle, CheckSquare, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserTasks, updateTask } from '../../services/taskService';
import { logoutUser } from '../../services/userServices';
import Swal from 'sweetalert2';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const ModalContent = styled(Paper)({
  padding: 24,
  maxWidth: 400,
  width: '90%'
});

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
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
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    try {
      await updateTask( taskId, {status: updatedStatus} );
      Swal.fire( {
        title: 'Task updated successfully',
        icon: 'success',
        timer: 2000,
        
      })
      await fetchUserTasks();
      setIsOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckSquare color="green" />;
      case 'inprogress':
        return <Clock color="blue" />;
      default:
        return <AlertTriangle color="orange" />;
    }
  };

  const getTaskProgress = (task) => {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const today = new Date();
    const total = end - start;
    const progress = today - start;
    return Math.min(Math.max((progress / total) * 100, 0), 100);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'success';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'inprogress': return 'primary';
      default: return 'warning';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
            <CheckCircle size={32} />
            <Typography variant="h5">Task Management</Typography>
          </Stack>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogOut />}
            onClick={() => {
              logoutUser();
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Timeline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id} hover>
                    <TableCell>
                      <Typography fontWeight="medium">{task.title}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography noWrap>{task.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority}
                        color={getPriorityColor(task.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Calendar size={16} />
                          <Typography variant="body2">
                            {new Date(task.startDate).toLocaleDateString()} - 
                            {new Date(task.endDate).toLocaleDateString()}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={getTaskProgress(task)}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {getStatusIcon(task.status)}
                        <Chip
                          label={task.status}
                          color={getStatusColor(task.status)}
                          size="small"
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setTaskId(task._id);
                          setIsOpen(true);
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <StyledModal open={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Update Task Status</Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Select
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="InProgress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" onClick={handleUpdateTask}>
              Update
            </Button>
            <Button variant="outlined" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </Stack>
        </ModalContent>
      </StyledModal>
    </Box>
  );
};

export default UserDashboard;