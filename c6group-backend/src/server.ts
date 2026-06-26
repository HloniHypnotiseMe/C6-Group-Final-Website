import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { aiRouter } from './routes/ai';
import { userRouter } from './routes/user';
import { subscriptionRouter } from './routes/subscription';
import { analyticsRouter } from './routes/analytics';
import { webhookRouter } from './routes/webhooks';
import { aiToolsRouter } from './routes/aiTools';
import { whatsappRouter } from './routes/whatsapp';
import { paymentRouter } from './routes/payments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes - v1
const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/ai', aiRouter);
v1Router.use('/users', userRouter);
v1Router.use('/subscriptions', subscriptionRouter);
v1Router.use('/payments', paymentRouter);
v1Router.use('/analytics', analyticsRouter);
v1Router.use('/webhooks', webhookRouter);
v1Router.use('/ai-tools', aiToolsRouter);
v1Router.use('/whatsapp', whatsappRouter);

// Mount v1 API
app.use('/api/v1', v1Router);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableVersions: ['/api/v1']
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 C6GROUP API Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔑 Auth: /api/v1/auth`);
  logger.info(`🤖 AI: /api/v1/ai`);
  logger.info(`👤 Users: /api/v1/users`);
  logger.info(`💳 Subscriptions: /api/v1/subscriptions`);
  logger.info(`💰 Payments: /api/v1/payments`);
  logger.info(`📊 Analytics: /api/v1/analytics`);
  logger.info(`🤖 AI Tools: /api/v1/ai-tools`);
  logger.info(`💬 WhatsApp: /api/v1/whatsapp`);
  logger.info(`🔗 Webhooks: /api/v1/webhooks`);
});

export default app;
