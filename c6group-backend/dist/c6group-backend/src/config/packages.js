"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGENT_DEFAULT_MODELS = exports.LLM_COSTS = exports.packageConfigs = void 0;
exports.hasExceededAILimit = hasExceededAILimit;
exports.getRemainingAICalls = getRemainingAICalls;
exports.getPackageAILimits = getPackageAILimits;
const commercialCatalog_1 = require("./commercialCatalog");
const types_1 = require("../types");
// ============================================
// C6GROUP Package Configuration
// Capability limits live here; commercial pricing lives in the shared contract.
// ============================================
exports.packageConfigs = {
    [types_1.PackageType.LEAD]: {
        id: types_1.PackageType.LEAD,
        name: 'Lead Package',
        monthlyPrice: (0, commercialCatalog_1.getCommercialPackage)("LEAD").monthlyPriceZar ?? 0,
        annualPrice: (0, commercialCatalog_1.getCommercialPackage)("LEAD").annualPriceZar ?? 0,
        aiLimits: {
            [types_1.AgentType.BUSINESS_AUDIT]: 1,
            [types_1.AgentType.SEO_ANALYZER]: 0,
            [types_1.AgentType.CONTENT_GENERATOR]: 0,
            [types_1.AgentType.CHATBOT]: 0,
            [types_1.AgentType.EMAIL_ASSISTANT]: 0,
            [types_1.AgentType.SALES_ASSISTANT]: 0,
            [types_1.AgentType.MARKETING_STRATEGIST]: 0,
            [types_1.AgentType.CUSTOMER_SUPPORT]: 0,
            [types_1.AgentType.DATA_ANALYST]: 0,
            [types_1.AgentType.CODE_ASSISTANT]: 0,
        },
        features: [
            'Contact information capture', 'WhatsApp & Email opt-in', 'Basic revenue visualization',
            'RemotePay integration', 'Community support', '1 Free AI Business Audit'
        ],
        supportLevel: types_1.SupportLevel.COMMUNITY
    },
    [types_1.PackageType.DIAMOND]: {
        id: types_1.PackageType.DIAMOND,
        name: 'Diamond',
        monthlyPrice: (0, commercialCatalog_1.getCommercialPackage)("DIAMOND").monthlyPriceZar ?? 0,
        annualPrice: (0, commercialCatalog_1.getCommercialPackage)("DIAMOND").annualPriceZar ?? 0,
        aiLimits: {
            [types_1.AgentType.BUSINESS_AUDIT]: 5, [types_1.AgentType.SEO_ANALYZER]: 20, [types_1.AgentType.CONTENT_GENERATOR]: 50,
            [types_1.AgentType.CHATBOT]: 500, [types_1.AgentType.EMAIL_ASSISTANT]: 100, [types_1.AgentType.SALES_ASSISTANT]: 50,
            [types_1.AgentType.MARKETING_STRATEGIST]: 10, [types_1.AgentType.CUSTOMER_SUPPORT]: 0, [types_1.AgentType.DATA_ANALYST]: 0,
            [types_1.AgentType.CODE_ASSISTANT]: 0,
        },
        features: [
            'Business visibility & reputation tools', 'AI Chatbot trained on your business', 'Up to 2 enabled AI tools',
            'Basic analytics', 'Email support', '500 chatbot messages/month', '50 content generations/month',
            '20 SEO analyses/month'
        ],
        supportLevel: types_1.SupportLevel.EMAIL
    },
    [types_1.PackageType.GOLD]: {
        id: types_1.PackageType.GOLD,
        name: 'Gold',
        monthlyPrice: (0, commercialCatalog_1.getCommercialPackage)("GOLD").monthlyPriceZar ?? 0,
        annualPrice: (0, commercialCatalog_1.getCommercialPackage)("GOLD").annualPriceZar ?? 0,
        aiLimits: {
            [types_1.AgentType.BUSINESS_AUDIT]: 10, [types_1.AgentType.SEO_ANALYZER]: 100, [types_1.AgentType.CONTENT_GENERATOR]: 200,
            [types_1.AgentType.CHATBOT]: 2000, [types_1.AgentType.EMAIL_ASSISTANT]: 500, [types_1.AgentType.SALES_ASSISTANT]: 200,
            [types_1.AgentType.MARKETING_STRATEGIST]: 50, [types_1.AgentType.CUSTOMER_SUPPORT]: 100, [types_1.AgentType.DATA_ANALYST]: 50,
            [types_1.AgentType.CODE_ASSISTANT]: 20,
        },
        features: [
            'Everything in Diamond', 'Traffic & growth analyst', 'Up to 3 enabled AI tools', 'Advanced analytics',
            'Priority support', '1-on-1 onboarding', '2000 chatbot messages/month', '200 content generations/month',
            '100 SEO analyses/month'
        ],
        supportLevel: types_1.SupportLevel.PRIORITY
    },
    [types_1.PackageType.PLATINUM]: {
        id: types_1.PackageType.PLATINUM,
        name: 'Platinum',
        monthlyPrice: (0, commercialCatalog_1.getCommercialPackage)("PLATINUM").monthlyPriceZar ?? 0,
        annualPrice: (0, commercialCatalog_1.getCommercialPackage)("PLATINUM").annualPriceZar ?? 0,
        aiLimits: {
            [types_1.AgentType.BUSINESS_AUDIT]: 50, [types_1.AgentType.SEO_ANALYZER]: 200, [types_1.AgentType.CONTENT_GENERATOR]: 500,
            [types_1.AgentType.CHATBOT]: 10000, [types_1.AgentType.EMAIL_ASSISTANT]: 2000, [types_1.AgentType.SALES_ASSISTANT]: 1000,
            [types_1.AgentType.MARKETING_STRATEGIST]: 100, [types_1.AgentType.CUSTOMER_SUPPORT]: 500, [types_1.AgentType.DATA_ANALYST]: 200,
            [types_1.AgentType.CODE_ASSISTANT]: 100,
        },
        features: [
            'Everything in Gold', '1 AI Staff Member', 'Business Intelligence Dashboard', 'Dedicated account manager',
            'Priority phone support', 'Custom integrations', 'High-volume AI allowance with fair-use controls', 'White-label options'
        ],
        maxUsers: 5,
        supportLevel: types_1.SupportLevel.PHONE
    },
    [types_1.PackageType.ENTERPRISE]: {
        id: types_1.PackageType.ENTERPRISE,
        name: 'Enterprise',
        // Enterprise is custom-priced and is not self-serve. Internal config uses 0;
        // public commercial pricing is resolved from the shared contract and remains null.
        monthlyPrice: 0,
        annualPrice: 0,
        aiLimits: {
            [types_1.AgentType.BUSINESS_AUDIT]: -1, [types_1.AgentType.SEO_ANALYZER]: -1, [types_1.AgentType.CONTENT_GENERATOR]: -1,
            [types_1.AgentType.CHATBOT]: -1, [types_1.AgentType.EMAIL_ASSISTANT]: -1, [types_1.AgentType.SALES_ASSISTANT]: -1,
            [types_1.AgentType.MARKETING_STRATEGIST]: -1, [types_1.AgentType.CUSTOMER_SUPPORT]: -1, [types_1.AgentType.DATA_ANALYST]: -1,
            [types_1.AgentType.CODE_ASSISTANT]: -1,
        },
        features: [
            'SuperAI Agents', 'Dedicated consultant', 'White-label options', 'Custom AI development', 'SLA guarantee',
            'Priority development', 'Custom usage and model policy', 'Custom model training'
        ],
        maxUsers: -1,
        supportLevel: types_1.SupportLevel.DEDICATED
    }
};
function hasExceededAILimit(packageType, agentType, currentUsage) {
    const config = exports.packageConfigs[packageType];
    const limit = config.aiLimits[agentType];
    if (limit === -1)
        return false;
    return currentUsage >= limit;
}
function getRemainingAICalls(packageType, agentType, currentUsage) {
    const config = exports.packageConfigs[packageType];
    const limit = config.aiLimits[agentType];
    if (limit === -1)
        return -1;
    if (limit === 0)
        return 0;
    return Math.max(0, limit - currentUsage);
}
function getPackageAILimits(packageType) {
    const config = exports.packageConfigs[packageType];
    return config.aiLimits;
}
exports.LLM_COSTS = {
    'gpt-4o': { input: 0.0025, output: 0.01 }, 'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'claude-3-5-sonnet': { input: 0.003, output: 0.015 }, 'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    'gemini-1.5-pro': { input: 0.00125, output: 0.005 }, 'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
    'mistral-large': { input: 0.002, output: 0.006 }, 'llama-3.1-70b': { input: 0.00059, output: 0.00079 },
};
exports.AGENT_DEFAULT_MODELS = {
    [types_1.AgentType.BUSINESS_AUDIT]: 'openrouter/free', [types_1.AgentType.SEO_ANALYZER]: 'gpt-4o-mini',
    [types_1.AgentType.CONTENT_GENERATOR]: 'claude-3-5-sonnet', [types_1.AgentType.CHATBOT]: 'gpt-4o-mini',
    [types_1.AgentType.EMAIL_ASSISTANT]: 'claude-3-haiku', [types_1.AgentType.SALES_ASSISTANT]: 'gpt-4o-mini',
    [types_1.AgentType.MARKETING_STRATEGIST]: 'gpt-4o', [types_1.AgentType.CUSTOMER_SUPPORT]: 'claude-3-haiku',
    [types_1.AgentType.DATA_ANALYST]: 'gpt-4o', [types_1.AgentType.CODE_ASSISTANT]: 'claude-3-5-sonnet',
};
//# sourceMappingURL=packages.js.map