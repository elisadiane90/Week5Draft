// SavedCards.js (Component for Managing Saved Credit Cards)
import React, { useState, useEffect } from 'react';

const SavedCards = ({ savedCard }) => {
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    if (savedCard) {
      setCardNumber(savedCard);
    }
  }, [savedCard]);

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleSave = () => {
    localStorage.setItem('creditCard', JSON.stringify(cardNumber));
    alert('Card details saved!');
  };

  return (
    <div>
      <h2>Saved Credit Card</h2>
      <input type="text" placeholder="1234 5678 9012 3456" maxLength="19" value={cardNumber} onChange={handleInputChange} />
      <button onClick={handleSave}>Save Card</button>
    </div>
  );
};

export default SavedCards;