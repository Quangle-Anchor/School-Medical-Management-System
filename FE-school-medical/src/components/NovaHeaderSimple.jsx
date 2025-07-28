import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/img/1.png";

const NovaHeaderSimple = ({ variant = "light" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/health-lookup", label: "Health Lookup" },
    { path: "/contact", label: "Contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${
        isScrolled
          ? "navbar-light bg-white shadow-sm"
          : variant === "light"
          ? "navbar-light bg-white" 
          : "navbar-light bg-white"
      }`}
      style={{
        transition: "all 0.3s ease",
        zIndex: 1030,
        backgroundColor: "white", 
        boxShadow: isScrolled ? "0 2px 4px rgba(0,0,0,0.1)" : "none", 
      }}
    >
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/" onClick={scrollToTop}>
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle p-1 d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#0d6efd",
              }}
            >
              <img
                alt="Logo"
                src={logo}
                className=""
                style={{ height: "32px", width: "32px", borderRadius: "50%" }}
              />
            </div>
            <div className="d-flex flex-column lh-1 ms-2">
              <span
                className="fw-bold"
                style={{
                  fontSize: "16px",
                  marginBottom: "3px",
                  color: "#0d6efd",
                }}
              >
                SVXS
              </span>
              <span style={{ fontSize: "12px", color: "#0d6efd" }}>
                School Medical
              </span>
            </div>
          </div>
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
          style={{ color: "#0d6efd" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarNav"
          style={{ display: "flex !important" }}
        >
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link
                  className={`nav-link fw-semibold px-3 ${
                    isActive(link.path) ? "active" : ""
                  }`}
                  style={{
                    color: "#0d6efd",
                    opacity: 1,
                    visibility: "visible",
                  }}
                  to={link.path}
                  onClick={scrollToTop}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Replace Sign In and Sign Up buttons */}
          <div className="d-flex gap-2.5">
            <Link
              to="/login"
              style={{
                backgroundColor: "#0d6efd",
                borderColor: "#0d6efd",
                color: "white",
                fontWeight: "500",
                padding: "8px 16px",
                borderRadius: "6px", 
              }}
              onClick={scrollToTop}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              style={{
                backgroundColor: "#0d6efd",
                borderColor: "#0d6efd",
                color: "white",
                fontWeight: "500",
                padding: "8px 16px",
                borderRadius: "6px", 
              }}
              onClick={scrollToTop}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NovaHeaderSimple;
