import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CreateTaskForm = ({ users, onSubmit }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    priority: "low",
    assignedTo: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newTask);
    setNewTask({
      title: "",
      description: "",
      startDate: null,
      endDate: null,
      priority: "low",
      assignedTo: "",
    });
  };

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Create New Task
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                required
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={newTask.startDate}
                  onChange={(date) => {
                    setNewTask({ 
                      ...newTask, 
                      startDate: date,
                      // Reset endDate if it's before the new startDate
                      endDate: newTask.endDate && date > newTask.endDate ? null : newTask.endDate
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                  minDate={today}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={newTask.endDate}
                  onChange={(date) => setNewTask({ ...newTask, endDate: date })}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                  minDate={newTask.startDate || today}
                  disabled={!newTask.startDate}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTask.priority}
                  label="Priority"
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <MenuItem value="low">Low Priority</MenuItem>
                  <MenuItem value="medium">Medium Priority</MenuItem>
                  <MenuItem value="high">High Priority</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={newTask.assignedTo}
                  label="Assign To"
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {users?.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Create Task
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateTaskForm;