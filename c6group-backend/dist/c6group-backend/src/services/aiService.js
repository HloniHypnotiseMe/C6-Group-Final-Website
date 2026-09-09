"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = void 0;
const openai_1 = __importDefault(require("openai"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const types_1 = require("../types");
const agents_1 = require("../prompts/agents");
const packages_1 = require("../config/packages");
const logger_1 = require("../utils/logger");
const prisma_1 = require("../utils/prisma");
// Initialize LLM clients
const openRouterClient = process.env.OPENROUTER_API_KEY
    ? new openai_1.default({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: process.env.OPENROUTER_BASE_URL ||
            'https://openrouter.ai/api/v1',
    })
    : null;
const nvidiaClient = process.env.NVIDIA_API_KEY
    ? new openai_1.default({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: process.env.NVIDIA_BASE_URL ||
            'https://integrate.api.nvidia.com/v1',
    })
    : null;
const openai = process.env.OPENAI_API_KEY
    ? new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    })
    : null;
// Anthropic client setup
const anthropicClient = axios_1.default.create({
    baseURL: 'https://api.anthropic.com/v1',
    headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
    },
});
// Google Gemini client setup
const geminiClient = axios_1.default.create({
    baseURL: 'https://generativelanguage.googleapis.com/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Groq client setup
const groqClient = axios_1.default.create({
    baseURL: 'https://api.groq.com/openai/v1',
    headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`,
        'Content-Type': 'application/json',
    },
});
// ============================================
// Main AI Service Class
// ============================================
class AIService {
    /**
     * Execute an AI agent with rate limiting and usage tracking
     */
    async executeAgent(request) {
        const startTime = Date.now();
        const requestId = (0, uuid_1.v4)();
        try {
            logger_1.logger.info(`[${requestId}] Executing agent: ${request.agentType} for user: ${request.userId}`);
            // 1. Check rate limits
            const rateLimitCheck = await this.checkRateLimits(request.userId, request.agentType);
            if (!rateLimitCheck.allowed) {
                logger_1.logger.warn(`[${requestId}] Rate limit exceeded for user: ${request.userId}, agent: ${request.agentType}`);
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
            const agent = (0, agents_1.getAgent)(request.agentType);
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
                id: (0, uuid_1.v4)(),
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
            logger_1.logger.info(`[${requestId}] Agent execution completed in ${duration}ms, tokens: ${llmResponse.tokensUsed.total}, cost: $${llmResponse.cost.toFixed(4)}`);
            return {
                success: true,
                data: parsedResponse,
                tokensUsed: llmResponse.tokensUsed.total,
                cost: llmResponse.cost,
                duration,
                agentType: request.agentType
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger_1.logger.error(`[${requestId}] Agent execution failed:`, error);
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
    async checkRateLimits(userId, agentType) {
        try {
            // Get user's subscription
            const subscription = await prisma_1.prisma.subscription.findFirst({
                where: {
                    userId,
                    status: 'ACTIVE'
                },
                orderBy: { createdAt: 'desc' }
            });
            if (!subscription) {
                return { allowed: false, message: 'No active subscription found' };
            }
            const packageType = subscription.packageId;
            const config = packages_1.packageConfigs[packageType];
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
            const usage = await prisma_1.prisma.aIUsage.count({
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
        }
        catch (error) {
            logger_1.logger.error('Error checking rate limits:', error);
            return { allowed: false, message: 'Unable to verify usage limits. Please try again later.' };
        }
    }
    /**
     * Get user's current AI usage statistics
     */
    async getUsageStats(userId) {
        const subscription = await prisma_1.prisma.subscription.findFirst({
            where: { userId, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
        });
        if (!subscription) {
            throw new Error('No active subscription found');
        }
        const packageType = subscription.packageId;
        const config = packages_1.packageConfigs[packageType];
        // Get start of month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        // Get usage for each agent type
        const limits = {};
        for (const [agentType, limit] of Object.entries(config.aiLimits)) {
            const used = await prisma_1.prisma.aIUsage.count({
                where: {
                    userId,
                    agentType: agentType,
                    createdAt: { gte: startOfMonth }
                }
            });
            limits[agentType] = {
                limit: limit,
                used,
                remaining: limit === -1 ? -1 : Math.max(0, limit - used)
            };
        }
        // Get total cost and tokens
        const usage = await prisma_1.prisma.aIUsage.aggregate({
            where: { userId, createdAt: { gte: startOfMonth } },
            _sum: { cost: true, tokensUsed: true }
        });
        return {
            packageType,
            limits,
            totalCost: usage._sum.cost == null ? 0 : Number(usage._sum.cost),
            totalTokens: usage._sum.tokensUsed || 0
        };
    }
    /**
     * Build the complete prompt for the LLM
     */
    buildPrompt(systemPrompt, parameters, context) {
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
    selectModel(agentType, userId) {
        // For now, use default models. In production, could upgrade based on package tier
        return packages_1.AGENT_DEFAULT_MODELS[agentType];
    }
    /**
     * Call the appropriate LLM provider
     */
    async callLLM(prompt, model, agentType) {
        const startTime = Date.now();
        // Determine provider from model name
        const provider = this.getProviderFromModel(model);
        try {
            switch (provider) {
                case types_1.LLMProvider.OPENAI:
                    return await this.callOpenAI(prompt, model);
                case types_1.LLMProvider.OPENROUTER:
                    return await this.callOpenRouter(prompt, model);
                case types_1.LLMProvider.NVIDIA:
                    return await this.callNvidia(prompt);
                case types_1.LLMProvider.ANTHROPIC:
                    return await this.callAnthropic(prompt, model);
                case types_1.LLMProvider.GOOGLE:
                    return await this.callGemini(prompt, model);
                case types_1.LLMProvider.GROQ:
                    return await this.callGroq(prompt, model);
                default:
                    throw new Error(`Unsupported provider: ${provider}`);
            }
        }
        catch (error) {
            logger_1.logger.error(`LLM call failed for ${provider}:`, error);
            throw error;
        }
    }
    /**
     * Call OpenAI API
     */
    async callOpenAI(prompt, model) {
        if (!openai) {
            throw new Error('OpenAI provider is not configured.');
        }
        return this.callOpenAICompatible(openai, prompt, model, types_1.LLMProvider.OPENAI);
    }
    /**
     * Call OpenRouter.
     */
    async callOpenRouter(prompt, model) {
        if (!openRouterClient) {
            if (nvidiaClient) {
                logger_1.logger.warn('OpenRouter unavailable; falling back to NVIDIA.');
                return this.callNvidia(prompt);
            }
            throw new Error('Free AI provider is not configured. Set OPENROUTER_API_KEY or NVIDIA_API_KEY.');
        }
        try {
            return await this.callOpenAICompatible(openRouterClient, prompt, model, types_1.LLMProvider.OPENROUTER);
        }
        catch (error) {
            if (nvidiaClient) {
                logger_1.logger.warn('OpenRouter request failed; falling back to NVIDIA.', error);
                return this.callNvidia(prompt);
            }
            throw error;
        }
    }
    /**
     * Call NVIDIA NIM.
     */
    async callNvidia(prompt) {
        if (!nvidiaClient) {
            throw new Error('NVIDIA provider is not configured. Set NVIDIA_API_KEY.');
        }
        const model = process.env.NVIDIA_MODEL ||
            'meta/llama-3.3-70b-instruct';
        return this.callOpenAICompatible(nvidiaClient, prompt, model, types_1.LLMProvider.NVIDIA);
    }
    /**
     * Shared OpenAI-compatible implementation.
     */
    async callOpenAICompatible(client, prompt, model, provider) {
        const response = await client.chat.completions.create({
            model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });
        const content = response.choices[0]?.message?.content || '';
        const inputTokens = response.usage?.prompt_tokens || 0;
        const outputTokens = response.usage?.completion_tokens || 0;
        const totalTokens = inputTokens + outputTokens;
        const cost = provider === types_1.LLMProvider.OPENROUTER ||
            provider === types_1.LLMProvider.NVIDIA
            ? 0
            : this.calculateCost(model, inputTokens, outputTokens);
        return {
            content,
            tokensUsed: {
                input: inputTokens,
                output: outputTokens,
                total: totalTokens
            },
            cost,
            model,
            provider,
            duration: 0
        };
    }
    /**
     * Call Anthropic Claude API
     */
    async callAnthropic(prompt, model) {
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
            provider: types_1.LLMProvider.ANTHROPIC,
            duration: 0
        };
    }
    /**
     * Call Google Gemini API
     */
    async callGemini(prompt, model) {
        const apiKey = process.env.GOOGLE_API_KEY;
        const response = await geminiClient.post(`/models/${model}:generateContent?key=${apiKey}`, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4000,
            }
        });
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
            provider: types_1.LLMProvider.GOOGLE,
            duration: 0
        };
    }
    /**
     * Call Groq API (for Llama models)
     */
    async callGroq(prompt, model) {
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
            provider: types_1.LLMProvider.GROQ,
            duration: 0
        };
    }
    /**
     * Determine LLM provider from model name
     */
    getProviderFromModel(model) {
        if (model === 'openrouter/free' ||
            model.startsWith('openrouter/')) {
            return types_1.LLMProvider.OPENROUTER;
        }
        if (model.startsWith('nvidia/')) {
            return types_1.LLMProvider.NVIDIA;
        }
        if (model.startsWith('gpt-'))
            return types_1.LLMProvider.OPENAI;
        if (model.startsWith('claude-'))
            return types_1.LLMProvider.ANTHROPIC;
        if (model.startsWith('gemini-'))
            return types_1.LLMProvider.GOOGLE;
        if (model.startsWith('llama-') ||
            model.startsWith('mixtral-')) {
            return types_1.LLMProvider.GROQ;
        }
        if (model.startsWith('mistral-')) {
            return types_1.LLMProvider.MISTRAL;
        }
        return types_1.LLMProvider.OPENAI;
    }
    /**
     * Calculate cost based on model and token usage
     */
    calculateCost(model, inputTokens, outputTokens) {
        const costConfig = packages_1.LLM_COSTS[model];
        if (!costConfig) {
            logger_1.logger.warn(`No cost config found for model: ${model}, using default`);
            return (inputTokens + outputTokens) * 0.00001; // Fallback
        }
        const inputCost = (inputTokens / 1000) * costConfig.input;
        const outputCost = (outputTokens / 1000) * costConfig.output;
        return inputCost + outputCost;
    }
    /**
     * Parse and validate LLM response
     */
    parseResponse(content, agentType) {
        try {
            // Try to parse as JSON
            const parsed = JSON.parse(content);
            return parsed;
        }
        catch (error) {
            // If not valid JSON, return as text
            logger_1.logger.warn(`Agent ${agentType} returned non-JSON response`);
            return { text: content };
        }
    }
    /**
     * Track AI usage in database
     */
    async trackUsage(usage) {
        try {
            await prisma_1.prisma.aIUsage.create({
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
        }
        catch (error) {
            logger_1.logger.error('Failed to track AI usage:', error);
            // Don't throw - tracking failure shouldn't break the service
        }
    }
    /**
     * Increment usage counter in subscription
     */
    async incrementUsage(userId, agentType) {
        try {
            await prisma_1.prisma.subscription.updateMany({
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
        }
        catch (error) {
            logger_1.logger.error('Failed to increment usage:', error);
        }
    }
    /**
     * Get available agents for a user's package
     */
    async getAvailableAgents(userId) {
        const subscription = await prisma_1.prisma.subscription.findFirst({
            where: { userId, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
        });
        if (!subscription) {
            return [];
        }
        const packageType = subscription.packageId;
        const config = packages_1.packageConfigs[packageType];
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const available = [];
        for (const [agentType, limit] of Object.entries(config.aiLimits)) {
            if (limit === 0)
                continue; // Not available
            const agent = (0, agents_1.getAgent)(agentType);
            let remaining = -1;
            if (limit !== -1) {
                const used = await prisma_1.prisma.aIUsage.count({
                    where: {
                        userId,
                        agentType: agentType,
                        createdAt: { gte: startOfMonth }
                    }
                });
                remaining = Math.max(0, limit - used);
            }
            available.push({
                agentType: agentType,
                name: agent.name,
                description: agent.description,
                remaining
            });
        }
        return available;
    }
}
exports.AIService = AIService;
// Export singleton instance
exports.aiService = new AIService();
//# sourceMappingURL=aiService.js.map