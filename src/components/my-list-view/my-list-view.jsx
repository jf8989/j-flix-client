import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { MovieCard } from "../movie-card/movie-card";
import { BackArrow } from "../back-arrow/back-arrow";
import "./my-list-view.scss";

export const MyListView = ({ user, movies, onToggleFavorite }) => {
  const favoriteMovies = user?.FavoriteMovies || [];
  const filter = useSelector((state) => state.movies.filter);

  const filteredMovies = movies
    .filter((movie) => favoriteMovies.includes(movie._id))
    .filter((movie) =>
      movie.title.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <div className="my-list-view">
      <Container fluid className="p-3 content-margin">
        <div className="list-header">
          <BackArrow className="back-arrow" />
          <h2>Watch List</h2>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onToggleFavorite={onToggleFavorite}
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No movies in your list yet.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default MyListView;
