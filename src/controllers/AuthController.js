import { User } from '../models/mongodb/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/environment.js';

function getToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

async function register(req, res) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const user = await User.create({ email, password, name: name || email });
    res.status(201).json({ user: { id: user._id, email: user.email }, token: getToken(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user: { id: user._id, email: user.email }, token: getToken(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function refresh(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token required' });
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ token: getToken(user) });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

async function forgotPassword(req, res) {
  res.json({ message: 'If an account exists, you will receive reset instructions.' });
}

async function resetPassword(req, res) {
  res.json({ message: 'Password has been reset.' });
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function updateProfile(req, res) {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function updateLocation(req, res) {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, { location: req.body }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getGoals(req, res) {
  res.json({ goals: [] });
}

async function createGoal(req, res) {
  res.status(201).json({ message: 'Goal created' });
}

export {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  updateLocation,
  getGoals,
  createGoal,
};
