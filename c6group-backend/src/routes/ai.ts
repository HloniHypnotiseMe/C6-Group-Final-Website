import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { AgentType } from '../types';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Execute an AI agent
 * POST /api/v1/ai/execute
 */
router.post('/execute', authenticate, async (req, res, next) => {
  try {
    const { agentType, parameters, context } = req.body;
    
    // Validate agent type
    if (!Object.values(AgentType).includes(agentType)) {
      throw createError('Invalid agent type', 400, 'INVALID_AGENT_TYPE');
    }
    
    // Validate parameters
    if (!parameters || typeof parameters !== 'object') {
      throw createError('Parameters are required', 400, 'MISSING_PARAMETERS');
    }
    
    const result = await aiService.executeAgent({
      agentType,
      userId: req.user!.userId,
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
  } catch (error) {
    next(error);
  }
});

/**
 * Get available agents for current user
 * GET /api/v1/ai/agents
 */
router.get('/agents', authenticate, async (req, res, next) => {
  try {
    const agents = await aiService.getAvailableAgents(req.user!.userId);
    
    res.json({
      success: true,
      data: agents,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get AI usage statistics for current user
 * GET /api/v1/ai/usage
 */
router.get('/usage', authenticate, async (req, res, next) => {
  try {
    const stats = await aiService.getUsageStats(req.user!.userId);
    
    res.json({
      success: true,
      data: stats,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get agent details
 * GET /api/v1/ai/agents/:agentType
 */
router.get('/agents/:agentType', authenticate, async (req, res, next) => {
  try {
    const { agentType } = req.params;
    
    if (!Object.values(AgentType).includes(agentType as AgentType)) {
      throw createError('Invalid agent type', 400, 'INVALID_AGENT_TYPE');
    }
    
    const { getAgent, getAgentInfo } = await import('../prompts/agents');
    const agent = getAgent(agentType as AgentType);
    const info = getAgentInfo(agentType as AgentType);
    
    // Get user's remaining calls for this agent
    const stats = await aiService.getUsageStats(req.user!.userId);
    const agentLimit = stats.limits[agentType as AgentType];
    
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
  } catch (error) {
    next(error);
  }
});

/**
 * Run business audit
 * POST /api/v1/ai/audit
 */
router.post('/audit', authenticate, async (req, res, next) => {
  try {
    const auditData = req.body;
    
    const result = await aiService.executeAgent({
      agentType: AgentType.BUSINESS_AUDIT,
      userId: req.user!.userId,
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
  } catch (error) {
    next(error);
  }
});

/**
 * Generate content
 * POST /api/v1/ai/content
 */
router.post('/content', authenticate, async (req, res, next) => {
  try {
    const { contentType, topic, targetAudience, ...otherParams } = req.body;
    
    const result = await aiService.executeAgent({
      agentType: AgentType.CONTENT_GENERATOR,
      userId: req.user!.userId,
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
  } catch (error) {
    next(error);
  }
});

/**
 * SEO Analysis
 * POST /api/v1/ai/seo
 */
router.post('/seo', authenticate, async (req, res, next) => {
  try {
    const { websiteUrl, businessType, location, targetKeywords, competitors } = req.body;
    
    const result = await aiService.executeAgent({
      agentType: AgentType.SEO_ANALYZER,
      userId: req.user!.userId,
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
  } catch (error) {
    next(error);
  }
});

/**
 * Generate email
 * POST /api/v1/ai/email
 */
router.post('/email', authenticate, async (req, res, next) => {
  try {
    const { emailType, recipient, purpose, keyMessage, offer, tone } = req.body;
    
    const result = await aiService.executeAgent({
      agentType: AgentType.EMAIL_ASSISTANT,
      userId: req.user!.userId,
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
  } catch (error) {
    next(error);
  }
});

/**
 * Chatbot interaction
 * POST /api/v1/ai/chat
 */
router.post('/chat', authenticate, async (req, res, next) => {
  try {
    const { businessContext, conversationHistory, userMessage, userInfo } = req.body;
    
    const result = await aiService.executeAgent({
      agentType: AgentType.CHATBOT,
      userId: req.user!.userId,
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
  } catch (error) {
    next(error);
  }
});

export { router as aiRouter };
