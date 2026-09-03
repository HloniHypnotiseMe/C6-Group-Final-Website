import { getCommercialPrice } from '../config/commercial';
// C6GROUP AI Business Ecosystem - Static Content Data

import type { Package, Testimonial, Customer, ActivityItem, ChannelPerformance } from '@/types';

export const packages: Package[] = [
  {
    id: 'lead',
    name: 'Lead Package',
    price: 0,
    annualPrice: 0,
    description: 'For fence-sitters & startups',
    features: [
      'Contact information capture',
      'WhatsApp & Email opt-in',
      'Basic revenue visualization',
      'RemotePay integration',
      'Community support'
    ],
    ctaText: 'Get Started Free'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: getCommercialPrice("DIAMOND", "MONTHLY"),
    annualPrice: getCommercialPrice("DIAMOND", "ANNUAL"),
    description: 'Perfect for solopreneurs & small teams',
    features: [
      'Reputation Tool',
      'AI Chatbot (trained on your business)',
      '2 AI tools total',
      'Email support',
      'Basic analytics'
    ],
    ctaText: 'Start Diamond Package'
  },
  {
    id: 'gold',
    name: 'Gold',
    price: getCommercialPrice("GOLD", "MONTHLY"),
    annualPrice: getCommercialPrice("GOLD", "ANNUAL"),
    description: 'Ideal for growing businesses',
    features: [
      'Everything in Diamond',
      'Traffic Analyst',
      '3 AI tools total',
      'Priority support',
      'Advanced analytics',
      '1-on-1 onboarding'
    ],
    highlighted: true,
    ctaText: 'Start Gold Package'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: getCommercialPrice("PLATINUM", "MONTHLY"),
    annualPrice: getCommercialPrice("PLATINUM", "ANNUAL"),
    description: 'For established businesses ready to scale',
    features: [
      'Everything in Gold',
      '1 AI Staff Member',
      'Business Intelligence Dashboard',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations'
    ],
    ctaText: 'Start Platinum Package'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    annualPrice: null,
    description: 'For large businesses & agencies',
    features: [
      'SuperAI Agents',
      'Dedicated consultant',
      'White-label options',
      'Custom AI development',
      'SLA guarantee',
      'Priority development'
    ],
    ctaText: 'Book Consultation'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: "Mpho's Craft Studio",
    business: 'Handmade Crafts',
    location: 'Cape Town',
    quote: 'The AI audit showed me I was losing R15,000 monthly in missed opportunities. Now my revenue is up 340%.',
    metric: '+340% Revenue Growth',
    avatar: 'M'
  },
  {
    id: '2',
    name: 'Sibusiso Consulting',
    business: 'Business Consulting',
    location: 'Johannesburg',
    quote: 'The AI chatbot handles 80% of my client inquiries. I can focus on high-value work while leads convert automatically.',
    metric: '80% Automation Rate',
    avatar: 'S'
  },
  {
    id: '3',
    name: "Lerato's Kitchen",
    business: 'Catering Services',
    location: 'Pretoria',
    quote: 'RemotePay integration increased my payment collection rate by 95%. No more chasing unpaid invoices.',
    metric: '95% Collection Rate',
    avatar: 'L'
  }
];

export const industries = [
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'services', label: 'Professional Services' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'technology', label: 'Technology' },
  { value: 'construction', label: 'Construction' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' }
];

export const yearsInBusiness = [
  { value: '0-1', label: 'Less than 1 year' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' }
];

export const employeeRanges = [
  { value: '1', label: 'Just me' },
  { value: '2-5', label: '2-5 employees' },
  { value: '6-10', label: '6-10 employees' },
  { value: '11-20', label: '11-20 employees' },
  { value: '21-50', label: '21-50 employees' },
  { value: '50+', label: '50+ employees' }
];

export const platforms = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' }
];

export const marketingActivities = [
  { value: 'social_media', label: 'Social Media Marketing' },
  { value: 'email_marketing', label: 'Email Marketing' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'facebook_ads', label: 'Facebook/Instagram Ads' },
  { value: 'seo', label: 'SEO Optimization' },
  { value: 'content_marketing', label: 'Content Marketing' }
];

export const leadGenerationMethods = [
  { value: 'referrals', label: 'Referrals/Word of mouth' },
  { value: 'social_media', label: 'Social media' },
  { value: 'website', label: 'Website/SEO' },
  { value: 'paid_ads', label: 'Paid advertising' },
  { value: 'cold_outreach', label: 'Cold calling/outreach' },
  { value: 'networking', label: 'Networking events' },
  { value: 'none', label: 'No systematic lead generation' }
];

export const monthlyLeadRanges = [
  { value: '0-10', label: '0-10 leads' },
  { value: '11-50', label: '11-50 leads' },
  { value: '51-100', label: '51-100 leads' },
  { value: '101-200', label: '101-200 leads' },
  { value: '200+', label: '200+ leads' }
];

export const conversionRateRanges = [
  { value: '0-5', label: '0-5%' },
  { value: '6-10', label: '6-10%' },
  { value: '11-20', label: '11-20%' },
  { value: '21-30', label: '21-30%' },
  { value: '31-50', label: '31-50%' },
  { value: '50+', label: '50%+' },
  { value: 'unknown', label: "Don't know" }
];

export const marketingChallenges = [
  { value: 'lead_quality', label: 'Poor lead quality' },
  { value: 'high_costs', label: 'High marketing costs' },
  { value: 'low_conversion', label: 'Low conversion rates' },
  { value: 'no_tracking', label: "Can't track results" },
  { value: 'time_constraints', label: 'No time for marketing' },
  { value: 'competition', label: 'Too much competition' }
];

export const paymentSystems = [
  { value: 'eft', label: 'Bank EFT' },
  { value: 'card', label: 'Credit/Debit Cards' },
  { value: 'snapscan', label: 'SnapScan' },
  { value: 'zapper', label: 'Zapper' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other', label: 'Other' }
];

export const businessTools = [
  { value: 'crm', label: 'CRM System' },
  { value: 'accounting', label: 'Accounting Software' },
  { value: 'analytics', label: 'Google Analytics' },
  { value: 'email_platform', label: 'Email Marketing Platform' },
  { value: 'booking_system', label: 'Booking System' },
  { value: 'chatbot', label: 'Chatbot/AI Assistant' }
];

export const techChallenges = [
  { value: 'integration', label: "Systems don't integrate" },
  { value: 'cost', label: 'Tools are too expensive' },
  { value: 'complexity', label: 'Too complex to manage' },
  { value: 'data', label: "Can't track performance" },
  { value: 'automation', label: 'Lack of automation' },
  { value: 'security', label: 'Security concerns' },
  { value: 'none', label: 'No major challenges' }
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'John Lerato',
    email: 'john@techstart.co.za',
    phone: '+27 82 555 0123',
    business: 'CEO, TechStart',
    status: 'hot',
    lastContact: '2 hours ago',
    value: 15000,
    initials: 'JL'
  },
  {
    id: '2',
    name: 'Sarah Mthembu',
    email: 'sarah@sarahsdesigns.co.za',
    phone: '+27 83 555 0456',
    business: "Owner, Sarah's Designs",
    status: 'warm',
    lastContact: '1 day ago',
    value: 8500,
    initials: 'SM'
  },
  {
    id: '3',
    name: 'David Khumalo',
    email: 'david@eliteservices.co.za',
    phone: '+27 84 555 0789',
    business: 'Manager, Elite Services',
    status: 'cold',
    lastContact: '3 days ago',
    value: 12000,
    initials: 'DK'
  },
  {
    id: '4',
    name: 'Lisa Ndlovu',
    email: 'lisa@innovatesa.co.za',
    phone: '+27 81 555 0321',
    business: 'Director, Innovate SA',
    status: 'customer',
    lastContact: '1 week ago',
    value: 25000,
    initials: 'LN'
  },
  {
    id: '5',
    name: 'Peter Tshabalala',
    email: 'peter@startuphub.co.za',
    phone: '+27 82 555 0654',
    business: 'Founder, StartupHub',
    status: 'warm',
    lastContact: '2 days ago',
    value: 18500,
    initials: 'PT'
  }
];

export const recentActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'lead',
    title: 'New lead captured via AI Chatbot',
    description: '2 minutes ago • WhatsApp',
    time: '2 minutes ago',
    value: 'R2,500 potential'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment received via RemotePay',
    description: '15 minutes ago • Credit Card',
    time: '15 minutes ago',
    value: 'R1,850 received'
  },
  {
    id: '3',
    type: 'campaign',
    title: 'AI Marketing campaign launched',
    description: '1 hour ago • Facebook Ads',
    time: '1 hour ago',
    value: 'R500 spent'
  },
  {
    id: '4',
    type: 'affiliate',
    title: 'New customer from affiliate link',
    description: '3 hours ago • Instagram',
    time: '3 hours ago',
    value: 'R925 commission'
  }
];

export const channelPerformance: ChannelPerformance[] = [
  {
    name: 'Facebook Ads',
    icon: 'FB',
    category: 'Social Media Marketing',
    revenue: 45230,
    roi: 4.2
  },
  {
    name: 'WhatsApp',
    icon: 'WP',
    category: 'Direct Messaging',
    revenue: 32180,
    roi: 6.8
  },
  {
    name: 'Instagram',
    icon: 'IG',
    category: 'Organic Content',
    revenue: 28950,
    roi: 8.1
  },
  {
    name: 'Referrals',
    icon: 'REF',
    category: 'Word of Mouth',
    revenue: 18750,
    roi: 12.3
  }
];

export const faqs = [
  {
    question: 'Can I change my package later?',
    answer: 'Yes, you can upgrade or downgrade your package at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No setup fees! All packages include free onboarding and implementation. We\'re here to ensure you get maximum value from day one.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and EFT transfers. For Enterprise packages, we also offer invoicing and purchase order options.'
  },
  {
    question: 'How does the 30-day money-back guarantee work?',
    answer: 'If you\'re not completely satisfied within your first 30 days, we\'ll refund your entire payment. No questions asked, no hoops to jump through.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your current billing period.'
  },
  {
    question: 'Do you offer training and support?',
    answer: 'Absolutely! All packages include comprehensive training materials. Gold and above include 1-on-1 onboarding, while Platinum offers 24/7 phone support.'
  }
];

export const featureComparison = [
  { feature: 'AI Tools', lead: '—', diamond: '2 Tools', gold: '3 Tools', platinum: '4 Tools', enterprise: 'Unlimited' },
  { feature: 'AI Chatbot', lead: '—', diamond: '✓', gold: '✓', platinum: '✓', enterprise: '✓' },
  { feature: 'Reputation Tool', lead: '—', diamond: '✓', gold: '✓', platinum: '✓', enterprise: '✓' },
  { feature: 'Traffic Analyst', lead: '—', diamond: '—', gold: '✓', platinum: '✓', enterprise: '✓' },
  { feature: 'AI Staff Member', lead: '—', diamond: '—', gold: '—', platinum: '✓', enterprise: '✓' },
  { feature: 'Smart Website Builder', lead: 'Basic', diamond: '✓', gold: '✓', platinum: '✓', enterprise: '✓' },
  { feature: 'RemotePay Integration', lead: '✓', diamond: '✓', gold: '✓', platinum: '✓', enterprise: '✓' },
  { feature: 'Business Intelligence Dashboard', lead: '—', diamond: 'Basic', gold: 'Standard', platinum: 'Advanced', enterprise: 'Enterprise' },
  { feature: 'Affiliate & Passive Income', lead: 'Basic', diamond: '✓', gold: '✓', platinum: '✓', enterprise: '✓' },
  { feature: 'AI Marketing & Growth', lead: '—', diamond: 'Basic', gold: 'Standard', platinum: 'Advanced', enterprise: 'Enterprise' },
  { feature: 'Support Level', lead: 'Community', diamond: 'Email', gold: 'Priority', platinum: '24/7 Phone', enterprise: 'Dedicated' },
  { feature: 'Onboarding', lead: 'Self-service', diamond: 'Self-service', gold: '1-on-1', platinum: 'Dedicated', enterprise: 'Custom' }
];
