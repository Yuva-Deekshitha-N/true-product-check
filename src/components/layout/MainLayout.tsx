
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Barcode, Home, Package, Shield, LogOut, LogIn, Menu, X, AlertTriangle, Database, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import ConnectWalletButton from '../wallet/ConnectWalletButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/verify', label: 'Verify Product', icon: Shield },
  ];

  const authNavItems = user?.role === 'admin' 
    ? [
        { path: '/admin/products', label: 'Products', icon: Package },
        { path: '/admin/reports', label: 'Fake Reports', icon: AlertTriangle },
      ]
    : [
        { path: '/scan', label: 'Scan Product', icon: Barcode },
        { path: '/report', label: 'Report Fake', icon: AlertTriangle },
      ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-algorand-blue" />
              <span className="text-2xl font-bold bg-gradient-to-r from-algorand-blue to-algorand-teal bg-clip-text text-transparent">
                Authentico
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-1 text-sm font-medium hover:text-algorand-teal transition-colors",
                    isActiveLink(item.path) ? "text-algorand-teal" : "text-gray-600"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {isAuthenticated && authNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-1 text-sm font-medium hover:text-algorand-teal transition-colors",
                    isActiveLink(item.path) ? "text-algorand-teal" : "text-gray-600"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <ConnectWalletButton />
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-algorand-blue" />
                    <span className="font-medium text-gray-700">{user?.name}</span>
                    <span className="bg-algorand-blue/10 text-algorand-blue px-2 py-0.5 rounded text-xs">
                      {user?.role}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-1"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-algorand-teal focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-3 pb-3">
              {/* Add Connect Wallet button to mobile menu */}
              <div className="px-3 py-2">
                <ConnectWalletButton />
              </div>
              
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md",
                    isActiveLink(item.path) 
                      ? "bg-algorand-teal/10 text-algorand-teal" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {isAuthenticated && authNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md",
                    isActiveLink(item.path) 
                      ? "bg-algorand-teal/10 text-algorand-teal" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="pt-2 border-t">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-700">
                      <User className="inline-block h-4 w-4 mr-2" />
                      <span className="font-medium">{user?.name}</span>
                      <span className="ml-2 bg-algorand-blue/10 text-algorand-blue px-2 py-0.5 rounded text-xs">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 px-3">
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                    <Button
                      className="w-full justify-center"
                      onClick={() => {
                        navigate('/register');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-algorand-blue" />
                <span className="text-xl font-bold bg-gradient-to-r from-algorand-blue to-algorand-teal bg-clip-text text-transparent">
                  Authentico
                </span>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Secure, decentralized product authentication using Algorand blockchain technology
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-gray-600 hover:text-algorand-teal">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-algorand-teal">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect With Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about our product verification system?
              </p>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
            <p>&copy; 2025 Authentico. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
