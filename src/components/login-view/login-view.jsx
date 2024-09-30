// src/components/login-view/login-view.jsx
import React, { useState } from "react";

export const LoginView = ({ onLoggedIn, onSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      Username: username,
      Password: password,
    };

    fetch("https://your-api-url.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          onLoggedIn(data.user);
        } else {
          alert("Login failed");
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
