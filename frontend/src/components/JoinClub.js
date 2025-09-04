import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components
const Container = styled.div`
  width: 100%;
  min-height: 100vh; /* Ensures the container takes up full screen height */
  background-color: #390000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 20px; /* Increased top padding */
  justify-content: flex-start; /* Ensures content aligns to the top */
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 60px 0 20px; /* Increased top margin for spacing */
`;

const GridSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

const GridBox = styled.div`
  background-color: black;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
`;

const ClubName = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin: 10px 0;
`;

const ClubText = styled.p`
  color: white;
  font-size: 1rem;
  margin: 10px 0;
`;

const DiscussionLine = styled.hr`
  border: none;
  height: 1px;
  background: #610000;
  margin: 20px 0;
`;

const JoinButton = styled.button`
  font-family: 'Georgia', 'Times New Roman', serif;
  padding: 10px 20px;
  background-color: #610000;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b22222;
  }
`;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const JoinClubPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('User ID is missing. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/book_worms/api/v1/auth/club_create/getAllClubs`,
          { userId }
        );
        setClubs(response.data.data || []); // Access 'data' property in the response
      } catch (error) {
        console.error('Error fetching clubs:', error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleJoinClub = async (clubId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID is missing. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/book_worms/api/v1/auth/joinClub`,
        { userId, clubId }
      );
      alert(response.data.message || 'Successfully joined the club!');
    } catch (error) {
      console.error('Error joining club:', error.response?.data || error);
      alert(error.response?.data.message || 'An error occurred while joining the club.');
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>Join a Club</Title>
        <p style={{ color: 'white' }}>Loading clubs...</p>
      </Container>
    );
  }

  if (!loading && clubs.length === 0) {
    return (
      <Container>
        <Title>Join a Club</Title>
        <p style={{ color: 'white' }}>No clubs available at the moment.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Join a Club</Title>
      <GridSection>
        {clubs.map((club) => (
          <GridBox key={club._id}>
            <ClubName>{club.clubName}</ClubName>
            <ClubText>{club.description}</ClubText>
            <DiscussionLine />
            <JoinButton onClick={() => handleJoinClub(club._id)}>Join Club</JoinButton>
          </GridBox>
        ))}
      </GridSection>
    </Container>
  );
};

export default JoinClubPage;
