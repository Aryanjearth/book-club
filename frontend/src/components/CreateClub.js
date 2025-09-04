import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import background1 from '../assets/background1.jpg';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
`;

const BackgroundImage = styled.div`
  background-image: url(${background1});
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Send the background image behind the form */
`;

const FormContainer = styled.div`
  position: relative;
  width: 400px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px); /* Apply a subtle blur effect */
`;

const FormContent = styled.div`
  text-align: center;

  h2 {
    margin-bottom: 20px;
    color: #ffffff; /* White color for heading */
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-family: inherit; /* Ensure consistent font */
  }

  textarea {
    resize: vertical; /* Allow vertical resizing */
    height: 100px; /* Set a default height */
  }

  button {
    background-color: #610000; /* Dark red color */
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 10px;
  }

  button:hover {
    background-color: #a80000;
  }

  p {
    margin-top: 15px;
    color: #ffffff; /* White color for the paragraph */
  }
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: #ffffff;
  font-size: 1.5em;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure it's on top of other elements */

  &:hover {
    color: darkred;
  }
`;

function CreateClub() {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();  // Initialize the navigate hook

  // Ensure user is logged in before rendering the form
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      window.location.href = '/login';  // Redirect to login if user is not logged in
    }
  }, []);

  const handleInputChange = (event) => {
    setClubName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem('userId'); // Get user ID from localStorage
    console.log('User ID from localStorage:', userId);
    console.log({
      clubName,
      description,
      userId,
    });

    const dataToSend = {
      clubName,
      description,
      userId,
    };

    try {
      // Send POST request to the backend
      const response = await axios.post(
        `${API_BASE_URL}/book_worms/api/v1/auth/club_create`,
        dataToSend
      );

      if (response.status === 201) { // Success response
        const data = response.data;
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('clubId', data.data._id);

        console.log(data.data._id);
        setMessage('Club created successfully!');
        setClubName(''); // Reset fields
        setDescription('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create club';
      setMessage(errorMessage);
    }
  };

  return (
    <Container>
      <BackgroundImage />
      <FormContainer>
        {/* Close button to navigate to home */}
        <CloseIcon onClick={() => navigate('/')}>
          &times;
        </CloseIcon>

        <FormContent>
          <h2>Name your Club</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Club name"
              value={clubName}
              onChange={handleInputChange}
              required
            />
            <textarea
              placeholder="Club description"
              value={description}
              onChange={handleDescriptionChange}
              required
            />
            <button type="submit">CREATE MY CLUB</button>
            <p>Don't worry, you can always change it later!</p>
          </form>
          {message && (
            <p style={{ color: message.includes('success') ? 'green' : 'red' }}>
              {message}
            </p>
          )}
        </FormContent>
      </FormContainer>
    </Container>
  );
}

export default CreateClub;
