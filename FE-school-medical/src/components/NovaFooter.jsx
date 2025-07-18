import React from 'react';
import { Link } from 'react-router-dom';

const NovaFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section bg-light border-top">
      <div className="container">
        <div className="row gy-4">
          
          {/* Company Info */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center mb-3">
              <img 
                src="/src/assets/img/logoXoaNen.png" 
                alt="School Medical" 
                height="32"
                className="me-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h5 className="mb-0 fw-bold">School Medical</h5>
            </div>
            <p className="text-muted">
              Providing comprehensive medical management solutions for educational institutions. 
              Ensuring the health and wellbeing of students through innovative technology.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-envelope fs-5"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none">About</Link>
              </li>
              <li className="mb-2">
                <Link to="/health-lookup" className="text-muted text-decoration-none">Health Lookup</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="text-muted">Student Health Records</span>
              </li>
              <li className="mb-2">
                <span className="text-muted">Medication Management</span>
              </li>
              <li className="mb-2">
                <span className="text-muted">Health Event Scheduling</span>
              </li>
              <li className="mb-2">
                <span className="text-muted">Inventory Management</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3">
            <h6 className="fw-bold mb-3">Contact Info</h6>
            <div className="d-flex align-items-start mb-2">
              <i className="bi bi-geo-alt text-primary me-2 mt-1"></i>
              <span className="text-muted">123 Education Street<br />City, State 12345</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-telephone text-primary me-2"></i>
              <span className="text-muted">+1 (555) 123-4567</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-envelope text-primary me-2"></i>
              <span className="text-muted">info@schoolmedical.com</span>
            </div>
          </div>
        </div>

        <hr className="my-4" />
        
        {/* Copyright */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted small">
              © {currentYear} School Medical Management System. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0 text-muted small">
              Powered by <span className="text-primary">Nova Bootstrap Template</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NovaFooter;
