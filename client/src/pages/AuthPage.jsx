// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Use 'username' state instead of 'name'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook for redirection

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(''); // Clear errors when toggling
    // Clear form fields
    setUsername(''); // Clear username
    setEmail('');
    setPassword('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError('');

    const url = isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER;

    // Prepare the data to send (use 'username' for registration)
    const userData = isLogin
      ? { email, password }
      : { username, email, password }; // Use username here

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Send data as JSON
      });

      const data = await response.json(); // Parse the response

      if (!response.ok) {
        // Handle 404 specifically for registration if URL might be wrong
        if (response.status === 404 && !isLogin) {
          throw new Error(`Registration endpoint not found at ${registerUrl}. Check your backend routes.`);
        }
        // Handle other errors from the backend
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

      // --- SUCCESS ---
      console.log('Success:', data);

      // Store the token in localStorage upon successful login or registration
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      } else {
        console.warn("No token received from backend."); // Good to add a warning if token is expected but missing
      }


      // Redirect to homepage after successful login/registration
      navigate('/');

    } catch (err) {
      console.error('Authentication error:', err);
      // Display a user-friendly error message
      setError(err.message.includes("Not Found") ? "Could not reach the server. Please check the URL or try again later." : err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-container">
        {isLogin ? (
          // LOGIN FORM
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Welcome Back!</h2>
            <p>Please enter your details to log in.</p>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" // Added autocomplete
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password" // Added autocomplete
              />
            </div>
            {/* Display error message */}
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Log In'} {/* Loading text */}
            </button>
          </form>
        ) : (
          // REGISTRATION FORM
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <p>Join our community of learners!</p>
            {/* Changed 'name' input to 'username' */}
            <div className="input-group">
              <label htmlFor="username">Username</label> {/* Changed label */}
              <input
                type="text"
                id="username"                  // Changed id
                placeholder="Choose a username" // Changed placeholder
                required
                value={username}               // Changed value
                onChange={(e) => setUsername(e.target.value)} // Changed onChange
                autoComplete="username"        // Added autocomplete
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" // Added autocomplete
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password" // Added autocomplete
              />
            </div>
            {/* Display error message */}
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'} {/* Loading text */}
            </button>
          </form>
        )}

        {/* Toggle link */}
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={toggleForm}>
            {isLogin ? ' Sign Up' : ' Log In'}
          </span>
        </p>

        <div className="back-to-home">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;