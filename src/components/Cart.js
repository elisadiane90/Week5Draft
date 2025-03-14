import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to your cart.");
      return;
    }

    // Generate a random confirmation number
    const confirmationNumber = Math.floor(100000 + Math.random() * 900000);

    // Store order details
    const orderDetails = {
      confirmationNumber,
      items: cartItems,
      total: totalPrice.toFixed(2),
    };
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    // Navigate to the payment information page
    navigate('/saved-cards');
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <h3>{item.name}</h3>
              <p>Price: ${item.price.toFixed(2)}</p>
              {item.shirtSize && <p>Size: {item.shirtSize}</p>}
              {item.phoneModel && <p>Phone Model: {item.phoneModel}</p>}
              <div className="quantity-controls">
                <button
                  onClick={() => updateQuantity(item.id, item.shirtSize, item.phoneModel, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.shirtSize, item.phoneModel, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button onClick={() => removeFromCart(item.id, item.shirtSize, item.phoneModel)}>Remove</button>
            </div>
          ))}
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
