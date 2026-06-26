// C6GROUP AI Tools Marketplace - 100+ AI Tools

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tags?: string[];
  popular?: boolean;
  new?: boolean;
  featured?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const toolCategories: ToolCategory[] = [
  {
    id: 'content',
    name: 'Content Creation',
    icon: '✍️',
    description: 'Generate blogs, social posts, ads, and more'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📢',
    description: 'SEO, campaigns, email marketing tools'
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: '💼',
    description: 'Lead generation, proposals, CRM tools'
  },
  {
    id: 'design',
    name: 'Design',
    icon: '🎨',
    description: 'Graphics, logos, presentations, mockups'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    description: 'Data analysis, reports, insights'
  },
  {
    id: 'automation',
    name: 'Automation',
    icon: '⚙️',
    description: 'Workflows, integrations, bots'
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: '💬',
    description: 'Chatbots, email, messaging tools'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '⚡',
    description: 'Task management, scheduling, notes'
  }
];

export const aiTools: AITool[] = [
  // Content Creation Tools
  { id: 'blog-writer', name: 'Blog Writer Pro', description: 'Generate SEO-optimized blog posts in minutes', category: 'content', icon: '📝', popular: true },
  { id: 'social-creator', name: 'Social Media Creator', description: 'Create engaging posts for all platforms', category: 'content', icon: '📱', popular: true },
  { id: 'ad-copy', name: 'Ad Copy Generator', description: 'High-converting ad copy for Google & Facebook', category: 'content', icon: '🎯' },
  { id: 'email-writer', name: 'Email Composer', description: 'Professional emails that get responses', category: 'content', icon: '📧', popular: true },
  { id: 'product-desc', name: 'Product Description', description: 'Compelling product descriptions that sell', category: 'content', icon: '🛍️' },
  { id: 'video-script', name: 'Video Script Writer', description: 'Engaging scripts for YouTube & TikTok', category: 'content', icon: '🎬' },
  { id: 'press-release', name: 'Press Release Pro', description: 'Professional press releases for media', category: 'content', icon: '📰' },
  { id: 'case-study', name: 'Case Study Creator', description: 'Convert success stories into case studies', category: 'content', icon: '📋' },
  { id: 'whitepaper', name: 'Whitepaper Generator', description: 'In-depth industry whitepapers', category: 'content', icon: '📄' },
  { id: 'newsletter', name: 'Newsletter Builder', description: 'Engaging newsletters your audience loves', category: 'content', icon: '📨', new: true },
  { id: 'caption-gen', name: 'Caption Generator', description: 'Catchy captions for social media', category: 'content', icon: '💬' },
  { id: 'hashtag-pro', name: 'Hashtag Pro', description: 'Trending hashtags to boost reach', category: 'content', icon: '#' },
  { id: 'content-calendar', name: 'Content Calendar AI', description: 'Plan your content strategy', category: 'content', icon: '📅' },
  { id: 'story-writer', name: 'Story Writer', description: 'Brand stories that connect', category: 'content', icon: '📖' },

  // Marketing Tools
  { id: 'seo-audit', name: 'SEO Auditor', description: 'Complete website SEO analysis', category: 'marketing', icon: '🔍', popular: true },
  { id: 'keyword-research', name: 'Keyword Researcher', description: 'Find high-value keywords', category: 'marketing', icon: '🔎' },
  { id: 'competitor-analyzer', name: 'Competitor Analyzer', description: 'Spy on your competitors', category: 'marketing', icon: '🕵️' },
  { id: 'backlink-builder', name: 'Backlink Builder', description: 'Build quality backlinks', category: 'marketing', icon: '🔗' },
  { id: 'meta-generator', name: 'Meta Tag Generator', description: 'SEO-optimized meta titles & descriptions', category: 'marketing', icon: '🏷️' },
  { id: 'content-optimizer', name: 'Content Optimizer', description: 'Improve content for search rankings', category: 'marketing', icon: '⚡' },
  { id: 'local-seo', name: 'Local SEO Pro', description: 'Dominate local search results', category: 'marketing', icon: '📍' },
  { id: 'marketing-plan', name: 'Marketing Plan Builder', description: 'Complete marketing strategies', category: 'marketing', icon: '📊', featured: true },
  { id: 'campaign-optimizer', name: 'Campaign Optimizer', description: 'Maximize ad campaign ROI', category: 'marketing', icon: '📈' },
  { id: 'funnel-builder', name: 'Sales Funnel Builder', description: 'Create high-converting funnels', category: 'marketing', icon: '🔄' },
  { id: 'lead-magnet', name: 'Lead Magnet Creator', description: 'Build irresistible lead magnets', category: 'marketing', icon: '🧲' },
  { id: 'landing-page', name: 'Landing Page Copy', description: 'Copy that converts visitors', category: 'marketing', icon: '🛬' },
  { id: 'ab-test', name: 'A/B Test Generator', description: 'Test variations for better results', category: 'marketing', icon: '🧪' },
  { id: 'retargeting', name: 'Retargeting Assistant', description: 'Win back lost customers', category: 'marketing', icon: '🎯' },

  // Sales Tools
  { id: 'lead-scorer', name: 'Lead Scorer', description: 'Identify your hottest leads', category: 'sales', icon: '🔥', popular: true },
  { id: 'proposal-writer', name: 'Proposal Writer', description: 'Winning proposals in minutes', category: 'sales', icon: '📄', popular: true },
  { id: 'cold-email', name: 'Cold Email Pro', description: 'Emails that get responses', category: 'sales', icon: '📧' },
  { id: 'follow-up', name: 'Follow-up Sequences', description: 'Automated follow-up campaigns', category: 'sales', icon: '🔄' },
  { id: 'objection-handler', name: 'Objection Handler', description: 'Handle any sales objection', category: 'sales', icon: '🛡️' },
  { id: 'pricing-strategy', name: 'Pricing Strategist', description: 'Optimize your pricing', category: 'sales', icon: '💰' },
  { id: 'upsell-suggest', name: 'Upsell Suggester', description: 'Smart upsell recommendations', category: 'sales', icon: '⬆️' },
  { id: 'crm-assistant', name: 'CRM Assistant', description: 'Manage customer relationships', category: 'sales', icon: '👥' },
  { id: 'sales-script', name: 'Sales Script Writer', description: 'Scripts that close deals', category: 'sales', icon: '🎤' },
  { id: 'deal-analyzer', name: 'Deal Analyzer', description: 'Analyze and improve win rates', category: 'sales', icon: '📊' },
  { id: 'quote-generator', name: 'Quote Generator', description: 'Professional quotes instantly', category: 'sales', icon: '📋' },
  { id: 'contract-review', name: 'Contract Reviewer', description: 'Review contracts for issues', category: 'sales', icon: '📜' },

  // Design Tools
  { id: 'logo-maker', name: 'Logo Maker', description: 'Professional logos in seconds', category: 'design', icon: '🎨', popular: true },
  { id: 'social-graphics', name: 'Social Graphics', description: 'Stunning social media graphics', category: 'design', icon: '🖼️' },
  { id: 'presentation', name: 'Presentation Builder', description: 'Beautiful presentations', category: 'design', icon: '📽️' },
  { id: 'infographic', name: 'Infographic Creator', description: 'Data visualizations that impress', category: 'design', icon: '📊' },
  { id: 'mockup-gen', name: 'Mockup Generator', description: 'Product mockups for marketing', category: 'design', icon: '📦' },
  { id: 'banner-creator', name: 'Banner Creator', description: 'Web banners that convert', category: 'design', icon: '🚩' },
  { id: 'thumbnail-maker', name: 'Thumbnail Maker', description: 'Click-worthy video thumbnails', category: 'design', icon: '🖼️' },
  { id: 'brand-kit', name: 'Brand Kit Builder', description: 'Complete brand identity', category: 'design', icon: '🎨', featured: true },
  { id: 'color-palette', name: 'Color Palette AI', description: 'Perfect color combinations', category: 'design', icon: '🌈' },
  { id: 'font-pairing', name: 'Font Pairing Pro', description: 'Beautiful font combinations', category: 'design', icon: '🔤' },
  { id: 'image-enhancer', name: 'Image Enhancer', description: 'Improve image quality', category: 'design', icon: '✨' },
  { id: 'background-remover', name: 'Background Remover', description: 'Remove backgrounds instantly', category: 'design', icon: '🖼️' },

  // Analytics Tools
  { id: 'business-audit', name: 'Business Auditor', description: 'Complete business health check', category: 'analytics', icon: '🏥', popular: true, featured: true },
  { id: 'revenue-forecast', name: 'Revenue Forecaster', description: 'Predict future revenue', category: 'analytics', icon: '📈' },
  { id: 'customer-insights', name: 'Customer Insights', description: 'Understand your customers', category: 'analytics', icon: '👥' },
  { id: 'churn-predictor', name: 'Churn Predictor', description: 'Identify at-risk customers', category: 'analytics', icon: '⚠️' },
  { id: 'ltv-calculator', name: 'LTV Calculator', description: 'Calculate customer lifetime value', category: 'analytics', icon: '💎' },
  { id: 'cohort-analyzer', name: 'Cohort Analyzer', description: 'Track customer behavior over time', category: 'analytics', icon: '📊' },
  { id: 'funnel-analyzer', name: 'Funnel Analyzer', description: 'Optimize conversion funnels', category: 'analytics', icon: '🔄' },
  { id: 'sentiment-analyzer', name: 'Sentiment Analyzer', description: 'Analyze customer sentiment', category: 'analytics', icon: '😊' },
  { id: 'trend-detector', name: 'Trend Detector', description: 'Spot emerging trends', category: 'analytics', icon: '📈' },
  { id: 'competitor-tracker', name: 'Competitor Tracker', description: 'Monitor competitor activity', category: 'analytics', icon: '👁️' },
  { id: 'roi-calculator', name: 'ROI Calculator', description: 'Calculate marketing ROI', category: 'analytics', icon: '💰' },
  { id: 'dashboard-builder', name: 'Dashboard Builder', description: 'Custom analytics dashboards', category: 'analytics', icon: '📊' },

  // Automation Tools
  { id: 'workflow-builder', name: 'Workflow Builder', description: 'Automate repetitive tasks', category: 'automation', icon: '⚙️', popular: true },
  { id: 'email-automation', name: 'Email Automation', description: 'Automated email sequences', category: 'automation', icon: '📧' },
  { id: 'social-scheduler', name: 'Social Scheduler', description: 'Schedule posts automatically', category: 'automation', icon: '📅' },
  { id: 'lead-nurturing', name: 'Lead Nurturing', description: 'Automated lead follow-up', category: 'automation', icon: '🌱' },
  { id: 'data-sync', name: 'Data Sync', description: 'Sync data between platforms', category: 'automation', icon: '🔄' },
  { id: 'report-generator', name: 'Report Generator', description: 'Automated business reports', category: 'automation', icon: '📊' },
  { id: 'invoice-creator', name: 'Invoice Creator', description: 'Automated invoicing', category: 'automation', icon: '🧾' },
  { id: 'appointment-scheduler', name: 'Appointment Scheduler', description: 'Automated booking system', category: 'automation', icon: '📅' },
  { id: 'reminder-bot', name: 'Reminder Bot', description: 'Never miss important tasks', category: 'automation', icon: '⏰' },
  { id: 'form-builder', name: 'Form Builder', description: 'Smart forms with AI', category: 'automation', icon: '📝' },

  // Communication Tools
  { id: 'chatbot-builder', name: 'Chatbot Builder', description: '24/7 AI customer support', category: 'communication', icon: '🤖', popular: true, featured: true },
  { id: 'whatsapp-bot', name: 'WhatsApp Bot', description: 'Automated WhatsApp responses', category: 'communication', icon: '💬', new: true },
  { id: 'sms-campaign', name: 'SMS Campaign', description: 'Bulk SMS marketing', category: 'communication', icon: '📱' },
  { id: 'voice-assistant', name: 'Voice Assistant', description: 'AI phone answering', category: 'communication', icon: '📞' },
  { id: 'meeting-summarizer', name: 'Meeting Summarizer', description: 'Auto-summarize meetings', category: 'communication', icon: '📝' },
  { id: 'translation-pro', name: 'Translation Pro', description: 'Translate in 50+ languages', category: 'communication', icon: '🌐' },
  { id: 'transcription', name: 'Transcription AI', description: 'Audio to text conversion', category: 'communication', icon: '🎤' },
  { id: 'grammar-check', name: 'Grammar Checker', description: 'Perfect writing every time', category: 'communication', icon: '✅' },
  { id: 'tone-adjuster', name: 'Tone Adjuster', description: 'Adjust message tone', category: 'communication', icon: '🎭' },

  // Productivity Tools
  { id: 'task-manager', name: 'Task Manager AI', description: 'Smart task prioritization', category: 'productivity', icon: '✅' },
  { id: 'meeting-scheduler', name: 'Meeting Scheduler', description: 'Find perfect meeting times', category: 'productivity', icon: '📅' },
  { id: 'note-taker', name: 'Smart Note Taker', description: 'AI-powered note taking', category: 'productivity', icon: '📝' },
  { id: 'research-assistant', name: 'Research Assistant', description: 'Research any topic fast', category: 'productivity', icon: '🔬' },
  { id: 'summary-generator', name: 'Summary Generator', description: 'Summarize long documents', category: 'productivity', icon: '📄' },
  { id: 'idea-generator', name: 'Idea Generator', description: 'Brainstorm new ideas', category: 'productivity', icon: '💡' },
  { id: 'decision-helper', name: 'Decision Helper', description: 'Make better decisions', category: 'productivity', icon: '🎯' },
  { id: 'time-tracker', name: 'Time Tracker', description: 'Track and optimize time', category: 'productivity', icon: '⏱️' },
  { id: 'document-search', name: 'Document Search', description: 'Find anything in your docs', category: 'productivity', icon: '🔍' },
  { id: 'knowledge-base', name: 'Knowledge Base', description: 'Organize company knowledge', category: 'productivity', icon: '📚' },
  { id: 'onboarding', name: 'Onboarding Assistant', description: 'Streamline new hire onboarding', category: 'productivity', icon: '👋' },
  { id: 'training-creator', name: 'Training Creator', description: 'Create training materials', category: 'productivity', icon: '🎓' },
  { id: 'policy-writer', name: 'Policy Writer', description: 'Company policies & procedures', category: 'productivity', icon: '📋' },
  { id: 'sop-generator', name: 'SOP Generator', description: 'Standard operating procedures', category: 'productivity', icon: '📑' },
  { id: 'faq-builder', name: 'FAQ Builder', description: 'Automated FAQ creation', category: 'productivity', icon: '❓' },
  { id: 'survey-creator', name: 'Survey Creator', description: 'Build effective surveys', category: 'productivity', icon: '📊' },
  { id: 'feedback-analyzer', name: 'Feedback Analyzer', description: 'Analyze customer feedback', category: 'productivity', icon: '💭' },
  { id: 'review-responder', name: 'Review Responder', description: 'Respond to reviews quickly', category: 'productivity', icon: '⭐' },
  { id: 'crisis-manager', name: 'Crisis Manager', description: 'Handle PR crises', category: 'productivity', icon: '🚨' },
  { id: 'event-planner', name: 'Event Planner', description: 'Plan successful events', category: 'productivity', icon: '🎉' },
  { id: 'budget-planner', name: 'Budget Planner', description: 'Smart budget allocation', category: 'productivity', icon: '💰' },
  { id: 'expense-tracker', name: 'Expense Tracker', description: 'Track business expenses', category: 'productivity', icon: '💳' },
  { id: 'tax-assistant', name: 'Tax Assistant', description: 'Tax preparation help', category: 'productivity', icon: '🧾' },
  { id: 'legal-checker', name: 'Legal Checker', description: 'Basic legal document review', category: 'productivity', icon: '⚖️' },
  { id: 'compliance-helper', name: 'Compliance Helper', description: 'Stay compliant with regulations', category: 'productivity', icon: '✓' },
  { id: 'risk-assessor', name: 'Risk Assessor', description: 'Identify business risks', category: 'productivity', icon: '⚠️' },
  { id: 'swot-analyzer', name: 'SWOT Analyzer', description: 'Strategic business analysis', category: 'productivity', icon: '📊' },
  { id: 'pitch-deck', name: 'Pitch Deck Builder', description: 'Investor-ready presentations', category: 'productivity', icon: '📊' },
  { id: 'business-plan', name: 'Business Plan Writer', description: 'Complete business plans', category: 'productivity', icon: '📋' },
  { id: 'financial-model', name: 'Financial Modeler', description: 'Financial projections', category: 'productivity', icon: '📈' },
  { id: 'valuation-tool', name: 'Valuation Tool', description: 'Business valuation estimates', category: 'productivity', icon: '💎' },
  { id: 'exit-strategy', name: 'Exit Strategy', description: 'Plan your business exit', category: 'productivity', icon: '🚪' },
  { id: 'partnership-finder', name: 'Partnership Finder', description: 'Find strategic partners', category: 'productivity', icon: '🤝' },
  { id: 'investor-matcher', name: 'Investor Matcher', description: 'Find potential investors', category: 'productivity', icon: '💰' },
  { id: 'grant-writer', name: 'Grant Writer', description: 'Win funding applications', category: 'productivity', icon: '📝' },
  { id: 'press-kit', name: 'Press Kit Builder', description: 'Professional media kits', category: 'productivity', icon: '📰' },
  { id: 'influencer-finder', name: 'Influencer Finder', description: 'Find brand ambassadors', category: 'productivity', icon: '⭐' },
  { id: 'affiliate-manager', name: 'Affiliate Manager', description: 'Manage affiliate programs', category: 'productivity', icon: '🔗' },
  { id: 'referral-system', name: 'Referral System', description: 'Build referral programs', category: 'productivity', icon: '🎁' },
  { id: 'loyalty-program', name: 'Loyalty Program', description: 'Customer loyalty systems', category: 'productivity', icon: '💎' },
  { id: 'gift-card-system', name: 'Gift Card System', description: 'Digital gift card platform', category: 'productivity', icon: '🎁' },
  { id: 'subscription-manager', name: 'Subscription Manager', description: 'Manage recurring revenue', category: 'productivity', icon: '🔄' },
  { id: 'membership-site', name: 'Membership Site', description: 'Build membership platforms', category: 'productivity', icon: '👥' },
  { id: 'course-creator', name: 'Course Creator', description: 'Build online courses', category: 'productivity', icon: '🎓' },
  { id: 'webinar-builder', name: 'Webinar Builder', description: 'Host engaging webinars', category: 'productivity', icon: '💻' },
  { id: 'podcast-assistant', name: 'Podcast Assistant', description: 'Launch and grow podcasts', category: 'productivity', icon: '🎙️' },
  { id: 'youtube-optimizer', name: 'YouTube Optimizer', description: 'Grow your YouTube channel', category: 'productivity', icon: '▶️' },
  { id: 'tiktok-growth', name: 'TikTok Growth', description: 'Viral TikTok strategies', category: 'productivity', icon: '🎵' },
  { id: 'instagram-growth', name: 'Instagram Growth', description: 'Build Instagram following', category: 'productivity', icon: '📷' },
  { id: 'linkedin-growth', name: 'LinkedIn Growth', description: 'Professional networking', category: 'productivity', icon: '💼' },
  { id: 'twitter-growth', name: 'X/Twitter Growth', description: 'Build Twitter presence', category: 'productivity', icon: '🐦' },
  { id: 'facebook-growth', name: 'Facebook Growth', description: 'Grow Facebook presence', category: 'productivity', icon: '👍' },
  { id: 'community-builder', name: 'Community Builder', description: 'Build online communities', category: 'productivity', icon: '🌐' },
  { id: 'forum-moderator', name: 'Forum Moderator', description: 'Automated forum moderation', category: 'productivity', icon: '🛡️' },
  { id: 'review-aggregator', name: 'Review Aggregator', description: 'Collect reviews from everywhere', category: 'productivity', icon: '⭐' },
  { id: 'testimonial-collector', name: 'Testimonial Collector', description: 'Gather customer testimonials', category: 'productivity', icon: '💬' },
  { id: 'case-study-promoter', name: 'Case Study Promoter', description: 'Promote success stories', category: 'productivity', icon: '📢' },
  { id: 'pr-distributor', name: 'PR Distributor', description: 'Distribute press releases', category: 'productivity', icon: '📰' },
  { id: 'media-monitor', name: 'Media Monitor', description: 'Track media mentions', category: 'productivity', icon: '📺' },
  { id: 'crisis-communication', name: 'Crisis Communication', description: 'Manage crisis messaging', category: 'productivity', icon: '🚨' },
  { id: 'reputation-manager', name: 'Reputation Manager', description: 'Manage online reputation', category: 'productivity', icon: '🌟' },
  { id: 'brand-monitor', name: 'Brand Monitor', description: 'Track brand mentions', category: 'productivity', icon: '👁️' },
  { id: 'trademark-checker', name: 'Trademark Checker', description: 'Check trademark availability', category: 'productivity', icon: '™️' },
  { id: 'domain-finder', name: 'Domain Finder', description: 'Find perfect domain names', category: 'productivity', icon: '🌐' },
  { id: 'hosting-advisor', name: 'Hosting Advisor', description: 'Find best web hosting', category: 'productivity', icon: '☁️' },
  { id: 'ssl-checker', name: 'SSL Checker', description: 'Verify SSL certificates', category: 'productivity', icon: '🔒' },
  { id: 'speed-test', name: 'Speed Test', description: 'Website performance test', category: 'productivity', icon: '⚡' },
  { id: 'uptime-monitor', name: 'Uptime Monitor', description: 'Monitor website uptime', category: 'productivity', icon: '📡' },
  { id: 'security-scanner', name: 'Security Scanner', description: 'Scan for vulnerabilities', category: 'productivity', icon: '🛡️' },
  { id: 'backup-automator', name: 'Backup Automator', description: 'Automated data backups', category: 'productivity', icon: '💾' },
  { id: 'migration-assistant', name: 'Migration Assistant', description: 'Platform migration help', category: 'productivity', icon: '🚚' },
  { id: 'integration-helper', name: 'Integration Helper', description: 'Connect your tools', category: 'productivity', icon: '🔌' },
  { id: 'api-builder', name: 'API Builder', description: 'Build custom APIs', category: 'productivity', icon: '🔧' },
  { id: 'webhook-manager', name: 'Webhook Manager', description: 'Manage webhook integrations', category: 'productivity', icon: '🪝' },
  { id: 'database-designer', name: 'Database Designer', description: 'Design database schemas', category: 'productivity', icon: '🗄️' },
  { id: 'code-reviewer', name: 'Code Reviewer', description: 'Review code for issues', category: 'productivity', icon: '👨‍💻' },
  { id: 'bug-finder', name: 'Bug Finder', description: 'Find and fix bugs', category: 'productivity', icon: '🐛' },
  { id: 'performance-optimizer', name: 'Performance Optimizer', description: 'Speed up your systems', category: 'productivity', icon: '⚡' },
  { id: 'scalability-planner', name: 'Scalability Planner', description: 'Plan for growth', category: 'productivity', icon: '📈' },
  { id: 'disaster-recovery', name: 'Disaster Recovery', description: 'Business continuity plans', category: 'productivity', icon: '🏥' },
  { id: 'insurance-advisor', name: 'Insurance Advisor', description: 'Business insurance guidance', category: 'productivity', icon: '🛡️' },
  { id: 'health-benefits', name: 'Health Benefits', description: 'Employee benefits planning', category: 'productivity', icon: '❤️' },
  { id: 'hiring-assistant', name: 'Hiring Assistant', description: 'Streamline recruitment', category: 'productivity', icon: '👔' },
  { id: 'interview-prep', name: 'Interview Prep', description: 'Prepare for interviews', category: 'productivity', icon: '🎤' },
  { id: 'onboarding-flow', name: 'Onboarding Flow', description: 'New employee onboarding', category: 'productivity', icon: '👋' },
  { id: 'performance-review', name: 'Performance Review', description: 'Employee evaluations', category: 'productivity', icon: '📊' },
  { id: 'exit-interview', name: 'Exit Interview', description: 'Departing employee feedback', category: 'productivity', icon: '🚪' },
  { id: 'culture-builder', name: 'Culture Builder', description: 'Build company culture', category: 'productivity', icon: '🏢' },
  { id: 'team-builder', name: 'Team Builder', description: 'Strengthen team dynamics', category: 'productivity', icon: '🤝' },
  { id: 'conflict-resolver', name: 'Conflict Resolver', description: 'Handle team conflicts', category: 'productivity', icon: '⚖️' },
  { id: 'motivation-booster', name: 'Motivation Booster', description: 'Keep team motivated', category: 'productivity', icon: '💪' },
  { id: 'goal-tracker', name: 'Goal Tracker', description: 'Track team goals', category: 'productivity', icon: '🎯' },
  { id: 'okr-planner', name: 'OKR Planner', description: 'Plan objectives and key results', category: 'productivity', icon: '📊' },
  { id: 'kpi-dashboard', name: 'KPI Dashboard', description: 'Track key metrics', category: 'productivity', icon: '📈' },
  { id: 'benchmark-tool', name: 'Benchmark Tool', description: 'Compare against competitors', category: 'productivity', icon: '📊' },
  { id: 'industry-reporter', name: 'Industry Reporter', description: 'Industry trend reports', category: 'productivity', icon: '📰' },
  { id: 'market-research', name: 'Market Research', description: 'Deep market analysis', category: 'productivity', icon: '🔬' },
  { id: 'customer-discovery', name: 'Customer Discovery', description: 'Find ideal customers', category: 'productivity', icon: '🔍' },
  { id: 'product-roadmap', name: 'Product Roadmap', description: 'Plan product development', category: 'productivity', icon: '🗺️' },
  { id: 'feature-prioritizer', name: 'Feature Prioritizer', description: 'Prioritize product features', category: 'productivity', icon: '📋' },
  { id: 'user-story-writer', name: 'User Story Writer', description: 'Write effective user stories', category: 'productivity', icon: '📝' },
  { id: 'bug-report-analyzer', name: 'Bug Report Analyzer', description: 'Analyze bug reports', category: 'productivity', icon: '🐛' },
  { id: 'release-notes', name: 'Release Notes', description: 'Write product updates', category: 'productivity', icon: '📝' },
  { id: 'changelog-creator', name: 'Changelog Creator', description: 'Track product changes', category: 'productivity', icon: '📋' },
  { id: 'documentation-writer', name: 'Documentation Writer', description: 'Create user documentation', category: 'productivity', icon: '📚' },
  { id: 'tutorial-creator', name: 'Tutorial Creator', description: 'Build product tutorials', category: 'productivity', icon: '🎓' },
  { id: 'knowledge-article', name: 'Knowledge Article', description: 'Write help articles', category: 'productivity', icon: '📖' },
  { id: 'video-tutorial', name: 'Video Tutorial', description: 'Script video tutorials', category: 'productivity', icon: '🎬' },
  { id: 'webinar-script', name: 'Webinar Script', description: 'Write webinar content', category: 'productivity', icon: '🎤' },
  { id: 'demo-creator', name: 'Demo Creator', description: 'Build product demos', category: 'productivity', icon: '🎥' },
  { id: 'testimonial-video', name: 'Testimonial Video', description: 'Script customer videos', category: 'productivity', icon: '🎬' },
  { id: 'explainer-video', name: 'Explainer Video', description: 'Create explainer content', category: 'productivity', icon: '📺' },
  { id: 'animated-video', name: 'Animated Video', description: 'Script animated videos', category: 'productivity', icon: '🎨' },
  { id: 'podcast-script', name: 'Podcast Script', description: 'Write podcast episodes', category: 'productivity', icon: '🎙️' },
  { id: 'newsletter-content', name: 'Newsletter Content', description: 'Engaging newsletter content', category: 'productivity', icon: '📧' },
  { id: 'blog-calendar', name: 'Blog Calendar', description: 'Plan blog content', category: 'productivity', icon: '📅' },
  { id: 'content-strategy', name: 'Content Strategy', description: 'Build content plans', category: 'productivity', icon: '📊' },
  { id: 'editorial-calendar', name: 'Editorial Calendar', description: 'Plan publication schedule', category: 'productivity', icon: '📅' },
  { id: 'guest-post', name: 'Guest Post Writer', description: 'Write guest articles', category: 'productivity', icon: '✍️' },
  { id: 'syndication-plan', name: 'Syndication Plan', description: 'Distribute content widely', category: 'productivity', icon: '📡' },
  { id: 'repurposing', name: 'Content Repurposing', description: 'Reuse content across channels', category: 'productivity', icon: '♻️' },
  { id: 'evergreen-content', name: 'Evergreen Content', description: 'Create lasting content', category: 'productivity', icon: '🌲' },
  { id: 'seasonal-content', name: 'Seasonal Content', description: 'Holiday and event content', category: 'productivity', icon: '🎄' },
  { id: 'trending-content', name: 'Trending Content', description: 'Capitalize on trends', category: 'productivity', icon: '🔥' },
  { id: 'viral-content', name: 'Viral Content', description: 'Create shareable content', category: 'productivity', icon: '🚀' },
  { id: 'interactive-content', name: 'Interactive Content', description: 'Quizzes, polls, calculators', category: 'productivity', icon: '🎮' },
  { id: 'gamification', name: 'Gamification', description: 'Add game elements', category: 'productivity', icon: '🏆' },
  { id: 'contest-creator', name: 'Contest Creator', description: 'Run engaging contests', category: 'productivity', icon: '🎁' },
  { id: 'giveaway-manager', name: 'Giveaway Manager', description: 'Manage promotional giveaways', category: 'productivity', icon: '🎉' },
  { id: 'loyalty-rewards', name: 'Loyalty Rewards', description: 'Reward customer loyalty', category: 'productivity', icon: '🎁' },
  { id: 'vip-program', name: 'VIP Program', description: 'Exclusive customer programs', category: 'productivity', icon: '💎' },
  { id: 'early-access', name: 'Early Access', description: 'Beta and early access programs', category: 'productivity', icon: '🔓' },
  { id: 'waitlist-manager', name: 'Waitlist Manager', description: 'Build product waitlists', category: 'productivity', icon: '📋' },
  { id: 'launch-strategy', name: 'Launch Strategy', description: 'Plan product launches', category: 'productivity', icon: '🚀' },
  { id: 'preorder-campaign', name: 'Preorder Campaign', description: 'Drive preorders', category: 'productivity', icon: '💰' },
  { id: 'crowdfunding', name: 'Crowdfunding', description: 'Plan crowdfunding campaigns', category: 'productivity', icon: '💵' },
  { id: 'investor-deck', name: 'Investor Deck', description: 'Pitch to investors', category: 'productivity', icon: '📊' },
  { id: 'board-presentation', name: 'Board Presentation', description: 'Present to stakeholders', category: 'productivity', icon: '📈' },
  { id: 'annual-report', name: 'Annual Report', description: 'Create annual reports', category: 'productivity', icon: '📊' },
  { id: 'quarterly-review', name: 'Quarterly Review', description: 'Quarterly business reviews', category: 'productivity', icon: '📅' },
  { id: 'monthly-report', name: 'Monthly Report', description: 'Monthly performance reports', category: 'productivity', icon: '📊' },
  { id: 'weekly-update', name: 'Weekly Update', description: 'Team weekly updates', category: 'productivity', icon: '📅' },
  { id: 'daily-standup', name: 'Daily Standup', description: 'Daily team updates', category: 'productivity', icon: '☀️' },
  { id: 'retrospective', name: 'Retrospective', description: 'Team retrospectives', category: 'productivity', icon: '🔍' },
  { id: 'sprint-planning', name: 'Sprint Planning', description: 'Agile sprint planning', category: 'productivity', icon: '🏃' },
  { id: 'backlog-grooming', name: 'Backlog Grooming', description: 'Prioritize work items', category: 'productivity', icon: '📋' },
  { id: 'story-pointing', name: 'Story Pointing', description: 'Estimate effort', category: 'productivity', icon: '🎯' },
  { id: 'velocity-tracker', name: 'Velocity Tracker', description: 'Track team velocity', category: 'productivity', icon: '📈' },
  { id: 'burndown-chart', name: 'Burndown Chart', description: 'Visualize progress', category: 'productivity', icon: '📉' },
  { id: 'cumulative-flow', name: 'Cumulative Flow', description: 'Track work flow', category: 'productivity', icon: '🌊' },
  { id: 'cycle-time', name: 'Cycle Time', description: 'Measure delivery speed', category: 'productivity', icon: '⏱️' },
  { id: 'lead-time', name: 'Lead Time', description: 'Measure request to delivery', category: 'productivity', icon: '📅' },
  { id: 'throughput', name: 'Throughput', description: 'Track work completed', category: 'productivity', icon: '✅' },
  { id: 'wip-limits', name: 'WIP Limits', description: 'Manage work in progress', category: 'productivity', icon: '🚧' },
  { id: 'flow-efficiency', name: 'Flow Efficiency', description: 'Optimize workflow', category: 'productivity', icon: '⚡' },
  { id: 'blocker-tracker', name: 'Blocker Tracker', description: 'Identify obstacles', category: 'productivity', icon: '🚫' },
  { id: 'dependency-map', name: 'Dependency Map', description: 'Visualize dependencies', category: 'productivity', icon: '🗺️' },
  { id: 'risk-register', name: 'Risk Register', description: 'Track project risks', category: 'productivity', icon: '⚠️' },
  { id: 'issue-tracker', name: 'Issue Tracker', description: 'Manage issues', category: 'productivity', icon: '🐛' },
  { id: 'change-request', name: 'Change Request', description: 'Manage changes', category: 'productivity', icon: '🔄' },
  { id: 'decision-log', name: 'Decision Log', description: 'Record decisions', category: 'productivity', icon: '📝' },
  { id: 'meeting-minutes', name: 'Meeting Minutes', description: 'Document meetings', category: 'productivity', icon: '📝' },
  { id: 'action-items', name: 'Action Items', description: 'Track action items', category: 'productivity', icon: '✅' },
  { id: 'parking-lot', name: 'Parking Lot', description: 'Capture off-topic items', category: 'productivity', icon: '🅿️' }
];

export const getToolsByCategory = (categoryId: string) => {
  return aiTools.filter(tool => tool.category === categoryId);
};

export const getFeaturedTools = () => {
  return aiTools.filter(tool => tool.featured);
};

export const getPopularTools = () => {
  return aiTools.filter(tool => tool.popular);
};

export const getNewTools = () => {
  return aiTools.filter(tool => tool.new);
};

export const searchTools = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return aiTools.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery)
  );
};
