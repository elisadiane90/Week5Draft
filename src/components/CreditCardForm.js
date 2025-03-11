import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    value = value.replace(/(.{4})/g, '$1 ').trim(); // Format in groups of 4
    setCardNumber(value);
  };

  const handleSave = () => {
    if (cardNumber.length < 19) {
      alert('Please enter a valid 16-digit card number.');
      return;
    }
    localStorage.setItem('creditCard', JSON.stringify({ number: cardNumber }));
    alert('Card details saved!');
    navigate('/order-confirmation'); // Redirect to confirmation page
  };

  return (
    <div>
      <h2>Enter Credit Card Details</h2>
      <input 
        type="text" 
        placeholder="1234 5678 9012 3456" 
        maxLength="19" 
        value={cardNumber} 
        onChange={handleInputChange} 
      />
      <button onClick={handleSave}>Save & Continue</button>
    </div>
  );
};

export default CreditCardForm;
