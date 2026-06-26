import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { aiTools as staticAiTools } from '@/data/aiTools';
import { aiToolsApi } from '@/services/api';
import {
  Search, Sparkles, TrendingUp, Zap, ArrowRight,
  Loader2, AlertTriangle, Bot, Palette, Globe, ShoppingCart,
  BarChart3, Briefcase, Code, Cpu, FileText, Megaphone, PenTool
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  content: FileText, marketing: Megaphone, sales: ShoppingCart,
  design: Palette, development: Code, productivity: Briefcase,
  analytics: BarChart3, support: Bot, seo: Globe,
  social: TrendingUp, ecommerce: ShoppingCart, automation: Cpu,
  writing: PenTool,
};

const categories = [
  { id: 'all', label: 'All Tools' },
  { id: 'content', label: 'Content' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Sales' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'design', label: 'Design' },
  { id: 'support', label: 'Support' },
];

export function AIToolsMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState(staticAiTools);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchTools() {
      try {
        setIsLoading(true);
        const response = await aiToolsApi.getAll({ limit: 100 });
        if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
          const mapped = response.data.map((t: any) => ({
            id: t.id, name: t.name, description: t.description,
            category: t.category, icon: t.icon || 'zap',
            tags: t.tags || [], popular: t.popular || false,
            featured: t.featured || false, new: t.new || false,
          }));
          if (!cancelled) setTools(mapped);
        }
      } catch (err: any) {
        if (!cancelled) {
          setApiError('Showing cached tools');
          setTools(staticAiTools);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchTools();
    return () => { cancelled = true; };
  }, []);

  const filtered = tools.filter((tool) => {
    const matchCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = tools.filter((t) => t.featured).slice(0, 3);
  const popular = tools.filter((t) => t.popular).slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-24 pb-20">
        {/* Header */}
        <div className="container-max section-padding mb-12">
          <div className="max-w-2xl">
            <span className="eyebrow mb-3 inline-block">AI Tools</span>
            <h1 className="mb-4">AI Tools Marketplace</h1>
            <p className="text-slate-600 text-lg">
              100+ specialised AI tools to automate, optimise, and grow your South African business.
            </p>
          </div>
        </div>

        {/* Featured Tools */}
        {featured.length > 0 && (
          <div className="container-max section-padding mb-16">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Featured Tools
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((tool) => {
                const Icon = categoryIcons[tool.category] || Zap;
                return (
                  <div key={tool.id} className="card-clean group cursor-pointer hover:border-emerald-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      {tool.new && <span className="badge-emerald text-[10px]">NEW</span>}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
                    <span className="inline-flex items-center text-sm font-medium text-emerald-600">
                      Try Now <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="container-max section-padding mb-8">
          {apiError && (
            <div className="mb-4 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-4 py-2 w-fit">
              <AlertTriangle className="w-3.5 h-3.5" /> {apiError}
            </div>
          )}
          {isLoading && (
            <div className="mb-4 flex items-center gap-2 text-xs text-emerald-600">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading tools...
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text" placeholder="Search AI tools..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input-clean pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >{cat.label}</button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="container-max section-padding">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tool) => {
              const Icon = categoryIcons[tool.category] || Zap;
              return (
                <div key={tool.id} className="card-clean group hover:border-emerald-300 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex gap-1">
                      {tool.popular && <TrendingUp className="w-3.5 h-3.5 text-amber-500" />}
                      {tool.new && <span className="badge-emerald text-[9px] px-1.5 py-0">NEW</span>}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{tool.description}</p>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No tools found</p>
              <p className="text-sm text-slate-400">Try a different search or category</p>
            </div>
          )}
        </div>

        {/* Popular Section */}
        {popular.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="container-max section-padding mt-16">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Popular Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map((tool) => {
                const Icon = categoryIcons[tool.category] || Zap;
                return (
                  <div key={tool.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
