// src/components/signup-view/signup-view.jsx
import React, { useState } from "react";

export const SignupView = ({ onSignupSuccess }) => {
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
      username: username,
      password: password,
      email: email,
      birthday: birthday,
    };

    fetch("https://j-flix-omega.vercel.app/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json(); // Parse the response
      })
      .then((data) => {
        console.log("Signup response data:", data);
        if (data && data.user) {
          // User registered successfully, now try to log the user in automatically
          autoLogin(username, password); // Attempt login after signup
        } else {
          alert("Signup failed: " + (data.message || "Unknown error"));
        }
      })
      .catch((e) => {
        alert("Error: " + e);
      });
  };

  const autoLogin = (username, password) => {
    // Attempt to log the user in automatically after signup
    fetch("https://j-flix-omega.vercel.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.token) {
          // Store the user and token in localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);

          // Call the onSignupSuccess to update the app state and redirect
          onSignupSuccess(data.user, data.token);
        } else {
          throw new Error("Login failed");
        }
      })
      .catch((e) => {
        alert("Login failed: " + e.message);
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
        <button type="button" onClick={() => (window.location.href = "/login")}>
          Log In Here
        </button>
      </p>
    </form>
  );
};
