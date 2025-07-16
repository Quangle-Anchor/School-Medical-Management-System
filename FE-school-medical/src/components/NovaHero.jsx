import React from 'react';
import { Link } from 'react-router-dom';

const NovaHero = ({ 
  title = "School Medical Management System",
  subtitle = "Comprehensive health management for educational institutions",
  description = "Streamline student health records, medication management, and health event scheduling with our innovative platform designed specifically for schools.",
  primaryButtonText = "Get Started",
  primaryButtonLink = "/login",
  secondaryButtonText = "Learn More",
  secondaryButtonLink = "/about",
  backgroundImage = "/nova-assets/images/3d-render-1-min.jpg"
}) => {
  return (
    <section 
      className="section first-section position-relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        background: 'linear-gradient(135deg, rgba(33, 92, 92, 0.8) 0%, rgba(20, 75, 75, 0.6) 100%)'
      }}></div>
      
      <div className="container position-relative">
        <div className="row align-items-center min-vh-100 py-5">
          <div className="col-lg-6">
            <div data-aos="fade-up" data-aos-delay="100">
              <h1 className="display-4 fw-bold text-white mb-4">
                {title}
              </h1>
              <p className="lead text-white-50 mb-4">
                {subtitle}
              </p>
              <p className="text-white-50 mb-5">
                {description}
              </p>
              
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link 
                  to={primaryButtonLink} 
                  className="btn btn-primary btn-lg px-4 py-3"
                >
                  <i className="bi bi-play-circle me-2"></i>
                  {primaryButtonText}
                </Link>
                <Link 
                  to={secondaryButtonLink} 
                  className="btn btn-outline-light btn-lg px-4 py-3"
                >
                  <i className="bi bi-info-circle me-2"></i>
                  {secondaryButtonText}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div data-aos="fade-left" data-aos-delay="200">
              <div className="position-relative">
                <img 
                  src="/nova-assets/images/about_2-min.jpg" 
                  alt="Medical Management" 
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/src/assets/img/back.png';
                  }}
                />
                
                {/* Floating cards */}
                <div className="position-absolute top-0 start-0 translate-middle">
                  <div className="bg-white rounded-3 shadow p-3" data-aos="zoom-in" data-aos-delay="300">
                    <div className="d-flex align-items-center">
                      <div className="bg-success rounded-circle p-2 me-3">
                        <i className="bi bi-heart-pulse text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Health Records</h6>
                        <small className="text-muted">Secure & Accessible</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="position-absolute bottom-0 end-0 translate-middle">
                  <div className="bg-white rounded-3 shadow p-3" data-aos="zoom-in" data-aos-delay="400">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle p-2 me-3">
                        <i className="bi bi-calendar-check text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Smart Scheduling</h6>
                        <small className="text-muted">Automated Events</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x pb-4">
        <div className="text-center">
          <a href="#features" className="text-white-50 text-decoration-none">
            <i className="bi bi-chevron-down fs-4 animate-bounce"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default NovaHero;
