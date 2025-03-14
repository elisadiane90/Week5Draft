import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CreditCardForm from './components/CreditCardForm';
import OrderConfirmation from './components/OrderConfirmation';

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    try {
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];
      if (!Array.isArray(parsedCart)) {
        console.error("Invalid cart format in localStorage");
        return [];
      }
      parsedCart.forEach(item => {
        if (typeof item !== 'object' || !item.id || !item.quantity) {
          console.error("Invalid item structure in cart:", item);
        }
      });
      return parsedCart;
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  });

  const [savedCards, setSavedCards] = useState(() => {
    const storedCards = localStorage.getItem('savedCards');
    return storedCards ? JSON.parse(storedCards) : [];
  });

  const [selectedCard, setSelectedCard] = useState('');
  const [isCardSelected, setIsCardSelected] = useState(false); // Track if card is selected

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

      // Ensure only one subscription is added at a time
      if (product.category === 'subscription' && prevCart.some(item => item.category === 'subscription')) {
        alert('Only one subscription can be added at a time.');
        return prevCart;
      }

      // Check if the item already exists in the cart
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

  const saveCard = (cardNumber) => {
    const cardNumberPattern = /^\d{16}$/; // Validates if the card number is exactly 16 digits long

    if (!cardNumberPattern.test(cardNumber)) {
      alert("Please enter a valid 16-digit card number.");
      return;
    }

    const newCard = { cardNumber }; // Save more details if needed (e.g., card type, expiration)
    const updatedCards = [...savedCards, newCard];
    setSavedCards(updatedCards);
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
  };

  const handleCardSelection = (event) => {
    const cardNumber = event.target.value;
    setSelectedCard(cardNumber);
    setIsCardSelected(cardNumber !== ''); // Check if a card is selected
  };

  const handleUseSelectedCard = () => {
    if (!selectedCard) {
      alert('Please select a card before proceeding.');
      return;
    }

    // Redirect to the order confirmation page
    const orderId = Math.floor(Math.random() * 1000000);  // Random order number
    const orderSummary = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderDetails = {
      orderId,
      selectedCard,
      orderSummary
    };

    // Store order details in localStorage or state for use on the confirmation page
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    
    // Redirect to the order confirmation page
    window.location.href = '/order-confirmation';
  };

  return (
    <Router>
      <Navbar 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={user ? <ProductList addToCart={addToCart} /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} /> : <Navigate to="/login" />} />
        <Route 
          path="/saved-cards"
          element={
            user ? (
              <CreditCardForm
                savedCards={savedCards}
                saveCard={saveCard}
                handleCardSelection={handleCardSelection}
                handleUseSelectedCard={handleUseSelectedCard}
                selectedCard={selectedCard}
                isCardSelected={isCardSelected}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route 
          path="/order-confirmation" 
          element={user ? <OrderConfirmation clearCart={clearCart} /> : <Navigate to="/login" />} 
        />
        <Route path="/login" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
