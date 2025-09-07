import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa'; // FontAwesome icons
import backgroundImage from '../assets/background.jpg';

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: black;
  padding: 20px;
  box-sizing: border-box;
  perspective: 1000px;
`;

const FlipContainer = styled.div`
  width: 400px;
  height: 380px;
  position: relative;
  transform-style: preserve-3d;
  transform: ${({ isFlipped }) => (isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
  transition: transform 0.6s;
`;

const Column = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
`;

const LoginColumn = styled(Column)`
  transform: rotateY(0deg);
`;

const SignUpColumn = styled(Column)`
  transform: rotateY(180deg);
`;

const Heading = styled.h2`
  font-size: 1.8em;
  margin-bottom: 15px;
  text-align: center;
  color: white;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 40px 8px 8px;
  margin-bottom: 10px;
  border: 1px solid darkred;
  border-radius: 5px;
  font-size: 1em;

  &:focus {
    border: 1px solid black;
    outline: none;
  }
`;

const EyeIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: darkred;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: darkred;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  font-family: 'Georgia', 'Times New Roman', serif;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #B22222;
    transform: translateY(-5px);
  }
`;

const LinkContainer = styled.div`
  text-align: center;
  font-size: 0.9em;
  color: white;
`;

const SignUpLink = styled.a`
  color: white;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: darkred;
    transform: translateY(-5px);
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
  z-index: 10; /* Make sure it’s clickable */

  &:hover {
    color: darkred;
  }
`;


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LoginPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [signupPasswordVisible, setSignupPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();  // Navigate hook for redirection

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleSignupPasswordVisibility = () => {
    setSignupPasswordVisible(!signupPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleLogin = async () => {
    var url = `${API_BASE_URL}/book_worms/api/v1/auth/signin`;
    const credentials = { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.user && data.user._id) {
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('userId', data.user._id);

        localStorage.setItem('username', data.user.username);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('status', true);
        window.location.href = '/';  // Redirect to home page
      } else {
        alert('Login failed: ' + (data.message || 'Invalid credentials'));
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    }
  };

  const handleSign = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    var url = `${API_BASE_URL}/book_worms/api/v1/auth/signup`;
    const credentials = { username: fullName, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.user && data.user._id) {
        setIsFlipped(false);
        alert('User created successfully!');
        localStorage.setItem('userId', data.user._id);
        console.log(localStorage.getItem('userId'));

        localStorage.setItem('username', data.user.username);
      } else {
        alert(data.message || 'Signup failed, please try again.');
      }
    } catch (error) {
      alert('An error occurred during signup. Please try again later.');
    }
  };

  return (
    <LoginPageContainer>
      <FlipContainer isFlipped={isFlipped}>
        {/* Close Icon */}
        <CloseIcon onClick={() => navigate('/')}>
          <FaTimes />
        </CloseIcon>
        
        {/* Login Form */}
        <LoginColumn>
          <Heading>Login</Heading>
          <InputContainer>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </InputContainer>
          <InputContainer>
            <Input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <EyeIcon onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </EyeIcon>
          </InputContainer>
          <Button onClick={handleLogin}>Login</Button>
          <LinkContainer>
            Don't have an account?{' '}
            <SignUpLink to="#" onClick={() => setIsFlipped(true)}>
              Sign up
            </SignUpLink>
          </LinkContainer>
        </LoginColumn>

        {/* Sign Up Form */}
        <SignUpColumn>
          <Heading>Sign Up</Heading>
          <InputContainer>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
            />
          </InputContainer>
          <InputContainer>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </InputContainer>
          <InputContainer>
            <Input
              type={signupPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <EyeIcon onClick={toggleSignupPasswordVisibility}>
              {signupPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </EyeIcon>
          </InputContainer>
          <InputContainer>
            <Input
              type={confirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <EyeIcon onClick={toggleConfirmPasswordVisibility}>
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </EyeIcon>
          </InputContainer>
          <Button onClick={handleSign}>Sign Up</Button>
          <LinkContainer>
            Already have an account?{' '}
            <SignUpLink to="#" onClick={() => setIsFlipped(false)}>
              Login
            </SignUpLink>
          </LinkContainer>
        </SignUpColumn>
      </FlipContainer>
    </LoginPageContainer>
  );
};

export default LoginPage;
