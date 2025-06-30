import React, { useState } from 'react';
import authApi from '../../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, message, Alert } from 'antd';
import logo from '../../assets/img/1.png';
import backgroundImg from '../../assets/img/back.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {      const data = await authApi.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('email', data.email);
      
      // Store userId if available (needed for parent-child relationship)
      if (data.userId) {
        localStorage.setItem('userId', data.userId.toString());
      }
        // Store fullname if available (for profile display)
      if (data.fullName) {
        localStorage.setItem('fullname', data.fullName);
      }
      
      message.success('Login successful!');
      
      // Dispatch custom event to notify navbar of authentication change
      window.dispatchEvent(new CustomEvent('authChange'));
      
      // Redirect based on role
      const roleDashboardMap = {
        Manager: '/managerDashboard',
        Principal: '/managerDashboard', // Principal uses the same dashboard as Manager
        Admin: '/adminDashboard',
        Nurse: '/nurseDashboard',
        Parent: '/parentDashboard',
        Student: '/studentDashboard',
      };
      const dashboardPath = roleDashboardMap[data.role] || '/';
      navigate(dashboardPath, { replace: true }); // Use replace to avoid back button issue
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data || 'Login failed. Check credentials.');
    }
  };  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay - removed backdrop-blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      
      {/* Glassmorphism container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Logo section */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-white/20 rounded-full backdrop-blur-sm mb-4">
              <img 
                alt="Logo" 
                src={logo} 
                className="h-16 w-16 rounded-full shadow-lg" 
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/80">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <div className="text-red-300 mr-2">⚠️</div>
                <span className="text-red-100 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Email address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                autoComplete="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                autoComplete="current-password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-white/80">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-800 hover:text-blue-100 font-semibold transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm">
              New here?{' '}
              <Link to="/signup" className="text-blue-800 hover:text-blue-100 font-semibold transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
