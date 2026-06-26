import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Home } from '@/pages/Home';
import { Audit } from '@/pages/Audit';
import { PackagesPage } from '@/pages/Packages';
import { Dashboard } from '@/pages/Dashboard';
import { AIToolsMarketplace } from '@/pages/AIToolsMarketplace';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { TermsPage } from '@/pages/Terms';
import { PrivacyPage } from '@/pages/Privacy';
import { AboutPage } from '@/pages/About';
import { BlogPage } from '@/pages/Blog';
import { ForgotPasswordPage } from '@/pages/ForgotPassword';
import { POPIAPage } from '@/pages/POPIA';
import { CookiesPage } from '@/pages/Cookies';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-tools" element={<AIToolsMarketplace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/popia" element={<POPIAPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;
