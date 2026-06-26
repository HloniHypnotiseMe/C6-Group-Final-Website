# C6GROUP Backend API

AI-powered business growth platform backend for South African SMEs.

## 🚀 Features

- **AI Agents**: 10 specialized AI agents for business growth
- **Rate Limiting**: AI calls capped per package tier
- **Authentication**: JWT-based auth with refresh tokens
- **Subscriptions**: Multi-tier subscription system
- **Analytics**: Comprehensive usage tracking
- **Payments**: PayFast and Stripe integration

## 📁 Project Structure

```
src/
├── agents/          # AI agent implementations
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Database models
├── prompts/         # AI agent prompts
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## 🤖 AI Agents

| Agent | Description | Lead | Diamond | Gold | Platinum |
|-------|-------------|------|---------|------|----------|
| Business Audit | Comprehensive business health analysis | 1/mo | 5/mo | 10/mo | Unlimited |
| SEO Analyzer | Website SEO analysis | - | 20/mo | 100/mo | Unlimited |
| Content Generator | Marketing content creation | - | 50/mo | 200/mo | Unlimited |
| Chatbot | 24/7 customer support AI | - | 500/mo | 2000/mo | Unlimited |
| Email Assistant | Email marketing copy | - | 100/mo | 500/mo | Unlimited |
| Sales Assistant | Sales enablement & proposals | - | 50/mo | 200/mo | Unlimited |
| Marketing Strategist | Marketing strategy & planning | - | 10/mo | 50/mo | Unlimited |
| Customer Support | Support ticket handling | - | - | 100/mo | Unlimited |
| Data Analyst | Business intelligence | - | - | 50/mo | Unlimited |
| Code Assistant | Technical development help | - | - | 20/mo | Unlimited |

## 🛠️ Tech Stack

- **Runtime**: Node.js 20 + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis (optional)
- **AI**: OpenAI, Anthropic, Google, Groq
- **Auth**: JWT
- **Validation**: Zod

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

## 🔑 Environment Variables

See `.env.example` for all required environment variables.

## 🚀 Deployment

### AWS Deployment

1. **Setup Terraform**:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

2. **Configure GitHub Secrets**:
- `AWS_ROLE_ARN`: IAM role for GitHub Actions
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key

3. **Push to main branch**:
GitHub Actions will automatically deploy to AWS ECS.

### Manual Deployment

```bash
# Build Docker image
docker build -t c6group-backend .

# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.af-south-1.amazonaws.com
docker tag c6group-backend:latest <account>.dkr.ecr.af-south-1.amazonaws.com/c6group-backend:latest
docker push <account>.dkr.ecr.af-south-1.amazonaws.com/c6group-backend:latest
```

## 📚 API Documentation

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

### AI Agents

```http
POST /api/v1/ai/execute          # Execute any agent
POST /api/v1/ai/audit            # Business audit
POST /api/v1/ai/seo              # SEO analysis
POST /api/v1/ai/content          # Content generation
POST /api/v1/ai/email            # Email generation
POST /api/v1/ai/chat             # Chatbot
GET  /api/v1/ai/agents           # List available agents
GET  /api/v1/ai/usage            # Usage statistics
```

### Subscriptions

```http
GET  /api/v1/subscriptions/packages
GET  /api/v1/subscriptions/me
POST /api/v1/subscriptions/subscribe
POST /api/v1/subscriptions/cancel
```

## 📊 LLM Provider Recommendations

| Use Case | Recommended Model | Cost/1K tokens |
|----------|-------------------|----------------|
| Business Audit | GPT-4o | $0.0025/$0.01 |
| SEO Analysis | GPT-4o-mini | $0.00015/$0.0006 |
| Content Generation | Claude 3.5 Sonnet | $0.003/$0.015 |
| Chatbot | GPT-4o-mini | $0.00015/$0.0006 |
| Email Assistant | Claude 3 Haiku | $0.00025/$0.00125 |
| Data Analysis | GPT-4o | $0.0025/$0.01 |
| Code Assistant | Claude 3.5 Sonnet | $0.003/$0.015 |

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint
```

## 📄 License

MIT License - see LICENSE file for details.
