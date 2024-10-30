// Contact.jsx
import React, { useState } from "react";
import {
  MessageCircle,
  Send,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import "./contact-view.scss";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: "loading", message: "Sending your message..." });

    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="connect__container">
      <div className="connect__header">
        <MessageCircle className="connect__header-icon" />
        <h1 className="connect__header-title">Get in Touch</h1>
      </div>

      <div className="connect__content">
        <div className="connect__grid">
          {/* Contact Information */}
          <div className="connect__info">
            <h2 className="connect__info-title">Contact Information</h2>
            <p className="connect__info-text">
              Fill out the form and I'll get back to you within 24 hours. (This
              is a demo form and it does not send any email, but you can reach
              out to me by email.)
            </p>

            <div className="connect__info-items">
              <div className="connect__info-item">
                <Mail className="connect__info-icon" />
                <div>
                  <h3>Email</h3>
                  <p>juanfrajf.contacto@gmail.com</p>
                </div>
              </div>

              <div className="connect__info-item">
                <Phone className="connect__info-icon" />
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="connect__info-item">
                <MapPin className="connect__info-icon" />
                <div>
                  <h3>Location</h3>
                  <p>Lima, PE</p>
                </div>
              </div>
            </div>

            <div className="connect__info-hours">
              <h3>Office Hours</h3>
              <p>Monday - Friday: 9:00 AM - 5:00 PM GMT-5</p>
              <p>Weekend: By appointment only</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="connect__form-wrapper">
            <form className="connect__form" onSubmit={handleSubmit}>
              <div className="connect__form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="connect__form-input"
                />
              </div>

              <div className="connect__form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  required
                  className="connect__form-input"
                />
              </div>

              <div className="connect__form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject"
                  required
                  className="connect__form-input"
                />
              </div>

              <div className="connect__form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  required
                  className="connect__form-input connect__form-textarea"
                  rows="5"
                />
              </div>

              {formStatus.message && (
                <div
                  className={`connect__form-status ${
                    formStatus.type === "success"
                      ? "connect__form-status--success"
                      : ""
                  }`}
                >
                  <AlertCircle className="connect__status-icon" />
                  <p>{formStatus.message}</p>
                </div>
              )}

              <button type="submit" className="connect__form-submit">
                <span>Send Message</span>
                <Send className="connect__submit-icon" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
