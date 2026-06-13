import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, User, CheckCircle2, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import logoImg from '../assets/BPIR Student Council Logo.jpg';


const Login = () => {
  const { login, register: authRegister, loginWithGoogle, forgotPassword, currentUser, isDemo } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // React Hook Form initialization
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm({
    defaultValues: { name: '', email: '', password: '' }
  });

  useEffect(() => {
    if (currentUser) navigate(from, { replace: true });
  }, [currentUser, navigate, from]);

  // Reset when switching tabs
  useEffect(() => {
    reset();
    setError('');
    setSuccess('');
    setShowForgot(false);
    setForgotEmail('');
  }, [isLoginTab, reset]);

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isLoginTab) {
        await login(data.email, data.password);
        setSuccess('Logged in successfully!');
        setTimeout(() => navigate(from, { replace: true }), 800);
      } else {
        await authRegister(data.email, data.password, data.name);
        setSuccess('Account created successfully!');
        setTimeout(() => navigate(from, { replace: true }), 800);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (mockEmail) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      setValue('email', mockEmail);
      setValue('password', 'password123');
      await login(mockEmail, 'password123');
      setSuccess(`Quick logged in as ${mockEmail.split('@')[0]}!`);
      setTimeout(() => navigate(from, { replace: true }), 800);
    } catch (err) {
      setError('Mock login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccess('Google Authentication successful!');
      setTimeout(() => navigate(from, { replace: true }), 800);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setError('');
    setSuccess('');
    try {
      await forgotPassword(forgotEmail.trim());
      setSuccess('Password reset email sent! Please check your inbox (and spam folder).');
    } catch (err) {
      if (err.message === 'DEMO_MODE') {
        // In demo mode, the UI panel already shows the info — do nothing
        return;
      }
      setError(err.message || 'Failed to send reset email. Please verify the email address.');
    } finally {
      setForgotLoading(false);
    }
  };

  const openForgot = () => {
    setShowForgot(true);
    setError('');
    setSuccess('');
    setForgotEmail('');
  };

  const closeForgot = () => {
    setShowForgot(false);
    setError('');
    setSuccess('');
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col justify-center items-center px-4 bg-primary-dark">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800">
        
        {/* Logo and Greeting */}
        <div className="text-center mb-8 flex flex-col items-center justify-center gap-3">
          <img src={logoImg} alt="BPIRSC Logo" className="h-16 w-16 object-contain rounded-full border border-slate-700 shadow-lg bg-slate-900" />
          <span className="text-3xl font-bold tracking-tight text-gradient-glow">BPIRSC Portal</span>
          <p className="text-xs text-gray-400 mt-1.5">
            {showForgot
              ? 'Reset your account password via email'
              : isLoginTab
                ? 'Sign in to access your student/council dashboard'
                : 'Join the Bangladesh Polytechnic Institute Rajshahi Student Council community'}
          </p>
        </div>

        {/* ─── FORGOT PASSWORD PANEL ─── */}
        {showForgot && (
          <div className="animate-fadeIn">
            {/* Back button header */}
            <div className="flex items-center gap-2 mb-6">
              <button
                type="button"
                onClick={closeForgot}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-accent-cyan" />
                Forgot Password
              </span>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 text-xs leading-relaxed animate-fadeIn">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Demo mode — can't send real emails */}
            {isDemo ? (
              <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-5 text-xs leading-relaxed space-y-3">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5" />
                  Demo Mode Active
                </p>
                <p className="text-gray-400 font-light">
                  Password reset emails require real Firebase Authentication credentials.
                  In Demo Mode, use the quick-login buttons to access any account instantly.
                </p>
                <div className="border-t border-amber-700/20 pt-3 font-mono text-[10px] space-y-1 text-gray-500">
                  <p><span className="text-amber-300">admin@bpirsc.org</span> — Admin access</p>
                  <p><span className="text-amber-300">student@bpirsc.org</span> — Student access</p>
                  <p><span className="text-amber-300">alumni@bpirsc.org</span> — Alumni access</p>
                </div>
                <button
                  type="button"
                  onClick={closeForgot}
                  className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:border-accent-emerald text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 group mt-2"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                  Go to Login
                </button>
              </div>
            ) : (
              /* Firebase mode — send real reset email */
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {/* Email input — hidden once reset email is sent */}
                {!success && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="Your account email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        autoFocus
                        className="w-full bg-slate-900/80 border border-slate-800 focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan text-sm text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Send button — hidden after success */}
                {!success && (
                  <>
                    <button
                      type="submit"
                      disabled={forgotLoading || !forgotEmail.trim()}
                      className="w-full py-3 bg-gradient-to-r from-accent-cyan to-accent-emerald text-slate-950 font-bold rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? (
                        <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4" />
                          <span>Send Reset Link</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                      A secure password reset link will be sent to your registered email address.
                      The link expires after 1 hour.
                    </p>
                  </>
                )}

                {/* Go to Login button — always visible */}
                <button
                  type="button"
                  onClick={closeForgot}
                  className="w-full py-3 bg-slate-900 border border-slate-800 hover:border-accent-emerald text-white text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                  Go to Login
                </button>
              </form>
            )}
          </div>
        )}

        {/* ─── NORMAL LOGIN / REGISTER PANEL ─── */}
        {!showForgot && (
          <>
            {/* Auth Mode Tabs */}
            <div className="flex border-b border-slate-800 mb-6">
              <button
                onClick={() => setIsLoginTab(true)}
                className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  isLoginTab 
                    ? 'text-accent-emerald border-accent-emerald' 
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLoginTab(false)}
                className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  !isLoginTab 
                    ? 'text-accent-emerald border-accent-emerald' 
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Status Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 text-xs leading-relaxed animate-fadeIn">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
                {success}
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLoginTab && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      {...register('name', { 
                        required: !isLoginTab ? 'Full Name is required' : false,
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      className={`w-full bg-slate-900/80 border ${
                        errors.name ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-accent-emerald'
                      } focus:ring-1 focus:ring-accent-emerald text-sm text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all`}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-red-400 text-[10px] mt-1 block pl-2 font-mono">{errors.name.message}</span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Your Email"
                    {...register('email', { 
                      required: 'Email Address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`w-full bg-slate-900/80 border ${
                      errors.email ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-accent-emerald'
                    } focus:ring-1 focus:ring-accent-emerald text-sm text-white rounded-xl py-3 pl-10 pr-4 outline-none transition-all`}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-400 text-[10px] mt-1 block pl-2 font-mono">{errors.email.message}</span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                  {/* Forgot Password link — only on Sign In */}
                  {isLoginTab && (
                    <button
                      type="button"
                      onClick={openForgot}
                      className="text-[11px] text-accent-cyan hover:text-white transition-colors cursor-pointer font-medium"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your Password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className={`w-full bg-slate-900/80 border ${
                      errors.password ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-accent-emerald'
                    } focus:ring-1 focus:ring-accent-emerald text-sm text-white rounded-xl py-3 pl-10 pr-10 outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-400 text-[10px] mt-1 block pl-2 font-mono">{errors.password.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-accent-emerald to-accent-cyan text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-emerald-500/10 hover:from-emerald-400 hover:to-cyan-400 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  <span>{isLoginTab ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Quick Demo Login Layer */}
            {isDemo && isLoginTab && (
              <div className="mt-8 border-t border-slate-800/80 pt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Quick Demo Access (1-Click)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickLogin('admin@bpirsc.org')}
                    className="text-[10px] py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-accent-emerald rounded-lg font-bold text-gray-300 transition-all cursor-pointer"
                  >
                    Admin Profile
                  </button>
                  <button
                    onClick={() => handleQuickLogin('student@bpirsc.org')}
                    className="text-[10px] py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-accent-emerald rounded-lg font-bold text-gray-300 transition-all cursor-pointer"
                  >
                    Student Profile
                  </button>
                  <button
                    onClick={() => handleQuickLogin('alumni@bpirsc.org')}
                    className="text-[10px] py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-accent-emerald rounded-lg font-bold text-gray-300 transition-all cursor-pointer"
                  >
                    Alumni Profile
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-center">
                  Testing credentials are mock synced instantly in local storage database.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
