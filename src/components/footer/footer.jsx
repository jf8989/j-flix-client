import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./footer.scss";

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
              <li>
                <Link to="/audio-description" className="footer-link">
                  Audio Description
                </Link>
              </li>
              <li>
                <Link to="/investor-relations" className="footer-link">
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link to="/legal-notices" className="footer-link">
                  Legal Notices
                </Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <ul>
              <li>
                <Link to="/help" className="footer-link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="footer-link">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/cookie-preferences" className="footer-link">
                  Cookie Preferences
                </Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <ul>
              <li>
                <Link to="/gift-cards" className="footer-link">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/corporate-information" className="footer-link">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <ul>
              <li>
                <Link to="/media-center" className="footer-link">
                  Media Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
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
