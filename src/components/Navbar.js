import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ cartCount, user, setUser, handleLogin, handleLogout }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Track login state
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Set the login state to in-progress
    setLoginError(''); // Clear any previous errors

    const loginSuccess = await handleLogin(username, password);
    
    if (loginSuccess) {
      setShowLogin(false);
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid username or password');
    }
    
    setIsLoggingIn(false); // Reset login state
  };

  return (
    <nav className="navbar">
      <h1>EZTech Store</h1>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        {user ? (
          <>
            <Link to="/saved-cards" className="nav-link">Saved Cards</Link>
            <button 
              onClick={handleLogout} 
              className="nav-button" 
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => setShowLogin(true)} 
            className="nav-button" 
            aria-label="Login"
          >
            Login
          </button>
        )}
      </div>

      {showLogin && (
        <div className="login-modal" role="dialog" aria-labelledby="login-modal-title">
          <div className="login-content">
            <h2 id="login-modal-title">Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                aria-label="Enter your username"
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                aria-label="Enter your password"
              />
              <button 
                type="submit" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>
              {loginError && <p className="error-message">{loginError}</p>}
              <button 
                type="button" 
                onClick={() => setShowLogin(false)} 
                aria-label="Cancel login"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
