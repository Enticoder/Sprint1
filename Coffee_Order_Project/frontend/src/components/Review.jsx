// Review component for submitting and displaying reviews
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Review.css';

// Backend API URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Review() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([
    { id: 1, userName: 'Guest 1', rating: 5, comment: 'Love the aroma, great staff, and cozy seating.', createdAt: '2 days ago' },
    { id: 2, userName: 'Guest 2', rating: 5, comment: 'Love the aroma, great staff, and cozy seating.', createdAt: '2 days ago' },
    { id: 3, userName: 'Guest 3', rating: 5, comment: 'Love the aroma, great staff, and cozy seating.', createdAt: '2 days ago' }
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showForm, setShowForm] = useState(false);
  const [averageRating, setAverageRating] = useState(4.8);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch reviews from API on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Fetch reviews from backend API
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/reviews`);
      if (response.ok) {
        const data = await response.json();
        // Format the reviews data
        const formattedReviews = data.map(review => ({
          id: review.id,
          userName: review.user.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: formatDate(new Date(review.createdAt))
        }));
        setReviews(formattedReviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Format date to "X days ago" format
  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? 'Today' : `${diffDays} days ago`;
  };

  // Calculate average rating whenever reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating((total / reviews.length).toFixed(1));
    }
  }, [reviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Check if user is logged in
    if (!user) {
      setError('Please sign in to leave a review');
      return;
    }
    
    setLoading(true);
    
    try {
      // Send review to backend API
      const response = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
          userId: user.id
        }),
      });
      
      if (response.ok) {
        const savedReview = await response.json();
        
        // Add the new review to the list
        const reviewToAdd = {
          id: savedReview.id,
          userName: user.name,
          rating: newReview.rating,
          comment: newReview.comment,
          createdAt: 'Just now'
        };
        
        setReviews([reviewToAdd, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
        setShowForm(false);
        setSuccess('Thank you for your review!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Error submitting review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-container">
      <div className="review-header">
        <div className="rating-summary">
          <p>Enjoy our coffee?</p>
          <div className="average-rating">{averageRating}</div>
        </div>
        <button 
          className="review-button" 
          onClick={() => setShowForm(!showForm)}
        >
          Leave a review
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {showForm && (
        <div className="review-form-container">
          <h3>Write a Review</h3>
          {!user && <p className="login-prompt">Please <a href="/auth">sign in</a> to leave a review</p>}
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label>Rating</label>
              <select 
                name="rating" 
                value={newReview.rating} 
                onChange={handleInputChange}
                disabled={!user || loading}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Your Review</label>
              <textarea 
                name="comment" 
                value={newReview.comment} 
                onChange={handleInputChange} 
                placeholder="Share your experience..."
                required
                disabled={!user || loading}
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)} disabled={loading}>Cancel</button>
              <button type="submit" disabled={!user || loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-item">
            <div className="review-avatar">
              {review.userName.charAt(0)}
            </div>
            <div className="review-content">
              <h4>{review.userName}</h4>
              <div className="review-meta">
                <span className="review-stars">
                  {Array(review.rating).fill('★').join('')}
                </span>
                <span className="review-date">{review.createdAt}</span>
              </div>
              <p className="review-text">{review.comment}</p>
              <div className="review-actions">
                <button>Helpful</button>
                <button>Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}