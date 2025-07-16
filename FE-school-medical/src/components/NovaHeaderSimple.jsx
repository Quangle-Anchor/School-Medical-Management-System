import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NovaHeaderSimple = ({ variant = "light" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Simple auth state from localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const fullName = localStorage.getItem("fullname") || localStorage.getItem("email") || "User";
  const isAuthenticated = !!token;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("fullname");
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/';
    
    switch (role) {
      case 'ADMIN':
        return '/adminDashboard';
      case 'PRINCIPAL':
        return '/principalDashboard';
      case 'NURSE':
        return '/nurseDashboard';
      case 'PARENT':
        return '/parentDashboard';
      default:
        return '/';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${
      isScrolled ? 'navbar-light bg-white shadow-sm' : 
      variant === 'light' ? 'navbar-dark' : 'navbar-light bg-white'
    }`} style={{ transition: 'all 0.3s ease' }}>
      <div className="container-fluid px-4">
        
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <span className="text-primary">Nova</span>
          <span className={isScrolled || variant !== 'light' ? 'text-dark' : 'text-white'}>Health</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${isActive('/') ? 'active text-primary' : isScrolled ? 'text-dark' : 'text-dark'}`} 
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${isActive('/about') ? 'active text-primary' : isScrolled ? 'text-dark' : 'text-dark'}`} 
                to="/about"
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${isActive('/contact') ? 'active text-primary' : isScrolled ? 'text-dark' : 'text-dark'}`} 
                to="/contact"
              >
                Contact
              </Link>
            </li>
            {!isAuthenticated && (
              <li className="nav-item">
                <Link 
                  className={`nav-link fw-semibold px-3 ${isActive('/health-lookup') ? 'active text-primary' : isScrolled ? 'text-dark' : 'text-dark'}`} 
                  to="/health-lookup"
                >
                  Health Lookup
                </Link>
              </li>
            )}
          </ul>

          {/* Auth buttons */}
          <div className="d-flex align-items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">
                  Login
                </Link>
                <Link to="/login" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2"
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>
                  {fullName}
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
                  <li>
                    <Link className="dropdown-item" to={getDashboardLink()}>
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NovaHeaderSimple;
