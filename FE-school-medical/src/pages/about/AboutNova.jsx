import React from "react";
import NovaLayout from "../../components/NovaLayout";
import NovaHeaderSimple from "../../components/NovaHeaderSimple";

// Thêm style cho nút hero với hiệu ứng hover xanh lá cây
const heroBtnStyle = `
.btn-hero-about {
  background: transparent !important;
  border: 2px solid white !important;
  color: white !important;
  transition: all 0.3s ease !important;
}
.btn-hero-about:hover, .btn-hero-about:focus {
  background: #1976d2 !important;
  border-color: #1976d2 !important;
  color: white !important;
  transform: translateY(-2px) !important;
}
`;

export default function AboutNova() {
  return (
    <NovaLayout>
      <style>{heroBtnStyle}</style>
      <NovaHeaderSimple variant="light" />

      {/* Hero Section */}
      <section
        className="hero-section position-relative overflow-hidden py-5"
        style={{
          background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
          minHeight: "60vh",
        }}
      >
        <div className="container-fluid px-0">
          <div className="row align-items-center min-vh-60 g-0">
            <div className="col-lg-6 px-5">
              <div className="hero-content text-white" data-aos="fade-right">
                <h1
                  className="display-4 mb-4 text-white"
                  style={{ fontWeight: "800" }}
                >
                  About
                  <br />
                  School Medical
                  <br />
                  Management
                </h1>
                <p className="lead mb-4">
                  Transforming healthcare management in educational institutions
                  through innovative technology and comprehensive solutions.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <a
                    href="#mission"
                    className="btn btn-hero-about btn-lg px-4 py-3 fw-semibold rounded-pill"
                  >
                    Our Mission
                  </a>
                  <a
                    href="/login"
                    className="btn btn-hero-about btn-lg px-4 py-3 fw-semibold rounded-pill"
                  >
                    <i className="bi bi-play me-2"></i>
                    Get Started
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 px-5">
              <div className="hero-image text-center" data-aos="fade-left">
                <img
                  src="/nova-assets/images/about_2-min.jpg"
                  alt="About Us"
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="position-absolute top-0 end-0 opacity-10">
          <img
            src="/nova-assets/images/arch-line.svg"
            alt=""
            className="w-100"
          />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2
                className="display-5 fw-bold mb-3"
                style={{ color: "#0d6efd" }}
                data-aos="fade-up"
              >
                Our Mission & Vision
              </h2>
              <p
                className="lead text-muted"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Dedicated to revolutionizing school health management
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div
                className="card h-100 border-0 shadow-sm hover-lift"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="card-body p-5 text-center">
                  <div className="feature-icon mb-4">
                    <i
                      className="bi bi-heart-fill"
                      style={{ fontSize: "3rem", color: "#2196f3" }}
                    ></i>
                  </div>
                  <h3 className="card-title fw-bold text-dark mb-4">Mission</h3>
                  <p className="card-text text-muted">
                    To create a safe, healthy, and holistic learning environment
                    for students through professional and modern school health
                    programs. We are committed to partnering with schools and
                    families to care for students' physical and mental
                    well-being.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="card h-100 border-0 shadow-sm hover-lift"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="card-body p-5 text-center">
                  <div className="feature-icon mb-4">
                    <i
                      className="bi bi-mortarboard-fill text-success"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h3 className="card-title fw-bold text-dark mb-4">Vision</h3>
                  <p className="card-text text-muted">
                    To become a leading unit in school health in Vietnam,
                    trusted by educators, parents, and students. We aim to build
                    a young generation that is healthy, confident, and equipped
                    with the knowledge to care for themselves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2
                className="display-5 fw-bold mb-3"
                style={{ color: "#0d6efd" }}
                data-aos="fade-up"
              >
                Our Core Values
              </h2>
              <p
                className="lead text-muted"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                The principles that guide everything we do
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div
                className="text-center"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="feature-icon mb-4">
                  <i
                    className="bi bi-shield-check text-primary"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <h4 className="fw-bold mb-3">Safety First</h4>
                <p className="text-muted">
                  Student safety and well-being are our top priorities in every
                  decision we make.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className="text-center"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="feature-icon mb-4">
                  <i
                    className="bi bi-lightbulb text-warning"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <h4 className="fw-bold mb-3">Innovation</h4>
                <p className="text-muted">
                  We continuously improve our technology to provide the best
                  healthcare solutions.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className="text-center"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="feature-icon mb-4">
                  <i
                    className="bi bi-people text-info"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <h4 className="fw-bold mb-3">Collaboration</h4>
                <p className="text-muted">
                  Working together with schools, parents, and healthcare
                  professionals for better outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2
                className="display-5 fw-bold mb-3"
                style={{ color: "#0d6efd" }}
                data-aos="fade-up"
              >
                Key Features
              </h2>
              <p
                className="lead text-muted"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Comprehensive tools for modern school health management
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div
                className="card h-100 border-0 shadow-sm hover-lift text-center"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i
                      className="bi bi-clipboard-data text-primary"
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Health Records
                  </h5>
                  <p className="card-text text-muted small">
                    Comprehensive digital health records for every student
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div
                className="card h-100 border-0 shadow-sm hover-lift text-center"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i
                      className="bi bi-capsule text-success"
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Medication Management
                  </h5>
                  <p className="card-text text-muted small">
                    Track and manage student medications safely
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div
                className="card h-100 border-0 shadow-sm hover-lift text-center"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i
                      className="bi bi-calendar-event text-warning"
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Health Events
                  </h5>
                  <p className="card-text text-muted small">
                    Schedule and manage health events and checkups
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div
                className="card h-100 border-0 shadow-sm hover-lift text-center"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i
                      className="bi bi-bell text-info"
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Notifications
                  </h5>
                  <p className="card-text text-muted small">
                    Real-time alerts and communication system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2
                className="display-5 fw-bold mb-3"
                style={{ color: "#0d6efd" }}
                data-aos="fade-up"
              >
                Our Team
              </h2>
              <p
                className="lead text-muted"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Dedicated professionals committed to student health
              </p>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div
                className="card border-0 shadow-sm hover-lift text-center"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="card-body p-4">
                  <div className="avatar mb-3">
                    <i
                      className="bi bi-heart-pulse-fill text-danger"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Healthcare Professionals
                  </h5>
                  <p className="text-muted small mb-3">Medical Team</p>
                  <p className="card-text text-muted small">
                    Experienced healthcare professionals dedicated to student
                    wellness and safety.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className="card border-0 shadow-sm hover-lift text-center"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="card-body p-4">
                  <div className="avatar mb-3">
                    <i
                      className="bi bi-code-slash text-primary"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Development Team
                  </h5>
                  <p className="text-muted small mb-3">Technology Experts</p>
                  <p className="card-text text-muted small">
                    Skilled developers creating innovative solutions for school
                    health management.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className="card border-0 shadow-sm hover-lift text-center"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="card-body p-4">
                  <div className="avatar mb-3">
                    <i
                      className="bi bi-mortarboard text-success"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Education Specialists
                  </h5>
                  <p className="text-muted small mb-3">Academic Partners</p>
                  <p className="card-text text-muted small">
                    Education experts ensuring our solutions meet school needs
                    effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
        }}
      >
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2
                className="display-6 fw-bold mb-4 text-white"
                data-aos="fade-up"
              >
                Ready to Transform Your School's Health Management?
              </h2>
              <p
                className="lead mb-4 text-white"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Join hundreds of schools already using our platform to ensure
                student well-being.
              </p>
              <div
                className="d-flex flex-wrap gap-3 justify-content-center"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <a
                  href="/contact"
                  className="btn btn-hero-about btn-lg px-4 py-3 fw-semibold rounded-pill"
                >
                  Contact Us
                </a>
                <a
                  href="/login"
                  className="btn btn-hero-about btn-lg px-4 py-3 fw-semibold rounded-pill"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </NovaLayout>
  );
}
