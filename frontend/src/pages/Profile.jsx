import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">NutriMate</div>
        <div className="navbar-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/newplan">Generate Diet Plan</a>
          <a href="/profile">Profile</a>
          <a href="/logout">Logout</a>
        </div>
      </div>

      <div className="profile-container">
        <h2 className="profile-title">Your Profile</h2>
        <div className="profile-card">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Age:</strong> {user?.age}</p>
          <p><strong>Gender:</strong> {user?.gender}</p>
          <p><strong>Height:</strong> {user?.height} cm</p>
          <p><strong>Weight:</strong> {user?.weight} kg</p>
          <p><strong>Activity Level:</strong> {user?.activityLevel}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;