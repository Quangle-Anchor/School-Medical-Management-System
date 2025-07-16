import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NovaHeader = ({ variant = "light" }) => {
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
    <nav className={`navbar navbar-expand-lg fixed-top transition-all duration-300 ${
      isScrolled ? 'navbar-light bg-white shadow-sm' : 
      variant === 'light' ? 'navbar-light' : 'navbar-dark'
    }`}>
      <div className="container">
        
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-circle p-2 me-2">
              <i className="bi bi-hospital text-white fs-5"></i>
            </div>
            <span className={isScrolled ? 'text-dark' : variant === 'light' ? 'text-white' : 'text-dark'}>
              School Medical
            </span>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${isActive('/') ? 'active text-primary' : 
                  isScrolled ? 'text-dark' : variant === 'light' ? 'text-white' : 'text-dark'
                }`} 
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${isActive('/about') ? 'active text-primary' : 
                  isScrolled ? 'text-dark' : variant === 'light' ? 'text-white' : 'text-dark'
                }`} 
                to="/about"
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${isActive('/contact') ? 'active text-primary' : 
                  isScrolled ? 'text-dark' : variant === 'light' ? 'text-white' : 'text-dark'
                }`} 
                to="/contact"
              >
                Contact
              </Link>
            </li>
            {!isAuthenticated && (
              <li className="nav-item">
                <Link 
                  className={`nav-link fw-semibold px-3 ${isActive('/health-lookup') ? 'active text-primary' : 
                    isScrolled ? 'text-dark' : variant === 'light' ? 'text-white' : 'text-dark'
                  }`} 
                  to="/health-lookup"
                >
                  Health Lookup
                </Link>
              </li>
            )}
          </ul>

          {/* Auth buttons */}
          <div className="d-flex align-items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className={`btn btn-outline-primary me-2 ${
                    variant === 'light' && !isScrolled ? 'btn-outline-light text-white' : ''
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button 
                  className={`btn dropdown-toggle ${
                    isScrolled ? 'btn-outline-primary' : 
                    variant === 'light' ? 'btn-outline-light text-white' : 'btn-outline-primary'
                  }`}
                  type="button" 
                  id="dropdownMenuButton" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {fullName}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2" aria-labelledby="dropdownMenuButton">
                  <li>
                    <Link className="dropdown-item py-2" to={getDashboardLink()}>
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/settings">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Sign Out
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

export default NovaHeader;
