import 'dotenv/config';

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};

if (!config.mongoUri) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}
if (!config.jwtSecret) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}
