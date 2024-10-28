// Privacy.jsx
import React from "react";
import { ShieldCheck } from "lucide-react";
import "./privacy-view.scss";

const Privacy = () => {
  return (
    <div className="privacy__container">
      <div className="privacy__header">
        <ShieldCheck className="privacy__header-icon" />
        <h1 className="privacy__header-title">Privacy Policy</h1>
      </div>

      <div className="privacy__content">
        <section className="privacy__content-section">
          <div className="privacy__content-intro">
            <p className="privacy__content-text">
              At myFlix, we take your privacy seriously. This privacy policy
              explains how we collect, use, and protect your personal
              information when you use our service. Last updated: October 27,
              2024
            </p>
          </div>
        </section>

        <section className="privacy__content-section">
          <h2 className="privacy__content-title">Information We Collect</h2>
          <div className="privacy__info-card">
            <h3 className="privacy__info-subtitle">Account Information</h3>
            <ul className="privacy__info-list">
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Date of birth</li>
            </ul>
          </div>

          <div className="privacy__info-card">
            <h3 className="privacy__info-subtitle">Usage Data</h3>
            <ul className="privacy__info-list">
              <li>Movies you've watched</li>
              <li>Favorite movies</li>
              <li>Viewing history</li>
              <li>Device information</li>
            </ul>
          </div>
        </section>

        <section className="privacy__content-section">
          <h2 className="privacy__content-title">
            How We Use Your Information
          </h2>
          <p className="privacy__content-text">
            We use the collected information to:
          </p>
          <div className="privacy__usage-grid">
            <div className="privacy__usage-item">
              <h4>Personalization</h4>
              <p>Customize your movie recommendations and viewing experience</p>
            </div>
            <div className="privacy__usage-item">
              <h4>Account Management</h4>
              <p>Manage your account and provide customer support</p>
            </div>
            <div className="privacy__usage-item">
              <h4>Service Improvement</h4>
              <p>Analyze usage patterns to improve our service</p>
            </div>
            <div className="privacy__usage-item">
              <h4>Communication</h4>
              <p>Send important updates and newsletters</p>
            </div>
          </div>
        </section>

        <section className="privacy__content-section">
          <h2 className="privacy__content-title">Data Protection</h2>
          <p className="privacy__content-text">
            We implement various security measures to protect your personal
            information:
          </p>
          <div className="privacy__security-features">
            <div className="privacy__security-item">
              <h4>Encryption</h4>
              <p>All data is encrypted in transit and at rest</p>
            </div>
            <div className="privacy__security-item">
              <h4>Access Controls</h4>
              <p>Strict access controls and authentication measures</p>
            </div>
            <div className="privacy__security-item">
              <h4>Regular Audits</h4>
              <p>Continuous security monitoring and auditing</p>
            </div>
          </div>
        </section>

        <section className="privacy__content-section">
          <h2 className="privacy__content-title">Your Rights</h2>
          <div className="privacy__rights-container">
            <div className="privacy__rights-item">
              <h4>Access</h4>
              <p>Request access to your personal data</p>
            </div>
            <div className="privacy__rights-item">
              <h4>Correction</h4>
              <p>Request correction of inaccurate data</p>
            </div>
            <div className="privacy__rights-item">
              <h4>Deletion</h4>
              <p>Request deletion of your personal data</p>
            </div>
            <div className="privacy__rights-item">
              <h4>Portability</h4>
              <p>Request transfer of your data</p>
            </div>
          </div>
        </section>

        <section className="privacy__content-section">
          <h2 className="privacy__content-title">Contact Us</h2>
          <div className="privacy__contact-info">
            <p className="privacy__content-text">
              If you have any questions about our Privacy Policy, please contact
              us:
            </p>
            <ul className="privacy__contact-list">
              <li>Email: privacy@j-flix.com</li>
              <li>Address: 123 Privacy Street, Lima, PE 10001</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
          </div>
        </section>

        <div className="privacy__footer">
          <p className="privacy__footer-text">
            This privacy policy may be updated periodically. Please check back
            regularly for any changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
