import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AuditFormData, AuditResult } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in South African Rand
export function formatCurrency(value: number): string {
  return 'R' + value.toLocaleString('en-ZA');
}

// Format number with commas
export function formatNumber(value: number): string {
  return value.toLocaleString('en-ZA');
}

// Calculate audit results based on form data
export function calculateAuditResults(formData: AuditFormData): AuditResult {
  let overallScore = 0;
  let seoScore = 0;
  let conversionRate = 0;

  // Website presence scoring
  if (formData.websiteUrl && formData.websiteUrl.trim() !== '') {
    overallScore += 15;
    seoScore += 25;
  }

  // Social media presence scoring
  if (formData.platforms && formData.platforms.length > 0) {
    const platformCount = formData.platforms.length;
    overallScore += Math.min(platformCount * 5, 20);
    seoScore += Math.min(platformCount * 10, 30);
  }

  // Marketing activities scoring
  if (formData.marketingActivities && formData.marketingActivities.length > 0) {
    const activityCount = formData.marketingActivities.length;
    overallScore += Math.min(activityCount * 8, 25);
  }

  // Lead generation scoring
  if (formData.leadGeneration && formData.leadGeneration !== 'none') {
    overallScore += 10;
  }

  // Conversion rate scoring
  if (formData.conversionRate) {
    const rate = formData.conversionRate;
    if (rate === '50+') conversionRate = 50;
    else if (rate === '31-50') conversionRate = 40;
    else if (rate === '21-30') conversionRate = 25;
    else if (rate === '11-20') conversionRate = 15;
    else if (rate === '6-10') conversionRate = 8;
    else conversionRate = 3;

    if (conversionRate > 20) overallScore += 15;
    else if (conversionRate > 10) overallScore += 10;
    else overallScore += 5;
  }

  // Technology adoption scoring
  if (formData.businessTools && formData.businessTools.length > 0) {
    const toolCount = formData.businessTools.length;
    overallScore += Math.min(toolCount * 5, 15);
  }

  // Calculate revenue gap
  const currentRevenue = formData.monthlyRevenue || 0;
  const potentialRevenue = currentRevenue * 2.5;
  const revenueGap = potentialRevenue - currentRevenue;

  // Ensure scores are within bounds
  overallScore = Math.min(Math.max(overallScore, 0), 100);
  seoScore = Math.min(Math.max(seoScore, 0), 100);

  // Generate recommendations
  const recommendations = generateRecommendations(formData, overallScore, seoScore, conversionRate);

  // Determine recommended package
  const recommendedPackage = determineRecommendedPackage(overallScore, currentRevenue);

  // Generate action plan
  const actionPlan = generateActionPlan(overallScore, seoScore, conversionRate);

  return {
    overallScore,
    seoScore,
    currentRevenue,
    potentialRevenue,
    revenueGap,
    conversionRate,
    potentialConversion: Math.min(conversionRate * 2, 50),
    recommendations,
    recommendedPackage,
    actionPlan
  };
}

// Generate recommendations based on audit data
function generateRecommendations(
  formData: AuditFormData,
  overallScore: number,
  seoScore: number,
  conversionRate: number
): AuditResult['recommendations'] {
  const seo: string[] = [];
  const revenue: string[] = [];
  const conversion: string[] = [];
  const aiTools: string[] = [];

  // SEO Recommendations
  if (!formData.websiteUrl || formData.websiteUrl.trim() === '') {
    seo.push('🚀 Launch a professional website to establish online presence');
  }
  if (!formData.platforms || formData.platforms.length < 3) {
    seo.push('📱 Expand social media presence across multiple platforms');
  }
  if (seoScore < 50) {
    seo.push('🔍 Implement SEO optimization to improve search rankings');
  }
  if (!formData.marketingActivities || !formData.marketingActivities.includes('seo')) {
    seo.push('📊 Set up Google Analytics and Search Console');
  }

  // Revenue Recommendations
  if (formData.monthlyRevenue === 0) {
    revenue.push('💡 Start with lead capture to build customer base');
    revenue.push('🎯 Implement AI-powered conversion optimization');
  } else if (formData.monthlyRevenue < 50000) {
    revenue.push('📈 Focus on high-ROI marketing channels');
    revenue.push('🤖 Automate follow-up sequences to increase conversion');
  } else {
    revenue.push('🚀 Scale successful campaigns with AI optimization');
    revenue.push('💰 Implement upselling and cross-selling strategies');
  }

  // Conversion Recommendations
  if (conversionRate < 10) {
    conversion.push('🎯 Add AI chatbot for instant lead response');
    conversion.push('📧 Set up automated email nurture sequences');
  }
  if (conversionRate < 20) {
    conversion.push('🧪 Implement A/B testing for landing pages');
    conversion.push('📱 Optimize for mobile conversion');
  }

  // AI Tools Recommendations
  if (!formData.businessTools || !formData.businessTools.includes('chatbot')) {
    aiTools.push('🤖 AI Chatbot - 24/7 lead response and qualification');
  }
  if (!formData.marketingActivities || !formData.marketingActivities.includes('seo')) {
    aiTools.push('🔍 Traffic Analyst - SEO and performance tracking');
  }
  if (overallScore < 60) {
    aiTools.push('⭐ Reputation Tool - Monitor and improve online presence');
  }

  return { seo, revenue, conversion, aiTools };
}

// Determine recommended package based on score and revenue
function determineRecommendedPackage(overallScore: number, monthlyRevenue: number): string {
  if (monthlyRevenue === 0) {
    return 'lead';
  } else if (monthlyRevenue < 30000 || overallScore < 40) {
    return 'diamond';
  } else if (monthlyRevenue < 100000 || overallScore < 70) {
    return 'gold';
  } else if (monthlyRevenue < 500000) {
    return 'platinum';
  } else {
    return 'enterprise';
  }
}

// Generate action plan based on audit results
function generateActionPlan(
  _overallScore: number,
  _seoScore: number,
  _conversionRate: number
): AuditResult['actionPlan'] {
  const actionPlan: AuditResult['actionPlan'] = [
    {
      phase: 'Month 1: Foundation',
      tasks: [
        'Set up AI Chatbot for 24/7 lead response',
        'Implement lead capture forms on website',
        'Connect social media accounts',
        'Set up basic analytics tracking'
      ]
    },
    {
      phase: 'Month 2: Optimization',
      tasks: [
        'Launch SEO optimization campaign',
        'Set up automated email sequences',
        'Implement reputation monitoring',
        'A/B test landing pages'
      ]
    },
    {
      phase: 'Month 3: Scale',
      tasks: [
        'Analyze performance data',
        'Scale high-performing campaigns',
        'Add advanced AI tools',
        'Implement referral program'
      ]
    }
  ];

  return actionPlan;
}

// Calculate ROI for packages
export function calculateROI(
  currentRevenue: number,
  currentLeads: number,
  conversionRate: number,
  customerValue: number,
  isAnnual: boolean = false
): {
  projectedRevenue: number;
  revenueIncrease: number;
  annualIncrease: number;
  roiPercentage: number;
} {
  const leadImprovement = 2.5;
  const conversionImprovement = 1.8;

  const projectedLeads = currentLeads * leadImprovement;
  const projectedConversion = Math.min(conversionRate * conversionImprovement, 50);
  const projectedCustomers = projectedLeads * (projectedConversion / 100);
  const projectedRevenue = projectedCustomers * customerValue;

  const revenueIncrease = projectedRevenue - currentRevenue;
  const annualIncrease = revenueIncrease * 12;

  const monthlyCost = isAnnual ? 559 : 699;
  const annualCost = monthlyCost * 12;
  const roiPercentage = annualCost > 0 ? ((annualIncrease - annualCost) / annualCost * 100) : 0;

  return {
    projectedRevenue,
    revenueIncrease,
    annualIncrease,
    roiPercentage
  };
}

// Get score interpretation
export function getScoreInterpretation(score: number): { text: string; color: string } {
  if (score >= 80) {
    return { text: 'Excellent! Your business is well-positioned for growth.', color: 'text-warm-gold' };
  } else if (score >= 60) {
    return { text: 'Good foundation with significant improvement opportunities.', color: 'text-electric-cyan' };
  } else if (score >= 40) {
    return { text: 'Moderate performance with room for substantial growth.', color: 'text-soft-silver' };
  } else {
    return { text: 'Early stage with major growth potential through AI optimization.', color: 'text-alert-orange' };
  }
}

// Get package name by ID
export function getPackageName(id: string): string {
  const names: Record<string, string> = {
    lead: 'Lead Package',
    diamond: 'Diamond',
    gold: 'Gold',
    platinum: 'Platinum',
    enterprise: 'Enterprise'
  };
  return names[id] || id;
}

// Get package price by ID
export function getPackagePrice(id: string, isAnnual: boolean = false): string {
  if (id === 'lead') return 'Free';
  if (id === 'enterprise') return 'Custom Quote';
  
  const prices: Record<string, { monthly: number; annual: number }> = {
    diamond: { monthly: 299.99, annual: 239.99 },
    gold: { monthly: 699, annual: 559 },
    platinum: { monthly: 1499, annual: 1199 }
  };
  
  const price = prices[id];
  if (!price) return 'Custom Quote';
  
  return `R${isAnnual ? price.annual : price.monthly}`;
}

// Scroll to element smoothly
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate South African phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
