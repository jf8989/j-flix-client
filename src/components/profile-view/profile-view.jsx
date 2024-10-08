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
    setUsername(user.Username);
    setEmail(user.Email);
    setBirthday(formatDate(user.Birthday));
    setFavoriteMovies(user.favoriteMovies || []); // Use favoriteMovies from user state
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare the object with only modified fields
    const updatedFields = {};
    if (username !== user.Username) updatedFields.username = username;
    if (password) updatedFields.password = password; // If the password is not empty, update it
    if (email !== user.Email) updatedFields.email = email;
    if (birthday !== formatDate(user.Birthday))
      updatedFields.birthday = birthday;

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

  const handleToggleFavorite = (movieId) => {
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
        {movies.length > 0 && user.favoriteMovies.length > 0 ? (
          <Row>
            {movies
              .filter((movie) => user.favoriteMovies.includes(movie._id))
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
