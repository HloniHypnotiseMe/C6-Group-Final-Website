import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Cookie, ArrowLeft, Settings, X } from 'lucide-react';
import { useState } from 'react';

export function CookiesPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

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
              <Cookie className="w-8 h-8 text-emerald-600" />
              Cookie Policy
            </h1>
            <p className="text-slate-500 mt-2">Last updated: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">What Are Cookies?</h2>
              <p className="text-slate-600 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, 
                analyzing how you use our site, and enabling certain functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">How We Use Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                C6GROUP uses cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                <li><strong>Essential cookies:</strong> Required for the website to function properly (e.g., login sessions, security).</li>
                <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website.</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences for future visits.</li>
                <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements and measure their effectiveness.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Cookie Preferences</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You can manage your cookie preferences below. Essential cookies cannot be disabled as they are necessary for the website to function.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-slate-900">Essential Cookies</h3>
                      <p className="text-sm text-slate-600">Required for the website to function. Cannot be disabled.</p>
                    </div>
                  </div>
                  <input type="checkbox" checked disabled className="w-5 h-5 text-emerald-600 rounded" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-slate-900">Analytics Cookies</h3>
                      <p className="text-sm text-slate-600">Help us improve our website by collecting usage data.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
                    className="w-5 h-5 text-emerald-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-slate-900">Marketing Cookies</h3>
                      <p className="text-sm text-slate-600">Used to deliver personalized advertisements.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
                    className="w-5 h-5 text-emerald-600 rounded"
                  />
                </div>
              </div>

              <button 
                onClick={() => alert('Cookie preferences saved!')}
                className="mt-6 btn-primary"
              >
                Save Preferences
              </button>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Managing Cookies in Your Browser</h2>
              <p className="text-slate-600 leading-relaxed">
                You can also control cookies through your browser settings. Most browsers allow you to block or delete cookies. 
                Please note that disabling cookies may affect the functionality of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about our Cookie Policy, please contact us at{' '}
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
