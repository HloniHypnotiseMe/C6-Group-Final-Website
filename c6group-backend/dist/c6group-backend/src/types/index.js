"use strict";
// ============================================
// C6GROUP Backend Type Definitions
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEvent = exports.LLMProvider = exports.SupportLevel = exports.AgentType = exports.BillingCycle = exports.SubscriptionStatus = exports.PackageType = exports.UserStatus = exports.UserRole = void 0;
exports.UserRole = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    SUPPORT: 'SUPPORT'
};
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
    UserStatus["PENDING"] = "PENDING";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
exports.PackageType = {
    LEAD: 'lead',
    DIAMOND: 'diamond',
    GOLD: 'gold',
    PLATINUM: 'platinum',
    ENTERPRISE: 'enterprise'
};
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
    SubscriptionStatus["PENDING"] = "PENDING";
    SubscriptionStatus["TRIAL"] = "TRIAL";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var BillingCycle;
(function (BillingCycle) {
    BillingCycle["MONTHLY"] = "MONTHLY";
    BillingCycle["ANNUAL"] = "ANNUAL";
})(BillingCycle || (exports.BillingCycle = BillingCycle = {}));
var AgentType;
(function (AgentType) {
    AgentType["BUSINESS_AUDIT"] = "business_audit";
    AgentType["SEO_ANALYZER"] = "seo_analyzer";
    AgentType["CONTENT_GENERATOR"] = "content_generator";
    AgentType["CHATBOT"] = "chatbot";
    AgentType["EMAIL_ASSISTANT"] = "email_assistant";
    AgentType["SALES_ASSISTANT"] = "sales_assistant";
    AgentType["MARKETING_STRATEGIST"] = "marketing_strategist";
    AgentType["CUSTOMER_SUPPORT"] = "customer_support";
    AgentType["DATA_ANALYST"] = "data_analyst";
    AgentType["CODE_ASSISTANT"] = "code_assistant";
})(AgentType || (exports.AgentType = AgentType = {}));
var SupportLevel;
(function (SupportLevel) {
    SupportLevel["COMMUNITY"] = "COMMUNITY";
    SupportLevel["EMAIL"] = "EMAIL";
    SupportLevel["PRIORITY"] = "PRIORITY";
    SupportLevel["PHONE"] = "PHONE";
    SupportLevel["DEDICATED"] = "DEDICATED";
})(SupportLevel || (exports.SupportLevel = SupportLevel = {}));
var LLMProvider;
(function (LLMProvider) {
    LLMProvider["OPENAI"] = "openai";
    LLMProvider["OPENROUTER"] = "openrouter";
    LLMProvider["NVIDIA"] = "nvidia";
    LLMProvider["ANTHROPIC"] = "anthropic";
    LLMProvider["GOOGLE"] = "google";
    LLMProvider["COHERE"] = "cohere";
    LLMProvider["MISTRAL"] = "mistral";
    LLMProvider["GROQ"] = "groq";
    LLMProvider["AWS_BEDROCK"] = "aws_bedrock";
})(LLMProvider || (exports.LLMProvider = LLMProvider = {}));
var WebhookEvent;
(function (WebhookEvent) {
    WebhookEvent["USER_CREATED"] = "user.created";
    WebhookEvent["USER_UPDATED"] = "user.updated";
    WebhookEvent["SUBSCRIPTION_CREATED"] = "subscription.created";
    WebhookEvent["SUBSCRIPTION_CANCELLED"] = "subscription.cancelled";
    WebhookEvent["SUBSCRIPTION_RENEWED"] = "subscription.renewed";
    WebhookEvent["AI_USAGE_THRESHOLD"] = "ai.usage.threshold";
    WebhookEvent["PAYMENT_SUCCEEDED"] = "payment.succeeded";
    WebhookEvent["PAYMENT_FAILED"] = "payment.failed";
})(WebhookEvent || (exports.WebhookEvent = WebhookEvent = {}));
//# sourceMappingURL=index.js.map