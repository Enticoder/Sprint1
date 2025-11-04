import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const _location = useLocation();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please sign in to submit a review');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment,
          userId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setSuccess('Thank you for your review!');
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="payment-success-page">
      <Navigation />
      
      <div className="success-container">
        <div className="success-header">
          <h1>Payment Successful!</h1>
          <p>Your order has been placed successfully.</p>
          <div className="order-confirmation">
            <i className="fas fa-check-circle"></i>
            <p>Order confirmation has been sent to your email.</p>
          </div>
        </div>

        <div className="review-section">
          <h2>How was your experience?</h2>
          <p>We'd love to hear your feedback!</p>
          
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
          
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="rating-container">
              <label>Rating:</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? 'star active' : 'star'}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="comment">Your Review:</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with us..."
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="button-group">
              <button 
                type="submit" 
                className="submit-review-btn"
                disabled={isSubmitting || !user}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button 
                type="button" 
                className="skip-btn"
                onClick={handleSkip}
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}