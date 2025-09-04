import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Import Link
import { useNavigate } from 'react-router-dom';

// Importing images

import rb1Image from '../assets/RB1.png';
import rb2Image from '../assets/RB2.png';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import logo3 from '../assets/logo3.png';
import logo4 from '../assets/logo4.png';
import book1 from '../assets/book1.png';
import book2 from '../assets/book2.png';
import book3 from '../assets/book3.png';
import book4 from '../assets/book4.png';
import botm from '../assets/botm.png'; // Adjust the path as necessary
import graphic1 from '../assets/graphic1.png'; // Import graphic1
import graphic2 from '../assets/graphic2.png'; // Import graphic2
import graphic3 from '../assets/graphic3.png'; // Import graphic3



const SectionContainer = styled.div`
  width: 100%;
`;

const SectionWrapper = styled.div`
  padding: 20px;
  background-color: ${props => props.bgColor || '#fff'}; /* Default to white */
`;

const ImagesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  flex: 1;
  margin: 0 10px;
`;

const Image = styled.img`
  width: 100%;
  height: 300px;  /* Increased height for images */
  object-fit: cover;  /* Ensures the image covers the entire area without distortion */
  border-radius: 15px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ImageWrapper2 = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
`;

const GraphicImage = styled.img`
  width: 200px;  /* Adjust the width to reduce size */
  height: auto;  /* Maintain aspect ratio */
`;

const Button = styled(Link)` /* Changed from button to Link */
  flex: 1;
  margin: 10px;
  padding: 15px;
  background-color: #610000;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color:  #B22222;
  }
`;

const TextSection = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: white;
`;

const TextContent = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
`;

const GridSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px 10px;
`;

const GridBox = styled.button`
  padding: 2px;
  background-color: #390000;
  border: 2px solid black;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  
  &:hover {
    border-color: darkred;
  }
`;
const API_BASE_URL = process.env.url;

const ClubLogo = styled.img`
  width: 80%;
  height: auto;
  margin-bottom: 10px;
  margin-top : 10px;
`;

const ClubName = styled.h3`
  margin: 10px 0;
  color : white;
  font-family: 'Georgia', 'Times New Roman';
`;

const ClubText = styled.p`
  margin: 10px 0;
  color : white;
  font-family: 'Georgia', 'Times New Roman';
`;

const ShowMoreButton = styled(Link)`
  flex: 1;
  margin: 10px;
  padding: 15px;
  background-color: #610000;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color:  #B22222;
  }
`;

const JoinButton = styled.button`
  background-color: #610000;
  color: white;
  padding: 8px 15px;
  margin-bottom : 3px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-family: 'Georgia', 'Times New Roman';
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    background-color: #B22222;
  }
`;


const DiscussionLine = styled.hr`
  margin: 10px 0;
  width: 80%;
  border: 0;
  border-top: 1px solid black;
`;

const BookImage = styled.img`
  width: 95%;
  height: 100%;  /* Adjusted size for book image */
  object-fit: cover;  /* Ensures the image covers the entire area without distortion */
  margin-bottom: 10px;
  border-radius: 10px;
`;

const BookOfTheMonthSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
`;

const BookOfTheMonthHeader = styled.h3`
  text-align: center;
  margin-bottom: 40px;
  font-size: 30px;
  font-family: 'Georgia', 'Times New Roman';
  color: white;
`;

const BookOfTheMonthContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BookOfTheMonthImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: 15px;
  margin-right: 20px;
`;

const BookText = styled.div`
  flex: 1;
  font-size: 1.2rem;
  line-height: 1.5; /* Added line height for better readability */
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
`;

const AddToShelfButton = styled.button`
  align-self: center; /* Center the button horizontally within the BookText container */
  margin-top: 20px;
  padding: 10px 20px;
  background-color:  #610000;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #a80000;
  }
`;

const ReadingInfo = styled.p`
  margin: 10px 0;
  color : white;
  font-family: 'Georgia', 'Times New Roman';
`;

const TestimonialsSection = styled.div`
  padding: 40px 20px;
  background-color: #390000; /* Background color */
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Adjust to automatically fill space */
  gap: 20px;
  max-width: 1000px; /* Optional max width for better alignment */
  margin: 0 auto; /* Center align the grid */
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column for smaller screens */
  }
`;

const TestimonialsHeading = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const TestimonialBox = styled.div`
  padding: 15px;
  background-color: #f4f4f4;
  border-radius: 10px;
  text-align: center;
  aspect-ratio: 1 / 1; /* Ensures square shape */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Optional shadow for better look */
  max-width: 200px; /* Limit width */
  margin: 0 auto; /* Center the box within the grid cell */
  
  p {
    margin: 0;
    font-size: 0.9rem; /* Adjust text size to fit */
  }
`;

const RecommendedBooksSection = styled.div`
  padding: 40px 20px;
  color: white;
`;

const RecommendedBooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const RecommendedBookBox = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  text-align: center;
`;


const Section = () => {
  const navigate = useNavigate();
  const handleClick = ()=>{
    navigate('/popular-books');
  }
  return (
    <SectionContainer>
      {/* First Section: Images and Buttons */}
      <SectionWrapper id="firstsection" bgColor="black"> {/* Grayish beige */}
        <ImagesContainer>
          <ImageWrapper>
            <Image src={image1} alt="Image 1" />
          </ImageWrapper>
          <ImageWrapper>
            <Image src={image2} alt="Image 2" />
          </ImageWrapper>
          <ImageWrapper>
            <Image src={image3} alt="Image 3" />
          </ImageWrapper>
        </ImagesContainer>
        <ButtonsContainer>
          <Button to="/create-club">Create Your Own Club</Button>
          <Button to="/join-club">Join a Club</Button> {/* Replace with actual link if needed */}
          <Button to="/search">Discover New Books</Button> {/* Replace with actual link if needed */}
        </ButtonsContainer>
      </SectionWrapper>

    {/*Second Section */}
      <SectionWrapper id="secondsection" bgColor="#390000"> {/* White */}
      <ImageWrapper2>
        <GraphicImage src={graphic1} alt="Graphic 1" />
        <GraphicImage src={graphic2} alt="Graphic 2" />
        <GraphicImage src={graphic3} alt="Graphic 3" />
      </ImageWrapper2>
      <TextSection>
        <TextContent>
          Join the best book clubs in town and start your reading journey today! Create your own club and share your love for books with others.
        </TextContent>
        <Button to="/create-club">Create Your Club Now</Button>
      </TextSection>
    </SectionWrapper>

      {/* Third Section: Grid of Clubs */}
      <SectionWrapper id="thirdsection"bgColor="black"> 
      <TextSection>
      <ShowMoreButton to="/join-club">Show More Clubs</ShowMoreButton>
      </TextSection>
        <GridSection>
          <GridBox>
            <ClubLogo src={logo1} alt="Club Logo 1" />
            <ClubName>Club 1</ClubName>
            <ClubText>Details about Club 1.</ClubText>
            <DiscussionLine />
            <BookImage src={book1} alt="Book 1" />
            <ReadingInfo>831 currently reading</ReadingInfo>
            {/* <JoinButton>Join Club</JoinButton> */}
          </GridBox>
          <GridBox>
            <ClubLogo src={logo2} alt="Club Logo 2" />
            <ClubName>Club 2</ClubName>
            <ClubText>Details about Club 2.</ClubText>
            <DiscussionLine />
            <BookImage src={book2} alt="Book 2" />
            <ReadingInfo>658 currently reading</ReadingInfo>
            {/* <JoinButton>Join Club</JoinButton> */}
          </GridBox>
          <GridBox>
            <ClubLogo src={logo3} alt="Club Logo 3" />
            <ClubName>Club 3</ClubName>
            <ClubText>Details about Club 3.</ClubText>
            <DiscussionLine />
            <BookImage src={book3} alt="Book 3" />
            <ReadingInfo>930 currently reading</ReadingInfo>
            {/* <JoinButton>Join Club</JoinButton> */}
          </GridBox>
          <GridBox>
            <ClubLogo src={logo4} alt="Club Logo 4" />
            <ClubName>Club 4</ClubName>
            <ClubText>Details about Club 4.</ClubText>
            <DiscussionLine />
            <BookImage src={book4} alt="Book 4" />
            <ReadingInfo>1031 currently reading</ReadingInfo>
            {/* <JoinButton>Join Club</JoinButton> */}
          </GridBox>
        </GridSection>
      </SectionWrapper>

      {/* Fourth Section: Testimonials */}
      <SectionWrapper id="fourthsection" bgColor="#390000"> {/* White */}
        <TestimonialsSection>
          <TestimonialsHeading>Testimonials</TestimonialsHeading>
          <TestimonialsGrid>
          <TestimonialBox>
            <p>"This book club has changed the way I read and think about books. Highly recommend!" - Member A</p>
          </TestimonialBox>
          <TestimonialBox>
            <p>"A wonderful experience! The community is so welcoming and the book selections are always top-notch." - Member B</p>
          </TestimonialBox>
          <TestimonialBox>
            <p>"This book club has changed the way I read and think about books. Highly recommend!" - Member A</p>
          </TestimonialBox>
          <TestimonialBox>
            <p>"A wonderful experience! The community is so welcoming and the book selections are always top-notch." - Member B</p>
          </TestimonialBox>
        </TestimonialsGrid>
        </TestimonialsSection>
      </SectionWrapper>

     {/* Fifth Section: Book of the Month */}
<SectionWrapper id="fifthsection" bgColor="black"> {/* Grayish beige */}
  <BookOfTheMonthSection>
    <BookOfTheMonthHeader>Book of the Month: The Wedding People</BookOfTheMonthHeader>
    <BookOfTheMonthContent>
      <BookOfTheMonthImage src={botm} alt="Book of the Month" />
      <BookText>
        <p>
          This month's featured book is a must-read for all literature lovers. 
          Dive into the world of [Book Title] and explore its rich narrative 
          and unforgettable characters.
        </p>
        <AddToShelfButton onClick={handleClick}>Show Bestsellers</AddToShelfButton>
      </BookText>
    </BookOfTheMonthContent>
  </BookOfTheMonthSection>
</SectionWrapper>

{/* Sixth Section: Recommended Books */}
<SectionWrapper id="sixthsection" bgColor="#390000">
  <RecommendedBooksSection>
    <h3>Recommended Books</h3>
    <RecommendedBooksGrid>
      <GridBox>
        <img src={rb1Image} alt="Book 1" style={{ width: '100%', borderRadius: '8px' }} />
        <p style={{ color: 'white', fontFamily: 'Georgia, serif' }}>Details about Book 1.</p>
      </GridBox>
      <GridBox>
        <img src={rb2Image} alt="Book 2" style={{ width: '100%', borderRadius: '8px' }} />
        <p style={{ color: 'white', fontFamily: 'Georgia, serif' }}>Details about Book 2.</p>
      </GridBox>
      {/* You can add more GridBoxes for additional books */}
    </RecommendedBooksGrid>
  </RecommendedBooksSection>
</SectionWrapper>

    </SectionContainer>
  );
};


export default Section;