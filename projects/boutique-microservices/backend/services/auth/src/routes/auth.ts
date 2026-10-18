import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../database/connection';
import { User } from '../types';

const router = express.Router();

// Simple demo authentication without JWT
let currentUser: any = null;

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role, created_at, updated_at',
      [email, hashedPassword, firstName, lastName, 'customer']
    );

    const user = result.rows[0];
    currentUser = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    };

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      token: user.id.toString(),
      refreshToken: user.id.toString(),
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // For demo mode: accept any email with password "demo"
    if (password === 'demo') {
      let user;
      const result = await query('SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        // Create demo user if doesn't exist
        const hashedPassword = await bcrypt.hash('demo', 10);
        const newUser = await query(
          'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role, created_at, updated_at',
          [email, hashedPassword, 'Demo', 'User', 'customer']
        );
        user = newUser.rows[0];
      } else {
        user = result.rows[0];
      }

      currentUser = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      };

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        },
        token: user.id.toString(),
        refreshToken: user.id.toString(),
        message: 'Demo login successful'
      });
      return;
    }

    // Normal password check
    const result = await query('SELECT id, email, password_hash, first_name, last_name, role, created_at, updated_at FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    currentUser = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    };

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      token: user.id.toString(),
      refreshToken: user.id.toString(),
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  currentUser = null;
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  const userId = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!userId || userId === 'undefined') {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const result = await query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export { router as authRoutes };