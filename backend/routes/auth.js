import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config.js';
import { auth } from '../middleware/auth.js';

const router = Router();

function createToken(userId) {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatarUrl } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, avatarUrl: avatarUrl || '' });

    const token = createToken(user._id.toString());
    const safeUser = { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role };
    return res.status(201).json({ token, user: safeUser });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user._id.toString());
    const safeUser = { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role };
    return res.json({ token, user: safeUser });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/me', auth, async (req, res) => {
  const u = req.user;
  res.json({ user: { id: u._id, name: u.name, email: u.email, avatarUrl: u.avatarUrl, role: u.role } });
});

export default router;
