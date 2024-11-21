import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { MovieCard } from "../movie-card/movie-card";
import { BackArrow } from "../back-arrow/back-arrow";
import "./my-list-view.scss";

export const MyListView = ({ user, movies, onToggleFavorite }) => {
  const favoriteMovies = user?.FavoriteMovies || [];
  const filter = useSelector((state) => state.movies.filter);
  // Get series from Redux store
  const series = useSelector((state) => state.series.list);

  // Combine and filter both movies and series
  const filteredContent = [...movies, ...series]
    .filter((content) => favoriteMovies.includes(content._id))
    .filter((content) =>
      content.title.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <div className="my-list-view">
      <Container fluid className="p-3 content-margin">
        <div className="list-header">
          <BackArrow className="back-arrow" />
          <h2>Watch List</h2>
        </div>

        {filteredContent.length > 0 ? (
          <div className="movies-grid">
            {filteredContent.map((content) => (
              <MovieCard
                key={content._id}
                movie={content}
                onToggleFavorite={onToggleFavorite}
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nothing in your list yet.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default MyListView;
