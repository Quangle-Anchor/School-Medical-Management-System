import React, { useState } from "react";
import NovaLayout from "../../components/NovaLayout";
import NovaHeaderSimple from "../../components/NovaHeaderSimple";

// Thêm style cho card hover - chỉ giữ lại active state
const contactCardStyle = `
.contact-card.active {
  border-color: #2196f3 !important;
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.2) !important;
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
      <style>{contactCardStyle}</style>
      <NovaHeaderSimple variant="light" />

      {/* Hero Section */}
      <section
        className="hero-section position-relative overflow-hidden py-5"
        style={{
          background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
          minHeight: "35vh",
        }}
      >
        <div className="container">
          <div
            className="row align-items-center justify-content-center"
            style={{ minHeight: "50vh" }}
          >
            <div className="col-lg-8 mx-auto text-center">
              <div className="hero-content text-white" data-aos="fade-up">
                <h1
                  className="display-4 mb-4 text-white"
                  style={{ fontWeight: "800" }}
                >
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
                className="display-5 fw-bold mb-3"
                style={{ color: "#1976d2" }}
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
                className={`card contact-card h-100 border-0 shadow-sm hover-lift${
                  activeCard === 0 ? " active" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay="200"
                onClick={() => setActiveCard(0)}
                tabIndex={0}
                role="button"
                aria-pressed={activeCard === 0}
              >
                <div className="card-body p-4 text-center">
                  <div className="feature-icon mb-4">
                    <i
                      className="bi bi-telephone-fill text-primary"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Emergency Contact
                  </h5>
                  <p className="card-text text-muted mb-3">
                    For immediate medical emergencies during school hours
                  </p>
                  <div className="contact-details">
                    <p className="mb-1">
                      <strong>Emergency:</strong> 0395-550-123
                    </p>
                    <p className="mb-1">
                      <strong>Health Office:</strong> 0395-550-123
                    </p>
                    <p className="mb-1">
                      <strong>Available:</strong> Mon-Fri, 7:30 AM - 4:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className={`card contact-card h-100 border-0 shadow-sm hover-lift${
                  activeCard === 1 ? " active" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay="300"
                onClick={() => setActiveCard(1)}
                tabIndex={0}
                role="button"
                aria-pressed={activeCard === 1}
              >
                <div className="card-body p-4 text-center">
                  <div className="feature-icon mb-4">
                    <i
                      className="bi bi-envelope-fill text-success"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Email Support
                  </h5>
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
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div
                className={`card contact-card h-100 border-0 shadow-sm hover-lift${
                  activeCard === 2 ? " active" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay="400"
                onClick={() => setActiveCard(2)}
                tabIndex={0}
                role="button"
                aria-pressed={activeCard === 2}
              >
                <div className="card-body p-4 text-center">
                  <div className="feature-icon mb-4">
                    <i
                      className="bi bi-geo-alt-fill text-warning"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h5
                    className="card-title mb-3 text-dark"
                    style={{ fontWeight: "800" }}
                  >
                    Visit Us
                  </h5>
                  <p className="card-text text-muted mb-4">
                    Health office location and visiting hours
                  </p>
                  <div className="contact-details">
                    <p className="mb-3">
                      <strong>Location:</strong> Building A, Room 105
                    </p>
                    <p className="mb-1">
                      <strong>Address:</strong> 123 School Street, Ho Chi Minh
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
              <div
                className="card border-0 shadow-lg hover-lift-lg"
                data-aos="fade-up"
              >
                <div className="card-body p-5">
                  <div className="text-center mb-5">
                    <h3
                      className="fw-bold mb-3"
                      style={{ color: "#0d6efd", fontSize: "2rem" }}
                    >
                      Send Us A Message
                    </h3>
                    <p className="text-muted" style={{ fontSize: "1.1rem" }}>
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
                          className="btn btn-lg px-5"
                          style={{
                            background:
                              "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
                            border: "none",
                            color: "white",
                          }}
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
                className="display-5 fw-bold mb-3"
                style={{ color: "#1976d2" }}
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
                  className="card h-100 border-0 shadow-sm hover-lift"
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
                    <h5
                      className="card-title mb-3 text-dark"
                      style={{ fontWeight: "800" }}
                    >
                      {member.name}
                    </h5>
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
                  <a className="btn btn-light btn-lg">
                    <i className="bi bi-telephone-fill me-2"></i>
                    Call Emergency: 0395-550-123
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
    </NovaLayout>
  );
}
