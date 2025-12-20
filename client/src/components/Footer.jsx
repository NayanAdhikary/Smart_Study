// src/components/Footer.jsx
import * as React from 'react';
import './Footer.css';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';

function Footer() {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.SUBSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsError(false);
        setEmail('');
      } else {
        setMessage(data.message || 'Subscription failed.');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      setIsError(true);
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Column 1: Brand and Socials */}
        <div className="footer-section footer-brand">
          <h3>Study AI</h3>
          <p>Your Smart Study Partner for BCA & MCA.</p>
          <div className="footer-social">
            <a href="#" aria-label="GitHub"><FaGithub /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Predictor</a></li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div className="footer-section footer-links">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter Subscription */}
        <div className="footer-section footer-subscribe">
          <h4>Stay Updated</h4>
          <p>Get the latest notes and predictions delivered to your inbox.</p>
          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Subscribe</button>
          </form>
          {message && (
            <p style={{
              marginTop: '10px',
              fontSize: '0.9rem',
              color: isError ? '#ff6b6b' : '#4ecdc4'
            }}>
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Study AI. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;