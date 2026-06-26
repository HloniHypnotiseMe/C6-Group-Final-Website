import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Twitter, Facebook, Instagram, ExternalLink } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'AI Business Audit', href: '/audit' },
    { label: 'Packages & Pricing', href: '/packages' },
    { label: 'AI Tools Marketplace', href: '/ai-tools' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  company: [
    { label: 'About C6GROUP', href: '/about' },
    { label: 'Contact Us', href: 'tel:+27735558440' },
    { label: 'WhatsApp Chat', href: 'https://wa.me/27735558440' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'POPIA Compliance', href: '/popia' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/c6group' },
  { name: 'X (Twitter)', icon: Twitter, href: 'https://twitter.com/c6group' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/c6group' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/c6group' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* CTA Banner */}
      <div className="border-b border-slate-800">
        <div className="container-max py-12 section-padding">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to grow your business?</h3>
              <p className="text-slate-400">Get a free AI business audit and discover your revenue potential.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a href="https://wa.me/27735558440" target="_blank" rel="noopener noreferrer"
                className="btn-secondary bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp Us
              </a>
              <Link to="/audit" className="btn-primary">
                Start Free Audit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-max py-12 section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C6</span>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">C6GROUP</span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              AI-powered business growth solutions for South African SMEs. Trusted by 2,500+ businesses.
            </p>
            <div className="space-y-3">
              <a href="tel:+27735558440" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-emerald-500" /> 073 555 8440
              </a>
              <a href="mailto:hello@c6group.co.za" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-emerald-500" /> hello@c6group.co.za
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-500" /> South Africa
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') || link.href.startsWith('tel') || link.href.startsWith('https') ? (
                    <a href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1" target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      {link.label}
                      {link.href.startsWith('http') && <ExternalLink className="w-3 h-3" />}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} C6GROUP. All rights reserved. POPIA Compliant.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer"
                className="text-slate-500 hover:text-emerald-500 transition-colors" aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
