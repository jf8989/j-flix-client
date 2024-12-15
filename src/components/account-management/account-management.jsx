// src/components/account-management/account-management.jsx

import React, { useState, useEffect } from "react";
import { Button, Card, Form, Row, Col, Container } from "react-bootstrap";
import { BackArrow } from "../back-arrow/back-arrow";
import "./account-management.scss";

// Keep the formatDate helper function
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const AccountManagement = ({ user, token, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Populate user data
  useEffect(() => {
    if (user) {
      setUsername(user.Username || "");
      setEmail(user.Email || "");
      setBirthday(formatDate(user.Birthday));
    }
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare the object with only modified fields
    const updatedFields = {};

    if (email !== user.Email) {
      updatedFields.Email = email;
    }

    // Format birthday properly before comparing and sending
    const currentBirthday = formatDate(user.Birthday);
    if (birthday && birthday !== currentBirthday) {
      // Send the birthday as a properly formatted date string
      // The API expects the field name to be 'birthday' not 'Birthday'
      updatedFields.birthday = birthday;
    }

    if (password.trim()) {
      if (password !== passwordConfirm) {
        alert("Passwords do not match");
        return;
      }
      updatedFields.password = password;
    }

    if (Object.keys(updatedFields).length === 0) {
      alert("No fields have been updated.");
      return;
    }

    console.log("Updating user with data: ", updatedFields);

    fetch(`https://j-flix-omega.vercel.app/users/${user.Username}`, {
      method: "PUT",
      body: JSON.stringify(updatedFields),
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
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
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
        setUser(null);
        localStorage.clear();
        alert("User deregistered successfully");
      })
      .catch((error) => {
        console.error("Error during deregistration:", error);
        alert(error.message || "Failed to deregister");
      });
  };

  return (
    <Container fluid className="account-management content-margin">
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <BackArrow className="mt-1" />
        </Col>
        <Col>
          <h2 className="text-white mb-0">Account Management</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="bg-dark text-white account-card">
            <Card.Body>
              <Card.Title as="h2" className="section-title mb-4">
                Account Information
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <div className="info-section">
                  <Form.Group controlId="formUsername" className="mb-4">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      readOnly
                      className="form-field"
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="form-field"
                    />
                  </Form.Group>

                  <Form.Group controlId="formBirthday" className="mb-4">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="form-field"
                    />
                  </Form.Group>

                  <div className="password-section mt-4 pt-3 border-top">
                    <h3 className="mb-3">Change Password</h3>
                    <Form.Group controlId="formPassword" className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-field"
                        autoComplete="new-password"
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="formPasswordConfirm"
                      className="mb-4"
                    >
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="form-field"
                        autoComplete="new-password"
                      />
                    </Form.Group>
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    <Button
                      variant="danger"
                      type="submit"
                      className="update-btn"
                    >
                      Update Profile
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={handleDeregister}
                      className="deregister-btn"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountManagement;
