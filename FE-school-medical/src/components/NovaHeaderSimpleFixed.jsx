import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NovaHeaderSimple = ({ variant = "dark" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLight = variant === "light";
  const navbarClass = `navbar navbar-expand-lg fixed-top transition-all ${
    isScrolled 
      ? "navbar-light bg-white shadow-sm" 
      : isLight 
        ? "navbar-dark bg-transparent" 
        : "navbar-light bg-white"
  }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={navbarClass} style={{ transition: "all 0.3s ease" }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <span className="text-primary">Nova</span>
          <span className={isScrolled || !isLight ? "text-dark" : "text-white"}>Health</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${
                  isActive("/") ? "active text-primary" : 
                  (isScrolled || !isLight ? "text-dark" : "text-white")
                }`} 
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${
                  isActive("/about") ? "active text-primary" : 
                  (isScrolled || !isLight ? "text-dark" : "text-white")
                }`} 
                to="/about"
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link fw-semibold px-3 ${
                  isActive("/contact") ? "active text-primary" : 
                  (isScrolled || !isLight ? "text-dark" : "text-white")
                }`} 
                to="/contact"
              >
                Contact
              </Link>
            </li>
            
            {user && (
              <>
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle fw-semibold px-3 ${
                      isScrolled || !isLight ? "text-dark" : "text-white"
                    }`}
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dashboard
                  </a>
                  <ul className="dropdown-menu border-0 shadow">
                    {user.role === "ADMIN" && (
                      <li>
                        <Link className="dropdown-item" to="/admin-dashboard">
                          <i className="bi bi-speedometer2 me-2"></i>
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                    {user.role === "NURSE" && (
                      <li>
                        <Link className="dropdown-item" to="/nurse-dashboard">
                          <i className="bi bi-heart-pulse me-2"></i>
                          Nurse Dashboard
                        </Link>
                      </li>
                    )}
                    {user.role === "PARENT" && (
                      <li>
                        <Link className="dropdown-item" to="/parent-dashboard">
                          <i className="bi bi-person-heart me-2"></i>
                          Parent Dashboard
                        </Link>
                      </li>
                    )}
                    {user.role === "PRINCIPAL" && (
                      <li>
                        <Link className="dropdown-item" to="/principal-dashboard">
                          <i className="bi bi-building me-2"></i>
                          Principal Dashboard
                        </Link>
                      </li>
                    )}
                  </ul>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link fw-semibold px-3 ${
                      isActive("/profile") ? "active text-primary" : 
                      (isScrolled || !isLight ? "text-dark" : "text-white")
                    }`} 
                    to="/profile"
                  >
                    Profile
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>
                  {user.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
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
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">
                  Login
                </Link>
                <Link to="/login" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NovaHeaderSimple;
