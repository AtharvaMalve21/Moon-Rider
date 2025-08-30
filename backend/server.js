import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db.js';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import profileRoutes from './routes/profile.js';
import statsRoutes from './routes/stats.js';
import { notFound, errorHandler } from './middleware/error.js';

await connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: config.frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
