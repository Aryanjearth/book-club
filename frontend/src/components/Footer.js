import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: black;
  color: white;
  text-align: center;
  padding: 10px 0;
`;

const Footer = () => (
  <FooterContainer id="contact">
    <p>Contact us: email@example.com | Phone: (123) 456-7890</p>
  </FooterContainer>
);

export default Footer;
