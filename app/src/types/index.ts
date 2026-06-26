// C6GROUP AI Business Ecosystem - Type Definitions

export interface Package {
  id: string;
  name: string;
  price: number;
  annualPrice: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}

export interface Testimonial {
  id: string;
  name: string;
  business: string;
  location: string;
  quote: string;
  metric: string;
  avatar: string;
}

export interface AuditFormData {
  companyName: string;
  industry: string;
  yearsInBusiness: string;
  employees: string;
  monthlyRevenue: number;
  websiteUrl: string;
  platforms: string[];
  marketingActivities: string[];
  leadGeneration: string;
  monthlyLeads: string;
  conversionRate: string;
  cac: number;
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
  recommendedPackage: string;
  actionPlan: {
    phase: string;
    tasks: string[];
  }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  status: 'hot' | 'warm' | 'cold' | 'customer';
  lastContact: string;
  value: number;
  initials: string;
}

export interface AnalyticsData {
  revenue: {
    dates: string[];
    values: number[];
  };
  customers: {
    sources: { name: string; value: number }[];
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

export interface ROICalculation {
  currentRevenue: number;
  currentLeads: number;
  conversionRate: number;
  customerValue: number;
  projectedRevenue: number;
  revenueIncrease: number;
  annualIncrease: number;
  roiPercentage: number;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change: string;
  icon: string;
}

export interface ActivityItem {
  id: string;
  type: 'lead' | 'payment' | 'campaign' | 'affiliate';
  title: string;
  description: string;
  time: string;
  value?: string;
}

export interface ChannelPerformance {
  name: string;
  icon: string;
  category: string;
  revenue: number;
  roi: number;
}
