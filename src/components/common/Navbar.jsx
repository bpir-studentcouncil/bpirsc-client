import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, User, ShieldAlert } from 'lucide-react';
import logoImg from '../../assets/BPIR Student Council Logo.jpg';


const Navbar = () => {
  const { currentUser, logout, isDemo } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gossip / News', path: '/news' },
    { name: 'Projects', path: '/projects' },
    { name: 'Alumni', path: '/alumni' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const activeStyle = "text-accent-emerald border-b-2 border-accent-emerald px-1 py-2 text-sm font-semibold transition-all duration-300";
  const inactiveStyle = "text-gray-300 hover:text-accent-emerald hover:border-b-2 hover:border-gray-600 px-1 py-2 text-sm font-medium transition-all duration-300";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo / Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logoImg} alt="BPIRSC Logo" className="h-9 w-9 object-contain rounded-full border border-slate-700 bg-slate-900" />
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-accent-emerald to-accent-cyan bg-clip-text text-transparent">BPIRSC</span>
                  {isDemo && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded-full font-mono font-semibold">
                      Demo Mode
                    </span>
                  )}
                </span>
                <span className="text-[9px] text-gray-400 tracking-wider font-medium hidden sm:inline uppercase">Bangladesh Polytechnic Institute Rajshahi Student Council</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path}
                className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Panel */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-sm text-gray-200 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                >
                  {currentUser.profilePhoto ? (
                    <div className="h-6 w-6 rounded-full overflow-hidden border border-slate-700/50 flex-shrink-0">
                      <img src={currentUser.profilePhoto} alt={currentUser.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-accent-emerald to-accent-cyan flex items-center justify-center font-bold text-slate-900 text-xs uppercase flex-shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold border border-slate-600 px-1 py-0.2 rounded">
                    {currentUser.role}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl glass-card py-2 border border-slate-700/80 focus:outline-none animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-gray-400">Logged in as</p>
                      <p className="text-sm font-semibold text-white truncate">{currentUser.email}</p>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-200 hover:bg-slate-800/80 hover:text-white transition-colors"
                    >
                      <User className="mr-3 h-4 w-4 text-accent-emerald" />
                      View Profile
                    </Link>
                    
                    {currentUser.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-200 hover:bg-slate-800/80 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="mr-3 h-4 w-4 text-accent-emerald" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-slate-800/80 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-gradient-to-r from-accent-emerald to-accent-cyan hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-full text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-nav animate-slideIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 border-t border-slate-800">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                    isActive 
                      ? 'text-accent-emerald bg-slate-900/60 font-semibold border-l-4 border-accent-emerald' 
                      : 'text-gray-300 hover:text-accent-emerald hover:bg-slate-900/30'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            {currentUser ? (
              <div className="pt-4 border-t border-slate-800 mt-4 px-3">
                <div className="flex items-center space-x-3 mb-3">
                  {currentUser.profilePhoto ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-700/50 flex-shrink-0">
                      <img src={currentUser.profilePhoto} alt={currentUser.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-accent-emerald to-accent-cyan flex items-center justify-center font-bold text-slate-900 text-sm flex-shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-400 uppercase font-mono">{currentUser.role}</p>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center py-2.5 text-sm text-gray-300 hover:text-white"
                >
                  <User className="mr-3 h-4 w-4 text-accent-emerald" />
                  View Profile
                </Link>

                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center py-2.5 text-sm text-gray-300 hover:text-white"
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4 text-accent-emerald" />
                    Admin Dashboard
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center py-2.5 text-sm text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-800 mt-4 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold py-2.5 rounded-full text-sm transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
