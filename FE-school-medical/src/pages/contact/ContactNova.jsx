import React, { useState } from "react";
import NovaLayout from "../../components/NovaLayout";
import NovaHeaderSimple from "../../components/NovaHeaderSimple";
import NovaFooter from "../../components/NovaFooter";

// Thêm style cho hiệu ứng hover và active
const cardHoverStyle = `
  .contact-card {
    transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
    border: 2px solid transparent;
    cursor: pointer;
  }
  .contact-card:hover {
    box-shadow: 0 8px 32px 0 rgba(25, 118, 210, 0.15), 0 1.5px 8px 0 rgba(25, 118, 210, 0.10);
    transform: scale(1.04);
    border-color: #1976d2;
    z-index: 2;
  }
  .contact-card:hover .feature-icon i {
    color: #1976d2 !important;
  }
  .contact-card.active {
    box-shadow: 0 12px 40px 0 rgba(25, 118, 210, 0.25), 0 2px 12px 0 rgba(25, 118, 210, 0.18);
    transform: scale(1.08);
    border-color: #0d47a1;
    z-index: 3;
  }
  .contact-card.active .feature-icon i {
    color: #0d47a1 !important;
  }
`;

export default function ContactNova() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // State cho card active
  const [activeCard, setActiveCard] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const team = [
    {
      name: "Dr. Nguyễn Thị Mai",
      role: "School Doctor",
      specialty: "General Medicine",
      icon: "bi-heart-pulse",
      color: "text-primary",
      desc: "Responsible for health checks, treatment plans, and emergency care.",
    },
    {
      name: "Mr. Trần Văn Hùng",
      role: "Medical Assistant",
      specialty: "Patient Care",
      icon: "bi-clipboard-heart",
      color: "text-success",
      desc: "Supports the doctor in daily routines and coordinates with teachers.",
    },
    {
      name: "Ms. Lê Hoàng Anh",
      role: "Mental Health Counselor",
      specialty: "Psychology",
      icon: "bi-chat-heart",
      color: "text-info",
      desc: "Provides counseling and emotional support to students.",
    },
  ];

  return (
    <NovaLayout>
      <NovaHeaderSimple variant="light" />

      {/* Hero Section */}
      <section
        className="hero-section position-relative overflow-hidden py-5"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "50vh",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <div className="hero-content text-white" data-aos="fade-up">
                <h1 className="display-4 fw-bold mb-4">
                  Contact Our Health Team
                </h1>
                <p className="lead mb-4">
                  Reach out to our school health professionals for support with
                  appointments, emergencies, or general inquiries. We're here to
                  ensure every student's wellbeing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="position-absolute top-0 start-0 opacity-10">
          <img
            src="/nova-assets/images/arch-line-reverse.svg"
            alt=""
            className="w-100"
          />
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2
                className="display-5 fw-bold text-dark mb-3"
                data-aos="fade-up"
              >
                Get In Touch
              </h2>
              <p
                className="lead text-muted"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Multiple ways to reach our dedicated health team
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div
                className={`card contact-card h-100 border-0 shadow-sm text-center${
                  activeCard === 0 ? " active" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay="200"
                onClick={() => setActiveCard(0)}
                tabIndex={0}
                role="button"
                aria-pressed={activeCard === 0}
              >
                <div className="card-body p-4">
                  <div className="feature-icon mb-4">
                    <i
                      className="bi bi-telephone-fill text-primary"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Emergency Contact</h5>
                  <p className="card-text text-muted mb-3">
                    For immediate medical emergencies during school hours
                  </p>
                  <div className="contact-details">
                    <p className="mb-1">
                      <strong>Emergency:</strong> 024-3-555-0123
                    </p>
                    <p className="mb-1">
                      <strong>Health Office:</strong> 024-3-555-0124
                    </p>
                    <p className="text-muted small">
                      Available: Mon-Fri, 7:30 AM - 4:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className={`card contact-card h-100 border-0 shadow-sm text-center${
                  activeCard === 1 ? " active" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay="300"
                onClick={() => setActiveCard(1)}
                tabIndex={0}
                role="button"
                aria-pressed={activeCard === 1}
              >
                <div className="card-body p-4">
                  <div className="feature-icon mb-4">
                    <i
                      className="bi bi-envelope-fill text-success"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Email Support</h5>
                  <p className="card-text text-muted mb-3">
                    For non-urgent inquiries and appointment scheduling
                  </p>
                  <div className="contact-details">
                    <p className="mb-1">
                      <strong>General:</strong> health@schoolhealth.com
                    </p>
                    <p className="mb-1">
                      <strong>Appointments:</strong>{" "}
                      appointments@schoolhealth.com
                    </p>
                    <p className="text-muted small">Response within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className={`card contact-card h-100 border-0 shadow-sm text-center${
                  activeCard === 2 ? " active" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay="400"
                onClick={() => setActiveCard(2)}
                tabIndex={0}
                role="button"
                aria-pressed={activeCard === 2}
              >
                <div className="card-body p-4">
                  <div className="feature-icon mb-4">
                    <i
                      className="bi bi-geo-alt-fill text-warning"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Visit Us</h5>
                  <p className="card-text text-muted mb-3">
                    Health office location and visiting hours
                  </p>
                  <div className="contact-details">
                    <p className="mb-1">
                      <strong>Location:</strong> Building A, Room 105
                    </p>
                    <p className="mb-1">
                      <strong>Address:</strong> 123 School Street, Hanoi
                    </p>
                    <p className="text-muted small">Open during school hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg" data-aos="fade-up">
                <div className="card-body p-5">
                  <div className="text-center mb-5">
                    <h3 className="fw-bold text-dark mb-3">
                      Send Us A Message
                    </h3>
                    <p className="text-muted">
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="name"
                          className="form-label fw-semibold"
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="email"
                          className="form-label fw-semibold"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="phone"
                          className="form-label fw-semibold"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Your phone number"
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="subject"
                          className="form-label fw-semibold"
                        >
                          Subject *
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="appointment">
                            Schedule Appointment
                          </option>
                          <option value="emergency">Medical Emergency</option>
                          <option value="medication">Medication Inquiry</option>
                          <option value="health-record">Health Records</option>
                          <option value="general">General Question</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label
                          htmlFor="message"
                          className="form-label fw-semibold"
                        >
                          Message *
                        </label>
                        <textarea
                          className="form-control form-control-lg"
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          placeholder="Please describe your inquiry in detail..."
                        ></textarea>
                      </div>
                      <div className="col-12 text-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg px-5"
                        >
                          <i className="bi bi-send me-2"></i>
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2
                className="display-5 fw-bold text-dark mb-3"
                data-aos="fade-up"
              >
                Meet Our Health Team
              </h2>
              <p
                className="lead text-muted"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Dedicated professionals committed to student health and
                wellbeing
              </p>
            </div>
          </div>

          <div className="row g-4">
            {team.map((member, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className="card h-100 border-0 shadow-sm"
                  data-aos="fade-up"
                  data-aos-delay={200 + index * 100}
                >
                  <div className="card-body p-4 text-center">
                    <div className="feature-icon mb-4">
                      <i
                        className={`bi ${member.icon} ${member.color}`}
                        style={{ fontSize: "3rem" }}
                      ></i>
                    </div>
                    <h5 className="card-title fw-bold mb-2">{member.name}</h5>
                    <h6 className="text-primary mb-1">{member.role}</h6>
                    <p className="text-muted small mb-3">{member.specialty}</p>
                    <p className="card-text text-muted small">{member.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Information */}
      <section className="py-5 bg-danger text-white">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div data-aos="fade-up">
                <i
                  className="bi bi-exclamation-triangle-fill mb-3"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h2 className="display-6 fw-bold mb-4">Medical Emergency?</h2>
                <p className="lead mb-4">
                  For immediate medical emergencies during school hours, contact
                  our health office immediately.
                </p>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <a href="tel:024-3-555-0123" className="btn btn-light btn-lg">
                    <i className="bi bi-telephone-fill me-2"></i>
                    Call Emergency: 024-3-555-0123
                  </a>
                </div>
                <p className="mt-3 opacity-75">
                  For life-threatening emergencies, call 115 (Vietnam Emergency
                  Services)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NovaFooter />
    </NovaLayout>
  );
}
