import { COMMERCIAL_PRICING } from '@/config/commercial';

export const industries = [
  { value: 'retail', label: 'Retail & eCommerce' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'property', label: 'Property & Real Estate' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'construction', label: 'Construction & Trades' },
  { value: 'finance', label: 'Financial Services' },
  { value: 'education', label: 'Education & Training' },
  { value: 'other', label: 'Other' },
] as const;

export const testimonials = [
  {
    id: 'business-visibility',
    name: 'Business Visibility',
    location: 'C6 use case',
    avatar: 'V',
    quote: 'Identify where your business is difficult to find and turn those gaps into a practical visibility plan.',
    metric: 'Visibility opportunities',
  },
  {
    id: 'lead-generation',
    name: 'Lead Generation',
    location: 'C6 use case',
    avatar: 'L',
    quote: 'Connect the audit findings to the customer acquisition workflows most relevant to the business.',
    metric: 'Lead opportunities',
  },
  {
    id: 'automation',
    name: 'Automation',
    location: 'C6 use case',
    avatar: 'A',
    quote: 'Find repetitive work that can be systemised with AI, automation and reusable business processes.',
    metric: 'Automation opportunities',
  },
] as const;

export const content = {
  pricing: COMMERCIAL_PRICING,
  industries,
  testimonials,
};

export default content;
