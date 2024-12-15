import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { setLoading } from "../../redux/loadingSlice";
import "./login-view.scss";

export const LoginView = ({ onLoggedIn }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(setLoading(true));

    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("https://j-flix-omega.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (responseData.token) {
        localStorage.setItem("user", JSON.stringify(responseData.user));
        localStorage.setItem("token", responseData.token);
        onLoggedIn(responseData.user, responseData.token);
      } else {
        alert("Login failed");
      }
    } catch (e) {
      alert("Login failed");
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container className="content-margin-login">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="bg-dark text-white">
            <Card.Body>
              <h2 className="text-center mb-4">Login to j-Flix</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-secondary text-white"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-secondary text-white"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="danger" type="submit" size="lg">
                    Login
                  </Button>
                </div>
              </Form>
              <div className="text-center mt-3">
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-danger">
                    Create an account
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
