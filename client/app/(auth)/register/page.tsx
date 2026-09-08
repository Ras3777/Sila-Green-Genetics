'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BovineAuthHeader from '@/components/auth/BovineAuthHeader';
import BovineAuthFooter from '@/components/auth/BovineAuthFooter';
import DnaHelixSvg from '@/components/auth/DnaHelixSvg';
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  Users,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Sprout,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  // Multi-step State (Step 1: Account, Step 2: Farm profile, Step 3: Verification)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Farm Profile Preview State
  const [farmName, setFarmName] = useState('');
  const [regionLocation, setRegionLocation] = useState('');
  const [herdSize, setHerdSize] = useState('50 - 150 head');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (currentStep === 1) {
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMessage('Please fill in your full name, email address, and password.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your confirmation password.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('Please agree to the Terms of Service and Privacy Policy to continue.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccessModalOpen(true);
      }, 500);
    }
  };

  const handleFinishOnboarding = () => {
    setIsSuccessModalOpen(false);
    router.push('/bovine/dashboard');
  };

  const handleQuickDemo = () => {
    setFullName('Sarah Jenkins, DVM');
    setPhoneNumber('+1 (970) 555-0182');
    setEmail('s.jenkins@highlandbeef.com');
    setPassword('CattleGenetics2026!');
    setConfirmPassword('CattleGenetics2026!');
    setFarmName('Highland Valley Beef Station');
    setRegionLocation('Larimer County, Colorado');
    setHerdSize('150 - 500 head');
    setAgreeTerms(true);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F7F2] text-[#161D18] selection:bg-[#2A4736] selection:text-white relative overflow-x-hidden font-sans-ui">
      {/* Top Header */}
      <BovineAuthHeader />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 py-4 sm:py-6 max-w-7xl mx-auto w-full">
        
        {/* Top Stepper Header */}
        <div className="w-full max-w-2xl text-center space-y-2 mb-6 sm:mb-8 select-none">
          <h1 className="font-serif-hero text-3xl sm:text-4xl lg:text-[40px] font-normal tracking-tight text-[#161D18] leading-tight">
            Create your farmer account
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6A6E67] font-normal">
            Start building a healthier, more productive herd with better genetic decisions.
          </p>

          {/* Stepper Progress Indicator */}
          <div className="pt-4 flex items-center justify-center gap-2 sm:gap-3 text-xs">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2A4736] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                1
              </div>
              <span className="font-bold text-[#161D18] text-xs">Account</span>
            </div>

            {/* Line 1 */}
            <div className="w-10 sm:w-14 h-[1px] bg-[#D2CFC5]" />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-[#C0BCB2] bg-transparent text-[#6A6E67] flex items-center justify-center text-xs font-medium shrink-0">
                2
              </div>
              <span className="font-medium text-[#6A6E67] text-xs">Farm profile</span>
            </div>

            {/* Line 2 */}
            <div className="w-10 sm:w-14 h-[1px] bg-[#D2CFC5]" />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-[#C0BCB2] bg-transparent text-[#6A6E67] flex items-center justify-center text-xs font-medium shrink-0">
                3
              </div>
              <span className="font-medium text-[#6A6E67] text-xs">Verification</span>
            </div>
          </div>
        </div>

        {/* Content Body: Form Card + Side Brand Column */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-10 w-full max-w-5xl">
          
          {/* Main Registration Form Card */}
          <div className="bg-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 shadow-[0_16px_50px_-20px_rgba(0,0,0,0.08)] border border-[#EAE7DE] w-full max-w-2xl">
            
            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-700 font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleContinue} className="space-y-5">
              
              {/* SECTION 1: Account Information */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-[#161D18] tracking-tight">
                  Account information
                </h3>

                {/* Row 1: Full name & Phone number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full name */}
                  <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="fullname-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm text-[#1A1A18] placeholder-[#9E9B93] bg-transparent outline-none rounded-xl"
                    />
                  </div>

                  {/* Phone number */}
                  <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      id="phone-input"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone number"
                      className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm text-[#1A1A18] placeholder-[#9E9B93] bg-transparent outline-none rounded-xl"
                    />
                  </div>
                </div>

                {/* Row 2: Email address & Create password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email address */}
                  <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="email-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm text-[#1A1A18] placeholder-[#9E9B93] bg-transparent outline-none rounded-xl"
                    />
                  </div>

                  {/* Create password */}
                  <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="create-password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full h-11 pl-10 pr-9 text-xs sm:text-sm text-[#1A1A18] placeholder-[#9E9B93] bg-transparent outline-none rounded-xl font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7C7A72] hover:text-[#1A1A18] transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Row 3: Confirm password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full h-11 pl-10 pr-9 text-xs sm:text-sm text-[#1A1A18] placeholder-[#9E9B93] bg-transparent outline-none rounded-xl font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7C7A72] hover:text-[#1A1A18] transition-colors"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Farm Profile (Preview) */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#161D18] tracking-tight">
                  Farm profile (preview)
                </h3>

                {/* Row 1: Farm name & Region / location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Farm name */}
                  <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="farm-name-input"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="Farm name"
                      className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm text-[#1A1A18] placeholder-[#9E9B93] bg-transparent outline-none rounded-xl"
                    />
                  </div>

                  {/* Region / location */}
                  <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="region-input"
                      value={regionLocation}
                      onChange={(e) => setRegionLocation(e.target.value)}
                      placeholder="Region / location"
                      className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm text-[#1A1A18] placeholder-[#9E9B93] bg-transparent outline-none rounded-xl"
                    />
                  </div>
                </div>

                {/* Row 2: Herd size dropdown */}
                <div className="relative rounded-xl border border-[#DCD9D0] bg-[#FCFCFA] focus-within:bg-white focus-within:border-[#2A4736] focus-within:ring-1 focus-within:ring-[#2A4736] transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                    <Users className="w-4 h-4" />
                  </div>
                  <select
                    id="herd-size-select"
                    value={herdSize}
                    onChange={(e) => setHerdSize(e.target.value)}
                    className="w-full h-11 pl-10 pr-9 text-xs sm:text-sm text-[#1A1A18] bg-transparent outline-none rounded-xl appearance-none cursor-pointer"
                  >
                    <option value="< 50 head">&lt; 50 head</option>
                    <option value="50 - 150 head">50 - 150 head</option>
                    <option value="150 - 500 head">150 - 500 head</option>
                    <option value="500 - 1,500 head">500 - 1,500 head</option>
                    <option value="1,500+ commercial">1,500+ commercial enterprise</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#7C7A72]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-[#52504A]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C5C2B8] text-[#2A4736] focus:ring-[#2A4736] accent-[#2A4736] mt-0.5"
                  />
                  <span>
                    I agree to the{' '}
                    <a href="#" className="font-semibold text-[#161D18] underline hover:text-[#2A4736]">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-semibold text-[#161D18] underline hover:text-[#2A4736]">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Submit Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 sm:h-12 rounded-xl bg-[#2A4736] hover:bg-[#203629] active:scale-[0.99] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-75 cursor-pointer mt-3"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Continue</span>
                  </>
                )}
              </button>

              {/* Already have an account? Sign in */}
              <div className="text-center text-xs text-[#6B6A64] pt-2">
                <span>Already have an account? </span>
                <Link
                  href="/login"
                  className="font-bold text-[#2A4736] hover:underline"
                >
                  Sign in
                </Link>
              </div>

              {/* Demo Pre-fill Link */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#7A7870] hover:text-[#2A4736] transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#2A4736]" />
                  <span>Click to auto-fill sample farmer details</span>
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT SIDE BRAND COLUMN (Aesthetic storytelling matching auth.png) */}
          <div className="w-full sm:w-56 lg:w-64 flex flex-col items-center sm:items-start space-y-5 select-none shrink-0">
            
            {/* Top Vertical DNA Helix */}
            <div className="w-full flex justify-center sm:justify-start">
              <DnaHelixSvg variant="vertical" className="w-16 h-40 text-[#4D6F59]/35" />
            </div>

            {/* Vertical Stacked Typography */}
            <div className="text-center sm:text-left space-y-3">
              <div className="text-[11px] font-bold tracking-[0.22em] text-[#6E736B] uppercase leading-tight">
                BETTER<br />GENETICS
              </div>
              <div className="text-[11px] font-bold tracking-[0.22em] text-[#6E736B] uppercase leading-tight">
                HEALTHIER<br />HERDS
              </div>
              <div className="text-[11px] font-bold tracking-[0.22em] text-[#6E736B] uppercase leading-tight">
                BRIGHTER<br />TOMORROWS
              </div>
            </div>

            {/* Handwritten Script: "Same Land Brighter Generations" */}
            <div className="text-center sm:text-left -rotate-3 pt-1">
              <span className="font-script text-2xl sm:text-[26px] text-[#555047] leading-tight block">
                Same<br />
                Land<br />
                Brighter<br />
                Generations
              </span>
            </div>

            {/* Farmland Barn Landscape Photo */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#EAE7DE] bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&auto=format&fit=crop&q=80"
                alt="Idyllic family farm landscape with red barn, silo and green hills"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Card Badge: Sprout + GOOD GENETICS GREATER POSSIBILITIES */}
            <div className="w-full rounded-2xl bg-white/80 backdrop-blur-xs border border-[#EAE7DE] p-4 shadow-xs">
              <Sprout className="w-5 h-5 text-[#2A4736] mb-1.5" />
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#383733] leading-snug">
                GOOD<br />
                GENETICS<br />
                GREATER<br />
                POSSIBILITIES
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <BovineAuthFooter variant="register" />

      {/* Registration Success / Welcome Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-stone-900">Welcome to Bovine Genetics, {fullName.split(' ')[0]}!</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your farmer account has been created for <strong>{farmName || 'Your Farm'}</strong>. You now have full access to pedigree tracking, breeding plans, and genomic evaluations.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-2.5 rounded-xl bg-[#2A4736] hover:bg-[#203629] text-white font-semibold text-xs transition-colors shadow-xs"
              >
                Go to Livestock Operations Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
