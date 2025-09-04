import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import images
import rb1Image from '../assets/RB3.png'; // Adjust the path as necessary
import rb2Image from '../assets/RB4.png';
import rb3Image from '../assets/RB5.png';
import rb4Image from '../assets/RB6.png';

const ProfilePageContainer = styled.div`
  display: flex;
  background-color: black;
  color: white;
  font-family: 'Georgia', 'Times New Roman', serif;
  min-height: 100vh;
`;

const NavbarHeight = '60px'; // Adjust this to the height of your navbar

const Sidebar = styled.div`
  width: 300px; /* Width of the sidebar */
  background-color: #390000; /* Sidebar background color */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  position: fixed; /* Makes the sidebar stay in place while scrolling */
  height: calc(100vh - ${NavbarHeight}); /* Ensures the sidebar height spans the viewport minus navbar */
  top: ${NavbarHeight}; /* Aligns the sidebar below the navbar */
  left: 0; /* Aligns the sidebar to the left */
  z-index: 10; /* Ensures the sidebar appears above the main content */
  margin-top: 30px; /* Adds space at the top of the sidebar to avoid overlapping with navbar */
`;

const ProfilePic = styled.img`
  width: 120px; /* Adjust size for the profile picture */
  height: 120px;
  border-radius: 50%;
  margin-bottom: 15px;
  border: 2px solid white; /* Border around profile picture */
`;

const UserName = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
  color: white;
`;

const EditButton = styled.button`
  background-color: black;
  color: white;
  border: 2px solid white;
  padding: 8px 12px;
  margin-bottom: 20px;
  cursor: pointer;
  font-size: 0.9em;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: white;
    color: #610000;
  }
`;


const FavoriteBook = styled.div`
  width: 150px;
  background-color: #390000;
  color: white;
  padding: 2px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9em;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; /* Needed to position the delete button */
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  &:hover .deleteButton {
    display: block; /* Show delete button on hover */
  }

  .deleteButton {
    display: none; /* Hide by default */
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #610000;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 0.8em;
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: red;
    }
  }
`;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SidebarLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1em;
  padding: 10px 0;
  transition: color 0.3s ease;

  &:hover {
    color: #f0f0f0; /* Slightly lighter on hover */
  }
`;

const MainSection = styled.div`
  flex: 1;
  padding: 30px;
  background-color: black;
  margin-left: 300px; /* Adds left margin equal to the sidebar width */
  margin-top: ${NavbarHeight}; /* Adds top margin to ensure content starts below the navbar */
  position: relative; /* Allows positioning of children elements */
`;

const Section = styled.div`
  background-color: #390000; /* Section background color */
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: white;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.3em;
`;

const AddButton = styled.button`
  background-color: black;
  color: white;
  border: 2px solid white;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.9em;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: white;
    color: #610000;
  }
`;

const RecommendedBooksSection = styled(Section)`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px; /* Adjust this value to align with the sidebar */
`;

const RecommendedBook = styled.div`
  width: 150px;
  background-color: Black;
  color: white;
  padding: 2px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9em;

  img {
    width: 100%;
    height: 210px;
    border-radius: 8px;
  }
`;

const Footer = styled.footer`
  text-align: center;
  color: white;
  padding: 20px;
  font-size: 0.8em;
`;

// Profile Page Component
const MyProfile = () => {
  const [clubs, setClubs] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]); // State for favorite books
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false); // State for favorite books loading
  const [errorClubs, setErrorClubs] = useState(null);
  const [errorFavorites, setErrorFavorites] = useState(null); // State for favorite books error
  const [readBooks, setReadBooks] = useState([]);
  const [loadingReadBooks, setLoadingReadBooks] = useState(false); // State for loading books I have read
  const [errorReadBooks, setErrorReadBooks] = useState(null); 
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const fetchReadBooks = async () => {
    setLoadingReadBooks(true);
    setErrorReadBooks(null);
  
    try {
      const userId = localStorage.getItem('userId');
      const dataToSend = { userId }; // Prepare data to send
  
      const response = await axios.post(`${API_BASE_URL}/book_worms/api/v1/auth/getReadBooks`, dataToSend);
  
      if (!response.data.success) {
        alert(response.data.message); // Alert the user if the response isn't successful
      }
  
      if (response.data.success) {
        if (response.data.message === "No read books available.") {
          setReadBooks([]); // Empty the array if there are no read books
          setErrorReadBooks(response.data.message); // Set the error message
        } else {
          setReadBooks(response.data.data || []); // Update the state with the data if success
          setErrorReadBooks(null); // Clear the error
        }
      }
    } catch (error) {
      console.error('Error fetching read books:', error);
      setReadBooks([]); // Reset read books if error
      setErrorReadBooks('Error fetching read books.');
    } finally {
      setLoadingReadBooks(false); // Set loading state to false when done
    }
  };
  const handleAddToReadBooks = async (book) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }
  
    const dataToSend = {
      ...book,
      userId, // Add userId to the request
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/book_worms/api/v1/auth/read-books`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check the response message and handle accordingly
      if (response.data.message === 'This book is already in your Read Books') {
        alert(response.data.message); // Alert if the book is already added
      } else if (response.data.message === 'Book added to Read Books and linked to the user') {
        alert('Book added to "Books I\'ve Read" and linked to your account!');
      } else {
        alert('Unexpected response from the server.');
      }
    } catch (error) {
      // Check if the error response contains the "Book already exists" message
      if (error.response && error.response.status === 400) {
        if (error.response.data.message === 'This book is already in your Read Books') {
          alert('This book is already in your Read Books');
        } else {
          alert('Failed to save book.');
        }
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };
  
  

  useEffect(() => {
    if (!localStorage.status) {
      alert('You need to log in first!');
    window.location.href = '/';
    }
  })


  const dataToSend = {
    userId, // Add userId
  };
  const handleDeleteClub = async () => {
    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }
    const clubId = localStorage.getItem('clubId');

    const dataToSend = {
      userId,
      clubId, // Pass the correct clubId here
    };
    console.log(dataToSend)
    try {
      const response = await axios.post(`${API_BASE_URL}/book_worms/api/v1/auth/deleteClubs`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        alert(response.data.message); // Notify user of successful deletion
        fetchClubs(); // Refresh the list of clubs
      } else {
        alert(response.data.message); // Notify user of failure
      }
    } catch (error) {
      console.error('Error deleting club:', error);
      alert('Error deleting club. Please try again later.');
    }
  };


  const fetchClubs = async () => {
    setLoadingClubs(true);
    setErrorClubs(null);
    try {
      let response;
      if (username === "admin") {
        response = await axios.post(
          `${API_BASE_URL}/book_worms/api/v1/auth/club_create/getAllClubs`,
          dataToSend
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/book_worms/api/v1/auth/club_create/getClubs`,
          dataToSend
        );
      }

      if (response.data.success) {
        const clubsData = response.data.data || [];
        if (clubsData.length === 0) {
          setErrorClubs('No clubs found.');
        } else {
          setClubs(clubsData);
        }
      } else {
        setErrorClubs('Failed to fetch clubs.');
      }
    } catch (error) {
      setErrorClubs('No clubs found');
    } finally {
      setLoadingClubs(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('status'); // Remove status
    localStorage.removeItem('userId'); // Remove userId
    localStorage.removeItem('username'); // Optional: Remove username if needed
    window.location.href = '/'; // Redirect to home or login page
  };
  const fetchFavoriteBooks = async () => {
    setLoadingFavorites(true);

    setErrorFavorites(null); // Reset error message
    try {
      const response = await axios.post(`${API_BASE_URL}/book_worms/api/v1/auth/getFavorites`,dataToSend);
      if (!response.data.success) {
        alert(response.data.message);
      }
      console.log('Response:', response.data); // Debug log to check response structure

      if (response.data.success) {
        if (response.data.message === "No favorite books available.") {
          setFavoriteBooks([]); // Ensure favoriteBooks is an empty array
          setErrorFavorites(response.data.message); // Set the message as error
        } else {
          setFavoriteBooks(response.data.data || []); // Ensure data is always an array
          setErrorFavorites(null); // Clear any previous errors
        }
      } else {
        setFavoriteBooks([]); // Reset favoriteBooks to an empty array
        setErrorFavorites('Failed to fetch favorite books.');
      }
    } catch (error) {
      console.error('Error fetching favorite books:', error); // Debug log
      setFavoriteBooks([]); // Reset favoriteBooks to an empty array
      setErrorFavorites('Error fetching favorite books.');
    } finally {
      setLoadingFavorites(false);
    }
  };
  const handleDeleteBook = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }
    const bookId = localStorage.getItem('bookId')
    const dataToSend = {
      userId,
      bookId,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/book_worms/api/v1/auth/deleteFavorite`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        alert(response.data.message); // Notify user of successful deletion
        fetchFavoriteBooks(); // Refresh favorite books list
      } else {
        alert(response.data.message); // Notify user of failure
      }
    } catch (error) {
      console.error('Error deleting favorite book:', error);
      alert('Error deleting book. Please try again later.');
    }
  };



  return (
    (localStorage.status) && ( <ProfilePageContainer>
      <Sidebar>
        <ProfilePic src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1" alt="Profile" />
        <UserName>{username}</UserName>
        <email>{ email }</email>


        {/* <LogoutButton */}


        {/* Sidebar Links */}
       
        <button
style={{
  fontSize: "1.5em",
  fontFamily: "'Times New Roman', Georgia, serif",  // Set font family to Times New Roman and Georgia
  fontWeight: "bold",  // Make the text bold
  paddingTop: "10px",
  border: "none",
  color: "white",
  backgroundColor: "transparent",
  textAlign: "center",
  cursor: "pointer",
}}
onClick={() => {
  handleLogout();
}}

>
  Log Out
</button>
  </Sidebar>

  <MainSection>
        {/* My Favorite Books Section */}
        <Section>
      <SectionHeader>
        <SectionTitle>My Clubs</SectionTitle>
        <AddButton onClick={fetchClubs}>
          {loadingClubs ? 'Loading...' : 'Show All Clubs'}
        </AddButton>
      </SectionHeader>
      {errorClubs && <p>{errorClubs}</p>}
      {clubs.length > 0 ? (
        clubs.map((club) => (
          <div key={club._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ flex: 1 }}>{club.clubName}</p>
            <AddButton
              onClick={() => handleDeleteClub(club._id)}
              style={{ backgroundColor: '#610000', color: 'white' }}
            >
              Delete
            </AddButton>
          </div>
        ))
      ) : (
        !loadingClubs && !errorClubs && <p>Click on the button to view Your Clubs!</p>
      )}
    </Section>
        
        
    <Section>
   <SectionHeader>
      <SectionTitle>My Shelf</SectionTitle>
      <AddButton onClick={fetchFavoriteBooks}>
       {loadingFavorites ? 'Loading...' : 'Show books in shelf'}
     </AddButton>
   </SectionHeader>

  {/* Display the error or message */}
  {errorFavorites && !loadingFavorites && <p>{errorFavorites}</p>}

  {favoriteBooks.length > 0 ? (
  <RecommendedBooksSection>
    {favoriteBooks.map(book => (
      <FavoriteBook key={book._id}>
        <img
          src={book.imageLink ? book.imageLink : 'https://via.placeholder.com/150x200.png?text=No+Image'}
          alt={book.title}
        />
        <p>{book.title}</p>
        <button
          className="deleteButton"
          onClick={() => handleDeleteBook(book._id)}
        >
          Delete
        </button>

        <button
          onClick={() => handleAddToReadBooks(book)} // Pass the whole book object here
          style={{
            backgroundColor: '#610000',
            color: 'white',
            border: '2px solid white',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '0.9em',
            borderRadius: '5px',
            marginTop: '10px',
            transition: 'background-color 0.3s ease',
          }}
        >
          Add to Read Books
        </button>
      </FavoriteBook>
    ))}
  </RecommendedBooksSection>
) : (
  !loadingFavorites && !errorFavorites && <p>Click on the button to view your books in shelf!</p>
)}
</Section>
    


        {/* Other Sections */}
        <Section>
          <SectionHeader>
            <SectionTitle>Books I've Read</SectionTitle>
            <AddButton onClick={fetchReadBooks}>
              {loadingReadBooks ? 'Loading...' : 'Show Books I\'ve Read'}
            </AddButton>
          </SectionHeader>

          {/* Display error message or books */}
          {errorReadBooks && !loadingReadBooks && <p>{errorReadBooks}</p>}

          {readBooks.length > 0 ? (
            <RecommendedBooksSection>
              {readBooks.map(book => (
                <FavoriteBook key={book._id}>
                  <img
                    src={book.imageLink ? book.imageLink : 'https://via.placeholder.com/150x200.png?text=No+Image'}
                    alt={book.title}
                  />
                  <p>{book.title}</p>
                  
                </FavoriteBook>
              ))}
            </RecommendedBooksSection>
          ) : (
            !loadingReadBooks && <p>No books found. Click on the button to show your read books!</p>
          )}
        </Section>

        {/* Recommended Books */}
        <br></br>
        <SectionTitle>Recommended Books</SectionTitle>
        <RecommendedBooksSection>
          <RecommendedBook>
            <img src={rb1Image} alt="Recommended Book 1" />
            <p>Book 1</p>
          </RecommendedBook>
          <RecommendedBook>
            <img src={rb2Image} alt="Recommended Book 2" />
            <p>Book 2</p>
          </RecommendedBook>
          <RecommendedBook>
            <img src={rb3Image} alt="Recommended Book 3" />
            <p>Book 3</p>
          </RecommendedBook>
          <RecommendedBook>
            <img src={rb4Image} alt="Recommended Book 4" />
            <p>Book 4</p>
          </RecommendedBook>
        </RecommendedBooksSection>
      </MainSection>
    </ProfilePageContainer>)
  );
};

export default MyProfile;