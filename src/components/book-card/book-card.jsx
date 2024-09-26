import React from 'react';

export const BookCard = ({ book, onClick }) => {
  return <div onClick={onClick}>{book.title}</div>;
};
