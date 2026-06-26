import OpenAI from 'openai';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { 
  AgentType, 
  AgentRequest, 
  AgentResponse, 
  LLMProvider, 
  AIUsage,
  PackageType,
  User
} from '../types';
import { getAgent } from '../prompts/agents';
import { packageConfigs, AGENT_DEFAULT_MODELS, LLM_COSTS, hasExceededAILimit, getRemainingAICalls } from '../config/packages';
import { logger } from '../utils/logger';
import { prisma } from '../utils/prisma';

// ============================================
// AI Service - Handles all LLM interactions
// ============================================

interface LLMResponse {
  content: string;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
  model: string;
  provider: LLMProvider;
  duration: number;
}

// Initialize LLM clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Anthropic client setup
const anthropicClient = axios.create({
  baseURL: 'https://api.anthropic.com/v1',
  headers: {
    'x-api-key': process.env.ANTHROPIC_API_KEY || '',
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  },
});

// Google Gemini client setup
const geminiClient = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Groq client setup
const groqClient = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`,
    'Content-Type': 'application/json',
  },
});

// ============================================
// Main AI Service Class
// ============================================

export class AIService {
  
  /**
   * Execute an AI agent with rate limiting and usage tracking
   */
  async executeAgent(request: AgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();
    const requestId = uuidv4();
    
    try {
      logger.info(`[${requestId}] Executing agent: ${request.agentType} for user: ${request.userId}`);
      
      // 1. Check rate limits
      const rateLimitCheck = await this.checkRateLimits(request.userId, request.agentType);
      if (!rateLimitCheck.allowed) {
        logger.warn(`[${requestId}] Rate limit exceeded for user: ${request.userId}, agent: ${request.agentType}`);
        return {
          success: false,
          error: rateLimitCheck.message,
          tokensUsed: 0,
          cost: 0,
          duration: 0,
          agentType: request.agentType
        };
      }
      
      // 2. Get agent configuration
      const agent = getAgent(request.agentType);
      if (!agent) {
        return {
          success: false,
          error: `Unknown agent type: ${request.agentType}`,
          tokensUsed: 0,
          cost: 0,
          duration: 0,
          agentType: request.agentType
        };
      }
      
      // 3. Build the prompt
      const prompt = this.buildPrompt(agent.systemPrompt, request.parameters, request.context);
      
      // 4. Select model based on agent type and user package
      const model = this.selectModel(request.agentType, request.userId);
      
      // 5. Call the LLM
      const llmResponse = await this.callLLM(prompt, model, agent.agentType);
      
      // 6. Parse and validate response
      const parsedResponse = this.parseResponse(llmResponse.content, agent.agentType);
      
      // 7. Track usage
      await this.trackUsage({
        id: uuidv4(),
        userId: request.userId,
        agentType: request.agentType,
        prompt: JSON.stringify(request.parameters),
        response: llmResponse.content,
        tokensUsed: llmResponse.tokensUsed.total,
        cost: llmResponse.cost,
        createdAt: new Date(),
        duration: Date.now() - startTime
      });
      
      // 8. Increment usage counter
      await this.incrementUsage(request.userId, request.agentType);
      
      const duration = Date.now() - startTime;
      logger.info(`[${requestId}] Agent execution completed in ${duration}ms, tokens: ${llmResponse.tokensUsed.total}, cost: $${llmResponse.cost.toFixed(4)}`);
      
      return {
        success: true,
        data: parsedResponse,
        tokensUsed: llmResponse.tokensUsed.total,
        cost: llmResponse.cost,
        duration,
        agentType: request.agentType
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`[${requestId}] Agent execution failed:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        tokensUsed: 0,
        cost: 0,
        duration,
        agentType: request.agentType
      };
    }
  }
  
  /**
   * Check if user has exceeded their AI usage limits
   */
  private async checkRateLimits(userId: string, agentType: AgentType): Promise<{ allowed: boolean; message?: string }> {
    try {
      // Get user's subscription
      const subscription = await prisma.subscription.findFirst({
        where: { 
          userId,
          status: 'ACTIVE'
        },
        orderBy: { createdAt: 'desc' }
      });
      
      if (!subscription) {
        return { allowed: false, message: 'No active subscription found' };
      }
      
      const packageType = subscription.packageId as PackageType;
      const config = packageConfigs[packageType];
      const limit = config.aiLimits[agentType];
      
      // Check if agent is available in this package
      if (limit === 0) {
        return { 
          allowed: false, 
          message: `${agentType} is not available in your ${config.name} package. Upgrade to access this feature.` 
        };
      }
      
      // Unlimited access
      if (limit === -1) {
        return { allowed: true };
      }
      
      // Get current month's usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const usage = await prisma.aIUsage.count({
        where: {
          userId,
          agentType,
          createdAt: {
            gte: startOfMonth
          }
        }
      });
      
      if (usage >= limit) {
        const remainingDays = Math.ceil((new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return { 
          allowed: false, 
          message: `You have reached your monthly limit of ${limit} ${agentType} calls. Your limit will reset in ${remainingDays} days. Upgrade your package for more calls.` 
        };
      }
      
      return { allowed: true };
      
    } catch (error) {
      logger.error('Error checking rate limits:', error);
      return { allowed: false, message: 'Unable to verify usage limits. Please try again later.' };
    }
  }
  
  /**
   * Get user's current AI usage statistics
   */
  async getUsageStats(userId: string): Promise<{
    packageType: PackageType;
    limits: Record<AgentType, { limit: number; used: number; remaining: number }>;
    totalCost: number;
    totalTokens: number;
  }> {
    const subscription = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!subscription) {
      throw new Error('No active subscription found');
    }
    
    const packageType = subscription.packageId as PackageType;
    const config = packageConfigs[packageType];
    
    // Get start of month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    // Get usage for each agent type
    const limits: Record<AgentType, { limit: number; used: number; remaining: number }> = {} as any;
    
    for (const [agentType, limit] of Object.entries(config.aiLimits)) {
      const used = await prisma.aIUsage.count({
        where: {
          userId,
          agentType: agentType as AgentType,
          createdAt: { gte: startOfMonth }
        }
      });
      
      limits[agentType as AgentType] = {
        limit: limit as number,
        used,
        remaining: limit === -1 ? -1 : Math.max(0, (limit as number) - used)
      };
    }
    
    // Get total cost and tokens
    const usage = await prisma.aIUsage.aggregate({
      where: { userId, createdAt: { gte: startOfMonth } },
      _sum: { cost: true, tokensUsed: true }
    });
    
    return {
      packageType,
      limits,
      totalCost: usage._sum.cost || 0,
      totalTokens: usage._sum.tokensUsed || 0
    };
  }
  
  /**
   * Build the complete prompt for the LLM
   */
  private buildPrompt(
    systemPrompt: string, 
    parameters: Record<string, unknown>, 
    context?: Record<string, unknown>
  ): string {
    let prompt = systemPrompt;
    
    // Add context if provided
    if (context && Object.keys(context).length > 0) {
      prompt += `\n\nCONTEXT:\n${JSON.stringify(context, null, 2)}`;
    }
    
    // Add parameters
    prompt += `\n\nINPUT PARAMETERS:\n${JSON.stringify(parameters, null, 2)}`;
    
    prompt += `\n\nProvide your response in the specified format.`;
    
    return prompt;
  }
  
  /**
   * Select the appropriate model based on agent type and user package
   */
  private selectModel(agentType: AgentType, userId: string): string {
    // For now, use default models. In production, could upgrade based on package tier
    return AGENT_DEFAULT_MODELS[agentType];
  }
  
  /**
   * Call the appropriate LLM provider
   */
  private async callLLM(prompt: string, model: string, agentType: AgentType): Promise<LLMResponse> {
    const startTime = Date.now();
    
    // Determine provider from model name
    const provider = this.getProviderFromModel(model);
    
    try {
      switch (provider) {
        case LLMProvider.OPENAI:
          return await this.callOpenAI(prompt, model);
        case LLMProvider.ANTHROPIC:
          return await this.callAnthropic(prompt, model);
        case LLMProvider.GOOGLE:
          return await this.callGemini(prompt, model);
        case LLMProvider.GROQ:
          return await this.callGroq(prompt, model);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      logger.error(`LLM call failed for ${provider}:`, error);
      throw error;
    }
  }
  
  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string, model: string): Promise<LLMResponse> {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    });
    
    const content = response.choices[0]?.message?.content || '';
    const inputTokens = response.usage?.prompt_tokens || 0;
    const outputTokens = response.usage?.completion_tokens || 0;
    const totalTokens = inputTokens + outputTokens;
    
    const cost = this.calculateCost(model, inputTokens, outputTokens);
    
    return {
      content,
      tokensUsed: { input: inputTokens, output: outputTokens, total: totalTokens },
      cost,
      model,
      provider: LLMProvider.OPENAI,
      duration: 0
    };
  }
  
  /**
   * Call Anthropic Claude API
   */
  private async callAnthropic(prompt: string, model: string): Promise<LLMResponse> {
    const response = await anthropicClient.post('/messages', {
      model: model.replace('claude-', 'claude-3-'), // Normalize model name
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });
    
    const content = response.data.content[0]?.text || '';
    const inputTokens = response.data.usage?.input_tokens || 0;
    const outputTokens = response.data.usage?.output_tokens || 0;
    const totalTokens = inputTokens + outputTokens;
    
    const cost = this.calculateCost(model, inputTokens, outputTokens);
    
    return {
      content,
      tokensUsed: { input: inputTokens, output: outputTokens, total: totalTokens },
      cost,
      model,
      provider: LLMProvider.ANTHROPIC,
      duration: 0
    };
  }
  
  /**
   * Call Google Gemini API
   */
  private async callGemini(prompt: string, model: string): Promise<LLMResponse> {
    const apiKey = process.env.GOOGLE_API_KEY;
    const response = await geminiClient.post(
      `/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        }
      }
    );
    
    const content = response.data.candidates[0]?.content?.parts[0]?.text || '';
    const totalTokens = response.data.usageMetadata?.totalTokenCount || 0;
    
    // Estimate input/output split (Gemini doesn't provide this separately)
    const inputTokens = Math.floor(totalTokens * 0.3);
    const outputTokens = Math.floor(totalTokens * 0.7);
    
    const cost = this.calculateCost(model, inputTokens, outputTokens);
    
    return {
      content,
      tokensUsed: { input: inputTokens, output: outputTokens, total: totalTokens },
      cost,
      model,
      provider: LLMProvider.GOOGLE,
      duration: 0
    };
  }
  
  /**
   * Call Groq API (for Llama models)
   */
  private async callGroq(prompt: string, model: string): Promise<LLMResponse> {
    const response = await groqClient.post('/chat/completions', {
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    });
    
    const content = response.data.choices[0]?.message?.content || '';
    const inputTokens = response.data.usage?.prompt_tokens || 0;
    const outputTokens = response.data.usage?.completion_tokens || 0;
    const totalTokens = inputTokens + outputTokens;
    
    const cost = this.calculateCost(model, inputTokens, outputTokens);
    
    return {
      content,
      tokensUsed: { input: inputTokens, output: outputTokens, total: totalTokens },
      cost,
      model,
      provider: LLMProvider.GROQ,
      duration: 0
    };
  }
  
  /**
   * Determine LLM provider from model name
   */
  private getProviderFromModel(model: string): LLMProvider {
    if (model.startsWith('gpt-')) return LLMProvider.OPENAI;
    if (model.startsWith('claude-')) return LLMProvider.ANTHROPIC;
    if (model.startsWith('gemini-')) return LLMProvider.GOOGLE;
    if (model.startsWith('llama-') || model.startsWith('mixtral-')) return LLMProvider.GROQ;
    if (model.startsWith('mistral-')) return LLMProvider.MISTRAL;
    return LLMProvider.OPENAI; // Default
  }
  
  /**
   * Calculate cost based on model and token usage
   */
  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const costConfig = LLM_COSTS[model];
    if (!costConfig) {
      logger.warn(`No cost config found for model: ${model}, using default`);
      return (inputTokens + outputTokens) * 0.00001; // Fallback
    }
    
    const inputCost = (inputTokens / 1000) * costConfig.input;
    const outputCost = (outputTokens / 1000) * costConfig.output;
    
    return inputCost + outputCost;
  }
  
  /**
   * Parse and validate LLM response
   */
  private parseResponse(content: string, agentType: AgentType): unknown {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(content);
      return parsed;
    } catch (error) {
      // If not valid JSON, return as text
      logger.warn(`Agent ${agentType} returned non-JSON response`);
      return { text: content };
    }
  }
  
  /**
   * Track AI usage in database
   */
  private async trackUsage(usage: AIUsage): Promise<void> {
    try {
      await prisma.aIUsage.create({
        data: {
          id: usage.id,
          userId: usage.userId,
          agentType: usage.agentType,
          prompt: usage.prompt,
          response: usage.response,
          tokensUsed: usage.tokensUsed,
          cost: usage.cost,
          duration: usage.duration,
          createdAt: usage.createdAt
        }
      });
    } catch (error) {
      logger.error('Failed to track AI usage:', error);
      // Don't throw - tracking failure shouldn't break the service
    }
  }
  
  /**
   * Increment usage counter in subscription
   */
  private async incrementUsage(userId: string, agentType: AgentType): Promise<void> {
    try {
      await prisma.subscription.updateMany({
        where: { 
          userId,
          status: 'ACTIVE'
        },
        data: {
          aiUsageUsed: {
            increment: 1
          }
        }
      });
    } catch (error) {
      logger.error('Failed to increment usage:', error);
    }
  }
  
  /**
   * Get available agents for a user's package
   */
  async getAvailableAgents(userId: string): Promise<{ agentType: AgentType; name: string; description: string; remaining: number }[]> {
    const subscription = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!subscription) {
      return [];
    }
    
    const packageType = subscription.packageId as PackageType;
    const config = packageConfigs[packageType];
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const available: { agentType: AgentType; name: string; description: string; remaining: number }[] = [];
    
    for (const [agentType, limit] of Object.entries(config.aiLimits)) {
      if (limit === 0) continue; // Not available
      
      const agent = getAgent(agentType as AgentType);
      
      let remaining = -1;
      if (limit !== -1) {
        const used = await prisma.aIUsage.count({
          where: {
            userId,
            agentType: agentType as AgentType,
            createdAt: { gte: startOfMonth }
          }
        });
        remaining = Math.max(0, limit as number - used);
      }
      
      available.push({
        agentType: agentType as AgentType,
        name: agent.name,
        description: agent.description,
        remaining
      });
    }
    
    return available;
  }
}

// Export singleton instance
export const aiService = new AIService();
