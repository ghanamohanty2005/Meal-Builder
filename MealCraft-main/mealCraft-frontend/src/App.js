import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Builder from './pages/Builder';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import SearchResults from './pages/SearchResults';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import { fetchUserProfile } from './api/authApi';
import { searchMeals } from './api/mealApi';
import './App.css'; // ✅ Import your CSS here

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <main style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/search-results" element={<SearchResults />} />
            </Routes>
          </main>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

// Header Component
const Header = () => {
  const { user, logout, profilePicUrl } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [localPic, setLocalPic] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile()
        .then(res => {
          setLocalPic(res.data.profilePicUrl);
        })
        .catch(err => console.warn('Header profile fetch failed'));
    }
  }, [user]);

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const res = await searchMeals(search);
      navigate('/search-results', { state: { results: res.data } });
      setSearch('');
    } catch (err) {
      alert('Failed to search meals');
    }
  };

  return (
    <header style={headerStyle}>
      <h2 style={{ margin: 0 }}>🍴MealCraft</h2>

      <nav style={navContainer}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/builder" className="nav-link">Meal Builder</Link>
        <Link to="/cart" className="nav-link">🛒 Cart</Link>

        <div className="search-container">
  <input
    type="text"
    className="search-input"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') handleSearch();
    }}
    placeholder="Search meals..."
  />
  <button onClick={handleSearch} className="search-button">🔍</button>
</div>


        {!user ? (
          <button onClick={() => setShowAuth(true)} style={loginBtnStyle}>
            Login / Sign Up
          </button>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={profileIcon} title="Profile" onClick={() => setShowMenu(!showMenu)}>
              {localPic || profilePicUrl ? (
                <img
                  src={localPic || profilePicUrl}
                  alt="Profile"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: 8
                  }}
                />
              ) : (
                <span style={{ marginRight: 8 }}>👤</span>
              )}
              {user?.username || 'User'}
            </div>

            {showMenu && (
              <div style={dropdownMenu}>
                <div onClick={() => { navigate('/profile'); setShowMenu(false); }}>👤 Profile</div>
                <div onClick={() => { navigate('/cart'); setShowMenu(false); }}>🛒 Cart</div>
                <div onClick={() => { navigate('/orders'); setShowMenu(false); }}>📦 Orders</div>
                <div onClick={() => { logout(); setShowMenu(false); }}>🚪 Logout</div>
              </div>
            )}
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  );
};

// Styles
const headerStyle = {
  padding: '15px 20px',
  backgroundColor: '#ffffff',
  color: '#ff6b6b',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #eee'
};

const navContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
};

const loginBtnStyle = {
  backgroundColor: '#ff6b6b',
  color: 'white',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const profileIcon = {
  cursor: 'pointer',
  background: '#ff6b6b',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '20px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center'
};

const dropdownMenu = {
  position: 'absolute',
  top: '40px',
  right: '0',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '10px',
  width: '160px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  fontWeight: '500',
  cursor: 'pointer'
};

export default App;
