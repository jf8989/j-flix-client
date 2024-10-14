import React, { useEffect, useState, useCallback } from "react";
import { Navbar, Container, Nav, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFilter } from "../../redux/moviesSlice";
import { FaSearch } from "react-icons/fa";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();

  const handleFilterChange = useCallback(
    (e) => {
      setSearchValue(e.target.value);
      dispatch(setFilter(e.target.value));
    },
    [dispatch]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleClickOutside = (event) => {
      if (
        showSearch &&
        !event.target.closest(".navbar .form-control") &&
        !event.target.closest(".navbar .fa-search")
      ) {
        setShowSearch(false);
        setSearchValue("");
        dispatch(setFilter(""));
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch, dispatch]);

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
          <Nav className="align-items-center">
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
                {showSearch ? (
                  <Form
                    className={`d-flex align-items-center ${
                      showSearch ? "show-search" : ""
                    }`}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Search movies..."
                      value={searchValue}
                      onChange={handleFilterChange}
                      className="bg-dark text-white me-2"
                    />
                  </Form>
                ) : (
                  <Nav.Link onClick={() => setShowSearch(true)}>
                    <FaSearch />
                  </Nav.Link>
                )}
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
