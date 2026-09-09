"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./routes/auth");
const ai_1 = require("./routes/ai");
const user_1 = require("./routes/user");
const subscription_1 = require("./routes/subscription");
const analytics_1 = require("./routes/analytics");
const webhooks_1 = require("./routes/webhooks");
const aiTools_1 = require("./routes/aiTools");
const whatsapp_1 = require("./routes/whatsapp");
const payments_1 = require("./routes/payments");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Global rate limiter
const globalLimiter = (0, express_rate_limit_1.default)({
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
const v1Router = express_1.default.Router();
v1Router.use('/auth', auth_1.authRouter);
v1Router.use('/ai', ai_1.aiRouter);
v1Router.use('/users', user_1.userRouter);
v1Router.use('/subscriptions', subscription_1.subscriptionRouter);
v1Router.use('/payments', payments_1.paymentRouter);
v1Router.use('/analytics', analytics_1.analyticsRouter);
v1Router.use('/webhooks', webhooks_1.webhookRouter);
v1Router.use('/ai-tools', aiTools_1.aiToolsRouter);
v1Router.use('/whatsapp', whatsapp_1.whatsappRouter);
// Mount v1 API
app.use('/api/v1', v1Router);
// Error handling
app.use(errorHandler_1.errorHandler);
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
    logger_1.logger.info(`🚀 C6GROUP API Server running on port ${PORT}`);
    logger_1.logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger_1.logger.info(`🔑 Auth: /api/v1/auth`);
    logger_1.logger.info(`🤖 AI: /api/v1/ai`);
    logger_1.logger.info(`👤 Users: /api/v1/users`);
    logger_1.logger.info(`💳 Subscriptions: /api/v1/subscriptions`);
    logger_1.logger.info(`💰 Payments: /api/v1/payments`);
    logger_1.logger.info(`📊 Analytics: /api/v1/analytics`);
    logger_1.logger.info(`🤖 AI Tools: /api/v1/ai-tools`);
    logger_1.logger.info(`💬 WhatsApp: /api/v1/whatsapp`);
    logger_1.logger.info(`🔗 Webhooks: /api/v1/webhooks`);
});
exports.default = app;
//# sourceMappingURL=server.js.map