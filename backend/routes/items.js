import { Router } from 'express';
import { Item } from '../models/Item.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

// List items
router.get('/', async (req, res) => {
  const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ items });
});

// Create
router.post('/', async (req, res) => {
  const { title, description = '', amount = 0, date } = req.body || {};
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const item = await Item.create({
    owner: req.user._id,
    title,
    description,
    amount,
    date: date ? new Date(date) : new Date()
  });
  res.status(201).json({ item });
});

// Read
router.get('/:id', async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id, owner: req.user._id });
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ item });
});

// Update
router.put('/:id', async (req, res) => {
  const { title, description, amount, date } = req.body || {};
  const item = await Item.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { $set: { title, description, amount, date } },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ item });
});

// Delete
router.delete('/:id', async (req, res) => {
  const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ success: true });
});

export default router;
