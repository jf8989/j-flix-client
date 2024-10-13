import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/moviesSlice";
import { Form, Container } from "react-bootstrap";

export function MovieFilter() {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.movies.filter);

  const handleFilterChange = useCallback(
    (e) => {
      dispatch(setFilter(e.target.value));
    },
    [dispatch]
  );

  return (
    <Container className="mb-4 mt-5 pt-5">
      {" "}
      {/* Added mt-5 and pt-5 for top margin and padding */}
      <Form.Control
        type="text"
        placeholder="Search movies..."
        value={filter}
        onChange={handleFilterChange}
        className="bg-dark text-white"
        style={{ border: "1px solid #ffffff", zIndex: 1050 }}
      />
    </Container>
  );
}
