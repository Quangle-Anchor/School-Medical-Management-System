import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const NovaHeader = ({ variant = "dark" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/';
    
    switch (userRole) {
      case 'ADMIN':
        return '/admin';
      case 'PRINCIPAL':
        return '/principal';
      case 'NURSE':
        return '/nurseDashboard';
      case 'PARENT':
        return '/parent';
      default:
        return '/';
    }
  };

  const getUserDisplayName = () => {
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');
    return fullName || email || 'User';
  };

  return (
    <header className={`fbs__net-navbar navbar navbar-expand-lg ${variant}`} aria-label="School Medical navbar">
      <div className="container d-flex align-items-center justify-content-between">
        
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img 
            src="/src/assets/img/logoXoaNen.png" 
            alt="School Medical" 
            height="40"
            className="d-inline-block align-text-top"
          />
          <span className="ms-2 fw-bold">School Medical</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isMenuOpen} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/health-lookup">Health Lookup</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {getUserDisplayName()}
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to={getDashboardLink()}>
                      <i className="bi bi-speedometer2 me-2"></i>Dashboard
                    </Link></li>
                    <li><Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>Profile
                    </Link></li>
                    <li><Link className="dropdown-item" to="/settings">
                      <i className="bi bi-gear me-2"></i>Settings
                    </Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button></li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-primary ms-2" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default NovaHeader;
