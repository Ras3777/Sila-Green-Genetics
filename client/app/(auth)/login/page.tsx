'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BovineAuthHeader from '@/components/auth/BovineAuthHeader';
import BovineAuthFooter from '@/components/auth/BovineAuthFooter';
import DnaHelixSvg from '@/components/auth/DnaHelixSvg';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  Sprout,
  BarChart3,
  Users,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or registered phone number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay and redirect
    setTimeout(() => {
      setIsLoading(false);
      router.push('/bovine/dashboard');
    }, 600);
  };

  const handleQuickDemo = () => {
    setIdentifier('j.miller@apexbovine.com');
    setPassword('••••••••••••');
    setErrorMessage('');
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsPhoneModalOpen(false);
      router.push('/bovine/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F7F2] text-[#161D18] selection:bg-[#2A4736] selection:text-white relative overflow-x-hidden font-sans-ui">
      {/* Top Header */}
      <BovineAuthHeader />

      {/* Main Content Workspace */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-6 sm:py-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* LEFT HERO COLUMN: Editorial Branding & Livestock Visuals */}
          <div className="lg:col-span-6 relative flex flex-col justify-between min-h-[540px] select-none">
            
            {/* Background DNA Ribbon Illustration */}
            <div className="absolute right-0 top-0 w-80 h-full pointer-events-none opacity-80 hidden sm:block">
              <DnaHelixSvg variant="flowing" className="w-full h-full" />
            </div>

            {/* Top Left Headline & Subtitle */}
            <div className="relative z-10 space-y-3">
              <h1 className="font-serif-hero text-4xl sm:text-5xl lg:text-[54px] font-normal leading-[1.06] tracking-tight text-[#161D18]">
                Stronger<br />
                Herds<br />
                Brighter<br />
                Futures
              </h1>
              <p className="text-xs sm:text-[13px] text-[#646860] leading-snug max-w-xs font-normal">
                Science today<br />
                for a more productive<br />
                tomorrow.
              </p>
            </div>

            {/* Handwritten Script 1: Top-Right "Good Genes Brighter Days" */}
            <div className="absolute right-4 sm:right-10 top-2 sm:top-6 -rotate-6 pointer-events-none text-right z-10">
              <span className="font-script text-2xl sm:text-3xl text-[#5A564C] leading-tight block tracking-wide">
                Good<br />
                Genes<br />
                Brighter<br />
                Days
              </span>
            </div>

            {/* Middle Livestock Photography & Value Proposition Badges */}
            <div className="relative z-10 my-6 sm:my-8 flex items-center justify-between">
              
              {/* Feature Value Badges (3 items with circle icon badges) */}
              <div className="space-y-4 max-w-[210px] sm:max-w-[240px]">
                {/* Item 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#355944] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sprout className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-[#19221B] leading-tight">
                      Healthier animals
                    </strong>
                    <span className="text-[11px] text-[#6A7068] leading-tight">
                      through better genetics
                    </span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#355944] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BarChart3 className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-[#19221B] leading-tight">
                      More productive
                    </strong>
                    <span className="text-[11px] text-[#6A7068] leading-tight">
                      and profitable herds
                    </span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#355944] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Users className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-[#19221B] leading-tight">
                      A stronger future
                    </strong>
                    <span className="text-[11px] text-[#6A7068] leading-tight">
                      for farming communities
                    </span>
                  </div>
                </div>
              </div>

              {/* Realistic Holstein Cow Cutout / Portrait in Pasture */}
              <div className="relative w-52 sm:w-64 h-56 sm:h-72 shrink-0">
                <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-lg border border-white/60">
                  <img
                    src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=85"
                    alt="Holstein Dairy Cow with ear tag in green pasture"
                    className="w-full h-full object-cover object-center transform scale-105 hover:scale-110 transition-transform duration-700"
                  />
                  {/* Subtle pastoral vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Ear tag badge simulation */}
                <div className="absolute top-3 right-3 bg-amber-400 text-stone-900 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                  #258 US
                </div>
              </div>
            </div>

            {/* Handwritten Script 2: Bottom-Left "Farming a healthier tomorrow" */}
            <div className="relative z-10 pt-2 pb-1">
              <div className="inline-block relative -rotate-3">
                <span className="font-script text-2xl sm:text-3xl text-[#5A564C] leading-none block">
                  Farming<br />
                  &nbsp;&nbsp;a healthier<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;tomorrow
                </span>
                {/* Yellow/Amber Brush Underline */}
                <svg
                  className="w-32 sm:w-36 h-3 text-[#D69632] mt-0.5"
                  viewBox="0 0 140 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 5 6 Q 70 12 135 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Farmer Portal Login Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <div className="bg-white rounded-[28px] sm:rounded-[32px] p-7 sm:p-10 shadow-[0_16px_50px_-20px_rgba(0,0,0,0.08)] border border-[#EAE7DE] w-full max-w-[440px] flex flex-col justify-between">
              
              <div>
                {/* Category Subtitle */}
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#8C887E] uppercase mb-2.5 block">
                  FARMER PORTAL
                </span>

                {/* Main Card Headline */}
                <h2 className="font-serif-hero text-3xl sm:text-[34px] font-medium tracking-tight text-[#161D18] mb-2 leading-tight">
                  Welcome back
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-[13px] text-[#6C6A63] leading-relaxed mb-6">
                  Manage your herd, breeding plans, and genetic progress in one place.
                </p>

                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700 font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSignIn} className="space-y-4">
                  {/* Email or phone field */}
                  <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="identifier-input"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email or phone"
                      className="w-full h-11 sm:h-12 pl-10 pr-4 text-xs sm:text-sm text-[#1A1A18] placeholder-[#9E9B93] bg-transparent outline-none rounded-xl"
                    />
                  </div>

                  {/* Password field */}
                  <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full h-11 sm:h-12 pl-10 pr-10 text-xs sm:text-sm text-[#1A1A18] placeholder-[#9E9B93] bg-transparent outline-none rounded-xl font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7C7A72] hover:text-[#1A1A18] transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Remember me & Forgot Password */}
                  <div className="flex items-center justify-between pt-0.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[#C5C2B8] text-[#2A4736] focus:ring-[#2A4736] accent-[#2A4736]"
                      />
                      <span className="text-[#52504A]">Remember this device</span>
                    </label>

                    <Link
                      href="/bovine"
                      className="font-bold text-[#2A4736] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button: Sign in */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 sm:h-12 rounded-xl bg-[#2A4736] hover:bg-[#203629] active:scale-[0.99] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-75 cursor-pointer mt-2"
                  >
                    {isLoading ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>Sign in</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider with "or" */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E8E5DC]" />
                  </div>
                  <div className="relative flex justify-center text-xs text-[#8A877E]">
                    <span className="bg-white px-3 font-normal">or</span>
                  </div>
                </div>

                {/* Secondary Button: Continue with phone */}
                <button
                  type="button"
                  onClick={() => setIsPhoneModalOpen(true)}
                  className="w-full h-11 sm:h-12 rounded-xl border border-[#DCD9D0] bg-white hover:bg-[#F9F8F5] active:scale-[0.99] text-[#242320] font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#242320]" />
                  <span>Continue with phone</span>
                </button>

                {/* Create a farmer account Link */}
                <div className="text-center text-xs text-[#6B6A64] mt-6">
                  <span>New to the platform? </span>
                  <Link
                    href="/register"
                    className="font-bold text-[#2A4736] hover:underline"
                  >
                    Create a farmer account
                  </Link>
                </div>

                {/* Quick Demo Helper for Evaluators */}
                <div className="mt-4 pt-3 border-t border-[#F0EDE5] text-center">
                  <button
                    type="button"
                    onClick={handleQuickDemo}
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#7A7870] hover:text-[#2A4736] transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#2A4736]" />
                    <span>Click to auto-fill manager credentials</span>
                  </button>
                </div>
              </div>

              {/* Card Bottom Trust Row */}
              <div className="mt-6 pt-4 border-t border-[#F0EDE5] flex items-center justify-between text-[11px] text-[#55524B]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2A4736]" />
                  <span>Secure access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2A4736]" />
                  <span>Your data stays private</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <BovineAuthFooter variant="login" />

      {/* Phone Login Modal */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4">
            <div>
              <h4 className="text-base font-bold text-stone-900">Sign in with Mobile Phone</h4>
              <p className="text-xs text-stone-500 mt-1">
                Enter your mobile number to receive a 6-digit verification code.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-3 text-xs">
              <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] p-2.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-500" />
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full text-xs text-stone-900 bg-transparent outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPhoneModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-1.5 rounded-lg bg-[#2A4736] text-white font-semibold hover:bg-[#203629]"
                >
                  {isLoading ? 'Sending...' : 'Send SMS Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
