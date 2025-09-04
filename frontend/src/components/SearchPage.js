import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import backgroundImage from '../assets/background.jpg'; // Correct path for the image

// Styled Components
const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 800px;
  width: 100%;
`;

const Quote = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 30px;
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #390000;
  border-radius: 5px 0 0 5px;
  outline: none;
  width: 300px;
`;

const SearchButton = styled.button`
  font-family: 'Georgia', 'Times New Roman', serif;
  padding: 10px 20px;
  background-color: #610000;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 0 5px 5px 0;
  border: 2px solid #390000;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #B22222;
  }
`;

const FavoriteButton = styled.button`
  font-family: 'Georgia', 'Times New Roman', serif;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: ${(props) => (props.added ? 'white' : '#610000')};
  color: white;
  color :  ${(props) => (props.added ? 'black' : 'white')};

  &:hover {
    background-color: ${(props) => (props.added ? '#610000' : '#B22222')};
  }
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
  text-align: left;
  color: white;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Book = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const BookImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 5px;
`;

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;


const BuyLink = styled.button`
  font-family: 'Georgia', 'Times New Roman', serif;
  padding: 10px 20px;
  background-color: #610000;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #B22222;
  }
`;

const PdfLink = styled.button`
  font-family: 'Georgia', 'Times New Roman', serif;
  padding: 10px 20px;
  background-color: #00cc66;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #008f4f;
  }
`;

const Rating = styled.p`
  font-size: 1rem;
  color: #ffcc00; // Gold color for rating stars
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
  font-weight: bold;
`;
const API_BASE_URL = process.env.url;

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch books based on the search query
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/fetchBook/allBooks`, { link: query });
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save the book to the database, including the userId
  const saveBookToDatabase = async (book) => {
    const userId = localStorage.getItem('userId'); // Assuming you store the user ID in localStorage

    if (!userId) {
      alert('User not authenticated. Please log in first.');
      return;
    }

    const bookData = {
      ...book,
      userId, // Add userId to the book data
    };
    console.log(bookData);
    try {
      const response = await axios.post(`${API_BASE_URL}/book_worms/api/v1/auth/favorites`, bookData);
      if (response.status === 201) { // Success response
        const data = response.data;
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('bookId', data.data._id);
        console.log(data.data._id)
        
      }
      // If the book was added successfully, show the success message
      if (response.status === 201 && response.data.message === 'Book added to favorites successfully') {
        alert('Book saved to the database!');
      }
    } catch (error) {
      // Check if the error response contains the "Book already exists" message
      if (error.response && error.response.status === 400) {
        if (error.response.data.message === 'This book is already in your favorites') {
          alert('This book is already in your favorites!');
        } else {
          alert('Failed to save book.');
        }
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      fetchBooks();
    }
  };

  // Add the book to favorites and save it to the database
  const addToFavorites = (book) => {
    if (!favorites.some((favorite) => favorite.title === book.title)) {
      setFavorites((prevFavorites) => [...prevFavorites, book]);
      saveBookToDatabase(book);
    } else {
      alert('This book is already in your favorites!');
    }
  };

  return (
    <Container>
      <Overlay>
        <Quote>The only thing you absolutely have to know is the location of the library. So here's one for you!</Quote>
        <SearchBarContainer>
          <SearchInput type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for something..." />
          <SearchButton onClick={handleSubmit} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </SearchButton>
        </SearchBarContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ResultsContainer>
          {books.map((book, index) => (
            <Book key={index}>
              {book.imageLinks?.smallThumbnail && <BookImage src={book.imageLinks.smallThumbnail} alt={book.title} />}
              <BookInfo>
                <h2>{book.title}</h2>
                <p>Author: {book.authors.join(', ')}</p>
                <p>Published Date: {book.publishedDate}</p>
                <Rating>
                  {(() => {
                    const fullStars = Math.floor(book.review); // Number of full stars
                    const hasHalfStar = book.review % 1 >= 0.5; // Check for a half-star
                    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

                    // Generate the star string
                    const stars =
                      '★'.repeat(fullStars) + // Full stars
                      (hasHalfStar ? '½' : '') + // Half-star if applicable
                      '☆'.repeat(emptyStars); // Empty stars

                    return `${stars} `;
                  })()}
                </Rating>

                {book.buyLink && book.buyLink !== 'Not Available' ? (
                  <BuyLink onClick={() => window.open(book.buyLink, '_blank')}>
                    Buy this book
                  </BuyLink>
                ) : (
                  <p>Buy link not available</p>
                )}
                <br />
                <FavoriteButton
                  onClick={() => addToFavorites(book)}
                  added={favorites.some((favorite) => favorite.title === book.title)}
                >
                  {favorites.some((favorite) => favorite.title === book.title)
                    ? 'Added to shelf'
                    : 'Add to shelf'}
                </FavoriteButton>

                {book.pdfLink && (
                  <PdfLink onClick={() => window.open(book.pdfLink, '_blank')}>
                    Read PDF
                  </PdfLink>
                )}
              </BookInfo>
            </Book>
          ))}
        </ResultsContainer>
      </Overlay>
    </Container>
  );
};

export default SearchPage;
