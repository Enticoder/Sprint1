// Minimal Express backend for auth and health checks
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Database client (Prisma) and Google OAuth client
const { PrismaClient } = require('@prisma/client');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from local frontend
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Ensure DATABASE_URL points to the SQLite file in ../database/prisma/dev.db
// Helpful when running locally without a .env in backend
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.resolve(__dirname, '../database/prisma/dev.db')}`;
}

const prisma = new PrismaClient();
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const oauthClient = new OAuth2Client(googleClientId);

// Health check endpoint to verify backend is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Google OAuth login endpoint
// Verifies Google idToken, creates/updates user, and returns user JSON
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken required' });

    const ticket = await oauthClient.verifyIdToken({ idToken, audience: googleClientId });
    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || payload?.email?.split('@')[0];
    if (!email) return res.status(400).json({ error: 'No email in Google profile' });

    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name },
    });

    return res.json({ user });
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Reviews API endpoints
// Get all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create a new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { rating, comment, userId } = req.body;
    
    if (!rating || !comment || !userId) {
      return res.status(400).json({ error: 'Rating, comment and userId are required' });
    }
    
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        userId: parseInt(userId)
      },
      include: { user: true }
    });
    
    res.status(201).json(review);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Menu Items API endpoints
// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { category: 'asc' }
    });
    res.json(menuItems);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get a single menu item
app.get('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Create a new menu item
app.post('/api/menu', async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, available } = req.body;
    
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Name, description, price and category are required' });
    }
    
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
        available: available ?? true
      }
    });
    
    res.status(201).json(menuItem);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// Update a menu item
app.put('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, available } = req.body;
    
    const menuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        imageUrl,
        category,
        available
      }
    });
    
    res.json(menuItem);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete a menu item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.menuItem.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Admin authentication middleware
const isAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });
    
    // For simplicity, we're considering the first user as admin
    // In a real app, you would have a role field in the user model
    if (user && user.id === 1) {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  } catch (err) {
    console.error('Admin auth error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});