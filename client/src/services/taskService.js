import axios from 'axios';
// import axios from '../../node_modules/axios/index.d.cts';

const API_URL = 'http://localhost:5000/api';

axios.defaults.withCredentials = true; 

export const fetchTasks = async () => {
  const response = await axios.get(`${API_URL}/task`, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  });
  return response.data;
};

export const createTask = async ( taskData ) => {
  
  const response = await axios.post(`${API_URL}/task`, taskData, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  });
  return response.data;
};

export const getTask = async () => {
  const response = await axios.get(`${API_URL}/task`, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  });
  return response.data;
};

export const getUserTasks = async () => {
  const response = await axios.get(`${API_URL}/task/my-tasks`, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  });
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/task/${id}`, taskData, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  } );
  console.log("response:-",response)
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/task/${id}`, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  });
  return response;
};

const getCookie = (name) => {
  const match = document.cookie.match( new RegExp( '(^| )' + name + '=([^;]+)' ) ); 
  return match ? match[2] : null;
};