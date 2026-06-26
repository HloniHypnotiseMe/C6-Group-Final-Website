import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Info, ArrowLeft, Target, Users, Zap, Globe } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container-max section-padding max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Info className="w-8 h-8 text-emerald-600" />
              About C6GROUP
            </h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-12">
              <p className="text-lg text-slate-600 leading-relaxed">
                C6GROUP is a South African technology company dedicated to empowering small and medium enterprises (SMEs) 
                with artificial intelligence. We believe that every South African business deserves access to world-class 
                AI tools that were previously only available to large corporations.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-50 rounded-xl p-6">
                <Target className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To democratize AI technology for South African businesses, helping them compete globally while growing locally.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <Zap className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Vision</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A South Africa where every SME has the AI tools they need to thrive in the digital economy.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <Users className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Team</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A passionate team of AI specialists, developers, and business strategists based across South Africa.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <Globe className="w-8 h-8 text-emerald-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Our Impact</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Over 2,500 South African businesses have used our platform to grow revenue and streamline operations.
                </p>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Why We Started</h2>
              <p className="text-slate-600 leading-relaxed">
                C6GROUP was founded in response to a clear gap in the market: South African SMEs were being left behind 
                in the AI revolution. While large enterprises could afford dedicated AI teams and expensive software, 
                smaller businesses lacked access to these powerful tools. We built C6GROUP to level the playing field.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">What Makes Us Different</h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Built for South Africa:</strong> Our AI is trained on local market data and understands South African business contexts.</li>
                <li><strong>Affordable Pricing:</strong> We offer transparent, competitive pricing with no hidden fees.</li>
                <li><strong>Local Support:</strong> WhatsApp and phone support from our South African team.</li>
                <li><strong>POPIA Compliant:</strong> All data handling complies with South African privacy laws.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                Have questions? We&apos;d love to hear from you. Reach out via{' '}
                <a href="https://wa.me/27735558440" className="text-emerald-600 hover:underline">WhatsApp</a>,{' '}
                <a href="tel:+27735558440" className="text-emerald-600 hover:underline">phone</a>, or{' '}
                <a href="mailto:hello@c6group.co.za" className="text-emerald-600 hover:underline">email</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
