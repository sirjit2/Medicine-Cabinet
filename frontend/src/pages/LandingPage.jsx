import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import './LandingPage.css';

/* ═══════════════════════════════════════════════════════════════
   SVG ICON LIBRARY
   ───────────────────────────────────────────────────────────────
   A collection of reusable SVG icon components used throughout
   the landing page. Each icon accepts standard SVG props (width,
   height, style, etc.) and renders an inline SVG element.
   ═══════════════════════════════════════════════════════════════ */
const I = {
  /* Pill/capsule icon — represents medications */
  Pill: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  ),
  /* Shield with checkmark — represents safety & security */
  Shield: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  /* Warning triangle — represents alerts & interactions */
  Warn: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  /* Activity/heartbeat line — represents health tracking */
  Activity: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  /* File/document icon — represents reports */
  File: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  /* Group of users — represents caregivers & patients */
  Users: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  /* Clock — represents scheduling & timelines */
  Clock: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  /* Lock — represents data privacy */
  Lock: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  /* Right arrow — used for CTA buttons */
  Arrow: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  /* Sun — light theme toggle */
  Sun: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  /* Moon — dark theme toggle */
  Moon: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  /* Checkmark — used for trust badges & confirmation */
  Check: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  /* Star — used for ratings */
  Star: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  /* Database — represents FDA data connection */
  Database: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  /* Heart — represents free / health */
  Heart: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  /* Lightning bolt — represents speed & quick actions */
  Zap: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  /* Right chevron — used for navigation arrows */
  ChevR: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  /* Medical cross — represents healthcare */
  Cross: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2z" />
    </svg>
  ),
  /* Stethoscope — represents doctors */
  Stethoscope: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
  /* Clipboard — represents side effect logging */
  Clipboard: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
};


/* ═══════════════════════════════════════════════════════════════
   CUSTOM HOOK: useInView
   ───────────────────────────────────────────────────────────────
   Uses IntersectionObserver to detect when a DOM element enters
   the viewport. Returns a [ref, isInView] tuple. Once the element
   is visible, it stays "in view" permanently (one-shot trigger)
   to avoid re-animating on scroll back.

   @param {number} threshold - How much of the element must be
     visible (0 to 1) before triggering. Default 0.12 (12%).
   @returns {[React.RefObject, boolean]}
   ═══════════════════════════════════════════════════════════════ */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    /* Create an observer that fires once and disconnects */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}


/* ═══════════════════════════════════════════════════════════════
   CUSTOM HOOK: useCountUp
   ───────────────────────────────────────────────────────────────
   Animates a number counting up from 0 to `target` using
   requestAnimationFrame. Uses cubic ease-out easing for a smooth
   deceleration effect. Only starts when `started` is true.

   @param {number} target   - The final number to count up to
   @param {boolean} started - Whether counting should begin
   @param {number} duration - Animation duration in ms (default 2400)
   @returns {number}        - The current animated value
   ═══════════════════════════════════════════════════════════════ */
function useCountUp(target, started, duration = 2400) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!started) return;

    let rafId;
    let startTime = null;

    /**
     * Animation frame callback — calculates progress with
     * cubic ease-out and updates the displayed value
     */
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      setVal(Math.floor(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, started, duration]);

  return val;
}


/* ═══════════════════════════════════════════════════════════════
   STATIC DATA CONSTANTS
   ───────────────────────────────────────────────────────────────
   All the static content used throughout the landing page is
   defined here to keep the component clean and make content
   updates easy without touching the JSX structure.
   ═══════════════════════════════════════════════════════════════ */

/**
 * TICKER — Auto-scrolling trust badges shown below the navbar.
 * These rotate infinitely to build social proof.
 */
const TICKER = [
  '10,000+ Active Patients',
  'FDA-Linked Drug Database',
  '50,000+ Medications Tracked',
  'End-to-End Encrypted',
  '120,000+ Interactions Checked',
  'Caregiver Mode Included',
  'Doctor-Ready PDF Reports',
  '99.9% Uptime',
  'Free for Patients',
];

/**
 * FEATURES — The 6 core product features displayed in a bento grid.
 * Each has an icon, title, description, and a green accent color.
 */
const FEATURES = [
  {
    Icon: I.Pill,
    label: 'Medication Log',
    desc: 'Every prescription and supplement in one place — dosage, frequency, start date, prescribing doctor.',
    color: '#059669',
    glow: 'rgba(5,150,105,0.10)',
  },
  {
    Icon: I.Warn,
    label: 'Interaction Checker',
    desc: 'Powered by RxNorm & OpenFDA. Catch dangerous drug combinations before they affect you.',
    color: '#047857',
    glow: 'rgba(4,120,87,0.10)',
  },
  {
    Icon: I.Activity,
    label: 'Side Effect Tracker',
    desc: 'Log symptoms daily and surface correlations between your medications and how you feel.',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.10)',
  },
  {
    Icon: I.Clock,
    label: 'Dosage Timeline',
    desc: 'Visual adherence history — charts, streaks, and weekly breakdowns in one clear view.',
    color: '#059669',
    glow: 'rgba(5,150,105,0.10)',
  },
  {
    Icon: I.File,
    label: 'Doctor Summaries',
    desc: 'One-click PDF report for your next appointment. Your doctor gets the full picture instantly.',
    color: '#047857',
    glow: 'rgba(4,120,87,0.10)',
  },
  {
    Icon: I.Users,
    label: 'Caregiver Mode',
    desc: "Remotely manage a family member's medications. Real support for a real everyday challenge.",
    color: '#10b981',
    glow: 'rgba(16,185,129,0.10)',
  },
];

/**
 * HOW — The 4-step "How It Works" process flow.
 * Step numbers (01-04) are displayed as large gradient text.
 */
const HOW = [
  { n: '01', title: 'Add Your Medications', desc: 'Name, dosage, frequency, doctor. Under a minute per medication. We handle the complexity.' },
  { n: '02', title: 'Get Instant Alerts', desc: 'Every new medication is cross-checked against your full list using live FDA interaction data.' },
  { n: '03', title: 'Track & Spot Patterns', desc: 'Log symptoms, mark doses taken, and watch adherence trends build over weeks and months.' },
  { n: '04', title: 'Share With Your Doctor', desc: 'Export a clean summary before any appointment — no more trying to recall everything on the spot.' },
];

/**
 * TESTIMONIALS — User reviews with ratings, displayed in a 3-column grid.
 * Each has a colored top bar for visual variety within the green palette.
 */
const TESTIMONIALS = [
  {
    name: 'Margaret T.',
    role: 'Patient · Managing 8 medications',
    text: "This is the first app that made me feel like I actually understand what I'm taking. The interaction alerts have genuinely helped me.",
    rating: 5,
    color: '#059669',
  },
  {
    name: 'Dr. Aisha K.',
    role: 'General Practitioner · Boston',
    text: 'My patients who arrive with a Medicine Cabinet summary are the most informed I see. The doctor report is genuinely useful in practice.',
    rating: 5,
    color: '#047857',
  },
  {
    name: 'Carlos R.',
    role: 'Caregiver · Managing his father',
    text: "Managing my father's 12 medications from another city was overwhelming. Now I see everything from my phone. It changed everything.",
    rating: 5,
    color: '#10b981',
  },
];

/**
 * FLOATING_ICONS — Background decorative icons that float gently
 * behind the hero section to create depth and a medical atmosphere.
 * Each has a position, size, opacity, and animation delay.
 */
const FLOATING_ICONS = [
  { Icon: I.Cross, size: 28, top: '12%', left: '8%', opacity: 0.06, delay: '0s' },
  { Icon: I.Pill, size: 22, top: '25%', right: '12%', opacity: 0.05, delay: '1s' },
  { Icon: I.Heart, size: 20, top: '60%', left: '5%', opacity: 0.04, delay: '2s' },
  { Icon: I.Shield, size: 24, top: '75%', right: '8%', opacity: 0.06, delay: '0.5s' },
  { Icon: I.Activity, size: 26, top: '40%', left: '15%', opacity: 0.04, delay: '1.5s' },
  { Icon: I.Stethoscope, size: 22, top: '18%', right: '25%', opacity: 0.05, delay: '2.5s' },
  { Icon: I.Clipboard, size: 20, top: '85%', left: '20%', opacity: 0.04, delay: '3s' },
  { Icon: I.Cross, size: 18, top: '50%', right: '20%', opacity: 0.03, delay: '1.8s' },
];


/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ───────────────────────────────────────────────────────────────
   The main landing page for Medicine Cabinet. This is the first
   page users see before logging in. It includes:

   1. Fixed navbar with logo, nav links, theme toggle, and LOGIN
   2. Animated ticker bar with trust signals
   3. Full-screen hero with headline, CTA, and floating stat cards
   4. Animated statistics counters section
   5. Feature bento grid (6 features)
   6. Dashboard showcase with browser mockup
   7. "How It Works" 4-step process
   8. Testimonials from patients/doctors
   9. Final CTA section
   10. Footer with links

   @param {Function} onLogin - Callback when user clicks login/get started
   ═══════════════════════════════════════════════════════════════ */
const LandingPage = ({ onLogin }) => {
  /* ── Access theme context for dark/light mode toggle ── */
  const { theme, toggleTheme } = useTheme();

  /* ── Login modal state ── */
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  /* ── Animation & interaction state ── */
  const [loaded, setLoaded] = useState(false);         // Triggers hero entrance animation
  const [scrollY, setScrollY] = useState(0);            // Current scroll position for parallax
  const [navScrolled, setNavScrolled] = useState(false); // Whether navbar should be opaque

  /* ── Refs for sections ── */
  const heroRef = useRef(null);

  /* ── IntersectionObserver hooks — one per animated section ── */
  const [statsRef, statsInView] = useInView(0.3);
  const [featRef, featInView] = useInView(0.08);
  const [howRef, howInView] = useInView(0.08);
  const [testRef, testInView] = useInView(0.08);
  const [ctaRef, ctaInView] = useInView(0.2);

  /* ── Animated counter values (only start counting when section is in view) ── */
  const users = useCountUp(10000, statsInView);
  const meds = useCountUp(50000, statsInView);
  const checks = useCountUp(120000, statsInView);

  /**
   * handleScroll — Updates scroll position state for parallax effects
   * and determines if the navbar should switch to its scrolled style.
   * Uses useCallback to prevent re-creating the function on each render.
   */
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
    setNavScrolled(window.scrollY > 40);
  }, []);

  /**
   * Initial setup effect — triggers the hero entrance animation
   * after a short delay and attaches the scroll listener for
   * parallax and navbar effects.
   */
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  /**
   * submit — Handles both login and registration form submission.
   * Prevents default form behavior and triggers the onLogin callback
   * which switches the app to the authenticated dashboard view.
   */
  const submit = (e) => {
    e.preventDefault();
    onLogin();
  };

  /**
   * openLogin — Opens the login modal and sets it to sign-in mode.
   * Called when user clicks "Sign In" in the navbar.
   */
  const openLogin = () => {
    setAuthMode('login');
    setShowLoginModal(true);
  };

  /**
   * openRegister — Opens the login modal and sets it to register mode.
   * Called when user clicks "Get Started" in the navbar.
   */
  const openRegister = () => {
    setAuthMode('register');
    setShowLoginModal(true);
  };

  return (
    <div className="lp">

      {/* ─────────────────────────────────────────────────────────
          FLOATING MEDICAL ICONS (Background Decoration)
          ─────────────────────────────────────────────────────────
          Semi-transparent medical icons float gently across the
          background to create a healthcare atmosphere without
          distracting from the content.
       */}
      <div className="lp-floating-icons" aria-hidden="true">
        {FLOATING_ICONS.map((item, i) => (
          <div
            key={i}
            className="floating-icon"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              opacity: item.opacity,
              animationDelay: item.delay,
            }}
          >
            <item.Icon width={item.size} height={item.size} />
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────
          NAVBAR — Fixed top navigation bar
          ─────────────────────────────────────────────────────────
          Contains: Logo, navigation links, theme toggle, and
          LOGIN button. The navbar becomes opaque and gets a subtle
          shadow when the user scrolls down (controlled by
          navScrolled state). LOGIN is in the navbar, NOT on the page.
       */}
      <header className={`lp-nav ${navScrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-w">
          {/* App logo */}
          <div className="lp-logo">
            <div className="logo-pill-icon">
              <I.Pill width={16} height={16} />
            </div>
            <span className="logo-text">
              Medicine<em>Cabinet</em>
            </span>
          </div>

          {/* Main navigation links — smooth scroll to sections */}
          <nav className="lp-links">
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#reviews">Reviews</a>
          </nav>

          {/* Right side: theme toggle + auth buttons */}
          <div className="lp-nav-r">
            {/* Theme toggle button (sun/moon) */}
            <button
              className="nav-icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <I.Sun width={16} height={16} />
                : <I.Moon width={16} height={16} />
              }
            </button>

            {/* Sign In — opens the login modal */}
            <button
              id="nav-signin"
              className="nav-ghost-btn"
              onClick={openLogin}
            >
              Sign In
            </button>

            {/* Get Started — opens the registration modal */}
            <button
              id="nav-cta"
              className="nav-cta-btn"
              onClick={openRegister}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────
          TICKER BAR — Auto-scrolling trust signals
          ─────────────────────────────────────────────────────────
          A thin animated bar below the navbar that continuously
          scrolls through trust badges (user count, encryption,
          uptime, etc.). The track is duplicated so it loops
          seamlessly with CSS animation.
       */}
      <div className="lp-ticker">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-diamond">◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          HERO SECTION — Full-screen above-the-fold content
          ─────────────────────────────────────────────────────────
          This is the most important section — the first thing
          visitors see. It has:
          - Animated gradient background blobs (parallax)
          - Subtle grid pattern overlay
          - Headline with gradient text animation
          - Sub-headline with value proposition
          - Two CTA buttons
          - Trust chips (HIPAA, Encrypted, FDA, Free)
          - Floating stat notification cards (right side)
          - Photo strip at the bottom
       */}
      <section className="lp-hero" ref={heroRef}>
        {/* Animated background — gradient blobs that drift slowly */}
        <div className="hero-bg">
          <div
            className="hero-blob hero-blob-1"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          />
          <div
            className="hero-blob hero-blob-2"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          />
          <div className="hero-blob hero-blob-3" />
          {/* Subtle grid pattern — masked to fade at edges */}
          <div className="hero-grid-lines" />
        </div>

        <div className="lp-w">
          <div className={`hero-inner ${loaded ? 'hero-loaded' : ''}`}>

            {/* ── LEFT SIDE: Headlines & CTAs ── */}
            <div className="hero-left">
              {/* Trust badge with pulsing green dot */}
              <div className="hero-badge">
                <span className="hero-badge-pulse" />
                <span>Trusted by 10,000+ patients worldwide</span>
              </div>

              {/* Main headline — each line animates in with staggered delay */}
              <h1 className="hero-h1">
                <span className="h1-line h1-line-1">Your complete</span>
                <span className="h1-line h1-line-2">
                  <span className="h1-gradient">medicine companion.</span>
                </span>
              </h1>

              {/* Supporting text — explains the value proposition */}
              <p className="hero-sub">
                Medicine Cabinet gives you total clarity on your prescriptions — check dangerous
                interactions, track side effects, and walk into every appointment fully prepared.
                Built for patients, caregivers, and healthcare professionals.
              </p>

              {/* CTA buttons */}
              <div className="hero-actions">
                <button
                  id="hero-cta"
                  className="hero-primary-btn"
                  onClick={openRegister}
                >
                  <span>Start Free — No Card Needed</span>
                  <I.Arrow width={16} height={16} />
                </button>
                <button className="hero-ghost-btn">
                  <span className="hero-play">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                      <polygon points="2,1 9,5 2,9" />
                    </svg>
                  </span>
                  Watch demo
                </button>
              </div>

              {/* Trust chips — small badges showing key differentiators */}
              <div className="hero-chips">
                {[
                  { Icon: I.Lock, t: 'HIPAA-Friendly' },
                  { Icon: I.Shield, t: 'Encrypted' },
                  { Icon: I.Database, t: 'FDA Data' },
                  { Icon: I.Heart, t: 'Free Forever' },
                ].map(({ Icon, t }, i) => (
                  <div key={i} className="hero-chip">
                    <Icon width={12} height={12} />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT SIDE: Floating notification cards ── */}
            <div className="hero-right" id="auth-anchor">
              {/* These 3 cards float with gentle bobbing animations
                  to show the kind of notifications users will get */}
              <div className="float-stat float-stat-1">
                <div className="fs-icon" style={{ color: '#059669' }}>
                  <I.Check width={14} height={14} />
                </div>
                <div>
                  <div className="fs-title">Dose Confirmed</div>
                  <div className="fs-sub">Metformin · 8:00 AM</div>
                </div>
              </div>

              <div className="float-stat float-stat-2">
                <div className="fs-icon" style={{ color: '#d97706' }}>
                  <I.Warn width={14} height={14} />
                </div>
                <div>
                  <div className="fs-title">Interaction Detected</div>
                  <div className="fs-sub">Review recommended</div>
                </div>
              </div>

              <div className="float-stat float-stat-3">
                <div className="fs-icon" style={{ color: '#047857' }}>
                  <I.Activity width={14} height={14} />
                </div>
                <div>
                  <div className="fs-title">Adherence This Week</div>
                  <div className="fs-sub">91% — Great work</div>
                </div>
              </div>

              {/* Hero visual card — shows a mock dashboard preview */}
              <div className="hero-visual-card">
                <div className="hero-visual-glow" />
                <div className="hvc-header">
                  <div className="hvc-dot hvc-dot--green" />
                  <span className="hvc-title">Dashboard Preview</span>
                </div>
                <div className="hvc-content">
                  <div className="hvc-stat-row">
                    {[
                      { label: 'Active Meds', value: '4', color: '#059669' },
                      { label: 'Alerts', value: '2', color: '#d97706' },
                      { label: 'Adherence', value: '91%', color: '#10b981' },
                    ].map((s, i) => (
                      <div key={i} className="hvc-stat" style={{ borderTopColor: s.color }}>
                        <div className="hvc-stat-value" style={{ color: s.color }}>{s.value}</div>
                        <div className="hvc-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="hvc-bar-chart">
                    {[65, 80, 45, 90, 70, 85, 55].map((h, i) => (
                      <div
                        key={i}
                        className="hvc-bar"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${0.8 + i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="hvc-bar-labels">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          STATS SECTION — Animated number counters
          ─────────────────────────────────────────────────────────
          Four large statistics that count up when scrolled into
          view, creating an impressive visual effect. Each stat
          has an icon, number, and label.
       */}
      <section className="lp-stats" ref={statsRef}>
        <div className="lp-w stats-grid">
          {[
            { num: users, suf: '+', label: 'Active Patients', Icon: I.Users, c: '#059669' },
            { num: meds, suf: '+', label: 'Medications Tracked', Icon: I.Pill, c: '#047857' },
            { num: checks, suf: '+', label: 'Interactions Checked', Icon: I.Warn, c: '#10b981' },
            { num: 99, suf: '.9%', label: 'Uptime Guarantee', Icon: I.Shield, c: '#059669' },
          ].map((s, i) => (
            <div
              key={i}
              className={`stat-card ${statsInView ? 'stat-in' : ''}`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div
                className="stat-icon-wrap"
                style={{ color: s.c, background: `${s.c}15` }}
              >
                <s.Icon width={20} height={20} />
              </div>
              <div className="stat-num" style={{ color: s.c }}>
                {s.num.toLocaleString()}{s.suf}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FEATURES SECTION — 6-item bento grid
          ─────────────────────────────────────────────────────────
          Displays the core product features in a visually striking
          3×2 bento grid. Each tile has:
          - Colored icon with tinted background
          - Feature title
          - Description text
          - Hover glow effect
          - Arrow that appears on hover
       */}
      <section className="lp-features" id="features" ref={featRef}>
        <div className="lp-w">
          {/* Section header — animates in when scrolled into view */}
          <div className={`section-head ${featInView ? 'sh-visible' : ''}`}>
            <div className="section-tag">
              <span className="stag-sq" />
              Features
            </div>
            <h2 className="section-h2">
              Built for the real complexity of health
            </h2>
            <p className="section-p">
              Not a simple reminder app. A complete system for managing multiple
              medications, conditions, and providers without losing your mind.
            </p>
          </div>

          {/* Feature tiles — staggered fade-in animation */}
          <div className="feat-bento">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`feat-tile ${featInView ? 'ft-in' : ''}`}
                style={{
                  transitionDelay: `${i * 70}ms`,
                  '--glow': f.glow,
                }}
              >
                <div className="ft-glow-hover" />
                <div
                  className="ft-icon"
                  style={{ color: f.color, background: `${f.color}18` }}
                >
                  <f.Icon width={22} height={22} />
                </div>
                <h3 className="ft-title">{f.label}</h3>
                <p className="ft-desc">{f.desc}</p>
                <div className="ft-arr" style={{ color: f.color }}>
                  <I.ChevR width={16} height={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          DASHBOARD SHOWCASE — Product preview section
          ─────────────────────────────────────────────────────────
          A split-layout section with feature bullets on the left
          and a browser mockup showing the dashboard on the right.
          Uses a darker green background for contrast.
       */}
      <section className="lp-showcase">
        <div className="showcase-inner lp-w">
          {/* Left side: text content and feature list */}
          <div className="showcase-text">
            <div className="section-tag section-tag--light">
              <span className="stag-sq" />
              Your Dashboard
            </div>
            <h2 className="showcase-h2">
              Everything visible.<br />Nothing left to chance.
            </h2>
            <p className="showcase-p">
              See every medication, every interaction risk, and your full
              adherence history — all in one view designed for clarity,
              not complexity.
            </p>
            {/* Checklist of key dashboard capabilities */}
            <ul className="showcase-list">
              {[
                'Full medication history in one place',
                'Color-coded interaction severity levels',
                'Symptom-to-medication correlation engine',
                'Adherence tracking updated in real time',
              ].map((t, i) => (
                <li key={i} className="showcase-li">
                  <span className="sli-check">
                    <I.Check width={12} height={12} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <button className="showcase-btn" onClick={openRegister}>
              Open Your Dashboard
              <I.Arrow width={15} height={15} />
            </button>
          </div>

          {/* Right side: browser frame mockup with stats */}
          <div className="showcase-visual">
            <div className="showcase-glow-ring" />
            <div className="browser-frame">
              <div className="browser-bar">
                <div className="browser-dots">
                  <span /><span /><span />
                </div>
                <div className="browser-url">
                  dashboard.medicinecabinet.app
                </div>
              </div>
              {/* Mock dashboard content instead of an image */}
              <div className="browser-mock-content">
                <div className="bmc-greeting">Good evening, John 👋</div>
                <div className="bmc-cards">
                  {[
                    { label: 'Active Meds', val: '4', color: '#059669' },
                    { label: 'Alerts', val: '2', color: '#d97706' },
                    { label: 'Side Effects', val: '4', color: '#10b981' },
                    { label: 'Reports', val: '1', color: '#047857' },
                  ].map((c, i) => (
                    <div key={i} className="bmc-card" style={{ borderTopColor: c.color }}>
                      <div className="bmc-val" style={{ color: c.color }}>{c.val}</div>
                      <div className="bmc-label">{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          HOW IT WORKS — 4-step process
          ─────────────────────────────────────────────────────────
          A simple 4-step guide showing users how easy it is to
          get started. Each step has a large gradient number,
          title, and description. A connecting line runs across
          the top to suggest progression.
       */}
      <section className="lp-how" id="how" ref={howRef}>
        <div className="lp-w">
          <div className={`section-head ${howInView ? 'sh-visible' : ''}`}>
            <div className="section-tag">
              <span className="stag-sq" />
              How It Works
            </div>
            <h2 className="section-h2">Up and running in 5 minutes</h2>
            <p className="section-p">
              No complicated onboarding. No confusing flows. Add your
              medications and you're immediately in control.
            </p>
          </div>
          <div className="how-grid">
            {HOW.map((s, i) => (
              <div
                key={i}
                className={`how-card ${howInView ? 'hc-in' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="how-num">{s.n}</div>
                <h3 className="how-title">{s.title}</h3>
                <p className="how-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TESTIMONIALS — User reviews section
          ─────────────────────────────────────────────────────────
          Three review cards from different user types (patient,
          doctor, caregiver) to demonstrate broad appeal. Each
          card has star ratings, quoted text, and author info.
       */}
      <section className="lp-reviews" id="reviews" ref={testRef}>
        <div className="lp-w">
          <div className={`section-head sh-light ${testInView ? 'sh-visible' : ''}`}>
            <div className="section-tag section-tag--light">
              <span className="stag-sq" />
              Reviews
            </div>
            <h2 className="section-h2 sh2-light">
              Trusted by patients, caregivers & doctors
            </h2>
          </div>
          <div className="reviews-grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`review-card ${testInView ? 'rc-in' : ''}`}
                style={{ transitionDelay: `${i * 100}ms`, '--rc-color': t.color }}
              >
                <div className="rc-top-bar" style={{ background: t.color }} />
                <div className="rc-stars">
                  {Array(t.rating).fill(0).map((_, si) => (
                    <I.Star key={si} width={13} height={13} style={{ color: '#f59e0b' }} />
                  ))}
                </div>
                <p className="rc-quote">"{t.text}"</p>
                <div className="rc-author">
                  <div
                    className="rc-avatar"
                    style={{ background: `linear-gradient(135deg, ${t.color}, #064e3b)` }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="rc-name">{t.name}</div>
                    <div className="rc-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FINAL CTA — Last call-to-action before footer
          ─────────────────────────────────────────────────────────
          A large, centered CTA section with glowing background
          effects. Designed to capture users who scrolled through
          the entire page.
       */}
      <section className="lp-cta" ref={ctaRef}>
        <div className="lp-w">
          <div className={`cta-box ${ctaInView ? 'cta-in' : ''}`}>
            <div className="cta-glow-1" />
            <div className="cta-glow-2" />
            <div className="section-tag" style={{ marginBottom: '16px' }}>
              <span className="stag-sq" />
              Get Started Today
            </div>
            <h2 className="cta-h2">Take control of your health.</h2>
            <p className="cta-p">
              Free forever for individuals. No credit card, no commitments —
              just clarity over every medication you take.
            </p>
            <button
              id="cta-final"
              className="cta-main-btn"
              onClick={openRegister}
            >
              Start Free — No Card Needed
              <I.Arrow width={16} height={16} />
            </button>
            <div className="cta-trust">
              {['10,000+ users', 'No credit card', 'Cancel anytime', 'Free forever'].map((t, i) => (
                <span key={i} className="cta-chip">
                  <I.Check width={11} height={11} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FOOTER — Bottom navigation and legal info
       */}
      <footer className="lp-footer">
        <div className="lp-w">
          <div className="footer-row">
            <div className="lp-logo">
              <div className="logo-pill-icon">
                <I.Pill width={15} height={15} />
              </div>
              <span className="logo-text">
                Medicine<em>Cabinet</em>
              </span>
            </div>
            <div className="footer-links">
              {['Privacy Policy', 'Terms of Service', 'Contact Us', 'Help Center'].map((l) => (
                <a key={l} href="#">{l}</a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            © 2024 Medicine Cabinet — Not a substitute for professional
            medical advice. Always consult a qualified healthcare provider.
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────
          LOGIN MODAL — Overlay authentication dialog
          ─────────────────────────────────────────────────────────
          A centered modal that appears when users click Sign In
          or Get Started. Supports both login and registration
          modes with a tabbed interface. Clicking the backdrop
          closes the modal.
       */}
      {showLoginModal && (
        <div className="login-modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              className="login-modal-close"
              onClick={() => setShowLoginModal(false)}
              aria-label="Close login"
            >
              ✕
            </button>

            {/* Modal glow decoration */}
            <div className="login-modal-glow" />

            {/* Logo at top of modal */}
            <div className="login-modal-logo">
              <div className="logo-pill-icon">
                <I.Pill width={16} height={16} />
              </div>
              <span className="logo-text">
                Medicine<em>Cabinet</em>
              </span>
            </div>

            {/* Auth mode tabs — switch between Sign In and Register */}
            <div className="auth-tabs">
              <button
                id="tab-login"
                className={`auth-tab ${authMode === 'login' ? 'act' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button
                id="tab-register"
                className={`auth-tab ${authMode === 'register' ? 'act' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>

            {/* Authentication form */}
            <form className="auth-form" onSubmit={submit}>
              {/* Name field — only shown in register mode */}
              {authMode === 'register' && (
                <div className="af">
                  <label htmlFor="f-name">Full Name</label>
                  <input
                    id="f-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              {/* Email field */}
              <div className="af">
                <label htmlFor="f-email">Email</label>
                <input
                  id="f-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password field */}
              <div className="af">
                <label htmlFor="f-pass">Password</label>
                <input
                  id="f-pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Forgot password link — only in login mode */}
              {authMode === 'login' && (
                <a href="#" className="af-forgot">Forgot password?</a>
              )}

              {/* Submit button */}
              <button id="auth-submit" type="submit" className="auth-submit-btn">
                {authMode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}
                <I.Arrow width={15} height={15} />
              </button>

              {/* Social login divider */}
              <div className="af-divider"><span>or continue with</span></div>

              {/* Google OAuth button */}
              <button type="button" id="btn-google" className="auth-google-btn">
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Legal terms */}
            <p className="auth-terms">
              By signing up you agree to our <a href="#">Terms</a> &{' '}
              <a href="#">Privacy Policy</a>. Your data is encrypted and never sold.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
