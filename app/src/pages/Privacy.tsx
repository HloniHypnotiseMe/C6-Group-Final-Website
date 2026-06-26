import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Shield, ArrowLeft } from 'lucide-react';

export function PrivacyPage() {
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
              <Shield className="w-8 h-8 text-emerald-600" />
              Privacy Policy
            </h1>
            <p className="text-slate-500 mt-2">Last updated: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                C6GROUP (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information 
                in compliance with the Protection of Personal Information Act (POPIA) of South Africa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed">
                We collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                <li>Name, email address, and phone number</li>
                <li>Company name and industry</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-slate-600 leading-relaxed">
                We use your personal information to:
              </p>
              <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                <li>Provide and maintain our Services</li>
                <li>Process payments and manage subscriptions</li>
                <li>Communicate with you about your account and our Services</li>
                <li>Improve our AI tools and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Data Sharing and Disclosure</h2>
              <p className="text-slate-600 leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                <li>Service providers who assist us in operating our business</li>
                <li>Payment processors to complete transactions</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Data Security</h2>
              <p className="text-slate-600 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit 
                and at rest.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Your Rights (POPIA)</h2>
              <p className="text-slate-600 leading-relaxed">
                Under POPIA, you have the right to:
              </p>
              <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to the processing of your personal information</li>
                <li> Lodge a complaint with the Information Regulator</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at{' '}
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
