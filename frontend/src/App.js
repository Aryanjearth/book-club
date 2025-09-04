import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Section from './components/Section';
import LoginPage from './components/LoginPage';
import JoinClub from './components/JoinClub';
import CreateClub from './components/CreateClub';
import Blog from './components/Blog';
import MyProfile from './components/MyProfile';
import GlobalStyles from './components/GlobalStyles';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import FavoritesPage from './components/Favorite';
import PopularBooksPage from './components/popularBook';

const App = () => {
  // State to track user login status
  const [status, setStatus] = useState(false);

  // Load user login status from localStorage
  useEffect(() => {
    const storedStatus = localStorage.getItem('status');
    setStatus(storedStatus === 'true'); // Ensure boolean conversion
  }, []);

  return (
    <Router>
      {/* Global Styles */}
      <GlobalStyles />

      {/* Navbar - Visible on all pages */}
      <Navbar />

      {/* Define Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage />
              <Section />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join-club" element={<JoinClub />} />
        <Route path="/create-club" element={<CreateClub />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/popular-books" element={<PopularBooksPage />} />
      </Routes>

      {/* Footer - Visible on all pages */}
      <Footer />
    </Router>
  );
};

export default App;
