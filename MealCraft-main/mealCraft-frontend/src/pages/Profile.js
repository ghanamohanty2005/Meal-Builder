import React, { useEffect, useState } from 'react';
import { fetchUserProfile, updateUserSettings, uploadProfilePic } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Fetch user profile on token change
  useEffect(() => {
    if (!token) return;

    fetchUserProfile()
      .then(res => {
        setProfile(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Profile API failed:", err.response || err.message || err);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateUserSettings(formData)
      .then(() => {
        setProfile(prev => ({ ...prev, ...formData }));
        setEditMode(false);
        alert('Profile updated successfully!');
      })
      .catch(err => {
        console.error("Update failed:", err);
        alert("Failed to update profile.");
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    uploadProfilePic(data)
      .then(res => {
        const newUrl = res.data.profilePicUrl;
        setProfile(prev => ({ ...prev, profilePicUrl: newUrl }));
        setFormData(prev => ({ ...prev, profilePicUrl: newUrl }));
        alert('Profile picture updated!');
      })
      .catch(err => {
        console.error('Upload failed', err);
        alert('Failed to upload picture.');
      });
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Overview</h2>

      {token && <p style={{ fontSize: '12px', color: '#888' }}>Token present ✅</p>}
      {user && <p style={{ fontSize: '12px', color: '#888' }}>Logged in as: {user.username}</p>}

      {profile ? (
        <div style={{ maxWidth: '400px' }}>
          {/* Profile Picture */}
          {profile.profilePicUrl && (
            <img
              src={profile.profilePicUrl}
              alt="Profile"
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: 20
              }}
            />
          )}

          {/* Upload Picture */}
          <div style={{ marginBottom: 20 }}>
            <input type="file" onChange={handleImageUpload} accept="image/*" />
          </div>

          {/* Editable Fields */}
          <div>
            <label>Name:</label><br />
            <input
              name="name"
              value={formData.name}
              disabled={!editMode}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Email:</label><br />
            <input
              name="email"
              value={formData.email}
              disabled={!editMode}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label>Location:</label><br />
            <input
              name="location"
              value={formData.location}
              disabled={!editMode}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Edit / Save Buttons */}
          {editMode ? (
            <button onClick={handleSave} style={buttonStyle}>Save</button>
          ) : (
            <button onClick={() => setEditMode(true)} style={buttonStyle}>Edit</button>
          )}
        </div>
      ) : (
        <p>Unable to load profile. Please try again later.</p>
      )}
    </div>
  );
};

// Styles
const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '15px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  padding: '10px 16px',
  backgroundColor: '#ff6b6b',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default Profile;
