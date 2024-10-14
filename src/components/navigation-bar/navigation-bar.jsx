import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Form, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch, FaBell } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setFilter } from "../../redux/moviesSlice";
import profilePic from "../../assets/images/profilepic.jpg";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchValue("");
      dispatch(setFilter(""));
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    dispatch(setFilter(value));
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className={`styled-navbar ${isScrolled ? "scrolled" : ""}`}
      fixed="top"
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{ color: "#e50914", fontWeight: "bold" }}
        >
          j-Flix
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
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
          </Nav>
          <Nav>
            <div className="search-container">
              <FaSearch
                onClick={handleSearchToggle}
                style={{ cursor: "pointer", marginRight: "20px" }}
              />
              <Form.Control
                ref={searchInputRef}
                type="text"
                placeholder="Titles, people, genres"
                value={searchValue}
                onChange={handleSearchChange}
                className={`search-input ${isSearchOpen ? "open" : ""}`}
              />
            </div>
            <Nav.Link as={Link} to="/kids">
              Kids
            </Nav.Link>
            <Nav.Link href="#" title="Notifications">
              <FaBell />
            </Nav.Link>
            <Dropdown align="end" className="profile-dropdown">
              <Dropdown.Toggle as={Nav.Link}>
                <img src={profilePic} alt="Profile" className="profile-image" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                  Profile
                </Dropdown.Item>
                <Dropdown.Item>Profile 2</Dropdown.Item>
                <Dropdown.Item>Profile 3</Dropdown.Item>
                <Dropdown.Item>Profile 4</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/manage-profiles">
                  Manage Profiles
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/account">
                  Account
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/help">
                  Help Center
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={onLoggedOut}>
                  Sign out of Netflix
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
