import { PackageConfig, PackageType, AgentType, SupportLevel } from '../types';

// ============================================
// C6GROUP Package Configuration
// Commercial pricing is canonical in ZAR.
// Prices are productised for repeatable delivery; AI recommends a package,
// but never invents a price. Annual pricing is 10 months for 2 months free.
// ============================================

export const packageConfigs: Record<PackageType, PackageConfig> = {
  [PackageType.LEAD]: {
    id: PackageType.LEAD,
    name: 'Lead Package',
    monthlyPrice: 0,
    annualPrice: 0,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: 1,
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
    monthlyPrice: 4995,
    annualPrice: 49950,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: 5,
      [AgentType.SEO_ANALYZER]: 20,
      [AgentType.CONTENT_GENERATOR]: 50,
      [AgentType.CHATBOT]: 500,
      [AgentType.EMAIL_ASSISTANT]: 100,
      [AgentType.SALES_ASSISTANT]: 50,
      [AgentType.MARKETING_STRATEGIST]: 10,
      [AgentType.CUSTOMER_SUPPORT]: 0,
      [AgentType.DATA_ANALYST]: 0,
      [AgentType.CODE_ASSISTANT]: 0,
    },
    features: [
      'Business visibility & reputation tools',
      'AI Chatbot trained on your business',
      'Up to 2 enabled AI tools',
      'Basic analytics',
      'Email support',
      '500 chatbot messages/month',
      '50 content generations/month',
      '20 SEO analyses/month'
    ],
    supportLevel: SupportLevel.EMAIL
  },

  [PackageType.GOLD]: {
    id: PackageType.GOLD,
    name: 'Gold',
    monthlyPrice: 9995,
    annualPrice: 99950,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: 10,
      [AgentType.SEO_ANALYZER]: 100,
      [AgentType.CONTENT_GENERATOR]: 200,
      [AgentType.CHATBOT]: 2000,
      [AgentType.EMAIL_ASSISTANT]: 500,
      [AgentType.SALES_ASSISTANT]: 200,
      [AgentType.MARKETING_STRATEGIST]: 50,
      [AgentType.CUSTOMER_SUPPORT]: 100,
      [AgentType.DATA_ANALYST]: 50,
      [AgentType.CODE_ASSISTANT]: 20,
    },
    features: [
      'Everything in Diamond',
      'Traffic & growth analyst',
      'Up to 3 enabled AI tools',
      'Advanced analytics',
      'Priority support',
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
    monthlyPrice: 24995,
    annualPrice: 249950,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: 50,
      [AgentType.SEO_ANALYZER]: 200,
      [AgentType.CONTENT_GENERATOR]: 500,
      [AgentType.CHATBOT]: 10000,
      [AgentType.EMAIL_ASSISTANT]: 2000,
      [AgentType.SALES_ASSISTANT]: 1000,
      [AgentType.MARKETING_STRATEGIST]: 100,
      [AgentType.CUSTOMER_SUPPORT]: 500,
      [AgentType.DATA_ANALYST]: 200,
      [AgentType.CODE_ASSISTANT]: 100,
    },
    features: [
      'Everything in Gold',
      '1 AI Staff Member',
      'Business Intelligence Dashboard',
      'Dedicated account manager',
      'Priority phone support',
      'Custom integrations',
      'High-volume AI allowance with fair-use controls',
      'White-label options'
    ],
    maxUsers: 5,
    supportLevel: SupportLevel.PHONE
  },

  [PackageType.ENTERPRISE]: {
    id: PackageType.ENTERPRISE,
    name: 'Enterprise',
    monthlyPrice: 0,
    annualPrice: 0,
    aiLimits: {
      [AgentType.BUSINESS_AUDIT]: -1,
      [AgentType.SEO_ANALYZER]: -1,
      [AgentType.CONTENT_GENERATOR]: -1,
      [AgentType.CHATBOT]: -1,
      [AgentType.EMAIL_ASSISTANT]: -1,
      [AgentType.SALES_ASSISTANT]: -1,
      [AgentType.MARKETING_STRATEGIST]: -1,
      [AgentType.CUSTOMER_SUPPORT]: -1,
      [AgentType.DATA_ANALYST]: -1,
      [AgentType.CODE_ASSISTANT]: -1,
    },
    features: [
      'SuperAI Agents',
      'Dedicated consultant',
      'White-label options',
      'Custom AI development',
      'SLA guarantee',
      'Priority development',
      'Custom usage and model policy',
      'Custom model training'
    ],
    maxUsers: -1,
    supportLevel: SupportLevel.DEDICATED
  }
};

export function hasExceededAILimit(
  packageType: PackageType,
  agentType: AgentType,
  currentUsage: number
): boolean {
  const config = packageConfigs[packageType];
  const limit = config.aiLimits[agentType];
  if (limit === -1) return false;
  return currentUsage >= limit;
}

export function getRemainingAICalls(
  packageType: PackageType,
  agentType: AgentType,
  currentUsage: number
): number {
  const config = packageConfigs[packageType];
  const limit = config.aiLimits[agentType];
  if (limit === -1) return -1;
  if (limit === 0) return 0;
  return Math.max(0, limit - currentUsage);
}

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
