import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, User, LogOut, LayoutDashboard, Loader2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'AI Audit', href: '/audit' },
  { label: 'Packages', href: '/packages' },
  { label: 'AI Tools', href: '/ai-tools' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
        : 'bg-white border-b border-transparent'
    )}>
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C6</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">C6GROUP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive(item.href) ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            ) : isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50"
                >
                  <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.firstName}</span>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-sm text-slate-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full capitalize font-medium">
                          {user.packageType}
                        </span>
                      </div>
                      <Link to="/dashboard" className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 mr-3 text-slate-400" /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href}
                  className={cn('px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    isActive(item.href) ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-100 mt-3 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                      <LayoutDashboard className="w-4 h-4 mr-3 text-slate-400" /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                      <LogOut className="w-4 h-4 mr-3" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
                      <LogIn className="w-4 h-4 mr-3" /> Sign In
                    </Link>
                    <Link to="/register" className="flex items-center px-3 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg">
                      <User className="w-4 h-4 mr-3" /> Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
