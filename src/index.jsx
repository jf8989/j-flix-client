// src/index.jsx
import React from "react";
import ReactDOM from "react-dom";
import { Container } from "react-bootstrap";
import MainView from "./components/main-view/main-view";
import "./index.scss";

// Wrap the MainView component with a Bootstrap Container
ReactDOM.render(
  <Container>
    <MainView />
  </Container>,
  document.getElementById("app")
);
