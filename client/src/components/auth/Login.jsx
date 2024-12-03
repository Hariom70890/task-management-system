// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { loginUser } from '../../services/userServices';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);
      localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem( 'token', response.data.token );
        // set token to cookies
        // document.cookie = `token=${response.data.token}`    
      navigate(response.data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Sign In</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
          <div className="text-sm text-center mt-4">
  <span className="text-gray-600">Don't have an account? </span>
  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
    Sign up
  </Link>
</div>
          </div>
    </div>
  );
};

export default Login;
