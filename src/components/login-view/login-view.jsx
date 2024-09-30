// src/components/login-view/login-view.jsx
import React, { useState } from "react";

export const LoginView = ({ onLoggedIn, onSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username: username.toLowerCase(), // Convert to lowercase here
      password: password,
    };

    // Add this console log
    console.log("Sending login data:", data);

    fetch("https://j-flix-omega.vercel.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:1234",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Add this console log
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Add this console log
        console.log("Login response data:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          onLoggedIn(data.user);
        } else {
          alert("Login failed");
        }
      })
      .catch((e) => {
        console.error("Login error:", e);
        alert("Error: " + e.message);
      });
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
      <button type="submit">Login</button>

      {/* Button to switch to Signup */}
      <p>
        Don’t have an account?{" "}
        <button type="button" onClick={onSignup}>
          Sign Up Here
        </button>
      </p>
    </form>
  );
};
