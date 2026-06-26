import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// C6GROUP Database Seed Script
// Populates AI Tools, initial config, and sample data
// ============================================

async function seedAITools() {
  console.log('Seeding AI Tools catalog...');

  const tools = [
    // Content Creation
    { name: 'AI Blog Writer Pro', description: 'Generate SEO-optimized blog posts, articles, and long-form content tailored for South African audiences. Includes keyword research and meta descriptions.', category: 'content', icon: '✍️', tags: ['content', 'blog', 'seo', 'writing'], popular: true, featured: true, new: false },
    { name: 'Social Media Content Studio', description: 'Create engaging posts for Facebook, Instagram, LinkedIn, Twitter/X, and TikTok. Includes hashtag suggestions and optimal posting times.', category: 'content', icon: '📱', tags: ['social', 'media', 'content', 'marketing'], popular: true, featured: true, new: false },
    { name: 'Email Campaign Generator', description: 'Write high-converting email sequences, newsletters, and promotional emails. A/B testing suggestions included.', category: 'content', icon: '📧', tags: ['email', 'marketing', 'campaign', 'automation'], popular: true, featured: false, new: false },
    { name: 'Product Description Writer', description: 'Generate compelling product descriptions for e-commerce stores. Optimized for conversions and SEO.', category: 'content', icon: '🛍️', tags: ['ecommerce', 'product', 'description', 'sales'], popular: false, featured: false, new: false },
    { name: 'Ad Copy Generator', description: 'Create persuasive ad copy for Google Ads, Facebook Ads, and Instagram Ads. Includes headline variations.', category: 'content', icon: '🎯', tags: ['ads', 'copywriting', 'ppc', 'marketing'], popular: true, featured: true, new: false },
    { name: 'Video Script Writer', description: 'Write scripts for TikTok, Instagram Reels, YouTube, and promotional videos. Includes hooks and CTAs.', category: 'content', icon: '🎬', tags: ['video', 'script', 'content', 'social'], popular: false, featured: false, new: true },
    { name: 'Press Release Creator', description: 'Generate professional press releases for product launches, company news, and events.', category: 'content', icon: '📰', tags: ['pr', 'press', 'media', 'news'], popular: false, featured: false, new: false },
    { name: 'Website Copy Optimizer', description: 'Write and optimize homepage, about page, service pages, and landing page copy.', category: 'content', icon: '🌐', tags: ['website', 'copy', 'landing-page', 'conversion'], popular: false, featured: false, new: false },
    // Marketing
    { name: 'SEO Keyword Researcher', description: 'Discover high-value keywords for the South African market. Includes search volume, difficulty, and competitor analysis.', category: 'marketing', icon: '🔍', tags: ['seo', 'keywords', 'research', 'ranking'], popular: true, featured: true, new: false },
    { name: 'Local SEO Optimizer', description: 'Optimize your business for local search in South African cities. Google Business Profile optimization included.', category: 'marketing', icon: '📍', tags: ['local-seo', 'google', 'maps', 'visibility'], popular: true, featured: false, new: false },
    { name: 'Marketing Strategy Builder', description: 'Create comprehensive marketing strategies with channel recommendations, budget allocation, and ROI projections.', category: 'marketing', icon: '📊', tags: ['strategy', 'planning', 'budget', 'roi'], popular: true, featured: true, new: false },
    { name: 'Competitor Analyzer', description: 'Analyze competitor websites, strategies, and online presence. Identify gaps and opportunities.', category: 'marketing', icon: '🔎', tags: ['competitor', 'analysis', 'intelligence'], popular: false, featured: false, new: false },
    { name: 'Brand Voice Generator', description: 'Define your brand voice, tone, and messaging guidelines. Consistent across all channels.', category: 'marketing', icon: '🎨', tags: ['brand', 'voice', 'identity', 'guidelines'], popular: false, featured: false, new: true },
    { name: 'Customer Journey Mapper', description: 'Map your customer journey from awareness to advocacy. Identify touchpoints and optimization opportunities.', category: 'marketing', icon: '🗺️', tags: ['customer', 'journey', 'cx', 'mapping'], popular: false, featured: false, new: false },
    { name: 'Campaign Performance Predictor', description: 'Predict campaign performance before launch. Budget optimization and channel mix recommendations.', category: 'marketing', icon: '⚡', tags: ['campaign', 'prediction', 'optimization'], popular: false, featured: false, new: true },
    { name: 'Influencer Outreach Writer', description: 'Draft professional outreach messages to South African influencers and brand ambassadors.', category: 'marketing', icon: '🤝', tags: ['influencer', 'outreach', 'partnerships'], popular: false, featured: false, new: false },
    // Sales
    { name: 'Sales Proposal Generator', description: 'Create professional sales proposals, quotes, and pitch decks. Custom branded templates.', category: 'sales', icon: '📄', tags: ['sales', 'proposal', 'pitch', 'b2b'], popular: true, featured: true, new: false },
    { name: 'Lead Scoring AI', description: 'Score and prioritize leads based on behavior, demographics, and engagement. Focus on high-value prospects.', category: 'sales', icon: '⭐', tags: ['leads', 'scoring', 'qualification', 'crm'], popular: false, featured: false, new: true },
    { name: 'Cold Outreach Writer', description: 'Write personalized cold emails and LinkedIn messages that get responses. Follow-up sequences included.', category: 'sales', icon: '📨', tags: ['outreach', 'cold-email', 'linkedin', 'b2b'], popular: true, featured: false, new: false },
    { name: 'Sales Script Builder', description: 'Create phone and video sales scripts with objection handling. Tailored for your product/service.', category: 'sales', icon: '🎙️', tags: ['sales', 'script', 'calling', 'closing'], popular: false, featured: false, new: false },
    { name: 'CRM Data Enricher', description: 'Enrich customer profiles with additional data points. Better segmentation and personalization.', category: 'sales', icon: '💎', tags: ['crm', 'data', 'enrichment', 'profiles'], popular: false, featured: false, new: true },
    { name: 'Deal Risk Predictor', description: 'Identify at-risk deals and get recommendations to save them. Pipeline health monitoring.', category: 'sales', icon: '⚠️', tags: ['deals', 'risk', 'pipeline', 'forecasting'], popular: false, featured: false, new: false },
    { name: 'Pricing Strategy Advisor', description: 'Analyze and optimize your pricing strategy. Competitive pricing and value-based recommendations.', category: 'sales', icon: '💰', tags: ['pricing', 'strategy', 'revenue', 'optimization'], popular: true, featured: false, new: false },
    { name: 'Quote & Invoice Generator', description: 'Generate professional quotes and invoices. Automatic tax calculations for South African VAT.', category: 'sales', icon: '🧾', tags: ['quotes', 'invoices', 'vat', 'accounting'], popular: false, featured: false, new: false },
    // Design
    { name: 'Logo Design Brief Creator', description: 'Generate detailed design briefs for logo creation. Brand personality and visual direction.', category: 'design', icon: '🎨', tags: ['logo', 'design', 'branding', 'brief'], popular: false, featured: false, new: false },
    { name: 'Color Palette Generator', description: 'Generate on-brand color palettes with hex codes. Accessibility and psychology considerations.', category: 'design', icon: '🌈', tags: ['colors', 'palette', 'design', 'branding'], popular: false, featured: false, new: false },
    { name: 'Image Alt Text Writer', description: 'Generate SEO-optimized alt text for images. Improve accessibility and search rankings.', category: 'design', icon: '🖼️', tags: ['alt-text', 'seo', 'accessibility', 'images'], popular: false, featured: false, new: true },
    { name: 'Design Feedback Assistant', description: 'Get AI-powered feedback on your designs. Usability and visual hierarchy suggestions.', category: 'design', icon: '👁️', tags: ['design', 'feedback', 'ux', 'review'], popular: false, featured: false, new: false },
    { name: 'Brand Style Guide Generator', description: 'Create comprehensive brand style guides. Colors, typography, imagery, and voice guidelines.', category: 'design', icon: '📋', tags: ['brand', 'style-guide', 'guidelines'], popular: false, featured: false, new: true },
    // Development
    { name: 'Code Generator', description: 'Generate code snippets for websites, automations, and integrations. Multiple languages supported.', category: 'development', icon: '💻', tags: ['code', 'development', 'programming'], popular: true, featured: true, new: false },
    { name: 'API Integration Helper', description: 'Get step-by-step guidance for integrating APIs. PayFast, PayGate, Shopify, WooCommerce, and more.', category: 'development', icon: '🔌', tags: ['api', 'integration', 'payment', 'ecommerce'], popular: true, featured: false, new: false },
    { name: 'Bug Fix Suggester', description: 'Describe your coding issue and get potential solutions with code examples.', category: 'development', icon: '🐛', tags: ['debugging', 'code', 'fix', 'development'], popular: false, featured: false, new: false },
    { name: 'Database Query Builder', description: 'Generate SQL and NoSQL queries. Optimization suggestions included.', category: 'development', icon: '🗄️', tags: ['database', 'sql', 'queries', 'backend'], popular: false, featured: false, new: false },
    { name: 'Website Performance Analyzer', description: 'Analyze website speed and get optimization recommendations. Core Web Vitals focus.', category: 'development', icon: '⚡', tags: ['performance', 'speed', 'optimization', 'web-vitals'], popular: false, featured: false, new: true },
    { name: 'Security Audit Helper', description: 'Identify common security vulnerabilities. SSL, HTTPS, and data protection recommendations.', category: 'development', icon: '🔒', tags: ['security', 'audit', 'ssl', 'protection'], popular: false, featured: false, new: false },
    // Productivity
    { name: 'Meeting Summarizer', description: 'Transform meeting transcripts into actionable summaries with key decisions and next steps.', category: 'productivity', icon: '📝', tags: ['meetings', 'summary', 'productivity'], popular: true, featured: true, new: false },
    { name: 'Task Prioritizer', description: 'Prioritize tasks based on urgency, impact, and effort. Eisenhower matrix approach.', category: 'productivity', icon: '📋', tags: ['tasks', 'priority', 'productivity', 'time-management'], popular: false, featured: false, new: false },
    { name: 'Business Plan Writer', description: 'Generate comprehensive business plans with financial projections. Investor-ready format.', category: 'productivity', icon: '📑', tags: ['business-plan', 'strategy', 'funding'], popular: true, featured: true, new: false },
    { name: 'Policy Document Creator', description: 'Create HR policies, privacy policies, terms of service, and POPIA compliance documents.', category: 'productivity', icon: '📜', tags: ['policy', 'hr', 'legal', 'compliance'], popular: false, featured: false, new: false },
    { name: 'Report Generator', description: 'Generate business reports, financial summaries, and performance reviews. Professional formatting.', category: 'productivity', icon: '📈', tags: ['reports', 'analytics', 'business'], popular: false, featured: false, new: false },
    { name: 'Presentation Creator', description: 'Create slide outlines and content for investor pitches, team meetings, and client presentations.', category: 'productivity', icon: '📊', tags: ['presentation', 'slides', 'pitch'], popular: false, featured: false, new: true },
    { name: 'SWOT Analysis Generator', description: 'Generate comprehensive SWOT analyses for your business, products, or competitors.', category: 'productivity', icon: '⚖️', tags: ['swot', 'analysis', 'strategy', 'planning'], popular: false, featured: false, new: false },
    { name: 'Automation Workflow Designer', description: 'Design automation workflows for repetitive tasks. Zapier, Make.com, and custom integrations.', category: 'productivity', icon: '⚙️', tags: ['automation', 'workflow', 'efficiency'], popular: false, featured: false, new: true },
    // Analytics
    { name: 'Revenue Forecaster', description: 'Predict future revenue based on historical data. Seasonal trends and growth projections.', category: 'analytics', icon: '💹', tags: ['revenue', 'forecast', 'prediction', 'finance'], popular: true, featured: true, new: false },
    { name: 'Customer Churn Predictor', description: 'Identify customers at risk of leaving. Retention strategies and early warning signals.', category: 'analytics', icon: '🔄', tags: ['churn', 'retention', 'customers', 'risk'], popular: false, featured: false, new: true },
    { name: 'Market Trend Analyzer', description: 'Analyze market trends specific to South Africa. Industry insights and opportunity identification.', category: 'analytics', icon: '📊', tags: ['market', 'trends', 'industry', 'research'], popular: false, featured: false, new: false },
    { name: 'Social Media Analytics', description: 'Analyze social media performance. Engagement rates, best posting times, and content recommendations.', category: 'analytics', icon: '📱', tags: ['social', 'analytics', 'engagement', 'metrics'], popular: false, featured: false, new: false },
    { name: 'ROI Calculator', description: 'Calculate return on investment for marketing campaigns, tools, and business initiatives.', category: 'analytics', icon: '🧮', tags: ['roi', 'calculation', 'finance', 'investment'], popular: true, featured: false, new: false },
    { name: 'A/B Test Analyzer', description: 'Design and analyze A/B tests. Statistical significance and winner recommendations.', category: 'analytics', icon: '🧪', tags: ['ab-testing', 'experiments', 'optimization'], popular: false, featured: false, new: false },
    // Customer Support
    { name: 'FAQ Generator', description: 'Generate comprehensive FAQ sections based on your business information. Reduces support tickets.', category: 'support', icon: '❓', tags: ['faq', 'support', 'customer-service'], popular: false, featured: false, new: false },
    { name: 'Support Response Writer', description: 'Draft professional customer support responses. Tone-matched to your brand voice.', category: 'support', icon: '💬', tags: ['support', 'customer-service', 'responses'], popular: false, featured: false, new: false },
    { name: 'Review Reply Generator', description: 'Generate professional replies to customer reviews on Google, Facebook, and other platforms.', category: 'support', icon: '⭐', tags: ['reviews', 'reputation', 'responses'], popular: true, featured: true, new: false },
    { name: 'Complaint Resolution Helper', description: 'Get step-by-step guidance for handling customer complaints. De-escalation techniques.', category: 'support', icon: '🤝', tags: ['complaints', 'resolution', 'customer-retention'], popular: false, featured: false, new: false },
    { name: 'Customer Satisfaction Analyzer', description: 'Analyze customer feedback and satisfaction surveys. Actionable insights and trends.', category: 'support', icon: '😊', tags: ['csat', 'feedback', 'satisfaction', 'nps'], popular: false, featured: false, new: true },
    // HR & Operations
    { name: 'Job Description Writer', description: 'Create compelling job descriptions. Optimized for South African job boards.', category: 'hr', icon: '👥', tags: ['hiring', 'job-description', 'recruitment'], popular: false, featured: false, new: false },
    { name: 'Interview Question Generator', description: 'Generate role-specific interview questions. Technical and behavioral assessments.', category: 'hr', icon: '🎯', tags: ['interview', 'hiring', 'assessment'], popular: false, featured: false, new: false },
    { name: 'Employee Onboarding Planner', description: 'Create structured onboarding plans for new hires. Checklists and timeline included.', category: 'hr', icon: '🎓', tags: ['onboarding', 'hr', 'training'], popular: false, featured: false, new: true },
    { name: 'SOP Document Creator', description: 'Generate Standard Operating Procedures for your business processes.', category: 'hr', icon: '📋', tags: ['sop', 'process', 'operations', 'documentation'], popular: false, featured: false, new: false },
    { name: 'Training Material Generator', description: 'Create training materials, guides, and documentation for your team.', category: 'hr', icon: '📚', tags: ['training', 'materials', 'learning', 'development'], popular: false, featured: false, new: false },
    // Finance
    { name: 'Cash Flow Forecaster', description: 'Predict cash flow based on income and expense patterns. Identify potential shortfalls.', category: 'finance', icon: '💵', tags: ['cashflow', 'forecast', 'finance', 'planning'], popular: true, featured: false, new: false },
    { name: 'Budget Planner', description: 'Create detailed budgets with categories and allocation recommendations.', category: 'finance', icon: '📊', tags: ['budget', 'planning', 'finance'], popular: false, featured: false, new: false },
    { name: 'Invoice Reminder Writer', description: 'Generate professional payment reminder emails. Escalating tone for overdue invoices.', category: 'finance', icon: '⏰', tags: ['invoices', 'reminders', 'collections', 'cashflow'], popular: false, featured: false, new: false },
    { name: 'Financial Report Summarizer', description: 'Summarize complex financial reports into actionable business insights.', category: 'finance', icon: '📉', tags: ['finance', 'reports', 'summary', 'accounting'], popular: false, featured: false, new: true },
    // Legal & Compliance
    { name: 'POPIA Compliance Checker', description: 'Check your business practices against POPIA requirements. Gap analysis and recommendations.', category: 'legal', icon: '⚖️', tags: ['popia', 'compliance', 'privacy', 'legal'], popular: true, featured: true, new: false },
    { name: 'Contract Clause Generator', description: 'Generate standard contract clauses for South African business agreements.', category: 'legal', icon: '📃', tags: ['contracts', 'legal', 'agreements'], popular: false, featured: false, new: false },
    { name: 'Terms of Service Generator', description: 'Generate Terms of Service tailored for South African businesses and websites.', category: 'legal', icon: '🛡️', tags: ['terms', 'legal', 'website', 'protection'], popular: false, featured: false, new: false },
    { name: 'BEE Planning Advisor', description: 'Get guidance on B-BBEE compliance and planning. Strategy recommendations included.', category: 'legal', icon: '🇿🇦', tags: ['bee', 'compliance', 'transformation', 'planning'], popular: false, featured: false, new: true },
    // E-commerce
    { name: 'Abandoned Cart Recovery', description: 'Generate recovery email sequences for abandoned carts. Proven templates and timing.', category: 'ecommerce', icon: '🛒', tags: ['ecommerce', 'abandoned-cart', 'recovery', 'email'], popular: true, featured: true, new: false },
    { name: 'Product Launch Planner', description: 'Plan complete product launches with timelines, marketing, and sales strategies.', category: 'ecommerce', icon: '🚀', tags: ['product-launch', 'ecommerce', 'planning'], popular: false, featured: false, new: false },
    { name: 'Customer Segmentation AI', description: 'Segment customers based on behavior, value, and demographics. Personalized targeting.', category: 'ecommerce', icon: '👥', tags: ['segmentation', 'customers', 'targeting', 'personalization'], popular: false, featured: false, new: true },
    { name: 'Inventory Optimization', description: 'Optimize inventory levels based on demand forecasting. Reduce stockouts and overstock.', category: 'ecommerce', icon: '📦', tags: ['inventory', 'optimization', 'demand', 'forecasting'], popular: false, featured: false, new: false },
    { name: 'Shopify Store Optimizer', description: 'Get recommendations to optimize your Shopify store. Conversion rate improvements.', category: 'ecommerce', icon: '🛍️', tags: ['shopify', 'ecommerce', 'optimization', 'conversion'], popular: true, featured: false, new: false },
    { name: 'WooCommerce Assistant', description: 'Optimize your WooCommerce store. Plugin recommendations and performance tips.', category: 'ecommerce', icon: '🔄', tags: ['woocommerce', 'wordpress', 'ecommerce'], popular: false, featured: false, new: false },
  ];

  // Clear existing tools
  await prisma.aITool.deleteMany();

  // Insert all tools
  for (const tool of tools) {
    await prisma.aITool.create({ data: tool });
  }

  console.log(`✅ Seeded ${tools.length} AI Tools`);
}

async function seedSystemConfig() {
  console.log('Seeding system configuration...');

  const configs = [
    {
      key: 'whatsapp_number',
      value: { number: '27735558440', display: '073 555 8440' },
      description: 'Primary WhatsApp business number',
    },
    {
      key: 'office_number',
      value: { number: '27735558440', display: '073 555 8440' },
      description: 'Office phone number',
    },
    {
      key: 'company_info',
      value: {
        name: 'C6GROUP',
        tagline: 'AI-Powered Business Growth for South African SMEs',
        website: 'https://c6group.co.za',
        email: 'hello@c6group.co.za',
        address: 'South Africa',
      },
      description: 'Company information',
    },
    {
      key: 'social_links',
      value: {
        linkedin: 'https://linkedin.com/company/c6group',
        twitter: 'https://twitter.com/c6group',
        facebook: 'https://facebook.com/c6group',
        instagram: 'https://instagram.com/c6group',
        tiktok: 'https://tiktok.com/@c6group',
      },
      description: 'Social media profile links',
    },
  ];

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config,
    });
  }

  console.log(`✅ Seeded ${configs.length} system configs`);
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    await seedAITools();
    await seedSystemConfig();

    console.log('\n✅ Database seed completed successfully!');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
