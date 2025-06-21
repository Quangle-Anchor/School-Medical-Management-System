import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import './AuthPage.css'; // We'll create this CSS file with your provided styles

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const navigate = useNavigate();

  // Handlers for login
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginError('');
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authApi.login(loginData.email, loginData.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      if (data.userId) localStorage.setItem('userId', data.userId.toString());
      const roleDashboardMap = {
        Manager: '/managerDashboard',
        Admin: '/adminDashboard',
        Nurse: '/nurseDashboard',
        Parent: '/parentDashboard',
        Student: '/studentDashboard',
      };
      const dashboardPath = roleDashboardMap[data.role] || '/';
      navigate(dashboardPath, { replace: true });
    } catch (err) {
      setLoginError('Login failed. Check credentials.');
    }
  };

  // Handlers for signup
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setSignupError('');
    setSignupSuccess('');
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) {
      setSignupError('All fields are required.');
      return;
    }
    try {
      await authApi.signup({
        username: signupData.name,
        email: signupData.email,
        password: signupData.password,
        fullName: signupData.name,
        phone: '',
      });
      setSignupSuccess('Account created! You can now sign in.');
      setSignupData({ name: '', email: '', password: '' });
      setTimeout(() => setIsSignUp(false), 1200);
    } catch (err) {
      setSignupError('Registration failed. Try again.');
    }
  };

  return (
    <div className={isSignUp ? 'container right-panel-active' : 'container'} id="container">
      {/* Sign Up */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" name="name" placeholder="Name" value={signupData.name} onChange={handleSignupChange} />
          <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} />
          <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} />
          {signupError && <span style={{ color: 'red', fontSize: 12 }}>{signupError}</span>}
          {signupSuccess && <span style={{ color: 'green', fontSize: 12 }}>{signupSuccess}</span>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
      {/* Sign In */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your account</span>
          <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} />
          <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
          <a href="#">Forgot your password?</a>
          {loginError && <span style={{ color: 'red', fontSize: 12 }}>{loginError}</span>}
          <button type="submit">Sign In</button>
        </form>
      </div>
      {/* Overlay */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={() => setIsSignUp(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" id="signUp" onClick={() => setIsSignUp(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
