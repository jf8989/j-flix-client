import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="social-icons">
          <Col>
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaYoutube />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <ul>
              <li>Audio Description</li>
              <li>Investor Relations</li>
              <li>Legal Notices</li>
            </ul>
          </Col>
          <Col md={3}>
            <ul>
              <li>Help Center</li>
              <li>Jobs</li>
              <li>Cookie Preferences</li>
            </ul>
          </Col>
          <Col md={3}>
            <ul>
              <li>Gift Cards</li>
              <li>Terms of Use</li>
              <li>Corporate Information</li>
            </ul>
          </Col>
          <Col md={3}>
            <ul>
              <li>Media Center</li>
              <li>Privacy</li>
              <li>Contact Us</li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col>
            <button className="service-code">Service Code</button>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="copyright">&copy; 1997-2024 J-Flix, Inc.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
