import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FileText, ArrowLeft } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container-max section-padding max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-600" />
              Terms of Service
            </h1>
            <p className="text-slate-500 mt-2">Last updated: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing and using C6GROUP&apos;s website, services, and AI tools (collectively, the &ldquo;Services&rdquo;), 
                you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Description of Services</h2>
              <p className="text-slate-600 leading-relaxed">
                C6GROUP provides AI-powered business growth solutions for South African SMEs, including but not limited to:
                AI business audits, content generation tools, marketing automation, SEO analytics, and business intelligence dashboards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Account Registration</h2>
              <p className="text-slate-600 leading-relaxed">
                To access certain features, you must register for an account. You agree to provide accurate and complete information 
                and to keep this information updated. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Subscription and Payments</h2>
              <p className="text-slate-600 leading-relaxed">
                Some Services require payment of fees. All payments are processed securely through our payment partners. 
                Subscription fees are billed in advance on a monthly or annual basis. You may cancel your subscription at any time, 
                and access will continue until the end of the current billing period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Acceptable Use</h2>
              <p className="text-slate-600 leading-relaxed">
                You agree not to use the Services for any unlawful purpose or in any way that could damage, disable, or impair 
                our systems. You may not attempt to gain unauthorized access to any part of the Services or systems connected to them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed">
                All content, software, and technology provided by C6GROUP are protected by intellectual property laws. 
                You are granted a limited, non-exclusive license to use the Services for your internal business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                To the maximum extent permitted by law, C6GROUP shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising from your use of the Services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Governing Law</h2>
              <p className="text-slate-600 leading-relaxed">
                These terms are governed by the laws of the Republic of South Africa. Any disputes shall be subject to the 
                exclusive jurisdiction of the South African courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                For any questions regarding these Terms of Service, please contact us at{' '}
                <a href="mailto:hello@c6group.co.za" className="text-emerald-600 hover:underline">hello@c6group.co.za</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
