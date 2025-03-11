import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ cartCount, user, setUser }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const validUsername = "admin";
    const validPassword = "password123";

    if (username === validUsername && password === validPassword) {
      const userData = { name: username };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setShowLogin(false);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <nav className="navbar">
      <h1>EZTech Store</h1>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        {user ? (
          <button onClick={handleLogout} className="nav-button">Logout</button>
        ) : (
          <button onClick={() => setShowLogin(true)} className="nav-button">Login</button>
        )}
      </div>
      
      {showLogin && (
        <div className="login-modal">
          <div className="login-content">
            <h2>Login</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button type="submit">Login</button>
              <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
