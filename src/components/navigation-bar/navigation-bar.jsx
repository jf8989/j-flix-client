import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Form, Dropdown, Badge } from "react-bootstrap";
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
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(1);
  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside search container
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        !event.target.closest(".mobile-search-form")
      ) {
        setIsSearchOpen(false);
        setSearchValue("");
        dispatch(setFilter(""));
      }

      // Check if click is outside notifications menu
      if (
        notificationsMenuRef.current &&
        !notificationsMenuRef.current.contains(event.target) &&
        !event.target.closest(".notifications-toggle")
      ) {
        setIsNotificationsMenuOpen(false);
      }

      // Check if click is outside mobile profile menu
      if (
        mobileProfileMenuRef.current &&
        !mobileProfileMenuRef.current.contains(event.target) &&
        !event.target.closest(".profile-image")
      ) {
        setIsMobileProfileMenuOpen(false);
      }

      // Check if click is outside navbar collapse
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const handleSearchToggle = (e) => {
    e.stopPropagation();
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
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

  // Separate handlers for notifications
  const handleNotificationsIconClick = (e) => {
    e.stopPropagation();
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
    if (notificationCount > 0) {
      setNotificationCount(0); // Reset notification count when opened
    }
  };

  const handleNotificationsDropdownToggle = (isOpen) => {
    setIsNotificationsMenuOpen(isOpen);
    if (isOpen && notificationCount > 0) {
      setNotificationCount(0); // Reset notification count when opened
    }
  };

  const handleProfileHover = (isHovered) => {
    if (window.innerWidth >= 992) {
      // Only apply hover effect on desktop
      setIsProfileHovered(isHovered);
    }
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className={`styled-navbar ${isScrolled ? "scrolled" : ""}`}
      fixed="top"
      ref={navbarRef}
      expanded={isMobileMenuOpen}
      onToggle={handleMobileMenuToggle}
    >
      <Container fluid className="nav-container">
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="order-0" />
        <Navbar.Brand
          as={Link}
          to="/"
          className="order-1"
          style={{ color: "#e50914", fontWeight: "bold" }}
        >
          j-Flix
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav" className="order-2">
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
          <div className="search-container" ref={searchContainerRef}>
            <Form.Control
              ref={searchInputRef}
              type="text"
              placeholder="Titles, people, genres"
              value={searchValue}
              onChange={handleSearchChange}
              className={`search-input ${isSearchOpen ? "open" : ""}`}
            />
            <FaSearch
              onClick={handleSearchToggle}
              style={{ cursor: "pointer", marginRight: "20px" }}
            />
          </div>
          <Nav.Link as={Link} to="/kids">
            Kids
          </Nav.Link>
          <Dropdown
            align="end"
            show={isNotificationsMenuOpen}
            onToggle={handleNotificationsDropdownToggle}
          >
            <Dropdown.Toggle
              as={Nav.Link}
              id="notifications-dropdown"
              className="notifications-toggle"
              style={{ position: "relative" }}
            >
              <FaBell />
              {notificationCount > 0 && (
                <Badge
                  pill
                  bg="danger"
                  style={{ position: "absolute", top: "0", right: "0" }}
                >
                  {notificationCount}
                </Badge>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu ref={notificationsMenuRef}>
              <Dropdown.Item>Welcome to j-Flix!</Dropdown.Item>
              {/* Add more notifications as needed */}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            align="end"
            className={`profile-dropdown ${isProfileHovered ? "show" : ""}`}
            show={isProfileMenuOpen || isProfileHovered}
            onToggle={handleProfileMenuToggle}
            onMouseEnter={() => handleProfileHover(true)}
            onMouseLeave={() => handleProfileHover(false)}
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
                Sign out of j-Flix
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
        <div className="mobile-icons order-4 d-flex d-lg-none">
          <FaSearch onClick={handleSearchToggle} />
          <div style={{ position: "relative" }}>
            <FaBell
              onClick={handleNotificationsIconClick}
              className="notifications-toggle"
            />
            {notificationCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 5px",
                  fontSize: "10px",
                }}
              >
                {notificationCount}
              </span>
            )}
          </div>
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
          Sign out of j-Flix
        </Nav.Link>
      </div>
      <div
        ref={notificationsMenuRef}
        className={`mobile-notifications-menu d-lg-none ${
          isNotificationsMenuOpen ? "show" : ""
        }`}
      >
        <div className="notification-item">Welcome to j-Flix!</div>
        {/* Add more notification items as needed */}
      </div>
    </Navbar>
  );
};
