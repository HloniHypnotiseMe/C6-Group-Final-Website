import { AgentType, AgentRequest, AgentResponse, PackageType } from '../types';
export declare class AIService {
    /**
     * Execute an AI agent with rate limiting and usage tracking
     */
    executeAgent(request: AgentRequest): Promise<AgentResponse>;
    /**
     * Check if user has exceeded their AI usage limits
     */
    private checkRateLimits;
    /**
     * Get user's current AI usage statistics
     */
    getUsageStats(userId: string): Promise<{
        packageType: PackageType;
        limits: Record<AgentType, {
            limit: number;
            used: number;
            remaining: number;
        }>;
        totalCost: number;
        totalTokens: number;
    }>;
    /**
     * Build the complete prompt for the LLM
     */
    private buildPrompt;
    /**
     * Select the appropriate model based on agent type and user package
     */
    private selectModel;
    /**
     * Call the appropriate LLM provider
     */
    private callLLM;
    /**
     * Call OpenAI API
     */
    private callOpenAI;
    /**
     * Call OpenRouter.
     */
    private callOpenRouter;
    /**
     * Call NVIDIA NIM.
     */
    private callNvidia;
    /**
     * Shared OpenAI-compatible implementation.
     */
    private callOpenAICompatible;
    /**
     * Call Anthropic Claude API
     */
    private callAnthropic;
    /**
     * Call Google Gemini API
     */
    private callGemini;
    /**
     * Call Groq API (for Llama models)
     */
    private callGroq;
    /**
     * Determine LLM provider from model name
     */
    private getProviderFromModel;
    /**
     * Calculate cost based on model and token usage
     */
    private calculateCost;
    /**
     * Parse and validate LLM response
     */
    private parseResponse;
    /**
     * Track AI usage in database
     */
    private trackUsage;
    /**
     * Increment usage counter in subscription
     */
    private incrementUsage;
    /**
     * Get available agents for a user's package
     */
    getAvailableAgents(userId: string): Promise<{
        agentType: AgentType;
        name: string;
        description: string;
        remaining: number;
    }[]>;
}
export declare const aiService: AIService;
//# sourceMappingURL=aiService.d.ts.map