import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

axios.defaults.withCredentials = true; 
export const registerUser  = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};


export const createUser  = async (userData) => {
  const response = await axios.post( `${API_URL}`, userData );
  console.log( "reponse in createing user:-", response );
  return response;
};

export const loginUser  = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response;
};

export const logoutUser  = async () => {
  // clear the local storage as well
  localStorage.removeItem( 'token' );
  localStorage.removeItem( 'user' ); 
  const response = await axios.post(`${API_URL}/logout`, null, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  } );
  console.log(response)
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  } ); 
  
  return response.data;
};

export const deleteUser  = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  } );
  return response.data;
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};