import React from 'react';

const CreditCardForm = ({ savedCards, saveCard, handleCardSelection, handleUseSelectedCard, selectedCard, isCardSelected }) => {
  const handleAddNewCard = (event) => {
    event.preventDefault();
    const cardNumber = event.target.cardNumber.value;
    saveCard(cardNumber);
  };

  return (
    <div className="credit-card-form">
      <h2>Checkout</h2>

      {/* Option to select a saved card */}
      {savedCards.length > 0 ? (
        <div>
          <label>Select a saved card:</label>
          <div>
            {savedCards.map((card, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`card-${index}`}
                  name="savedCard"
                  value={card.cardNumber}
                  checked={selectedCard === card.cardNumber}
                  onChange={handleCardSelection}
                />
                <label htmlFor={`card-${index}`}>
                  **** **** **** {card.cardNumber.slice(-4)} {/* Display last 4 digits */}
                </label>
              </div>
            ))}
          </div>
          {isCardSelected && (
            <div className="selected-card">
              <h3>Selected Card:</h3>
              <p>**** **** **** {selectedCard.slice(-4)}</p>
              <button onClick={handleUseSelectedCard}>Use this card for payment</button>
            </div>
          )}
        </div>
      ) : (
        <p>No saved cards available. Add a new card.</p>
      )}

      {/* Option to add a new card */}
      <form onSubmit={handleAddNewCard}>
        <label htmlFor="cardNumber">Enter new card number:</label>
        <input type="text" id="cardNumber" name="cardNumber" placeholder="Enter card number" required />
        <button type="submit">Add New Card</button>
      </form>
    </div>
  );
};

export default CreditCardForm;
