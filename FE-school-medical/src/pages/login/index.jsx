import React, { useState } from 'react';
import authApi from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { Input, Button, message } from 'antd';

const LoginPage = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const data = await authApi.login(username, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    message.success('Login successful!');
    
    // Redirect based on role
    switch(data.role) {
      case "Manager":
        navigate('/manager-dashboard');
        break;
      case "Admin":
        navigate('/admin-dashboard');
        break;
      case "Nurse":
        navigate('/nurse-dashboard');
        break;
      case "Parent":
        navigate('/parent-dashboard');
        break;
      case "Student":
        navigate('/student-dashboard');
        break;
      default:
        navigate('/');
    }
  } catch (error) {
    message.error('Login failed. Check credentials.');
  }
};


  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Login</h2>
      <Input placeholder="Email" value={email} onChange={(e) => setemail(e.target.value)} />
      <Input.Password placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginTop: 10 }} />
      <Button type="primary" onClick={handleLogin} style={{ marginTop: 20 }}>Login</Button>
    </div>
  );
};

// 🔧 Don't forget this line
export default LoginPage;
