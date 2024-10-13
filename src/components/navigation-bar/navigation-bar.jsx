import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className={isScrolled ? "navbar-scrolled" : ""}
      fixed="top"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <span style={{ color: "#E50914", fontWeight: "bold" }}>j-Flix</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/tvshows">
                  TV Shows
                </Nav.Link>
                <Nav.Link as={Link} to="/movies">
                  Movies
                </Nav.Link>
                <Nav.Link as={Link} to="/new">
                  New & Popular
                </Nav.Link>
                <Nav.Link as={Link} to="/mylist">
                  My List
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
            {user && (
              <>
                <Nav.Link href="#">Search</Nav.Link>
                <Nav.Link href="#">Notifications</Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link onClick={onLoggedOut}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
