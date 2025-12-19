import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAstronaut, FaEnvelope } from 'react-icons/fa';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './ProfilePage.css';

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile.');
        }

        setUserData(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
        localStorage.removeItem('authToken');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };



  return (
    <div className="page-container profile-page-wrapper">
      <Navbar />
      <main className="profile-content">

        {isLoading && <div className="loading-container"><div className="spinner"></div><p>Loading Profile...</p></div>}
        {error && <div className="error-container"><p>{error}</p></div>}

        {userData && !isLoading && (
          <div className="profile-card">
            <div className="profile-header-section">
              <div className="avatar-wrapper">
                <FaUserAstronaut className="profile-avatar-icon" />
              </div>
              <h1 className="profile-username">{userData.username}</h1>
              <span className={`role-badge ${userData.role === 'admin' ? 'role-admin' : 'role-student'}`}>
                {userData.role}
              </span>
            </div>

            <div className="profile-details-grid">
              <div className="detail-row">
                <div className="detail-icon-box"><FaEnvelope /></div>
                <div className="detail-info">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{userData.email}</span>
                </div>
              </div>


            </div>

            <button onClick={handleLogout} className="logout-btn-premium">
              Sign Out
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ProfilePage;
