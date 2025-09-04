// FavoriteBooks.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: black;
  color: white;
  font-family: 'Georgia', 'Times New Roman', serif;
  min-height: 100vh;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #610000;
  margin-bottom: 20px;
`;

const FavoriteBooksList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const BookCard = styled.div`
  width: 200px;
  background-color: #390000;
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 10px;
  }
`;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FavoriteBooks = ({ favoriteBooks }) => {
  return (
    <Container>
      <Title>My Shelf</Title>
      {favoriteBooks && favoriteBooks.length > 0 ? (
        <FavoriteBooksList>
          {favoriteBooks.map((book, index) => (
            <BookCard key={index}>
              <img src={book.image || 'https://via.placeholder.com/150'} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </BookCard>
          ))}
        </FavoriteBooksList>
      ) : (
        <p style={{ textAlign: 'center' }}>No favorite books added yet!</p>
      )}
    </Container>
  );
};

export default FavoriteBooks;
