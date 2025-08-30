import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { Item } from '../models/Item.js';

const router = Router();
router.use(auth);

router.get('/daily', async (req, res) => {
  const days = Math.max(1, Math.min(90, parseInt(req.query.days || '30', 10)));
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const data = await Item.aggregate([
    { $match: { owner: req.user._id, createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        totalAmount: { $sum: { $ifNull: ['$amount', 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const map = new Map(data.map(d => [d._id, d]));
  const result = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const entry = map.get(key) || { _id: key, count: 0, totalAmount: 0 };
    result.push({ date: key, count: entry.count, totalAmount: entry.totalAmount });
  }

  res.json({ days, data: result });
});

export default router;
