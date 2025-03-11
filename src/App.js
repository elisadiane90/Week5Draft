import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CreditCardForm from './components/CreditCardForm';
import SavedCards from './components/SavedCards';
import OrderConfirmation from './components/OrderConfirmation';

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [savedCard, setSavedCard] = useState(() => {
    const storedCard = localStorage.getItem('creditCard');
    return storedCard ? JSON.parse(storedCard) : null;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleLogin = (username, password) => {
    const validUsername = 'admin';
    const validPassword = 'password123';

    if (username === validUsername && password === validPassword) {
      const userData = { name: username };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addToCart = (product, selectedSize, selectedModel) => {
    setCartItems(prevCart => {
      let updatedProduct = { ...product, quantity: 1 };

      if (product.category === 'shirt' && selectedSize) {
        updatedProduct.shirtSize = selectedSize;
      }
      if (product.name === 'EZTech Phone Case' && selectedModel) {
        updatedProduct.phoneModel = selectedModel;
      }

      if (product.category === 'subscription' && prevCart.some(item => item.category === 'subscription')) {
        alert('Only one subscription can be added at a time.');
        return prevCart;
      }

      const existingItem = prevCart.find(
        item => item.id === product.id &&
        item.shirtSize === updatedProduct.shirtSize &&
        item.phoneModel === updatedProduct.phoneModel
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.shirtSize === updatedProduct.shirtSize && item.phoneModel === updatedProduct.phoneModel
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, updatedProduct];
      }
    });
  };

  const removeFromCart = (id, shirtSize, phoneModel) => {
    setCartItems(cartItems.filter(item => !(item.id === id && item.shirtSize === shirtSize && item.phoneModel === phoneModel)));
  };

  const updateQuantity = (id, shirtSize, phoneModel, quantity) => {
    if (quantity < 1) return;
    setCartItems(cartItems.map(item => (item.id === id && item.shirtSize === shirtSize && item.phoneModel === phoneModel)
      ? { ...item, quantity }
      : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <Router>
      <Navbar 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        user={user}
        setUser={setUser}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={user ? <ProductList addToCart={addToCart} /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} /> : <Navigate to="/login" />} />
        <Route path="/checkout" element={user ? <CreditCardForm /> : <Navigate to="/login" />} />
        <Route path="/saved-cards" element={user ? <SavedCards savedCard={savedCard} /> : <Navigate to="/login" />} />
        <Route path="/order-confirmation" element={user ? <OrderConfirmation clearCart={clearCart} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
