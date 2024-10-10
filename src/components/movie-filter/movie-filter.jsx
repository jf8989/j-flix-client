import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/moviesSlice";
import { Form } from "react-bootstrap";

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
    <Form.Control
      type="text"
      placeholder="Filter movies..."
      value={filter}
      onChange={handleFilterChange}
    />
  );
}
