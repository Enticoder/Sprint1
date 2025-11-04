// Checkout page component
// Displays order summary and collects shipping/payment details
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';
import './Checkout.css';

// Currency conversion function (USD -> INR)
const convertToINR = (usdPrice) => {
  const exchangeRate = 83.0; // Approximate USD to INR exchange rate
  return (usdPrice * exchangeRate).toFixed(0);
};

export default function Checkout() {
  const location = useLocation();
  const { cart, cartTotal } = location.state || { cart: [], cartTotal: 0 };
  const navigate = useNavigate();
  const { user } = useAuth();
  // Shipping + payment form state; prefill user name/email when available
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pinCode: '',
    paymentMethod: 'credit_card',
    deliveryOption: 'home_delivery' // Default to home delivery
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Basic submit handler (placeholder for payment integration)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically process the payment and order
    navigate('/payment-success', { state: { orderDetails: { items: cart, total: cartTotal } } });
  };

  return (
    <div className="checkout-page">
      <Navigation />
      
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <div className="checkout-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="delivery-options">
              <label>
                <input
                  type="radio"
                  name="deliveryOption"
                  value="home_delivery"
                  checked={formData.deliveryOption === 'home_delivery'}
                  onChange={handleInputChange}
                />
                Home Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="deliveryOption"
                  value="store_pickup"
                  checked={formData.deliveryOption === 'store_pickup'}
                  onChange={handleInputChange}
                />
                Store Pickup
              </label>
            </div>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      ${(item.price * item.quantity).toFixed(2)}<br />
                      <span className="inr-price">₹{convertToINR(item.price * item.quantity)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <h3>
                Total: ${cartTotal.toFixed(2)}<br />
                <span className="inr-price">₹{convertToINR(cartTotal)}</span>
              </h3>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Shipping Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {formData.deliveryOption === 'home_delivery' && (
              <>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required={formData.deliveryOption === 'home_delivery'}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required={formData.deliveryOption === 'home_delivery'}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pinCode">PIN Code</label>
                    <input
                      type="text"
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      required={formData.deliveryOption === 'home_delivery'}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}