import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/MenuItemEditor.css';

function MenuItemEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = id !== 'new';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    available: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    // If editing an existing item, fetch its data
    if (isEditMode) {
      fetchMenuItem();
    }
  }, [user, navigate, isEditMode, id]);

  const fetchMenuItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/menu/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu item');
      }
      const data = await response.json();
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        imageUrl: data.imageUrl || '',
        category: data.category,
        available: data.available
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const url = isEditMode 
        ? `http://localhost:5000/api/menu/${id}`
        : 'http://localhost:5000/api/menu';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id // For admin authentication
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save menu item');
      }

      // Navigate back to admin dashboard
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading menu item...</div>;
  }

  return (
    <div className="menu-item-editor">
      <header>
        <h1>{isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}</h1>
        <button className="back-button" onClick={() => navigate('/admin')}>
          Back to Dashboard
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
            <option value="pastry">Pastry</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt={formData.name || "Menu item"} />
            </div>
          )}
        </div>

        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
          <label htmlFor="available">Available</label>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Menu Item'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MenuItemEditor;