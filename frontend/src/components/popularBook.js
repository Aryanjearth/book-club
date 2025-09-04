import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const PageContainer = styled.div`
  font-family: 'Georgia', 'Times New Roman', serif;
  background-color:#390000;  /* Similar to the color from LandingPage */
  min-height: 100vh;
  text-align: center;
  padding: 60px 20px 20px;  /* Added padding-top to avoid overlap with header */
`;

const Title = styled.h1`
  font-size: 3rem;
  color: white;
  margin-bottom: 30px;
  z-index: 10;
`;

const BookList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  justify-items: center;
`;

const BookItem = styled.li`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 220px;
  text-align: center;
`;

const BookTitle = styled.h2`
  font-size: 1.6rem;
  color: #333;
  margin-top: 10px;  /* Adds space between the image and the title */
  word-wrap: break-word;  /* Allows long words to wrap */
  max-width: 100%;        /* Ensures the title stays within the card */
  text-align: center;
  line-height: 1.2;
  padding: 0 10px;  /* Adds some padding around the title */
  overflow-wrap: break-word;
`;


const BookAuthor = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin: 10px 0;
`;

const BookCover = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
`;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PopularBooksPage = () => {
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    // Fetch popular books from your backend or any API here
    axios.get('${API_BASE_URL}/popular-books/month')
      .then(response => {
        setPopularBooks(response.data.data);  // Assuming response has a 'data' field
      })
      .catch(error => {
        console.error("Error fetching popular books:", error);
      });
  }, []);

  return (
    <PageContainer>
      <Title>Bestsellers</Title>
      <BookList>
        {popularBooks.map(book => (
          <BookItem key={book.title}>
            <BookCover src={book.coverImage} alt={book.title} />
            <BookTitle>{book.title}</BookTitle>
            <BookAuthor>{book.author}</BookAuthor>
          </BookItem>
        ))}
      </BookList>
    </PageContainer>
  );
};

export default PopularBooksPage;
