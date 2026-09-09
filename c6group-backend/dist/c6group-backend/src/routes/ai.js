"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const aiService_1 = require("../services/aiService");
const types_1 = require("../types");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
exports.aiRouter = router;
/**
 * Execute an AI agent
 * POST /api/v1/ai/execute
 */
router.post('/execute', auth_1.authenticate, async (req, res, next) => {
    try {
        const { agentType, parameters, context } = req.body;
        // Validate agent type
        if (!Object.values(types_1.AgentType).includes(agentType)) {
            throw (0, errorHandler_1.createError)('Invalid agent type', 400, 'INVALID_AGENT_TYPE');
        }
        // Validate parameters
        if (!parameters || typeof parameters !== 'object') {
            throw (0, errorHandler_1.createError)('Parameters are required', 400, 'MISSING_PARAMETERS');
        }
        const result = await aiService_1.aiService.executeAgent({
            agentType,
            userId: req.user.userId,
            parameters,
            context,
        });
        res.json({
            success: result.success,
            data: result.data,
            error: result.error,
            meta: {
                tokensUsed: result.tokensUsed,
                cost: result.cost,
                duration: result.duration,
                agentType: result.agentType,
                timestamp: new Date().toISOString(),
                requestId: req.headers['x-request-id'] || 'unknown',
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Get available agents for current user
 * GET /api/v1/ai/agents
 */
router.get('/agents', auth_1.authenticate, async (req, res, next) => {
    try {
        const agents = await aiService_1.aiService.getAvailableAgents(req.user.userId);
        res.json({
            success: true,
            data: agents,
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Get AI usage statistics for current user
 * GET /api/v1/ai/usage
 */
router.get('/usage', auth_1.authenticate, async (req, res, next) => {
    try {
        const stats = await aiService_1.aiService.getUsageStats(req.user.userId);
        res.json({
            success: true,
            data: stats,
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Get agent details
 * GET /api/v1/ai/agents/:agentType
 */
router.get('/agents/:agentType', auth_1.authenticate, async (req, res, next) => {
    try {
        const { agentType } = req.params;
        if (!Object.values(types_1.AgentType).includes(agentType)) {
            throw (0, errorHandler_1.createError)('Invalid agent type', 400, 'INVALID_AGENT_TYPE');
        }
        const { getAgent, getAgentInfo } = await Promise.resolve().then(() => __importStar(require('../prompts/agents')));
        const agent = getAgent(agentType);
        const info = getAgentInfo(agentType);
        // Get user's remaining calls for this agent
        const stats = await aiService_1.aiService.getUsageStats(req.user.userId);
        const agentLimit = stats.limits[agentType];
        res.json({
            success: true,
            data: {
                ...info,
                description: agent.description,
                parameters: agent.parameters,
                examples: agent.examples,
                remainingCalls: agentLimit?.remaining ?? 0,
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Run business audit
 * POST /api/v1/ai/audit
 */
router.post('/audit', auth_1.authenticate, async (req, res, next) => {
    try {
        const auditData = req.body;
        const result = await aiService_1.aiService.executeAgent({
            agentType: types_1.AgentType.BUSINESS_AUDIT,
            userId: req.user.userId,
            parameters: auditData,
        });
        res.json({
            success: result.success,
            data: result.data,
            error: result.error,
            meta: {
                tokensUsed: result.tokensUsed,
                cost: result.cost,
                duration: result.duration,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Generate content
 * POST /api/v1/ai/content
 */
router.post('/content', auth_1.authenticate, async (req, res, next) => {
    try {
        const { contentType, topic, targetAudience, ...otherParams } = req.body;
        const result = await aiService_1.aiService.executeAgent({
            agentType: types_1.AgentType.CONTENT_GENERATOR,
            userId: req.user.userId,
            parameters: {
                contentType,
                topic,
                targetAudience,
                ...otherParams,
            },
        });
        res.json({
            success: result.success,
            data: result.data,
            error: result.error,
            meta: {
                tokensUsed: result.tokensUsed,
                cost: result.cost,
                duration: result.duration,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * SEO Analysis
 * POST /api/v1/ai/seo
 */
router.post('/seo', auth_1.authenticate, async (req, res, next) => {
    try {
        const { websiteUrl, businessType, location, targetKeywords, competitors } = req.body;
        const result = await aiService_1.aiService.executeAgent({
            agentType: types_1.AgentType.SEO_ANALYZER,
            userId: req.user.userId,
            parameters: {
                websiteUrl,
                businessType,
                location,
                targetKeywords,
                competitors,
            },
        });
        res.json({
            success: result.success,
            data: result.data,
            error: result.error,
            meta: {
                tokensUsed: result.tokensUsed,
                cost: result.cost,
                duration: result.duration,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Generate email
 * POST /api/v1/ai/email
 */
router.post('/email', auth_1.authenticate, async (req, res, next) => {
    try {
        const { emailType, recipient, purpose, keyMessage, offer, tone } = req.body;
        const result = await aiService_1.aiService.executeAgent({
            agentType: types_1.AgentType.EMAIL_ASSISTANT,
            userId: req.user.userId,
            parameters: {
                emailType,
                recipient,
                purpose,
                keyMessage,
                offer,
                tone,
            },
        });
        res.json({
            success: result.success,
            data: result.data,
            error: result.error,
            meta: {
                tokensUsed: result.tokensUsed,
                cost: result.cost,
                duration: result.duration,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Chatbot interaction
 * POST /api/v1/ai/chat
 */
router.post('/chat', auth_1.authenticate, async (req, res, next) => {
    try {
        const { businessContext, conversationHistory, userMessage, userInfo } = req.body;
        const result = await aiService_1.aiService.executeAgent({
            agentType: types_1.AgentType.CHATBOT,
            userId: req.user.userId,
            parameters: {
                businessContext,
                conversationHistory,
                userMessage,
                userInfo,
            },
        });
        res.json({
            success: result.success,
            data: result.data,
            error: result.error,
            meta: {
                tokensUsed: result.tokensUsed,
                cost: result.cost,
                duration: result.duration,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=ai.js.map