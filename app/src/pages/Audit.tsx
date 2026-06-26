import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { calculateAuditResults } from '@/lib/utils';
import { aiApi } from '@/services/api';
import { toast } from 'sonner';
import {
  ChevronRight, ChevronLeft, Loader2, CheckCircle2,
  Building2, Target, Wrench, Globe, ArrowRight, RotateCcw,
  AlertTriangle, Lightbulb, Rocket
} from 'lucide-react';

interface FormData {
  companyName: string; industry: string; yearsInBusiness: string;
  employees: string; monthlyRevenue: string; websiteUrl: string;
  platforms: string[]; marketingActivities: string[];
  leadGeneration: string; monthlyLeads: string; conversionRate: string;
  cac: string; challenges: string[]; paymentSystems: string[];
  businessTools: string[]; techChallenge: string;
}

const INITIAL: FormData = {
  companyName: '', industry: '', yearsInBusiness: '', employees: '',
  monthlyRevenue: '', websiteUrl: '', platforms: [], marketingActivities: [],
  leadGeneration: '', monthlyLeads: '', conversionRate: '', cac: '',
  challenges: [], paymentSystems: [], businessTools: [], techChallenge: '',
};

const INDUSTRIES = [
  'Retail & E-commerce', 'Professional Services', 'Hospitality & Tourism',
  'Healthcare & Wellness', 'Education & Training', 'Technology & Software',
  'Manufacturing', 'Construction & Real Estate', 'Agriculture',
  'Creative & Media', 'Food & Beverage', 'Transportation & Logistics',
  'Financial Services', 'Other',
];

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
      <div
        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  );
}

export function Audit() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 5;

  const update = (field: string, value: any) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const toggleArray = (field: string, value: string) => {
    setFormData((p) => {
      const arr = p[field as keyof FormData] as string[];
      return { ...p, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!formData.companyName.trim()) e.companyName = 'Company name is required';
      if (!formData.industry) e.industry = 'Select an industry';
      if (!formData.monthlyRevenue) e.monthlyRevenue = 'Enter monthly revenue';
    }
    if (step === 2) {
      if (!formData.websiteUrl && formData.platforms.length === 0) {
        e.websiteUrl = 'Enter a website or select at least one platform';
      }
    }
    if (step === 3) {
      if (!formData.leadGeneration) e.leadGeneration = 'Select lead generation method';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const generateReport = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);

    try {
      const response = await aiApi.runAudit({
        companyName: formData.companyName,
        industry: formData.industry,
        yearsInBusiness: formData.yearsInBusiness,
        employees: formData.employees,
        monthlyRevenue: formData.monthlyRevenue,
        websiteUrl: formData.websiteUrl,
        socialPlatforms: formData.platforms,
        marketingActivities: formData.marketingActivities,
        leadGeneration: formData.leadGeneration,
        monthlyLeads: formData.monthlyLeads,
        conversionRate: formData.conversionRate,
        cac: formData.cac,
        challenges: formData.challenges,
        paymentSystems: formData.paymentSystems,
        businessTools: formData.businessTools,
        techChallenge: formData.techChallenge,
      });

      if (response.success && response.data) {
        const d = response.data as any;
        setResult({
          overallScore: d.overallScore || d.overall_score || 72,
          seoScore: d.seoScore || d.seo_score || 65,
          currentRevenue: formData.monthlyRevenue || 0,
          potentialRevenue: d.revenueAnalysis?.potentialMonthlyRevenue || Number(formData.monthlyRevenue) * 1.8 || 50000,
          revenueGap: d.revenueAnalysis?.revenueGap || 20000,
          conversionRate: parseFloat(formData.conversionRate) || 8,
          potentialConversion: d.potentialConversion || 20,
          recommendations: {
            seo: Array.isArray(d.recommendations?.immediate) ? d.recommendations.immediate.slice(0, 3).map((r: any) => r.action || r) : ['Optimize website meta descriptions', 'Add alt text to all images', 'Submit XML sitemap to Google'],
            revenue: Array.isArray(d.recommendations?.shortTerm) ? d.recommendations.shortTerm.slice(0, 3).map((r: any) => r.action || r) : ['Implement abandoned cart recovery', 'Launch email marketing campaigns', 'Add upsell offers'],
            conversion: ['Add social proof and testimonials', 'Simplify checkout process', 'Add live chat support'],
            aiTools: d.aiToolsRecommended || ['AI Chatbot', 'SEO Analyzer', 'Email Assistant'],
          },
          recommendedPackage: (d.recommendedPackage || 'gold').toLowerCase(),
          actionPlan: Array.isArray(d.recommendations?.immediate) ? [
            { phase: 'Immediate Actions (Week 1-2)', tasks: d.recommendations.immediate.slice(0, 3).map((r: any) => r.action || r) },
            { phase: 'Short Term (Month 1-3)', tasks: d.recommendations.shortTerm?.slice(0, 3).map((r: any) => r.action || r) || ['Optimize website conversion', 'Set up marketing automation'] },
            { phase: 'Long Term (3-12 Months)', tasks: d.recommendations.longTerm?.slice(0, 3).map((r: any) => r.action || r) || ['Expand product offerings', 'Build referral program'] },
          ] : [
            { phase: 'Immediate Actions (Week 1-2)', tasks: ['Set up AI chatbot', 'Optimize website for mobile', 'Add clear CTAs'] },
            { phase: 'Short Term (Month 1-3)', tasks: ['Launch email marketing automation', 'Implement SEO improvements', 'Set up retargeting ads'] },
            { phase: 'Long Term (3-12 Months)', tasks: ['Expand to new market segments', 'Build customer loyalty program', 'Implement advanced analytics'] },
          ],
        });
        toast.success('AI Business Audit Complete!');
      } else throw new Error(response.error || 'Audit failed');
    } catch (err: any) {
      console.log('API unavailable, using local engine:', err.message);
      await new Promise((r) => setTimeout(r, 1200));
      setResult(calculateAuditResults(formData as any));
      toast.info('Audit completed using local engine');
    }

    setShowResults(true);
    setIsSubmitting(false);
  };

  const reset = () => { setStep(1); setFormData(INITIAL); setShowResults(false); setResult(null); setErrors({}); };

  if (showResults && result) return <AuditResult result={result} onReset={reset} />;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container-max section-padding">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <span className="eyebrow mb-3 inline-block">Free AI Audit</span>
              <h1 className="mb-3">AI Business Audit</h1>
              <p className="text-slate-600">Answer a few questions and get your personalised growth report.</p>
            </div>

            <ProgressBar step={step} total={totalSteps} />

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i + 1 === step ? 'bg-emerald-600 text-white' :
                  i + 1 < step ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {i + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
              {step === 1 && <Step1Business formData={formData} update={update} toggleArray={toggleArray} errors={errors} />}
              {step === 2 && <Step2Online formData={formData} update={update} toggleArray={toggleArray} errors={errors} />}
              {step === 3 && <Step3Sales formData={formData} update={update} errors={errors} />}
              {step === 4 && <Step4Challenges formData={formData} update={update} toggleArray={toggleArray} />}
              {step === 5 && <Step5Tech formData={formData} update={update} toggleArray={toggleArray} />}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                {step < totalSteps ? (
                  <Button onClick={() => { if (validateStep()) setStep((s) => s + 1); }} className="btn-primary">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={generateReport} disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analysing...</> : <>
                      Generate Report <ArrowRight className="w-4 h-4 ml-2" />
                    </>}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ── Step Components ── */
function Step1Business({ formData, update, errors }: any) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-emerald-600" /> Tell Us About Your Business
      </h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name *</label>
        <input type="text" value={formData.companyName} onChange={(e) => update('companyName', e.target.value)}
          className={`input-clean ${errors.companyName ? 'border-red-300 ring-2 ring-red-100' : ''}`} placeholder="e.g. Acme Trading" />
        {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry *</label>
        <select value={formData.industry} onChange={(e) => update('industry', e.target.value)}
          className={`input-clean ${errors.industry ? 'border-red-300 ring-2 ring-red-100' : ''}`}>
          <option value="">Select your industry</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Years in Business</label>
          <select value={formData.yearsInBusiness} onChange={(e) => update('yearsInBusiness', e.target.value)} className="input-clean">
            <option value="">Select</option>
            {['< 1 year', '1-2 years', '3-5 years', '6-10 years', '10+ years'].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Employees</label>
          <select value={formData.employees} onChange={(e) => update('employees', e.target.value)} className="input-clean">
            <option value="">Select</option>
            {['Just me', '2-5', '6-10', '11-25', '26-50', '50+'].map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Revenue (ZAR) *</label>
        <input type="number" value={formData.monthlyRevenue} onChange={(e) => update('monthlyRevenue', e.target.value)}
          className={`input-clean ${errors.monthlyRevenue ? 'border-red-300 ring-2 ring-red-100' : ''}`} placeholder="e.g. 50000" />
        {errors.monthlyRevenue && <p className="text-red-500 text-xs mt-1">{errors.monthlyRevenue}</p>}
      </div>
    </div>
  );
}

function Step2Online({ formData, update, toggleArray, errors }: any) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <Globe className="w-5 h-5 text-emerald-600" /> Your Online Presence
      </h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Website URL</label>
        <input type="url" value={formData.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)}
          className={`input-clean ${errors.websiteUrl ? 'border-red-300 ring-2 ring-red-100' : ''}`} placeholder="https://yourcompany.co.za" />
        {errors.websiteUrl && <p className="text-red-500 text-xs mt-1">{errors.websiteUrl}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Social Media Platforms</label>
        <div className="grid grid-cols-2 gap-2">
          {['Facebook', 'Instagram', 'LinkedIn', 'Twitter/X', 'TikTok', 'YouTube', 'Google Business', 'None'].map((p) => (
            <button key={p} onClick={() => toggleArray('platforms', p)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all text-left ${
                formData.platforms.includes(p)
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>{p}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Current Marketing Activities</label>
        <div className="flex flex-wrap gap-2">
          {['Social Media', 'Email Marketing', 'SEO', 'Paid Ads', 'Content Marketing', 'Referrals', 'None'].map((a) => (
            <button key={a} onClick={() => toggleArray('marketingActivities', a)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                formData.marketingActivities.includes(a)
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3Sales({ formData, update, errors }: any) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <Target className="w-5 h-5 text-emerald-600" /> Sales &amp; Customers
      </h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Lead Source *</label>
        <select value={formData.leadGeneration} onChange={(e) => update('leadGeneration', e.target.value)}
          className={`input-clean ${errors.leadGeneration ? 'border-red-300 ring-2 ring-red-100' : ''}`}>
          <option value="">Select</option>
          {['Word of mouth / Referrals', 'Social media', 'Google search / SEO', 'Paid advertising', 'Walk-ins', 'Cold outreach', 'Online marketplaces', 'Other'].map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        {errors.leadGeneration && <p className="text-red-500 text-xs mt-1">{errors.leadGeneration}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Leads</label>
          <input type="number" value={formData.monthlyLeads} onChange={(e) => update('monthlyLeads', e.target.value)} className="input-clean" placeholder="e.g. 20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Conversion Rate (%)</label>
          <input type="number" value={formData.conversionRate} onChange={(e) => update('conversionRate', e.target.value)} className="input-clean" placeholder="e.g. 8" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Customer Acquisition Cost (ZAR)</label>
        <input type="number" value={formData.cac} onChange={(e) => update('cac', e.target.value)} className="input-clean" placeholder="e.g. 500" />
      </div>
    </div>
  );
}

function Step4Challenges({ formData, toggleArray }: any) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-emerald-600" /> Business Challenges
      </h2>
      <p className="text-sm text-slate-600">Select all that apply to your business.</p>
      <div className="grid grid-cols-1 gap-2">
        {[
          ['Getting new customers', 'Megaphone'],
          ['Managing cash flow', 'CreditCard'],
          ['Building online presence', 'Globe'],
          ['Competing with larger businesses', 'Users'],
          ['Finding skilled staff', 'Users'],
          ['Managing time effectively', 'Clock'],
          ['Marketing on a budget', 'TrendingUp'],
          ['Customer retention', 'MessageSquare'],
          ['Technology adoption', 'Wrench'],
          ['Regulatory compliance', 'Shield'],
        ].map(([label]) => (
          <button key={label} onClick={() => toggleArray('challenges', label)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
              formData.challenges.includes(label)
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}>
            <CheckCircle2 className={`w-5 h-5 shrink-0 ${formData.challenges.includes(label) ? 'text-emerald-500' : 'text-slate-300'}`} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Step5Tech({ formData, update, toggleArray }: any) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <Wrench className="w-5 h-5 text-emerald-600" /> Technology &amp; Tools
      </h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Payment Systems</label>
        <div className="flex flex-wrap gap-2">
          {['Cash only', 'EFT / Bank transfer', 'Card machine', 'SnapScan', 'Zapper', 'PayFast', 'Yoco', 'None'].map((s) => (
            <button key={s} onClick={() => toggleArray('paymentSystems', s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                formData.paymentSystems.includes(s)
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Biggest Technology Challenge</label>
        <textarea value={formData.techChallenge} onChange={(e) => update('techChallenge', e.target.value)}
          className="input-clean min-h-[100px] resize-none" placeholder="Tell us about your biggest tech challenge..." />
      </div>
    </div>
  );
}

/* ── Results ── */
function AuditResult({ result, onReset }: { result: any; onReset: () => void }) {
  const scoreColor = result.overallScore >= 80 ? 'text-emerald-600' : result.overallScore >= 60 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = result.overallScore >= 80 ? 'bg-emerald-50' : result.overallScore >= 60 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container-max section-padding">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <span className="eyebrow mb-3 inline-block">Audit Complete</span>
              <h1 className="mb-3">Your AI Business Audit Results</h1>
              <p className="text-slate-600">Personalised growth analysis and actionable recommendations.</p>
            </div>

            {/* Score Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <div className={`${scoreBg} rounded-xl p-6 text-center`}>
                <p className="text-sm text-slate-500 mb-1">Overall Score</p>
                <p className={`text-5xl font-bold ${scoreColor}`}>{result.overallScore}</p>
                <p className="text-xs text-slate-400 mt-1">out of 100</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-500 mb-1">Current Revenue</p>
                <p className="text-2xl font-bold text-slate-900">R{Number(result.currentRevenue).toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-1">per month</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-6 text-center">
                <p className="text-sm text-slate-500 mb-1">Potential Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">R{Number(result.potentialRevenue).toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">+R{Number(result.revenueGap).toLocaleString()} /mo</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-6 mb-10">
              <div className="card-clean">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Key Recommendations</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Revenue Growth</h4>
                    <ul className="space-y-2">
                      {result.recommendations.revenue.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Conversion Optimisation</h4>
                    <ul className="space-y-2">
                      {result.recommendations.conversion.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="card-clean">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Your Action Plan</h3>
                </div>
                <div className="space-y-4">
                  {result.actionPlan.map((phase: any, i: number) => (
                    <div key={i} className="border-l-2 border-emerald-200 pl-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">{phase.phase}</h4>
                      <ul className="space-y-1">
                        {phase.tasks.map((task: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                            <ChevronRight className="w-3 h-3 text-emerald-500 shrink-0 mt-1" /> {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Package */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Recommended Package: <span className="text-emerald-400 capitalize">{result.recommendedPackage}</span></h3>
                <p className="text-slate-300 text-sm mb-4">
                  Based on your audit, the {result.recommendedPackage} package provides the AI tools and support you need to achieve your growth targets.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/packages" className="btn-primary bg-emerald-600 hover:bg-emerald-500 inline-flex">
                    View Packages <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <button onClick={onReset} className="btn-secondary bg-slate-800 border-slate-700 text-white hover:bg-slate-700 inline-flex">
                    <RotateCcw className="mr-2 w-4 h-4" /> Start New Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
