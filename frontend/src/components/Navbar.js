import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo image

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(1.5rem); /* Adjust the blur effect if needed */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px; /* Increased padding to make the navbar slightly wider */
  z-index: 1000;
  font-family: 'Georgia', 'Times New Roman', serif;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white; /* White color for the logo text */
  font-size: 1.5rem; /* Increase font size of the text */
  transition: transform 0.3s ease, text-shadow 0.3s ease; /* Smooth transitions for zoom and shadow */

  &:hover {
    transform: scale(1.1); /* Zoom effect on hover */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6); /* Shadow effect on hover */
  }
`;

const LogoImage = styled.img`
  height: 65px; /* Increase the height of the logo image */
  margin-right: -25px; /* Reduce space between the logo image and text */
`;

const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px; /* Adjust gap as needed */
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 15px;
  margin: 0;
  padding: 0;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: white; /* White color for the links */
  transition: color 0.3s ease, transform 0.3s ease; /* Smooth transitions for color and translation */

  &:hover {
    color: #8B0000; /* Adjust the hover color if needed */
    transform: translateY(-5px); /* Translate upward on hover */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* Space between buttons */
`;

const Button = styled(Link)`
  text-decoration: none;
  color: #fff;
  background-color: #610000;
  padding: 10px 15px;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #B22222;
  }
`;

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const status = localStorage.getItem("status");

  return (
    <NavbarContainer>
      <Logo to="/">
        <LogoImage src={logo} alt="Book Worms Logo" />
        Book Worms
      </Logo>
      <NavLinksContainer>
        <NavLinks>
          <li><NavLink to="join-club">Join a Book Club</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
          <li><NavLink to="/search">Find a Book</NavLink></li>
          {status && <li><NavLink to="/profile">My Profile</NavLink></li>} {/* Conditionally render "My Profile" */}
        </NavLinks>
        <ButtonContainer>
          {status ? (
            <h1 style={{ color: "#FFFFFF" }}>{user ? user.username : 'Guest'}</h1>
          ) : (
            <Button to="/login">Login</Button>
          )}
        </ButtonContainer>
      </NavLinksContainer>
    </NavbarContainer>
  );
};

export default Navbar;
