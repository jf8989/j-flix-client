import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
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
      bg="black"
      variant="dark"
      expand="lg"
      className={`py-0 ${isScrolled ? "navbar-scrolled" : ""}`}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="me-4">
          <span
            style={{ color: "#E50914", fontWeight: "bold", fontSize: "2rem" }}
          >
            j-Flix
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/" className="nav-link">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/tvshows" className="nav-link">
                  TV Shows
                </Nav.Link>
                <Nav.Link as={Link} to="/movies" className="nav-link">
                  Movies
                </Nav.Link>
                <Nav.Link as={Link} to="/new" className="nav-link">
                  New & Popular
                </Nav.Link>
                <Nav.Link as={Link} to="/mylist" className="nav-link">
                  My List
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {!user && (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="nav-link">
                  Signup
                </Nav.Link>
              </>
            )}
            {user && (
              <>
                <Nav.Link href="#" className="nav-link">
                  Search
                </Nav.Link>
                <Nav.Link href="#" className="nav-link">
                  Notifications
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="nav-link">
                  Profile
                </Nav.Link>
                <Nav.Link onClick={onLoggedOut} className="nav-link">
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
