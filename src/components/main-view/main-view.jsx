import React, { useState } from 'react';
import { BookCard } from '../book-card/book-card';

export const MainView = () => {
  const [books, setBooks] = useState([
    { id: 1, title: 'Book Title 1' },
    { id: 2, title: 'Book Title 2' }
  ]);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  return (
    <div>
      {selectedBook ? (
        <div>
          <h1>{selectedBook.title}</h1>
          <button onClick={() => setSelectedBook(null)}>Back</button>
        </div>
      ) : (
        books.map((book) => (
          <BookCard key={book.id} book={book} onClick={() => handleBookClick(book)} />
        ))
      )}
    </div>
  );  
};
