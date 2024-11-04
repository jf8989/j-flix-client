// index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { Container } from "react-bootstrap";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { store, persistor } from "./redux/store"; // Import persistor
import MainView from "./components/main-view/main-view";
import { BrowserRouter as Router } from "react-router-dom";
import LoadingSpinner from "./components/loading-spinner/loading-spinner";
import { PersistGate } from "redux-persist/integration/react";
import "./index.scss";

// Wrapper component to use hooks
const App = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  return (
    <div className="app-wrapper">
      {isLoading && <LoadingSpinner />}
      <Router>
        <Container className="main-container">
          <MainView />
        </Container>
      </Router>
    </div>
  );
};

// Main component
const MyFlixApplication = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {" "}
        {/* Use persistor here */}
        <App />
      </PersistGate>
    </Provider>
  );
};

// Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<MyFlixApplication />);
