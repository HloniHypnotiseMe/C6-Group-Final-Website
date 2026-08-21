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
const PORT = Number(process.env.PORT || 3001);
const frontendUrl = process.env.FRONTEND_URL;

if (process.env.NODE_ENV === 'production' && !frontendUrl) {
  throw new Error('FRONTEND_URL must be configured in production');
}

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
app.use(
  cors({
    origin: frontendUrl || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 300 : 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

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

app.use('/api/v1', v1Router);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableVersions: ['/api/v1'],
  });
});

app.listen(PORT, () => {
  logger.info(`C6GROUP API Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
