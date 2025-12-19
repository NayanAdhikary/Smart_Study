import React, { useState, useEffect } from 'react'; // <-- Import useState, useEffect
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './HomePage.css';
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { Typewriter } from 'react-simple-typewriter';

// Import the background image
import heroBackground from '../assets/smartstudy_hero_bg.png';

// Explicitly set API URL for departments route
const DEPARTMENTS_API_URL = 'http://localhost:5000/api/departments';

function HomePage() {
  // State to hold departments fetched from backend
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch departments when the component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(DEPARTMENTS_API_URL, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Support both array or object responses
        setDepartments(
          Array.isArray(data)
            ? data
            : (Array.isArray(data.departments) ? data.departments : [])
        );
      } catch (e) {
        console.error("Failed to fetch departments:", e);
        setError("Could not load departments. Please try again later.");
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleGetStartedClick = () => {
    document.getElementById('course-selection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="homepage-container">
      <Navbar />

      <header
        className="hero-section"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="hero-overlay"></div>
        <div className="particle-container">
          {/* Repeat particle div 20 times */}
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="hero-content">
          <h1>
            Your
            <span style={{ color: 'var(--primary-accent)', marginLeft: '10px' }}>
              <Typewriter
                words={['Smart Study Partner', 'AI Question Predictor', 'BCA & MCA Guide']}
                loop={0}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </h1>
          <p>Notes, syllabus, and past papers for available streams. Plus, get AI-powered exam question predictions.</p>
          <button className="cta-button" onClick={handleGetStartedClick}>
            <span>Get Started</span>
            <FaArrowRight className="cta-icon" />
          </button>
        </div>
        <a href="#course-selection" className="scroll-down-link">
          <FaArrowDown className="scroll-down-icon" />
        </a>
      </header>

      <main id="course-selection" className="course-selection">
        <h2>Choose Your Stream</h2>
        <div className="course-cards">
          {/* Display loading/error or map over departments */}
          {loading && <p className="loading-message">Loading streams...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && departments.length === 0 && <p className="no-data-message">No streams available.</p>}

          {!loading && !error && departments.map((dept) => (
            // Use the department's _id in the link
            <Link to={`/course/${dept._id}`} key={dept._id} className="course-card-link">
              <div className="course-card">
                {/* Use department name and description */}
                <h3>{dept.name.toUpperCase()}</h3>
                <p>{dept.description || `Resources for ${dept.name}`}</p>
                <button className="card-button">View Stream</button>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
