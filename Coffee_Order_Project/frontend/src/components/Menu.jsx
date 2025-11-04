// Menu page component
// Displays coffee items, supports category filter, cart, and checkout
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';
import './Menu.css';

// Currency conversion function (USD -> INR)
const convertToINR = (usdPrice) => {
  const exchangeRate = 83.0; // Approximate USD to INR exchange rate
  return (usdPrice * exchangeRate).toFixed(0);
};

const coffeeMenu = [
  {
    
    id: 1,
    name: 'Espresso',
    description: 'Strong and concentrated coffee shot',
    price: 2.99,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400'
  },
  {
    id: 2,
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    price: 3.99,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'
  },
  {
    id: 3,
    name: 'Latte',
    description: 'Espresso with steamed milk and light foam',
    price: 3.99,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400'
  },
  {
    id: 4,
    name: 'Iced Americano',
    description: 'Chilled espresso with cold water',
    price: 3.49,
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400'
  },
  {
    id: 5,
    name: 'Cold Brew',
    description: 'Smooth, cold-steeped coffee',
    price: 4.49,
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'
  },
  {
    id: 6,
    name: 'Frappe',
    description: 'Blended coffee with whipped cream',
    price: 4.99,
    category: 'Cold Coffee',
    image: 'https://images.unsplash.com/photo-1586195831800-24f14c992cea?w=400'
  }
];

const categories = ['All', 'Hot Coffee', 'Cold Coffee'];

export default function Menu() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);

  // Filter items by category; 'All' shows everything
  const filteredMenu = selectedCategory === 'All'
    ? coffeeMenu
    : coffeeMenu.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartInfo = `$${cartTotal.toFixed(2)} (${cart.reduce((total, item) => total + item.quantity, 0)} items)`;

  return (
    <div className="menu-page">
      <Navigation showCart={true} cartInfo={cartInfo} />

      <div className="menu-container">
        <div className="menu-header">
          <h1>Our Menu</h1>
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filteredMenu.map(item => (
            <div key={item.id} className="menu-item">
              <div className="menu-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="menu-item-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="menu-item-footer">
                  <span className="price">
                    ${item.price.toFixed(2)}<br />
                    <span className="inr-price">₹{convertToINR(item.price)}</span>
                  </span>
                  <button className="add-to-cart" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>Your Cart</h2>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
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
            <div className="cart-total">
              <h3>
                Total: ${cartTotal.toFixed(2)}<br />
                <span className="inr-price">₹{convertToINR(cartTotal)}</span>
              </h3>
              <button className="checkout-btn" onClick={() => navigate('/checkout', { state: { cart, cartTotal } })}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}