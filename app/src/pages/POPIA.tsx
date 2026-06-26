import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Scale, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function POPIAPage() {
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
              <Scale className="w-8 h-8 text-emerald-600" />
              POPIA Compliance
            </h1>
            <p className="text-slate-500 mt-2">Protection of Personal Information Act</p>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Our Commitment to POPIA</h2>
              <p className="text-slate-600 leading-relaxed">
                C6GROUP is fully committed to complying with the Protection of Personal Information Act 4 of 2013 (POPIA). 
                We respect your privacy and are dedicated to protecting your personal information in accordance with South African law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Information Officer</h2>
              <p className="text-slate-600 leading-relaxed">
                Our Information Officer is responsible for ensuring POPIA compliance across our organization. 
                For any POPIA-related inquiries, please contact our Information Officer at{' '}
                <a href="mailto:popia@c6group.co.za" className="text-emerald-600 hover:underline">popia@c6group.co.za</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">POPIA Principles We Follow</h2>
              <div className="space-y-4 mt-4">
                {[
                  { title: 'Accountability', desc: 'We take full responsibility for the personal information under our control.' },
                  { title: 'Processing Limitation', desc: 'We only collect personal information for specified, explicit, and lawful purposes.' },
                  { title: 'Purpose Specification', desc: 'We clearly inform you why we need your personal information before collecting it.' },
                  { title: 'Further Processing Limitation', desc: 'We only use your information for the purposes we originally collected it for.' },
                  { title: 'Information Quality', desc: 'We take reasonable steps to ensure your personal information is accurate and up to date.' },
                  { title: 'Openness', desc: 'We maintain documentation of all processing activities and make our privacy practices transparent.' },
                  { title: 'Security Safeguards', desc: 'We implement appropriate technical and organizational measures to protect your data.' },
                  { title: 'Data Subject Participation', desc: 'You have the right to access, correct, and delete your personal information.' },
                ].map((principle) => (
                  <div key={principle.title} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-slate-900">{principle.title}</h3>
                      <p className="text-sm text-slate-600">{principle.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Your Rights Under POPIA</h2>
              <p className="text-slate-600 leading-relaxed">
                As a data subject, you have the right to:
              </p>
              <ul className="list-disc list-inside text-slate-600 mt-2 space-y-1">
                <li>Be notified that your personal information is being collected</li>
                <li>Request access to your personal information</li>
                <li>Request correction or deletion of your personal information</li>
                <li>Object to the processing of your personal information</li>
                <li>Lodge a complaint with the Information Regulator</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Contact the Information Regulator</h2>
              <p className="text-slate-600 leading-relaxed">
                If you are not satisfied with our response, you may contact the South African Information Regulator:
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mt-3 text-sm text-slate-600">
                <p><strong>Website:</strong> <a href="https://inforegulator.org.za" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">inforegulator.org.za</a></p>
                <p><strong>Email:</strong> inforeg@justice.gov.za</p>
                <p><strong>Phone:</strong> 012 406 4818</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
