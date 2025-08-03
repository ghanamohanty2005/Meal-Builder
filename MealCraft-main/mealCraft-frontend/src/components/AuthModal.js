import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ onClose }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Login state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("📤 Sending login request", { username: loginId, password: loginPassword });

    if (!loginId || !loginPassword) {
      return alert('Please enter username/email and password.');
    }

    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        username: loginId,
        password: loginPassword
      });

      const token = res.data.token;
      console.log("Login successful, token received:", token); 
      login(token); // Trigger context login
      onClose();
    } catch (err) {
      console.error('Login failed:', err);
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regUsername || !regName || !regEmail || !regPassword || !regConfirm) {
      return alert('Please fill in all fields.');
    }
    if (regPassword !== regConfirm) {
      return alert("Passwords do not match.");
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        username: regUsername,
        name: regName,
        email: regEmail,
        password: regPassword,
        location: "Not set",
        profilePicUrl: ""
      });

      const res = await axios.post('http://localhost:8080/api/auth/login', {
        username: regUsername,
        password: regPassword
      });

      const token = res.data.token;
      login(token); // Auto-login after registration
      onClose();
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed. Username may already exist.');
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h3>Welcome to MealCraft</h3>
        <div style={tabBarStyle}>
          <div onClick={() => setIsLogin(true)} style={isLogin ? tabActive : tabInactive}>Login</div>
          <div onClick={() => setIsLogin(false)} style={!isLogin ? tabActive : tabInactive}>Sign Up</div>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Username or Email"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={submitBtn}>Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={regConfirm}
              onChange={(e) => setRegConfirm(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={submitBtn}>Sign Up</button>
          </form>
        )}

        <button onClick={onClose} style={closeBtn}>×</button>
      </div>
    </div>
  );
};

// Styles
const backdropStyle = {
  position: 'fixed',
  top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: 'white',
  borderRadius: '10px',
  padding: '25px',
  width: '480px',
  position: 'relative',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
};

const tabBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid #ccc'
};

const tabActive = {
  flex: 1,
  textAlign: 'center',
  padding: '10px',
  fontWeight: 'bold',
  color: '#ff6b6b',
  borderBottom: '3px solid #ff6b6b',
  cursor: 'pointer'
};

const tabInactive = {
  flex: 1,
  textAlign: 'center',
  padding: '10px',
  fontWeight: 'normal',
  color: '#999',
  cursor: 'pointer'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxSizing: 'border-box'
};

const submitBtn = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#ff6b6b',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const closeBtn = {
  position: 'absolute',
  top: 10,
  right: 15,
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#aaa'
};

export default AuthModal;
