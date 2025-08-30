import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();
router.use(auth);

router.put('/', async (req, res) => {
  const { name, avatarUrl } = req.body || {};
  const update = {};
  if (name) update.name = name;
  if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;

  const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true });
  res.json({ user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role } });
});

export default router;
