import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import videoSrc from '../assets/video.mp4'; // Adjust the path as needed

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const LandingPageContainer = styled.section`
  position: relative;
  height: 100vh;
  overflow: hidden;
  font-family: 'Georgia', 'Times New Roman', serif;
`;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  opacity: 0;
`;

const Quote = styled.blockquote`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 10px;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 15px 30px;
  background-color: #610000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;

  &:hover {
    background-color: #b22222;
  }
`;

const LandingPage = () => {
  const overlayRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    // Initial fade-in effect
    gsap.to(overlayRef.current, { opacity: 1, duration: 2 });

    // Typing effect
    const typingEffect = gsap.to(quoteRef.current, {
      text: { value: "If a book is well written, you'll always Find it too short.", speed: 0.5 },
      duration: 10,
      ease: 'power1.inOut',
      paused: true,
    });

    // ScrollTrigger instance
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: overlayRef.current,
      start: 'top center',
      onEnter: () => typingEffect.restart(),
      onEnterBack: () => typingEffect.restart(),
    });

    return () => {
      scrollTriggerInstance.kill(); // Clean up ScrollTrigger when component unmounts
    };
  }, []);

  return (
    <LandingPageContainer>
      <BackgroundVideo autoPlay muted loop>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </BackgroundVideo>
      <Overlay ref={overlayRef}>
        <Quote ref={quoteRef}>" "</Quote>
        <Button as="a" href="#fifthsection" style={{ textDecoration: 'none' }}>See November's Popular Book</Button>
      </Overlay>
    </LandingPageContainer>
  );
};

export default LandingPage;