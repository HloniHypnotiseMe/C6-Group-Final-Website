export interface User {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    companyName?: string;
    industry?: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    role: UserRole;
    status: UserStatus;
}
export declare const UserRole: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
    readonly SUPPORT: "SUPPORT";
};
export type UserRole = typeof UserRole[keyof typeof UserRole];
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING = "PENDING"
}
export interface Subscription {
    id: string;
    userId: string;
    packageId: PackageType;
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    startDate: Date;
    endDate?: Date;
    nextBillingDate?: Date;
    aiUsageLimit: number;
    aiUsageUsed: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const PackageType: {
    readonly LEAD: "lead";
    readonly DIAMOND: "diamond";
    readonly GOLD: "gold";
    readonly PLATINUM: "platinum";
    readonly ENTERPRISE: "enterprise";
};
export type PackageType = typeof PackageType[keyof typeof PackageType];
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
    PENDING = "PENDING",
    TRIAL = "TRIAL"
}
export declare enum BillingCycle {
    MONTHLY = "MONTHLY",
    ANNUAL = "ANNUAL"
}
export interface AIUsage {
    id: string;
    userId: string;
    agentType: AgentType;
    prompt: string;
    response: string;
    tokensUsed: number;
    cost: number;
    createdAt: Date;
    duration: number;
}
export declare enum AgentType {
    BUSINESS_AUDIT = "business_audit",
    SEO_ANALYZER = "seo_analyzer",
    CONTENT_GENERATOR = "content_generator",
    CHATBOT = "chatbot",
    EMAIL_ASSISTANT = "email_assistant",
    SALES_ASSISTANT = "sales_assistant",
    MARKETING_STRATEGIST = "marketing_strategist",
    CUSTOMER_SUPPORT = "customer_support",
    DATA_ANALYST = "data_analyst",
    CODE_ASSISTANT = "code_assistant"
}
export interface PackageConfig {
    id: PackageType;
    name: string;
    monthlyPrice: number | null;
    annualPrice: number | null;
    aiLimits: {
        [key in AgentType]: number;
    };
    features: string[];
    maxUsers?: number;
    supportLevel: SupportLevel;
}
export declare enum SupportLevel {
    COMMUNITY = "COMMUNITY",
    EMAIL = "EMAIL",
    PRIORITY = "PRIORITY",
    PHONE = "PHONE",
    DEDICATED = "DEDICATED"
}
export interface AgentPrompt {
    id: string;
    agentType: AgentType;
    name: string;
    description: string;
    systemPrompt: string;
    expectedOutput: string;
    parameters: AgentParameter[];
    examples: AgentExample[];
}
export interface AgentParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    required: boolean;
    description: string;
    default?: unknown;
}
export interface AgentExample {
    input: Record<string, unknown>;
    output: string;
    description: string;
}
export interface AgentRequest {
    agentType: AgentType;
    userId: string;
    parameters: Record<string, unknown>;
    context?: Record<string, unknown>;
}
export interface AgentResponse {
    success: boolean;
    data?: unknown;
    error?: string;
    tokensUsed: number;
    cost: number;
    duration: number;
    agentType: AgentType;
}
export interface LLMConfig {
    provider: LLMProvider;
    model: string;
    apiKey: string;
    maxTokens: number;
    temperature: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}
export declare enum LLMProvider {
    OPENAI = "openai",
    OPENROUTER = "openrouter",
    NVIDIA = "nvidia",
    ANTHROPIC = "anthropic",
    GOOGLE = "google",
    COHERE = "cohere",
    MISTRAL = "mistral",
    GROQ = "groq",
    AWS_BEDROCK = "aws_bedrock"
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ApiMeta;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}
export interface ApiMeta {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
    requestId: string;
}
export interface AuditRequest {
    companyName: string;
    industry: string;
    yearsInBusiness: string;
    employees: string;
    monthlyRevenue: number;
    websiteUrl?: string;
    platforms: string[];
    marketingActivities: string[];
    leadGeneration: string;
    monthlyLeads: string;
    conversionRate: string;
    cac?: number;
    challenges: string[];
    paymentSystems: string[];
    businessTools: string[];
    techChallenge: string;
}
export interface AuditResult {
    overallScore: number;
    seoScore: number;
    currentRevenue: number;
    potentialRevenue: number;
    revenueGap: number;
    conversionRate: number;
    potentialConversion: number;
    recommendations: {
        seo: string[];
        revenue: string[];
        conversion: string[];
        aiTools: string[];
    };
    recommendedPackage: PackageType;
    actionPlan: {
        phase: string;
        tasks: string[];
    }[];
}
export interface AnalyticsData {
    revenue: {
        dates: string[];
        values: number[];
    };
    customers: {
        sources: {
            name: string;
            value: number;
        }[];
    };
    productRevenue: {
        products: string[];
        values: number[];
    };
    clv: {
        segments: string[];
        values: number[];
    };
}
export interface WebhookPayload {
    event: WebhookEvent;
    data: unknown;
    timestamp: string;
    signature: string;
}
export declare enum WebhookEvent {
    USER_CREATED = "user.created",
    USER_UPDATED = "user.updated",
    SUBSCRIPTION_CREATED = "subscription.created",
    SUBSCRIPTION_CANCELLED = "subscription.cancelled",
    SUBSCRIPTION_RENEWED = "subscription.renewed",
    AI_USAGE_THRESHOLD = "ai.usage.threshold",
    PAYMENT_SUCCEEDED = "payment.succeeded",
    PAYMENT_FAILED = "payment.failed"
}
export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
    packageType: PackageType;
    iat: number;
    exp: number;
}
//# sourceMappingURL=index.d.ts.map