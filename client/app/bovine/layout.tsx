'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BovineProvider, useBovine } from '@/lib/bovine-store';
import { BovineGeneticsProvider } from '@/lib/bovine-genetics-store';
import { BovineBreedingProvider } from '@/lib/bovine-breeding-store';
import { BovineMarketplaceProvider } from '@/lib/bovine-marketplace-store';
import { BovineTrustProvider } from '@/lib/bovine-trust-store';
import {
  LayoutDashboard,
  Layers,
  Building2,
  CalendarCheck2,
  CheckSquare,
  MapPin,
  Dna,
  GitBranch,
  FileSpreadsheet,
  Settings,
  Bell,
  Search,
  Plus,
  QrCode,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Truck,
  Activity,
  UserCheck,
  Award,
  Sliders,
  ArrowRightLeft,
  TestTubes,
  BarChart3,
  FileText,
  History,
  Users2,
  Users,
  HeartPulse,
  Heart,
  TrendingUp,
  Radio,
  ShoppingBag,
  Store,
} from 'lucide-react';

function BovineShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    session,
    setSessionRole,
    setActiveFarm,
    setActiveHerd,
    farms,
    herds,
    animals,
    identifiers,
    notifications,
  } = useBovine();

  // Search popup state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const quickCreateRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (quickCreateRef.current && !quickCreateRef.current.contains(event.target as Node)) {
        setQuickCreateOpen(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results across Name, DGR, Ear Tag, RFID, Registry No, Internal ID
  const searchResults = searchQuery.trim().length > 1
    ? animals.filter((a) => {
        const q = searchQuery.toLowerCase();
        if (a.name.toLowerCase().includes(q)) return true;
        if (a.internalId.toLowerCase().includes(q)) return true;
        if (a.registrationNumber?.toLowerCase().includes(q)) return true;
        if (a.primaryIdentifier?.toLowerCase().includes(q)) return true;
        // Check animal identifiers
        const animIds = identifiers.filter((i) => i.animalId === a.id);
        return animIds.some((i) => i.value.toLowerCase().includes(q));
      }).slice(0, 6)
    : [];

  const unreadCount = notifications.filter((n) => !n.isRead && !n.isArchived).length;

  const currentFarm = farms.find((f) => f.id === session.activeFarmId);
  const currentHerd = herds.find((h) => h.id === session.activeHerdId);

  const navigationSections = [
    {
      category: 'Overview',
      items: [
        { name: 'Dashboard', href: '/bovine/dashboard', icon: LayoutDashboard },
        { name: 'Map View', href: '/bovine/map', icon: MapPin },
      ],
    },
    {
      category: 'Registry & Ops',
      items: [
        { name: 'Animal Registry', href: '/bovine/animals', icon: Layers },
        { name: 'Farm Animals', href: '/bovine/animals/farm-animals', icon: Users },
        { name: 'Breeding Stock', href: '/bovine/animals/breeding-stock', icon: Award, badge: 'Elite' },
        { name: 'Farms & Facilities', href: '/bovine/farms', icon: Building2 },
        { name: 'Herds Directory', href: '/bovine/herds', icon: Users },
        { name: 'Management Groups', href: '/bovine/groups', icon: Users2 },
        { name: 'Daily Operations', href: '/bovine/daily-operations', icon: CalendarCheck2 },
        { name: 'Tasks', href: '/bovine/tasks', icon: CheckSquare },
      ],
    },
    {
      category: 'Health & Reproduction',
      items: [
        { name: 'Health & Clinical', href: '/bovine/health', icon: HeartPulse, badge: 'P2' },
        { name: 'Reproduction & AI', href: '/bovine/reproduction', icon: Heart, badge: 'P2' },
        { name: 'Reproductive Processes', href: '/bovine/reproduction/processes', icon: TestTubes, badge: 'AI/ET' },
        { name: 'Recipient Evaluations', href: '/bovine/reproduction/recipient-evaluations', icon: ShieldCheck },
        { name: 'Calving & Newborns', href: '/bovine/reproduction/calvings', icon: Sparkles },
        { name: 'Production Records', href: '/bovine/production', icon: TrendingUp, badge: 'P2' },
        { name: 'Connected Sensors', href: '/bovine/sensors', icon: Radio, badge: 'P2' },
      ],
    },
    {
      category: 'Genetics',
      items: [
        { name: 'Genetics Hub', href: '/bovine/genetics', icon: Dna },
        { name: 'Pedigree', href: '/bovine/genetics/pedigree', icon: GitBranch },
        { name: 'Contemporary Groups', href: '/bovine/genetics/contemporary-groups', icon: Users2 },
        { name: 'Performance Tests', href: '/bovine/genetics/performance-tests', icon: FileSpreadsheet },
        { name: 'Evaluations', href: '/bovine/genetics/evaluations', icon: Activity },
      ],
    },
    {
      category: 'Marketplace & Commerce',
      items: [
        { name: 'Marketplace Hub', href: '/bovine/marketplace', icon: ShoppingBag, badge: 'Trade' },
        { name: 'Live Animals', href: '/bovine/marketplace/animals', icon: Layers },
        { name: 'Semen Marketplace', href: '/bovine/marketplace/semen', icon: TestTubes },
        { name: 'Embryo Marketplace', href: '/bovine/marketplace/embryos', icon: Sparkles },
        { name: 'Compare Genetics', href: '/bovine/marketplace/compare', icon: ArrowRightLeft },
        { name: 'Commercial Orders', href: '/bovine/marketplace/orders', icon: CheckSquare },
        { name: 'Seller Dashboard', href: '/bovine/marketplace/seller', icon: BarChart3 },
        { name: 'Buyer Dashboard', href: '/bovine/marketplace/buyer', icon: UserCheck },
      ],
    },
    {
      category: 'Breeding & Germplasm',
      items: [
        { name: 'Breeding Programs', href: '/bovine/breeding-programs', icon: Award, badge: 'P4' },
        { name: 'Selection Indexes', href: '/bovine/selection-indexes', icon: Sliders, badge: 'P4' },
        { name: 'Mating Plans', href: '/bovine/mating', icon: ArrowRightLeft, badge: 'P4' },
        { name: 'Germplasm & Cryo', href: '/bovine/germplasm', icon: TestTubes, badge: 'P4' },
      ],
    },
    {
      category: 'Intelligence & Governance',
      items: [
        { name: 'Trust & Verification', href: '/bovine/documents/verify', icon: ShieldCheck, badge: 'Trust' },
        { name: 'Government Observer', href: '/bovine/government', icon: ShieldCheck, badge: 'Gov' },
        { name: 'Analytics', href: '/bovine/analytics', icon: BarChart3, badge: 'P4' },
        { name: 'Reports', href: '/bovine/reports', icon: FileText, badge: 'P4' },
        { name: 'Audit Logs', href: '/bovine/audit', icon: History, badge: 'P4' },
        { name: 'Settings & Orgs', href: '/bovine/settings', icon: Settings },
      ],
    },
  ];

  const roles = [
    { key: 'GOVERNMENT_OBSERVER', label: 'Government Observer', desc: 'Institutional oversight & regulatory surveillance' },
    { key: 'FARMER', label: 'Farmer / Operator', desc: 'Record daily checks & observations' },
    { key: 'TECHNICIAN', label: 'Field Technician', desc: 'Barcode/RFID scans, tasks & vitals' },
    { key: 'HERD_MANAGER', label: 'Herd Manager', desc: 'Herd placement, reviews, worklists' },
    { key: 'FARM_MANAGER', label: 'Farm Manager', desc: 'Full farm oversight & logs' },
    { key: 'REGISTRAR', label: 'Registrar', desc: 'Master data, parentage & breed verify' },
    { key: 'SUPERVISOR', label: 'Supervisor', desc: 'Cross-farm audits & incident review' },
    { key: 'ADMIN', label: 'System Admin', desc: 'Full permissions & org configuration' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur border-b border-stone-200/80 px-4 lg:px-6 h-16 flex items-center justify-between transition-all">
        <div className="flex items-center space-x-3 lg:space-x-6">
          {/* Mobile menu trigger */}
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 -ml-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 lg:hidden cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo & Brand */}
          <Link href="/bovine/dashboard" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-stone-900 tracking-tight block leading-tight">
                Bovine Genetics
              </span>
              <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider block">
                Workspace Foundation
              </span>
            </div>
          </Link>

          {/* Organization & Farm Scope Selector */}
          <div className="hidden md:flex items-center space-x-2 pl-3 border-l border-stone-300/80">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Scope:</span>
            <select
              id="select-farm-scope"
              value={session.activeFarmId}
              onChange={(e) => setActiveFarm(e.target.value)}
              className="bg-white border border-stone-300 text-stone-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Farms (Organization-wide)</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>

            {session.activeFarmId !== 'ALL' && (
              <select
                id="select-herd-scope"
                value={session.activeHerdId}
                onChange={(e) => setActiveHerd(e.target.value)}
                className="bg-white border border-stone-300 text-stone-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-2xs"
              >
                <option value="ALL">All Herds on Farm</option>
                {herds
                  .filter((h) => h.farmId === session.activeFarmId)
                  .map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.code})
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>

        {/* Center/Right Global Search & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Global Animal Search */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center">
              <div className="relative">
                <input
                  id="input-global-search"
                  type="text"
                  placeholder="Search Ear Tag, RFID, DGR, Name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/bovine/search?q=${encodeURIComponent(searchQuery)}`);
                      setSearchOpen(false);
                    }
                  }}
                  className="w-40 sm:w-64 lg:w-80 pl-8 pr-4 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:w-80 transition-all shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Quick Search Autocomplete Dropdown */}
            {searchOpen && searchQuery.trim().length > 1 && (
              <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white border border-stone-200 rounded-xl shadow-lg z-50 p-2 text-xs">
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
                  <span>Matching Livestock</span>
                  <span>{searchResults.length} found</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-stone-500">
                    No animals found for &ldquo;{searchQuery}&rdquo;. Press Enter for deep search.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/bovine/animals/${item.id}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 text-stone-800 transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                            <span>{item.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono border border-emerald-200">
                              {item.primaryIdentifier || item.internalId}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {item.sex} • {item.useStatus.replace(/_/g, ' ')}
                          </div>
                        </div>
                        <span className="text-emerald-700 font-medium text-[11px] flex items-center">
                          View 360 <ArrowRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </Link>
                    ))}
                    <Link
                      href={`/bovine/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setSearchOpen(false)}
                      className="block text-center py-2 text-xs text-emerald-800 font-semibold hover:underline border-t border-stone-100 mt-1"
                    >
                      Advanced search with filters &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Scan button (Field friendly) */}
          <Link
            id="btn-nav-scan"
            href="/bovine/scan"
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center justify-center cursor-pointer"
            title="Scan Ear Tag / RFID"
          >
            <QrCode className="w-4 h-4 text-stone-700" />
          </Link>

          {/* Notifications / Inbox */}
          <Link
            id="btn-nav-inbox"
            href="/bovine/inbox"
            className="relative p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center justify-center cursor-pointer"
            title="Operational Inbox"
          >
            <Bell className="w-4 h-4 text-stone-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Quick Create Dropdown */}
          <div className="relative" ref={quickCreateRef}>
            <button
              id="btn-quick-create"
              onClick={() => setQuickCreateOpen(!quickCreateOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick Action</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {quickCreateOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-stone-200 rounded-xl shadow-lg z-50 p-1 text-xs">
                <Link
                  id="link-quick-add-farm-animal"
                  href="/bovine/animals/farm-animals/new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-800 font-medium"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Register Farm Animal</span>
                </Link>
                <Link
                  id="link-quick-add-breeding-stock"
                  href="/bovine/animals/breeding-stock/new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 text-amber-900 font-medium"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Register Breeding Stock</span>
                </Link>
                <Link
                  id="link-quick-repro-process"
                  href="/bovine/reproduction/processes/new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-800 font-medium"
                >
                  <TestTubes className="w-3.5 h-3.5 text-emerald-700" />
                  <span>New Repro Process (AI/ET)</span>
                </Link>
                <Link
                  id="link-quick-calving"
                  href="/bovine/reproduction/calvings/new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-800 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Register Calving &amp; Newborn</span>
                </Link>
                <Link
                  id="link-quick-daily-log"
                  href="/bovine/daily-operations"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-800 font-medium"
                >
                  <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Record Daily Operations</span>
                </Link>
                <Link
                  id="link-quick-task"
                  href="/bovine/tasks"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-800 font-medium"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Create Field Task</span>
                </Link>
                <Link
                  id="link-quick-move"
                  href="/bovine/animals"
                  onClick={() => setQuickCreateOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-800 font-medium"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Move Livestock</span>
                </Link>
              </div>
            )}
          </div>

          {/* Role switcher (Allows testing permission matrix) */}
          <div className="relative hidden lg:block" ref={roleMenuRef}>
            <button
              id="btn-role-switcher"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-[11px] font-medium text-stone-700 shadow-2xs cursor-pointer"
            >
              <UserCheck className="w-3 h-3 text-stone-500" />
              <span>{roles.find((r) => r.key === session.role)?.label || session.role}</span>
              <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-stone-200 rounded-xl shadow-lg z-50 p-2 text-xs">
                <div className="px-2 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
                  Active Role (RBAC Testing)
                </div>
                <div className="space-y-1">
                  {roles.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => {
                        setSessionRole(r.key as any);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer ${
                        session.role === r.key
                          ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                          : 'hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      <div className="text-xs">{r.label}</div>
                      <div className="text-[10px] text-stone-500 font-normal">{r.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-stone-100 flex flex-col gap-1">
                  <Link
                    href="/login"
                    onClick={() => setRoleMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-medium text-xs transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Farmer Portal (Sign In)</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100/60 px-1.5 py-0.5 rounded">/login</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setRoleMenuOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 font-medium text-xs transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Create Farmer Account</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100/60 px-1.5 py-0.5 rounded">/register</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-stone-200/80 bg-white p-4 space-y-6 shrink-0 overflow-y-auto">
          {/* Active Scope Card */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              <span>Operational Scope</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="font-semibold text-stone-900 truncate">
              {currentFarm ? currentFarm.name : 'All Registered Farms'}
            </div>
            <div className="text-[11px] text-stone-500 flex items-center justify-between mt-1">
              <span>{currentHerd ? currentHerd.name : 'All Herds'}</span>
              <span className="font-mono text-emerald-800 font-semibold">
                {currentFarm ? `${currentFarm.headCount} Head` : `${animals.length} Head`}
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-4">
            {navigationSections.map((sec) => (
              <div key={sec.category} className="space-y-1">
                <div className="px-2 py-0.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  {sec.category}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/bovine/dashboard'
                      ? pathname === '/bovine/dashboard'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold tracking-wider uppercase ${
                            isActive
                              ? 'bg-emerald-950/40 text-emerald-100'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Technician Today Summary */}
          <div className="mt-auto p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
            <div className="flex items-center space-x-2 text-emerald-900 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Today&apos;s Field Shift</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed mb-2">
              Ready for mobile data-entry. Identifiers, daily vitals, and movement records update in real time.
            </p>
            <div className="text-[10px] text-stone-500 font-mono">
              System Sync: Live • Local Drafts: Active
            </div>
          </div>
        </aside>

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-10 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (5 Items as required) */}
      <nav
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg"
      >
        <Link
          id="btn-m-home"
          href="/bovine/dashboard"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[44px] rounded-lg text-xs ${
            pathname === '/bovine/dashboard' ? 'text-emerald-800 font-semibold' : 'text-stone-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link
          id="btn-m-animals"
          href="/bovine/animals"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[44px] rounded-lg text-xs ${
            pathname.startsWith('/bovine/animals') ? 'text-emerald-800 font-semibold' : 'text-stone-500'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Animals</span>
        </Link>
        <Link
          id="btn-m-scan"
          href="/bovine/scan"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[44px] rounded-lg text-xs ${
            pathname === '/bovine/scan'
              ? 'text-emerald-800 font-semibold'
              : 'text-stone-700 font-medium'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-xs -mt-3">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Scan</span>
        </Link>
        <Link
          id="btn-m-tasks"
          href="/bovine/tasks"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[44px] rounded-lg text-xs ${
            pathname.startsWith('/bovine/tasks') ? 'text-emerald-800 font-semibold' : 'text-stone-500'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Tasks</span>
        </Link>
        <button
          id="btn-m-more"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[44px] rounded-lg text-stone-500 text-xs cursor-pointer"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Mobile Full Module Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                  B
                </div>
                <span className="font-bold text-sm text-stone-900">Bovine Operations</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scope Switcher on mobile */}
            <div className="my-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                Active Farm Scope:
              </span>
              <select
                value={session.activeFarmId}
                onChange={(e) => setActiveFarm(e.target.value)}
                className="w-full bg-white border border-stone-300 text-stone-800 text-xs rounded-lg p-2"
              >
                <option value="ALL">All Farms</option>
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role switch in drawer */}
            <div className="mb-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                Role (RBAC):
              </span>
              <select
                value={session.role}
                onChange={(e) => setSessionRole(e.target.value as any)}
                className="w-full bg-white border border-stone-300 text-stone-800 text-xs rounded-lg p-2"
              >
                {roles.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Links list */}
            <div className="space-y-4 flex-1 overflow-y-auto">
              {navigationSections.map((sec) => (
                <div key={sec.category} className="space-y-1">
                  <div className="px-2 py-0.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    {sec.category}
                  </div>
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                          isActive
                            ? 'bg-emerald-800 text-white font-semibold'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 text-[11px] text-stone-500">
              Technician Field Mode • Online
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BovineLayout({ children }: { children: React.ReactNode }) {
  return (
    <BovineProvider>
      <BovineGeneticsProvider>
        <BovineBreedingProvider>
          <BovineMarketplaceProvider>
            <BovineTrustProvider>
              <BovineShellInner>{children}</BovineShellInner>
            </BovineTrustProvider>
          </BovineMarketplaceProvider>
        </BovineBreedingProvider>
      </BovineGeneticsProvider>
    </BovineProvider>
  );
}
