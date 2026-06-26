import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { BookOpen, ArrowLeft, Calendar, Clock } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'How AI is Transforming South African SMEs in 2025',
    excerpt: 'Discover how small and medium businesses across South Africa are leveraging AI to automate operations, reduce costs, and drive growth.',
    date: '15 June 2025',
    readTime: '5 min read',
    category: 'AI Trends',
    image: '/blog-ai-trends.jpg',
  },
  {
    id: 2,
    title: '5 Ways to Use AI for Better Customer Engagement',
    excerpt: 'Learn practical strategies for using AI chatbots, personalized content, and predictive analytics to keep your customers engaged.',
    date: '8 June 2025',
    readTime: '4 min read',
    category: 'Marketing',
    image: '/blog-customer-engagement.jpg',
  },
  {
    id: 3,
    title: 'POPIA Compliance: What Your Business Needs to Know',
    excerpt: 'A comprehensive guide to understanding and implementing POPIA compliance for your South African business.',
    date: '1 June 2025',
    readTime: '7 min read',
    category: 'Compliance',
    image: '/blog-popia.jpg',
  },
  {
    id: 4,
    title: 'The Future of Digital Payments in South Africa',
    excerpt: 'From instant EFT to QR code payments, explore the payment technologies shaping the future of South African commerce.',
    date: '25 May 2025',
    readTime: '6 min read',
    category: 'Fintech',
    image: '/blog-payments.jpg',
  },
];

export function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container-max section-padding">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              C6GROUP Blog
            </h1>
            <p className="text-slate-500 mt-2 max-w-xl">
              Insights, tips, and strategies for growing your South African business with AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[16/9] bg-slate-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <BookOpen className="w-12 h-12" />
                  </div>
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2 hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link to={`/blog/${post.id}`} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                    Read more &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
