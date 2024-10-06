// src/components/profile-view/profile-view.jsx
import React, { useState, useEffect } from "react";
import { Button, Card, Form, Row, Col } from "react-bootstrap"; // Import Row and Col
import { MovieCard } from "../movie-card/movie-card";

// Function to format the date to yyyy-MM-dd for input type="date"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Get the date part only
};

export const ProfileView = ({ user, token, setUser, movies }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // Populate user data and favorite movies
  useEffect(() => {
    setUsername(user.Username); // Adjust to user.Username
    setEmail(user.Email);
    setBirthday(formatDate(user.Birthday)); // Format birthday to yyyy-MM-dd
    setFavoriteMovies(user.FavoriteMovies || []); // Ensure it's an array
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password,
      email: email,
      birthday: birthday,
    };

    fetch(`https://j-flix-omega.vercel.app/users/${user.Username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Update successful");
          return response.json();
        } else {
          alert("Update failed");
        }
      })
      .then((data) => {
        if (data) {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
      });
  };

  const handleDeregister = () => {
    fetch(`https://j-flix-omega.vercel.app/users/${user.Username}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        setUser(null);
        localStorage.clear();
        alert("User deregistered successfully");
      } else {
        alert("Failed to deregister");
      }
    });
  };

  const handleToggleFavorite = (movieId) => {
    const isFavorite = favoriteMovies.includes(movieId);
    const url = `https://j-flix-omega.vercel.app/users/${user.Username}/movies/${movieId}`;
    const method = isFavorite ? "DELETE" : "POST";

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        const updatedFavorites = isFavorite
          ? favoriteMovies.filter((id) => id !== movieId)
          : [...favoriteMovies, movieId];
        setFavoriteMovies(updatedFavorites);
        setUser({ ...user, FavoriteMovies: updatedFavorites });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, FavoriteMovies: updatedFavorites })
        );
      } else {
        alert("Failed to update favorites");
      }
    });
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Profile</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="3"
              readOnly
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBirthday">
            <Form.Label>Birthday:</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
        <Button variant="danger" onClick={handleDeregister}>
          Deregister
        </Button>

        <h2>Favorite Movies</h2>
        {movies.length > 0 && favoriteMovies.length > 0 ? (
          <Row>
            {movies
              .filter((movie) => favoriteMovies.includes(movie._id))
              .map((movie) => (
                <Col className="mb-4" key={movie._id} md={3}>
                  <MovieCard
                    movie={movie}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={true}
                  />
                </Col>
              ))}
          </Row>
        ) : (
          <p>No favorite movies selected.</p>
        )}
      </Card.Body>
    </Card>
  );
};
