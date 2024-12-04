import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TablePagination
} from '@mui/material';
import { Trash2 } from 'lucide-react';

const TasksTable = ({ tasks, onDelete, totalTasks, page, setPage, rowsPerPage = 10 }) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1); // Adding 1 because MUI uses 0-based indexing but your API uses 1-based
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id} hover>
                <TableCell>{task.title}</TableCell>
                <TableCell sx={{ 
                  maxWidth: 200, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {truncateText(task.description, 100)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={task.priority}
                    size="small"
                    color={
                      task.priority === 'high' ? 'error' :
                      task.priority === 'medium' ? 'warning' : 'success'
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{task.assignedTo?.name || "Unassigned"}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="error" 
                    onClick={() => onDelete(task._id)}
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
      <TablePagination
        component="div"
        count={totalTasks}
        page={page - 1} // Subtracting 1 because MUI uses 0-based indexing
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]} // If you want to keep it fixed at 10
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};

export default TasksTable;