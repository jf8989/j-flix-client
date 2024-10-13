import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="social-icons">
          <FaFacebookF />
          <FaInstagram />
          <FaTwitter />
          <FaYoutube />
        </div>
        <div className="footer-links">
          <div className="col">
            <ul>
              <li>Audio Description</li>
              <li>Investor Relations</li>
              <li>Legal Notices</li>
            </ul>
          </div>
          <div className="col">
            <ul>
              <li>Help Center</li>
              <li>Jobs</li>
              <li>Cookie Preferences</li>
            </ul>
          </div>
          <div className="col">
            <ul>
              <li>Gift Cards</li>
              <li>Terms of Use</li>
              <li>Corporate Information</li>
            </ul>
          </div>
          <div className="col">
            <ul>
              <li>Media Center</li>
              <li>Privacy</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        <div className="text-center">
          <button className="service-code">Service Code</button>
        </div>
        <p className="copyright">&copy; 2024 J-Flix, Inc.</p>
      </Container>
    </footer>
  );
};
