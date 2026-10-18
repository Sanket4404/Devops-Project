import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../database/connection';
import { User } from '../types';

const router = express.Router();

// Demo mode - simple session storage (not persistent)
let currentUser: any = null;

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // For demo: allow any login with password "demo"
    if (password === 'demo') {
      const result = await query('SELECT id, email, first_name, last_name, role, created_at, updated_at FROM users WHERE email = $1', [email]);
      
      let user;
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
        user: currentUser,
        message: 'Demo login successful'
      });
    } else {
      res.status(401).json({ error: 'Use password "demo" for demo mode' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  currentUser = null;
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', (req, res) => {
  if (currentUser) {
    res.json(currentUser);
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

export { router as authRoutes };