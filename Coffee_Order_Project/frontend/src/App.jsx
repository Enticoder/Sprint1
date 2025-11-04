// App-level routing and providers
// Wraps the app in AuthProvider and sets up React Router routes
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Auth from './components/Auth.jsx';
import Home from './components/Home.jsx';
import Menu from './components/Menu.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Checkout from './components/Checkout.jsx';
import PaymentSuccess from './components/PaymentSuccess.jsx';
import Admin from './components/Admin.jsx';
import MenuItemEditor from './components/MenuItemEditor.jsx';
import './App.css';

// Protected route component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // For simplicity, we're considering the first user as admin
  // In a real app, you would check a role field
  if (user.id !== 1) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      
      {/* Admin routes with protection */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/menu/new" 
        element={
          <ProtectedRoute>
            <MenuItemEditor />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/menu/edit/:id" 
        element={
          <ProtectedRoute>
            <MenuItemEditor />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    // Provide authentication state to the entire app
    <AuthProvider>
      {/* Configure client-side routing */}
      <Router>
        <div className="app-root">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
