import React, { useState, useEffect } from "react";
import { Button, Card, Form, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { MovieCard } from "../movie-card/movie-card";
import { BackArrow } from "../back-arrow/back-arrow";
import "./profile-view.scss";

// Function to format the date to yyyy-MM-dd for input type="date"
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Get the date part only
};

export const ProfileView = ({ user, token, setUser, movies }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteSeries, setFavoriteSeries] = useState([]);
  const filter = useSelector((state) => state.movies.filter);
  const series = useSelector((state) => state.series.list);

  // Populate user data and favorite movies
  useEffect(() => {
    if (user) {
      setUsername(user.Username || "");
      setEmail(user.Email || "");
      setBirthday(formatDate(user.Birthday));
      setFavoriteMovies(user.FavoriteMovies || []);
      setFavoriteSeries(user.FavoriteSeries || []);
    }
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare the object with only modified fields
    const updatedFields = {};
    if (username !== user.Username) updatedFields.Username = username;
    if (password) updatedFields.Password = password; // If the password is not empty, update it
    if (email !== user.Email) updatedFields.Email = email;
    if (birthday !== formatDate(user.Birthday))
      updatedFields.Birthday = birthday;

    if (Object.keys(updatedFields).length === 0) {
      alert("No fields have been updated.");
      return;
    }

    console.log("Updating user with data: ", updatedFields);

    fetch(`https://j-flix-omega.vercel.app/users/${user.Username}`, {
      method: "PUT",
      body: JSON.stringify(updatedFields), // Send only the modified fields
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("Update successful: ", data);
          localStorage.setItem("user", JSON.stringify(data)); // Update localStorage with the new user data
          setUser(data); // Update the user state
          alert("Update successful");
        }
      })
      .catch((error) => {
        console.error("Error during update:", error);
        alert("Update failed");
      });
  };

  const handleDeregister = () => {
    fetch(`https://j-flix-omega.vercel.app/users/${user.Username}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((err) => {
            throw new Error(err.message || "Failed to deregister");
          });
        }
      })
      .then(() => {
        setUser(null); // Clear user data
        localStorage.clear(); // Clear localStorage
        alert("User deregistered successfully");
      })
      .catch((error) => {
        console.error("Error during deregistration:", error);
        alert(error.message || "Failed to deregister");
      });
  };

  const onToggleFavorite = (movieId) => {
    const isFavorite = favoriteMovies.includes(movieId);
    const url = `https://j-flix-omega.vercel.app/users/${user.Username}/movies/${movieId}`;
    const method = isFavorite ? "DELETE" : "POST";

    console.log(`Sending ${method} request to: ${url}`);

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          // Throw error if response is not OK
          throw new Error(
            `Failed to ${isFavorite ? "remove" : "add"} favorite movie`
          );
        }
        return response.json();
      })
      .then((updatedUser) => {
        // Update favorite movies on success
        const updatedFavorites = isFavorite
          ? favoriteMovies.filter((id) => id !== movieId)
          : [...favoriteMovies, movieId];

        setFavoriteMovies(updatedFavorites);
        setUser({ ...user, FavoriteMovies: updatedFavorites });

        // Persist the updated user in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, FavoriteMovies: updatedFavorites })
        );

        alert(
          `Successfully ${isFavorite ? "removed from" : "added to"} favorites!`
        );
      })
      .catch((error) => {
        console.error(error); // Log the error for debugging
        alert(
          `Error: Could not ${isFavorite ? "remove from" : "add to"} favorites`
        );
      });
  };

  const formatRating = (rating) => {
    if (!rating) return "N/A";
    return Number(rating).toFixed(1);
  };

  return (
    <Container fluid className="profile-view p-3 content-margin">
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <BackArrow className="mt-1" />
        </Col>
        <Col>
          <h2 className="text-white mb-0">Profile Information</h2>
        </Col>
      </Row>
      <Row>
        <Col md={4} lg={3} className="mb-4">
          <Card className="bg-dark text-white h-100">
            <Card.Body>
              <Card.Title as="h2" className="text-danger mb-4">
                Profile Information
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                    readOnly
                    className="bg-secondary text-white"
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>New Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary text-white"
                  />
                </Form.Group>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary text-white"
                  />
                </Form.Group>
                <Form.Group controlId="formBirthday" className="mb-3">
                  <Form.Label>Birthday:</Form.Label>
                  <Form.Control
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="bg-secondary text-white"
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button variant="danger" type="submit">
                    Update
                  </Button>
                  <Button variant="outline-danger" onClick={handleDeregister}>
                    Deregister
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8} lg={9}>
          <h2 className="section-title main-title">My Favorites</h2>
          {/* Movies Section */}
          <h3 className="section-title sub-title">Movies</h3>
          {movies.length > 0 && favoriteMovies.length > 0 ? (
            <Row xs={2} sm={2} md={4} lg={5} className="g-4 mx-0">
              {" "}
              {movies
                .filter((movie) => favoriteMovies.includes(movie._id))
                .filter((movie) =>
                  movie.title.toLowerCase().includes(filter.toLowerCase())
                )
                .map((movie) => (
                  <Col key={movie._id}>
                    <MovieCard
                      key={movie._id}
                      movie={movie}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={true}
                      rating={formatRating(movie.rating)} // Add this prop
                    />
                  </Col>
                ))}
            </Row>
          ) : (
            <p className="no-content-message">No favorite movies selected.</p>
          )}

          {/* TV Series Section */}
          <h3 className="section-title sub-title">TV Series</h3>
          {series.length > 0 && favoriteSeries.length > 0 ? (
            <Row xs={2} sm={2} md={4} lg={5} className="g-4 mx-0">
              {series
                .filter((show) => favoriteSeries.includes(show._id))
                .filter((show) =>
                  show.title.toLowerCase().includes(filter.toLowerCase())
                )
                .map((show) => (
                  <Col key={show._id}>
                    <MovieCard
                      key={show._id}
                      movie={show}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={true}
                      rating={formatRating(show.rating)} // Added here for series
                    />
                  </Col>
                ))}
            </Row>
          ) : (
            <p className="no-content-message">No favorite series selected.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};
