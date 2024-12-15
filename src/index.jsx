// index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { Container } from "react-bootstrap";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { store, persistor } from "./redux/store";
import MainView from "./components/main-view/main-view";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import LoadingSpinner from "./components/loading-spinner/loading-spinner";
import { PersistGate } from "redux-persist/integration/react";
import "./index.scss";

// Create router with ALL future flags
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="*"
      element={
        <Container fluid className="main-container">
          <MainView />
        </Container>
      }
    />
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

// Wrapper component to use hooks
const App = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  return (
    <div className="app-wrapper">
      {isLoading && <LoadingSpinner />}
      <RouterProvider router={router} />
    </div>
  );
};

// Main component
const MyFlixApplication = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
