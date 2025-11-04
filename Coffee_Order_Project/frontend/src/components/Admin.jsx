import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Admin.css';

function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');

  // Fetch menu items on component mount
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchMenuItems();
  }, [user, navigate]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      // Remove the deleted item from state
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          Logged in as: {user?.name || 'Admin'}
        </div>
      </header>

      <nav className="admin-nav">
        <button 
          className={activeTab === 'menu' ? 'active' : ''} 
          onClick={() => setActiveTab('menu')}
        >
          Menu Management
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'menu' && (
          <div className="menu-management">
            <div className="section-header">
              <h2>Menu Items</h2>
              <button 
                className="add-button"
                onClick={() => navigate('/admin/menu/new')}
              >
                Add New Item
              </button>
            </div>

            {loading && <p>Loading menu items...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            {!loading && !error && (
              <div className="menu-items-list">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Available</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.length === 0 ? (
                      <tr>
                        <td colSpan="5">No menu items found. Add your first item!</td>
                      </tr>
                    ) : (
                      menuItems.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>
                            <span className={item.available ? 'status-available' : 'status-unavailable'}>
                              {item.available ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="edit-button"
                              onClick={() => navigate(`/admin/menu/edit/${item.id}`)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-button"
                              onClick={() => deleteMenuItem(item.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-management">
            <h2>User Management</h2>
            <p>User management functionality will be implemented in future updates.</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="order-management">
            <h2>Orders</h2>
            <p>Order management functionality will be implemented in future updates.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;