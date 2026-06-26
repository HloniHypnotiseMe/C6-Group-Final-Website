# C6GROUP AI Business Ecosystem - Complete Architecture

## 🎯 Executive Summary

This document outlines the complete architecture for the C6GROUP AI Business Ecosystem, including:
- Frontend React application
- Backend Node.js API with AI agents
- AWS deployment infrastructure
- GitHub CI/CD pipelines
- LLM provider recommendations
- Agent prompts and expected outputs

---

## 📁 Repository Structure

```
c6group/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── services/        # API services
│   └── .github/workflows/   # Frontend CI/CD
│
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── agents/          # AI agent implementations
│   │   ├── prompts/         # Agent prompts
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── middleware/      # Express middleware
│   ├── prisma/              # Database schema
│   ├── terraform/           # AWS infrastructure
│   └── .github/workflows/   # Backend CI/CD
│
└── docs/                     # Documentation
```

---

## 🤖 AI Agent Architecture

### 10 Specialized AI Agents

| Agent | Purpose | Models Used |
|-------|---------|-------------|
| **Business Audit** | Comprehensive business health analysis | GPT-4o |
| **SEO Analyzer** | Website SEO performance analysis | GPT-4o-mini |
| **Content Generator** | Marketing content creation | Claude 3.5 Sonnet |
| **Chatbot** | 24/7 customer support | GPT-4o-mini |
| **Email Assistant** | Email marketing copy | Claude 3 Haiku |
| **Sales Assistant** | Sales enablement & proposals | GPT-4o-mini |
| **Marketing Strategist** | Marketing strategy & planning | GPT-4o |
| **Customer Support** | Support ticket handling | Claude 3 Haiku |
| **Data Analyst** | Business intelligence | GPT-4o |
| **Code Assistant** | Technical development help | Claude 3.5 Sonnet |

### Rate Limiting Per Package

```typescript
const AI_LIMITS = {
  lead: {
    business_audit: 1,        // 1 free audit
    seo_analyzer: 0,
    content_generator: 0,
    chatbot: 0,
    // ... rest unavailable
  },
  diamond: {
    business_audit: 5,
    seo_analyzer: 20,
    content_generator: 50,
    chatbot: 500,
    email_assistant: 100,
    sales_assistant: 50,
    marketing_strategist: 10,
    // ... rest unavailable
  },
  gold: {
    business_audit: 10,
    seo_analyzer: 100,
    content_generator: 200,
    chatbot: 2000,
    email_assistant: 500,
    sales_assistant: 200,
    marketing_strategist: 50,
    customer_support: 100,
    data_analyst: 50,
    code_assistant: 20,
  },
  platinum: {
    // All agents: UNLIMITED
  },
  enterprise: {
    // All agents: UNLIMITED + Custom training
  }
};
```

---

## 💰 LLM Provider Cost Analysis

### Recommended Models by Cost/Performance

| Model | Input Cost | Output Cost | Best For |
|-------|------------|-------------|----------|
| **GPT-4o-mini** | $0.00015/1K | $0.0006/1K | Chatbot, SEO, Sales |
| **Claude 3 Haiku** | $0.00025/1K | $0.00125/1K | Email, Support |
| **GPT-4o** | $0.0025/1K | $0.01/1K | Audit, Strategy, Analysis |
| **Claude 3.5 Sonnet** | $0.003/1K | $0.015/1K | Content, Code |
| **Gemini 1.5 Flash** | $0.000075/1K | $0.0003/1K | Cost-sensitive tasks |
| **Llama 3.1 70B (Groq)** | $0.00059/1K | $0.00079/1K | High-volume tasks |

### Cost Estimation per Package

| Package | Monthly AI Budget | Est. Cost/User/Month |
|---------|-------------------|---------------------|
| Lead | R0 | $0.05 |
| Diamond | R300 | $2-5 |
| Gold | R700 | $8-15 |
| Platinum | R1500 | $30-50 |
| Enterprise | Custom | Custom |

---

## 🔐 Agent Prompts Summary

### 1. Business Audit Agent

**System Prompt Excerpt:**
```
ROLE: You are a senior business consultant specializing in SME growth analysis.

OUTPUT FORMAT - STRICT JSON:
{
  "overallScore": number (0-100),
  "categoryScores": { ... },
  "revenueAnalysis": { current, potential, gap },
  "recommendations": { immediate, shortTerm, longTerm },
  "recommendedPackage": "lead|diamond|gold|platinum|enterprise"
}
```

**Expected Output:** Complete business health report with scores, revenue gap analysis, SWOT, and actionable recommendations.

### 2. SEO Analyzer Agent

**System Prompt Excerpt:**
```
ANALYSIS AREAS:
1. On-page SEO factors
2. Technical SEO issues
3. Content quality
4. Mobile optimization
5. Page speed performance
6. Local SEO presence

OUTPUT: JSON with scores, critical issues, keyword opportunities, priority actions
```

### 3. Content Generator Agent

**System Prompt Excerpt:**
```
CONTENT TYPES: blog, social_media, email, product_description, ad_copy

OUTPUT FORMAT:
{
  "content": "generated content",
  "title": "...",
  "metaDescription": "...",
  "hashtags": [...],
  "variations": [...],
  "seoScore": number
}
```

### 4. Chatbot Agent

**System Prompt Excerpt:**
```
ROLE: You are a friendly customer service representative.

CRITICAL: Never reveal you are an AI. Represent the business professionally.
Handle inquiries, qualify leads, and move conversations toward conversion.
```

---

## ☁️ AWS Infrastructure

### Services Used

| Service | Purpose |
|---------|---------|
| **ECS Fargate** | Container orchestration |
| **RDS PostgreSQL** | Primary database |
| **ElastiCache Redis** | Caching & sessions |
| **Application Load Balancer** | Traffic distribution |
| **Route 53** | DNS management |
| **ACM** | SSL certificates |
| **Secrets Manager** | Secure credential storage |
| **CloudWatch** | Logging & monitoring |
| **ECR** | Docker image registry |

### Architecture Diagram

```
                    ┌─────────────────┐
                    │   CloudFront    │
                    │   (CDN/SSL)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Route 53      │
                    │   (DNS)         │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼─────┐ ┌──────▼──────┐ ┌────▼─────┐
     │  Frontend    │ │   ALB       │ │  API     │
     │  (S3/CF)     │ │  (HTTPS)    │ │  (ECS)   │
     └──────────────┘ └──────┬──────┘ └────┬─────┘
                             │             │
                    ┌────────▼─────────────┼────────┐
                    │                      │        │
           ┌────────▼────────┐    ┌───────▼────────▼──────┐
           │   RDS           │    │   ElastiCache         │
           │   PostgreSQL    │    │   Redis               │
           └─────────────────┘    └───────────────────────┘
```

---

## 🚀 Deployment Process

### GitHub Actions Workflow

1. **Test & Lint**
   - Run unit tests
   - Run ESLint
   - Type check with TypeScript

2. **Build & Push**
   - Build Docker image
   - Push to Amazon ECR
   - Tag with commit SHA

3. **Deploy to ECS**
   - Update task definition
   - Deploy new service version
   - Run database migrations
   - Verify health checks

4. **Rollback on Failure**
   - Automatic rollback if deployment fails
   - Health check verification

### Environment Promotion

```
Development → Staging → Production
     │            │          │
     └────────────┴──────────┘
           GitHub Actions
```

---

## 📊 Database Schema

### Core Tables

```prisma
model User {
  id, email, passwordHash
  firstName, lastName, phone
  companyName, industry
  role, status
  subscriptions Subscription[]
  aiUsages AIUsage[]
}

model Subscription {
  id, userId, packageId
  status, billingCycle
  aiUsageLimit, aiUsageUsed
  payments Payment[]
}

model AIUsage {
  id, userId, agentType
  prompt, response
  tokensUsed, cost, duration
}

model AuditResult {
  id, userId
  overallScore, seoScore
  recommendations Json
  actionPlan Json
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

### AI Agents
```
POST /api/v1/ai/execute      # Generic agent execution
POST /api/v1/ai/audit        # Business audit
POST /api/v1/ai/seo          # SEO analysis
POST /api/v1/ai/content      # Content generation
POST /api/v1/ai/email        # Email generation
POST /api/v1/ai/chat         # Chatbot
GET  /api/v1/ai/agents       # List available agents
GET  /api/v1/ai/usage        # Usage statistics
```

### Subscriptions
```
GET  /api/v1/subscriptions/packages
GET  /api/v1/subscriptions/me
POST /api/v1/subscriptions/subscribe
POST /api/v1/subscriptions/cancel
```

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker (optional)
- AWS CLI
- Terraform 1.5+

### Local Development

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### AWS Deployment

```bash
# 1. Setup infrastructure
cd terraform
terraform init
terraform apply

# 2. Configure GitHub secrets
# - AWS_ROLE_ARN
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY

# 3. Push to main branch
# GitHub Actions handles the rest
```

---

## 📈 Monitoring & Observability

### Metrics Tracked
- API response times
- AI agent usage by type
- Token consumption
- Error rates
- User engagement

### Alerts
- High error rate
- AI usage threshold exceeded
- Database connection issues
- High latency

---

## 📝 Next Steps

1. **Setup GitHub Repository**
   - Create `c6group` organization
   - Create `frontend` and `backend` repos

2. **Configure AWS Account**
   - Setup IAM roles
   - Configure VPC
   - Setup ECR repositories

3. **Deploy Infrastructure**
   - Run Terraform
   - Configure DNS
   - Setup SSL certificates

4. **Configure CI/CD**
   - Add GitHub secrets
   - Test deployment pipeline

5. **Monitor & Optimize**
   - Setup CloudWatch dashboards
   - Configure alerts
   - Monitor costs

---

## 📞 Support

For questions or issues:
- Email: support@c6group.co.za
- Documentation: https://docs.c6group.co.za
- Status: https://status.c6group.co.za
