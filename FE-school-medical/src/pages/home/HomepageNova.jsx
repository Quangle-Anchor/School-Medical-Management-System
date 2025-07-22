import React from "react";
import NovaLayout from "../../components/NovaLayout";
import NovaHeaderSimple from "../../components/NovaHeaderSimple";
import NovaFooter from "../../components/NovaFooter";

// Thêm style cho nút dashboard xanh
const dashboardBtnStyle = `
.btn-dashboard {
  background: #2196f3 !important;
  border-color: #2196f3 !important;
  color: #fff !important;
}
.btn-dashboard:hover, .btn-dashboard:focus {
  background: #1976d2 !important;
  border-color: #1976d2 !important;
  color: #fff !important;
}
`;

const HomepageNova = () => {
  return (
    <NovaLayout>
      <style>{dashboardBtnStyle}</style>
      <NovaHeaderSimple variant="light" />

      {/* Hero Section - Matching Nova template style */}
      <section
        className="hero-section position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
          minHeight: "50vh",
        }}
      >
        <div className="container-fluid">
          <div className="row align-items-center min-vh-100">
            {/* Left */}
            <div
              className="col-12 col-lg-6 d-flex flex-column justify-content-center"
              style={{ minHeight: "500px" }}
            >
              <div
                className="hero-content text-white"
                style={{ maxWidth: 700 }}
                data-aos="fade-right"
              >
                <div className="badge bg-light text-primary mb-3 fs-6 fw-semibold">
                  INNOVATIVE SCHOOL HEALTH SOLUTIONS
                </div>
                <h1 className="display-2 fw-bold mb-4 lh-1">
                  School Medical
                  <br />
                  Management System
                </h1>
                <p className="lead mb-5 fs-4">
                  Ensure a safe and healthy learning environment for all
                  students. We provide regular health check-ups, emergency first
                  aid, health counseling, and health education programs to
                  support the overall development of students.
                </p>
                <div className="d-flex gap-3 mb-5">
                  <a
                    href="/login"
                    className="btn btn-lg px-4 py-3 fw-semibold"
                    style={{
                      background: "#0d47a1",
                      borderColor: "#0d47a1",
                      color: "#fff",
                    }}
                  >
                    <i className="bi bi-play-circle me-2"></i>
                    Get Started
                  </a>
                  <a
                    href="/about"
                    className="btn btn-lg px-4 py-3 fw-semibold"
                    style={{
                      background: "#0d47a1",
                      color: "#fff",
                      borderColor: "#0d47a1",
                    }}
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    Learn More
                  </a>
                </div>
                {/* Trust indicators */}
                <div className="trust-indicators mt-4">
                  <div className="d-flex align-items-center gap-4 opacity-75 flex-wrap">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-mortarboard fs-2 me-2 text-white"></i>
                      <span className="small text-white">100+ Schools</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-people fs-2 me-2 text-white"></i>
                      <span className="small text-white">50K+ Students</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-shield-check fs-2 me-2 text-white"></i>
                      <span className="small text-white">
                        Secure & Reliable
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right */}
            <div
              className="col-12 col-lg-6 d-flex align-items-center justify-content-center"
              style={{ minHeight: "700px" }}
            >
              <div
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ maxWidth: "800px", height: "650px" }}
              >
                <img
                  src="https://edulinkvn.com/Upload/Articles/Photos/main-slider-1.jpg"
                  alt="School Medical Management"
                  className="img-fluid rounded-4 shadow-2xl"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "2rem",
                  }}
                />
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div
            className="position-absolute bottom-0 start-0 w-100 opacity-20"
            style={{ pointerEvents: "none" }}
          >
            <svg
              viewBox="0 0 1200 120"
              className="w-100"
              style={{ height: "120px" }}
            >
              <path
                d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z"
                fill="rgba(255,255,255,0.1)"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* About Section - "Why Choose us" */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2
                className="display-5 fw-bold text-dark mb-3"
                data-aos="fade-up"
              >
                Why Choose us
              </h2>
              <p
                className="lead text-muted"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Experience the future of school health management with our
                secure, efficient, and user-friendly platform. Our cutting-edge
                system ensures student health data is safe, streamlined, and
                easy to manage.
              </p>
            </div>
          </div>

          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-6">
              <div className="position-relative" data-aos="fade-right">
                <img
                  src="/nova-assets/images/about_2-min.jpg"
                  alt="School Health Management"
                  className="img-fluid rounded-4 shadow-lg"
                />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <a
                    href="https://www.youtube.com/watch?v=DQx96G4yHd8"
                    className="btn btn-primary btn-lg rounded-circle p-4"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-play-fill fs-3"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="row g-4">
                <div className="col-12" data-aos="fade-up" data-aos-delay="200">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-primary rounded-circle p-3">
                        <i className="bi bi-person-check text-white fs-4"></i>
                      </div>
                    </div>
                    <div className="ms-4">
                      <h5 className="fw-bold mb-2">User-Friendly Interface</h5>
                      <p className="text-muted mb-0">
                        Easy navigation with responsive design for various
                        devices, ensuring seamless access for all users.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12" data-aos="fade-up" data-aos-delay="300">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-success rounded-circle p-3">
                        <i className="bi bi-graph-up text-white fs-4"></i>
                      </div>
                    </div>
                    <div className="ms-4">
                      <h5 className="fw-bold mb-2">Health Analytics</h5>
                      <p className="text-muted mb-0">
                        Student health tracking, medication monitoring, and
                        personalized health insights for better care.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12" data-aos="fade-up" data-aos-delay="400">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-warning rounded-circle p-3">
                        <i className="bi bi-headset text-white fs-4"></i>
                      </div>
                    </div>
                    <div className="ms-4">
                      <h5 className="fw-bold mb-2">24/7 Support</h5>
                      <p className="text-muted mb-0">
                        Round-the-clock service via chat, email, phone, and
                        comprehensive help center for schools.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12" data-aos="fade-up" data-aos-delay="500">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-info rounded-circle p-3">
                        <i className="bi bi-shield-lock text-white fs-4"></i>
                      </div>
                    </div>
                    <div className="ms-4">
                      <h5 className="fw-bold mb-2">Security Features</h5>
                      <p className="text-muted mb-0">
                        Advanced data encryption, privacy protection, and secure
                        access controls for student health data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2
                className="display-5 fw-bold text-dark mb-3"
                data-aos="fade-up"
              >
                Empowering School Health Through Cutting-Edge Services
              </h2>
            </div>
          </div>

          <div className="row g-4">
            <div
              className="col-12 col-md-6 col-lg-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i
                      className="bi bi-clipboard-data"
                      style={{ fontSize: "4rem", color: "#6c757d" }}
                    ></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">
                    Health Records Management
                  </h5>
                  <p className="card-text text-muted mb-4">
                    Comprehensive digital health records for every student,
                    ensuring easy access and secure storage of medical
                    information.
                  </p>
                  <a
                    href="https://www.securescan.com/articles/records-management/medical-records-management-challenges-and-best-practices/"
                    className="btn btn-dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>

            <div
              className="col-12 col-md-6 col-lg-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i
                      className="bi bi-capsule"
                      style={{ fontSize: "4rem", color: "#28a745" }}
                    ></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">
                    Medication Management
                  </h5>
                  <p className="card-text text-muted mb-4">
                    Safe and efficient medication tracking and administration
                    for students with special health needs .
                  </p>
                  <a
                    href="https://www.oakstreethealth.com/medication-management-1216889"
                    className="btn btn-dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>

            <div
              className="col-12 col-md-6 col-lg-4"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i
                      className="bi bi-calendar-heart"
                      style={{ fontSize: "4rem", color: "#dc3545" }}
                    ></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">
                    Health Event Scheduling
                  </h5>
                  <p className="card-text text-muted mb-4">
                    Automatically schedule and manage health screenings,
                    vaccinations and wellness programs for students at all
                    levels.
                  </p>
                  <a
                    href="https://eventupplanner.com/healthcare/"
                    className="btn btn-dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>

            <div
              className="col-12 col-md-6 col-lg-4"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i
                      className="bi bi-graph-up-arrow"
                      style={{ fontSize: "4rem", color: "#17a2b8" }}
                    ></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Health Analytics</h5>
                  <p className="card-text text-muted mb-4">
                    Comprehensive health reports and analytics to track student
                    wellness trends and outcomes.
                  </p>
                  <a
                    href="https://www.sciencedirect.com/journal/healthcare-analytics"
                    className="btn btn-dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>

            <div
              className="col-12 col-md-6 col-lg-4"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i
                      className="bi bi-bell"
                      style={{ fontSize: "4rem", color: "#ffc107" }}
                    ></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">
                    Emergency Notifications
                  </h5>
                  <p className="card-text text-muted mb-4">
                    Instant alerts and communication system for health
                    emergencies and important health updates.
                  </p>
                  <a
                    href="https://www.alert-software.com/healthcare"
                    className="btn btn-dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>

            <div
              className="col-12 col-md-6 col-lg-4"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i
                      className="bi bi-people"
                      style={{ fontSize: "4rem", color: "#6f42c1" }}
                    ></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">
                    Parent Integration
                  </h5>
                  <p className="card-text text-muted mb-4">
                    Seamless communication platform connecting school health
                    staff, parents, and students.
                  </p>
                  <a
                    href="https://cisedu.com/en-gb/world-of-cis/news/social_integration_of_parents/"
                    className="btn btn-dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-5"
        style={{ background: "#2196f3", color: "#fff" }}
      >
        <div className="container">
          <div className="row text-center">
            <div
              className="col-12 col-md-6 col-lg-3 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="stat-item">
                <h2
                  className="display-4 fw-bold mb-2"
                  style={{ color: "#fff" }}
                >
                  100+
                </h2>
                <p className="mb-0 fs-5" style={{ color: "#fff" }}>
                  Schools Protected
                </p>
              </div>
            </div>
            <div
              className="col-12 col-md-6 col-lg-3 mb-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="stat-item">
                <h2
                  className="display-4 fw-bold mb-2"
                  style={{ color: "#fff" }}
                >
                  99%+
                </h2>
                <p className="mb-0 fs-5" style={{ color: "#fff" }}>
                  Data Security
                </p>
              </div>
            </div>
            <div
              className="col-12 col-md-6 col-lg-3 mb-4"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="stat-item">
                <h2
                  className="display-4 fw-bold mb-2"
                  style={{ color: "#fff" }}
                >
                  50K+
                </h2>
                <p className="mb-0 fs-5" style={{ color: "#fff" }}>
                  Students Served
                </p>
              </div>
            </div>
            <div
              className="col-12 col-md-6 col-lg-3 mb-4"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="stat-item">
                <h2
                  className="display-4 fw-bold mb-2"
                  style={{ color: "#fff" }}
                >
                  24/7
                </h2>
                <p className="mb-0 fs-5" style={{ color: "#fff" }}>
                  Support Available
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </NovaLayout>
  );
};

export default HomepageNova;
