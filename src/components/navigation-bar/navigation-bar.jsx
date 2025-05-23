import React, { useState, useRef, useEffect } from "react";
import { Navbar, Container, Nav, Form, Dropdown, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch, FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"; // Ensure useSelector is imported
import { setFilter } from "../../redux/moviesSlice";
import defaultProfilePic from "../../assets/images/profilepic.jpg";
import "./NavigationBar.scss";

export const NavigationBar = ({
  user,
  onLoggedOut,
  onProfilePictureSelect,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(1);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navbarCollapseRef = useRef(null);

  const dispatch = useDispatch();
  const filter = useSelector((state) => state.movies.filter); // Get filter from Redux

  const [searchValue, setSearchValue] = useState(filter); // Initialize with filter

  // Use default profile picture if no custom picture is selected
  const profilePic = user?.profilePicture || defaultProfilePic;

  // Synchronize searchValue with filter whenever filter changes
  useEffect(() => {
    setSearchValue(filter);
  }, [filter]);

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
        // Only keep the search open if there's actual text in the filter
        if (filter && filter.trim() !== "") {
          // Do nothing - keep it open
        } else {
          setIsSearchOpen(false); // Close it if there's no text
        }
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

      // Check if click is outside navbar collapse and toggle button
      if (
        navbarCollapseRef.current &&
        !navbarCollapseRef.current.contains(event.target) &&
        !event.target.closest(".navbar-toggler") &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, filter]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const navbarToggle = document.querySelector(".navbar-toggler");
      const navbarCollapse = document.querySelector(".navbar-collapse");

      if (
        isMobileMenuOpen &&
        !navbarToggle?.contains(event.target) &&
        !navbarCollapse?.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isMobileMenuOpen]);

  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if the pressed key is 'S' and Shift is held
      if (event.key === "S" && event.shiftKey) {
        event.preventDefault(); // Prevent default behavior
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }

      // Handle Escape key to close search
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        dispatch(setFilter(""));
        setSearchValue("");
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [dispatch]);

  const handleSearchToggle = (e) => {
    if (e) {
      // If event exists (click event)
      e.stopPropagation();
    }
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    // Clear filter when closing search
    if (isSearchOpen) {
      dispatch(setFilter(""));
      setSearchValue("");
    }
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    // setSearchValue(value); // Remove this line
    dispatch(setFilter(value));
  };

  const handleProfileMenuToggle = (isOpen) => {
    setIsProfileMenuOpen(isOpen);
  };

  const handleMobileMenuToggle = (expanded) => {
    setIsMobileMenuOpen(expanded);
  };

  // Separate handlers for notifications
  const handleNotificationsIconClick = (e) => {
    e.stopPropagation();
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
    if (notificationCount > 0) {
      setNotificationCount(0); // Reset notification count when opened
    }
    setIsMobileMenuOpen(false); // Close mobile menu when notifications icon is clicked
  };

  const handleMobileProfileMenuToggle = (e) => {
    e.stopPropagation();
    setIsMobileProfileMenuOpen(!isMobileProfileMenuOpen);
    setIsMobileMenuOpen(false); // Close mobile menu when profile icon is clicked
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

  const handleHomeClick = () => {
    dispatch(setFilter("")); // Clear the filter
    setIsMobileMenuOpen(false); // Keep existing functionality
    window.scrollTo(0, 0); // Add this line to scroll to top
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className={`styled-navbar ${isScrolled ? "scrolled" : ""}`}
      fixed="top"
      expanded={isMobileMenuOpen}
      onToggle={handleMobileMenuToggle}
    >
      <Container fluid className="nav-container">
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="order-0" />
        <Navbar.Brand
          as={Link}
          to="/"
          className="order-1 j-flix-brand"
          onClick={handleHomeClick}
        >
          j-FLIX
        </Navbar.Brand>
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="order-2"
          ref={navbarCollapseRef}
        >
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={handleHomeClick}>
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
              to="/kids"
              onClick={() => setIsMobileMenuOpen(false)}
              className="d-lg-none" // Only show in mobile view
            >
              Kids
            </Nav.Link>
            <Nav.Link as={Link} to="/watchlist" onClick={() => handleHomeClick}>
              Watch List
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav className="ml-auto order-3 d-none d-lg-flex">
          <div className="search-container" ref={searchContainerRef}>
            <div
              className="position-relative"
              style={{ display: "inline-block" }}
            >
              <Form.Control
                ref={searchInputRef}
                type="text"
                placeholder="Titles, people, genres"
                value={filter}
                onChange={handleSearchChange}
                className={`search-input ${isSearchOpen ? "open" : ""}`}
              />
              {filter && filter.trim() !== "" && (
                <button
                  className="position-absolute bg-transparent border-0"
                  onClick={() => dispatch(setFilter(""))}
                  type="button"
                  aria-label="Clear search"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#333",
                    fontSize: "20px",
                    zIndex: 10,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              )}
            </div>
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
              {/* <Dropdown.Item as={Link} to="/profile">
    Profile
  </Dropdown.Item>
  <Dropdown.Divider />
  <Dropdown.Item as={Link} to="/manage-profiles">
    Manage Profiles
  </Dropdown.Item> */}
              <Dropdown.Item onClick={onProfilePictureSelect}>
                Change Profile Picture
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/account">
                Manage Account
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
        <div className="position-relative">
          <Form.Control
            type="text"
            placeholder="Titles, people, genres"
            value={searchValue}
            onChange={handleSearchChange}
          />
          {searchValue && searchValue.trim() !== "" && (
            <button
              className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-white pe-2"
              onClick={() => {
                dispatch(setFilter(""));
                setSearchValue("");
              }}
              type="button"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </Form>
      <div
        ref={mobileProfileMenuRef}
        className={`mobile-profile-menu d-lg-none ${
          isMobileProfileMenuOpen ? "show" : ""
        }`}
      >
        {/* <Nav.Link
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
  </Nav.Link> */}
        <Nav.Link
          as={Link}
          to="/profile-picture"
          onClick={() => setIsMobileProfileMenuOpen(false)}
        >
          Change Profile Picture
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/account"
          onClick={() => setIsMobileProfileMenuOpen(false)}
        >
          Manage Account
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
