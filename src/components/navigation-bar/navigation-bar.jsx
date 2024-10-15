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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        mobileProfileMenuRef.current &&
        !mobileProfileMenuRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchToggle = (e) => {
    e.stopPropagation();
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

  const handleProfileMenuToggle = (isOpen) => {
    setIsProfileMenuOpen(isOpen);
  };

  const handleMobileProfileMenuToggle = (e) => {
    e.stopPropagation();
    setIsMobileProfileMenuOpen(!isMobileProfileMenuOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className={`styled-navbar ${isScrolled ? "scrolled" : ""}`}
      fixed="top"
      ref={navbarRef}
    >
      <Container fluid className="nav-container">
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="order-0"
          onClick={handleMobileMenuToggle}
        />
        <Navbar.Brand
          as={Link}
          to="/"
          className="order-1"
          style={{ color: "#e50914", fontWeight: "bold" }}
        >
          j-Flix
        </Navbar.Brand>
        <Navbar.Collapse
          id="basic-navbar-nav"
          className={`order-2 ${isMobileMenuOpen ? "show" : ""}`}
        >
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/tvshows"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              TV Shows
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/movies"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/new"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New & Popular
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/mylist"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My List
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav className="ml-auto order-3 d-none d-lg-flex">
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
          <Dropdown
            align="end"
            className={`profile-dropdown ${isProfileMenuOpen ? "show" : ""}`}
            show={isProfileMenuOpen}
            onToggle={handleProfileMenuToggle}
          >
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
        <div className="mobile-icons order-4 d-flex d-lg-none">
          <FaSearch onClick={handleSearchToggle} />
          <FaBell />
          <img
            src={profilePic}
            alt="Profile"
            className="profile-image"
            onClick={handleMobileProfileMenuToggle}
          />
        </div>
      </Container>
      <Form
        className={`mobile-search-form d-lg-none ${isSearchOpen ? "show" : ""}`}
      >
        <Form.Control
          type="text"
          placeholder="Titles, people, genres"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </Form>
      <div
        ref={mobileProfileMenuRef}
        className={`mobile-profile-menu d-lg-none ${
          isMobileProfileMenuOpen ? "show" : ""
        }`}
      >
        <Nav.Link
          as={Link}
          to="/profile"
          onClick={() => setIsMobileProfileMenuOpen(false)}
        >
          Profile
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/manage-profiles"
          onClick={() => setIsMobileProfileMenuOpen(false)}
        >
          Manage Profiles
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/account"
          onClick={() => setIsMobileProfileMenuOpen(false)}
        >
          Account
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/help"
          onClick={() => setIsMobileProfileMenuOpen(false)}
        >
          Help Center
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            onLoggedOut();
            setIsMobileProfileMenuOpen(false);
          }}
        >
          Sign out of Netflix
        </Nav.Link>
      </div>
    </Navbar>
  );
};
