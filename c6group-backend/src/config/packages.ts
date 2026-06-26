import { PackageConfig, PackageType, AgentType, SupportLevel } from '../types';

// ============================================
// C6GROUP Package Configuration
// AI Call Limits Per Month Per Agent Type
// ============================================

export const packageConfigs: Record<PackageType, PackageConfig> = {
  [PackageType.LEAD]: {
    id: PackageType.LEAD,
    name: 'Lead Package',
    monthlyPrice: 0,
    annualPrice: 0,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: 1,        // 1 free audit
      [AgentType.SEO_ANALYZER]: 0,
      [AgentType.CONTENT_GENERATOR]: 0,
      [AgentType.CHATBOT]: 0,
      [AgentType.EMAIL_ASSISTANT]: 0,
      [AgentType.SALES_ASSISTANT]: 0,
      [AgentType.MARKETING_STRATEGIST]: 0,
      [AgentType.CUSTOMER_SUPPORT]: 0,
      [AgentType.DATA_ANALYST]: 0,
      [AgentType.CODE_ASSISTANT]: 0,
    },
    features: [
      'Contact information capture',
      'WhatsApp & Email opt-in',
      'Basic revenue visualization',
      'RemotePay integration',
      'Community support',
      '1 Free AI Business Audit'
    ],
    supportLevel: SupportLevel.COMMUNITY
  },

  [PackageType.DIAMOND]: {
    id: PackageType.DIAMOND,
    name: 'Diamond',
    monthlyPrice: 299.99,
    annualPrice: 239.99,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: 5,        // 5 audits per month
      [AgentType.SEO_ANALYZER]: 20,         // 20 SEO analyses
      [AgentType.CONTENT_GENERATOR]: 50,    // 50 content pieces
      [AgentType.CHATBOT]: 500,             // 500 chatbot interactions
      [AgentType.EMAIL_ASSISTANT]: 100,     // 100 email assists
      [AgentType.SALES_ASSISTANT]: 50,      // 50 sales assists
      [AgentType.MARKETING_STRATEGIST]: 10, // 10 marketing strategies
      [AgentType.CUSTOMER_SUPPORT]: 0,
      [AgentType.DATA_ANALYST]: 0,
      [AgentType.CODE_ASSISTANT]: 0,
    },
    features: [
      'Reputation Tool',
      'AI Chatbot (trained on your business)',
      '2 AI tools total',
      'Email support',
      'Basic analytics',
      '500 chatbot messages/month',
      '50 content generations/month',
      '20 SEO analyses/month'
    ],
    supportLevel: SupportLevel.EMAIL
  },

  [PackageType.GOLD]: {
    id: PackageType.GOLD,
    name: 'Gold',
    monthlyPrice: 699,
    annualPrice: 559,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: 10,       // 10 audits per month
      [AgentType.SEO_ANALYZER]: 100,        // 100 SEO analyses
      [AgentType.CONTENT_GENERATOR]: 200,   // 200 content pieces
      [AgentType.CHATBOT]: 2000,            // 2000 chatbot interactions
      [AgentType.EMAIL_ASSISTANT]: 500,     // 500 email assists
      [AgentType.SALES_ASSISTANT]: 200,     // 200 sales assists
      [AgentType.MARKETING_STRATEGIST]: 50, // 50 marketing strategies
      [AgentType.CUSTOMER_SUPPORT]: 100,    // 100 support tickets
      [AgentType.DATA_ANALYST]: 50,         // 50 data analyses
      [AgentType.CODE_ASSISTANT]: 20,       // 20 code assists
    },
    features: [
      'Everything in Diamond',
      'Traffic Analyst',
      '3 AI tools total',
      'Priority support',
      'Advanced analytics',
      '1-on-1 onboarding',
      '2000 chatbot messages/month',
      '200 content generations/month',
      '100 SEO analyses/month'
    ],
    supportLevel: SupportLevel.PRIORITY
  },

  [PackageType.PLATINUM]: {
    id: PackageType.PLATINUM,
    name: 'Platinum',
    monthlyPrice: 1499,
    annualPrice: 1199,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: -1,       // Unlimited
      [AgentType.SEO_ANALYZER]: -1,         // Unlimited
      [AgentType.CONTENT_GENERATOR]: -1,    // Unlimited
      [AgentType.CHATBOT]: -1,              // Unlimited
      [AgentType.EMAIL_ASSISTANT]: -1,      // Unlimited
      [AgentType.SALES_ASSISTANT]: -1,      // Unlimited
      [AgentType.MARKETING_STRATEGIST]: -1, // Unlimited
      [AgentType.CUSTOMER_SUPPORT]: -1,     // Unlimited
      [AgentType.DATA_ANALYST]: -1,         // Unlimited
      [AgentType.CODE_ASSISTANT]: -1,       // Unlimited
    },
    features: [
      'Everything in Gold',
      '1 AI Staff Member',
      'Business Intelligence Dashboard',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'Unlimited AI usage',
      'White-label options'
    ],
    maxUsers: 5,
    supportLevel: SupportLevel.PHONE
  },

  [PackageType.ENTERPRISE]: {
    id: PackageType.ENTERPRISE,
    name: 'Enterprise',
    monthlyPrice: 0, // Custom pricing
    annualPrice: 0,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: -1,       // Unlimited
      [AgentType.SEO_ANALYZER]: -1,         // Unlimited
      [AgentType.CONTENT_GENERATOR]: -1,    // Unlimited
      [AgentType.CHATBOT]: -1,              // Unlimited
      [AgentType.EMAIL_ASSISTANT]: -1,      // Unlimited
      [AgentType.SALES_ASSISTANT]: -1,      // Unlimited
      [AgentType.MARKETING_STRATEGIST]: -1, // Unlimited
      [AgentType.CUSTOMER_SUPPORT]: -1,     // Unlimited
      [AgentType.DATA_ANALYST]: -1,         // Unlimited
      [AgentType.CODE_ASSISTANT]: -1,       // Unlimited
    },
    features: [
      'SuperAI Agents',
      'Dedicated consultant',
      'White-label options',
      'Custom AI development',
      'SLA guarantee',
      'Priority development',
      'Unlimited AI usage',
      'Custom model training'
    ],
    maxUsers: -1, // Unlimited
    supportLevel: SupportLevel.DEDICATED
  }
};

// Helper function to check if user has exceeded AI limit
export function hasExceededAILimit(
  packageType: PackageType,
  agentType: AgentType,
  currentUsage: number
): boolean {
  const config = packageConfigs[packageType];
  const limit = config.aiLimits[agentType];
  
  // -1 means unlimited
  if (limit === -1) return false;
  
  return currentUsage >= limit;
}

// Helper function to get remaining AI calls
export function getRemainingAICalls(
  packageType: PackageType,
  agentType: AgentType,
  currentUsage: number
): number {
  const config = packageConfigs[packageType];
  const limit = config.aiLimits[agentType];
  
  if (limit === -1) return -1; // Unlimited
  if (limit === 0) return 0;   // Not available
  
  return Math.max(0, limit - currentUsage);
}

// Helper function to get all AI limits for a package
export function getPackageAILimits(packageType: PackageType): Record<AgentType, number> {
  const config = packageConfigs[packageType];
  return config.aiLimits as Record<AgentType, number>;
}

// Cost per 1K tokens for each LLM provider (in USD)
export const LLM_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
  'mistral-large': { input: 0.002, output: 0.006 },
  'llama-3.1-70b': { input: 0.00059, output: 0.00079 },
};

// Default model for each agent type (optimized for cost/performance)
export const AGENT_DEFAULT_MODELS: Record<AgentType, string> = {
  [AgentType.BUSINESS_AUDIT]: 'gpt-4o',
  [AgentType.SEO_ANALYZER]: 'gpt-4o-mini',
  [AgentType.CONTENT_GENERATOR]: 'claude-3-5-sonnet',
  [AgentType.CHATBOT]: 'gpt-4o-mini',
  [AgentType.EMAIL_ASSISTANT]: 'claude-3-haiku',
  [AgentType.SALES_ASSISTANT]: 'gpt-4o-mini',
  [AgentType.MARKETING_STRATEGIST]: 'gpt-4o',
  [AgentType.CUSTOMER_SUPPORT]: 'claude-3-haiku',
  [AgentType.DATA_ANALYST]: 'gpt-4o',
  [AgentType.CODE_ASSISTANT]: 'claude-3-5-sonnet',
};
