// src/components/signup-view/signup-view.jsx
import React, { useState } from "react";

export const SignupView = ({ onSignupSuccess, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error messages

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate that both passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const data = {
      username: username, // Changed from 'Username' to 'username'
      password: password, // Changed from 'Password' to 'password'
      email: email, // Changed from 'Email' to 'email'
      birthday: birthday, // Changed from 'Birthday' to 'birthday'
    };

    fetch("https://j-flix-omega.vercel.app/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Add this to check the response status
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Signup response data:", data); // Add this for debugging
        if (data && data.user) {
          alert("Signup successful");
          onSignupSuccess();
        } else {
          alert("Signup failed: " + (data.message || "Unknown error"));
        }
      })
      .catch((e) => alert("Error: " + e));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Confirm Password:
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Birthday:
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </label>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <button type="submit">Sign Up</button>

      {/* Button to switch to Login */}
      <p>
        Already have an account?{" "}
        <button type="button" onClick={onLogin}>
          Log In Here
        </button>
      </p>
    </form>
  );
};
