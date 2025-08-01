import React, { useState } from 'react';
import authApi from '../../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Alert } from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../hooks/useToast';
import logo from '../../assets/img/1.png';
import backgroundImg from '../../assets/img/back.png';
import googleIcon from '/nova-assets/images/Google_icon.svg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoggingIn(true);
      const data = await authApi.googleLogin(credentialResponse.credential);
      
      if (!data?.token) {
        showError('Invalid response from server. Please try again.');
        return;
      }
      
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
      
      showSuccess('Google login successful!');
      
      // Dispatch custom event to notify navbar of authentication change
      window.dispatchEvent(new CustomEvent('authChange'));
      
      // Redirect based on role
      const roleDashboardMap = {
        Principal: '/principalDashboard',
        Admin: '/adminDashboard',
        Nurse: '/nurseDashboard',
        Parent: '/parentDashboard',
        Student: '/studentDashboard',
      };
      const dashboardPath = roleDashboardMap[data.role] || '/';
      navigate(dashboardPath, { replace: true });
    } catch (err) {
      console.error('Google login error:', err);
      // Show error toast for Google login
      if (err.response?.data?.error) {
        showError(err.response.data.error);
      } else if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else if (err.message) {
        showError(err.message);
      } else {
        showError('Google login failed. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLoginError = () => {
    showError('Google login failed. Please try again or use regular login.');
  };
  
  // Completely separate function from form submission
  const handleLogin = async (e) => {
    // ALWAYS prevent default behavior first
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsLoggingIn(true);
    
    // Form validation
    if (!email || !password) {
      showError('Please enter both email and password');
      setIsLoggingIn(false);
      return false; // Explicitly return false
    }
    
    try {
      const data = await authApi.login(email, password);
      
      if (!data?.token) {
        showError('Invalid response from server. Please try again.');
        setPassword(''); // Clear password on error
        setIsLoggingIn(false);
        return false;
      }
      
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
      
      showSuccess('Login successful!');
      
      // Dispatch custom event to notify navbar of authentication change
      window.dispatchEvent(new CustomEvent('authChange'));
      
      // Redirect based on role
      const roleDashboardMap = {
        Principal: '/principalDashboard',
        Admin: '/adminDashboard',
        Nurse: '/nurseDashboard',
        Parent: '/parentDashboard',
        Student: '/studentDashboard',
      };
      const dashboardPath = roleDashboardMap[data.role] || '/';
      navigate(dashboardPath, { replace: true }); // Use replace to avoid back button issue
      return true;
    } catch (err) {
      console.error('Login error:', err);
      // Clear password on error but keep email
      setPassword('');
      
      // Show appropriate error message via toast
      if (err.response?.data?.error) {
        showError(err.response.data.error);
      } else if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else if (err.response?.status === 401) {
        showError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 400) {
        showError('Invalid credentials. Please check your email and password.');
      } else if (err.message) {
        showError(err.message);
      } else {
        showError('Login failed. Please check your credentials and try again.');
      }
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background overlay - removed backdrop-blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>

      {/* Glassmorphism container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Logo section */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block p-3 bg-white/20 rounded-full backdrop-blur-sm mb-4">
              <img
                alt="Logo"
                src={logo}
                className="h-16 w-16 rounded-full shadow-lg"
              />
            </Link>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/80">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/90 mb-2"
              >
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLogin(e);
                  }
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleLogin(e);
                    }
                  }}
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-white/80"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline ml-2"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogin(e);
              }}
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center mt-6">
            <div className="border-t border-white/20 flex-grow"></div>
            <span className="px-3 text-white/60 text-sm">or</span>
            <div className="border-t border-white/20 flex-grow"></div>
          </div>

          {/* Google OAuth Button */}
          <div className="w-full mt-6">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              theme="filled_black"
              shape="rectangular"
              size="large"
              text="signin_with"
              width="100%"
              style={{
                width: '100%',
              }}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm">
              New here?{" "}
              <Link
                to="/signup"
                className="text-blue-800 hover:text-blue-100 font-semibold transition-colors"
              >
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
