import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './Navbar.css';
import logo from '../assets/smartstudy_logo.png'; // Updated logo path

function Navbar() {
  const navigate = useNavigate();

  // 2. Check for the authentication token in localStorage
  const isLoggedIn = !!localStorage.getItem('authToken');

  // 3. Create a logout handler
  const handleLogout = () => {
    // Remove the token from storage
    localStorage.removeItem('authToken');
    // Redirect the user to the login page
    navigate('/login');
    // Note: In a larger app, you'd use global state (Context/Redux) to update the navbar instantly.
    // In this case, navigating away will cause it to re-render correctly.
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Study AI Logo" className="navbar-logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/predictor">Question Predictor</Link></li>

        {/* 4. Conditional Rendering Logic */}
        {isLoggedIn ? (
          // If logged in, show Profile and Logout
          <React.Fragment>
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <button onClick={handleLogout} className="navbar-logout-btn">
                Logout
              </button>
            </li>
          </React.Fragment>
        ) : (
          // If not logged in, show Login
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
