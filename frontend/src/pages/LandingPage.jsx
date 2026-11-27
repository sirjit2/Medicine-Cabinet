import { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

/* ═══════════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════════ */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const icon = (children, extra = {}) => (p) => (
  <svg {...base} {...extra} {...p}>{children}</svg>
);

const I = {
  Pill: icon(<><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></>),
  Shield: icon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>),
  Activity: icon(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
  File: icon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>),
  Warn: icon(<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>),
  Check: icon(<polyline points="20 6 9 17 4 12" />, { strokeWidth: 2.5 }),
  Cross: icon(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>, { strokeWidth: 2.4 }),
  Arrow: icon(<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>, { strokeWidth: 2.2 }),
  Clock: icon(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>),
  Bell: icon(<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>),
  Users: icon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  Lock: icon(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  Heart: icon(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />),
  Stethoscope: icon(<><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" /></>),
  Download: icon(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>),
  Calendar: icon(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>),
  Plus: icon(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>, { strokeWidth: 2.2 }),
};

/* ═══════════════════════════════════════════════════════════════
   CONTENT
   ═══════════════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { id: 'features', label: 'Features' },
  { id: 'product', label: 'Product' },
  { id: 'audience', label: 'Who it\'s for' },
  { id: 'how', label: 'How it works' },
  { id: 'security', label: 'Security' },
  { id: 'faq', label: 'FAQ' },
];
const SECTION_IDS = NAV_LINKS.map((l) => l.id);

const CAPABILITIES = [
  { Icon: I.Pill, label: 'Medication tracking' },
  { Icon: I.Shield, label: 'Interaction checks' },
  { Icon: I.Activity, label: 'Side-effect log' },
  { Icon: I.File, label: 'Doctor reports' },
  { Icon: I.Users, label: 'Caregiver sharing' },
  { Icon: I.Lock, label: 'Private by default' },
];

const FEATURES = [
  { Icon: I.Pill, title: 'Track medications', desc: 'Name, strength, dose, schedule, start date and prescriber for every prescription, over-the-counter drug and supplement, in one organised list.' },
  { Icon: I.Bell, title: 'Dose reminders', desc: 'Get reminded when a dose is due and mark it taken in one tap. Skipped doses are recorded so your history stays honest.' },
  { Icon: I.Shield, title: 'Check interactions', desc: 'Every new medication is compared against your whole list. Warnings are rated by severity and explained in plain language.' },
  { Icon: I.Activity, title: 'Log side effects', desc: 'Note symptoms with severity and timing, then see which medication they line up with over days and weeks.' },
  { Icon: I.Clock, title: 'Dosage timeline', desc: 'A clear visual history of what you took and when, so adherence patterns and gaps are easy to spot.' },
  { Icon: I.File, title: 'Health reports', desc: 'Generate a printable summary of medications, allergies, side effects and adherence to bring to any appointment.' },
  { Icon: I.Users, title: 'Caregiver sharing', desc: 'Help a parent, partner or child stay on track by managing a shared list, with you in control of who can see what.' },
  { Icon: I.Download, title: 'Export anything', desc: 'Download your records whenever you like, or delete everything with a single action. Your data is yours to take.' },
];

const SHOWCASE = [
  { id: 'schedule', title: 'Today\'s schedule', desc: 'See every dose due today, mark them off, and watch your progress for the day fill up.', Icon: I.Calendar },
  { id: 'interactions', title: 'Interaction alerts', desc: 'Severity-rated warnings appear the moment two medications overlap, with clear next steps.', Icon: I.Shield },
  { id: 'effects', title: 'Side-effect log', desc: 'Record how you feel and spot patterns between symptoms and the medicines you take.', Icon: I.Activity },
  { id: 'report', title: 'Doctor report', desc: 'One tidy page with everything your clinician needs, ready to print or save.', Icon: I.File },
];

const AUDIENCE = [
  {
    Icon: I.Heart, who: 'Patients', tag: 'Managing your own medicines',
    points: ['Never wonder whether you took a dose', 'Catch risky combinations early', 'Walk into appointments prepared'],
  },
  {
    Icon: I.Users, who: 'Caregivers', tag: 'Looking after someone else',
    points: ['Keep a loved one\'s list in one place', 'Know what has been taken today', 'Share one clear summary with their doctor'],
  },
  {
    Icon: I.Stethoscope, who: 'Clinicians', tag: 'Seeing patients who use it',
    points: ['A clean medication summary on arrival', 'Documented side effects and timing', 'Fewer gaps in the medication history'],
  },
];

const STEPS = [
  { title: 'Add your medications', desc: 'Enter name, dose and schedule once. Edit, pause or remove any medication whenever things change.' },
  { title: 'Get safety checks', desc: 'We compare each new medication with your list and flag interactions as soon as they overlap.' },
  { title: 'Track every day', desc: 'Mark doses taken, log how you feel, and build a record that shows what is really happening.' },
  { title: 'Share a summary', desc: 'Print or save a clear report to bring to your next appointment, so nothing is left to memory.' },
];

const SECURITY = [
  { Icon: I.Lock, title: 'Encrypted sign-in', desc: 'Passwords are never stored in plain text.' },
  { Icon: I.Shield, title: 'Private by default', desc: 'Your records are visible only to you unless you choose to share.' },
  { Icon: I.Users, title: 'You control sharing', desc: 'Caregiver access is something you grant and can withdraw.' },
  { Icon: I.Download, title: 'Export any time', desc: 'Take a full copy of your data whenever you want.' },
  { Icon: I.Cross, title: 'Delete in one click', desc: 'Remove all of your data permanently, no questions asked.' },
  { Icon: I.Heart, title: 'Never sold', desc: 'Your health information is not a product.' },
];

const COMPARE_COLS = ['Paper list', 'Notes app', 'Medicine Cabinet'];
const COMPARE_ROWS = [
  { label: 'Keeps all medications in one place', v: [true, true, true] },
  { label: 'Reminds you when a dose is due', v: [false, false, true] },
  { label: 'Checks for drug interactions', v: [false, false, true] },
  { label: 'Tracks side effects against medications', v: [false, false, true] },
  { label: 'Shows adherence history', v: [false, false, true] },
  { label: 'Prints a clean summary for your doctor', v: [false, false, true] },
  { label: 'Lets a caregiver help', v: [false, false, true] },
];

const FAQ = [
  { q: 'Does Medicine Cabinet replace advice from my doctor or pharmacist?', a: 'No. It is an organisation and awareness tool. Interaction warnings are informational, so always speak to a doctor or pharmacist before starting, stopping or changing any medication.' },
  { q: 'Who can see my medication data?', a: 'Only you. Your records are private by default, and the only way anyone else sees them is if you choose to share a report or give a caregiver access.' },
  { q: 'How do interaction checks work?', a: 'When you add a medication, it is compared against everything already on your list. If a combination is known to cause problems, you see a severity-rated alert with a plain-language explanation and a suggested next step.' },
  { q: 'Can I manage medications for someone else?', a: 'Yes. Caregiver mode lets you keep a family member\'s list, record doses and prepare their summary for appointments, from wherever you are.' },
  { q: 'What goes into the doctor report?', a: 'Your current medications and doses, known allergies, logged side effects and your recent adherence. It is formatted as a single clear page you can print or save.' },
  { q: 'Can I take my data with me or delete it?', a: 'Yes, both. You can export your records at any time, and you can delete all of your data in one action.' },
  { q: 'Does it cost anything to start?', a: 'Creating an account is free and takes about two minutes. You can add your medications and see your first safety check right away.' },
];

const FOOTER_COLS = [
  { title: 'Product', links: [['Features', '#features'], ['Product tour', '#product'], ['How it works', '#how'], ['Security', '#security']] },
  { title: 'Who it\'s for', links: [['Patients', '#audience'], ['Caregivers', '#audience'], ['Clinicians', '#audience']] },
  { title: 'Support', links: [['FAQ', '#faq'], ['Contact us', '#'], ['Help centre', '#']] },
  { title: 'Legal', links: [['Privacy policy', '#'], ['Terms of service', '#'], ['Medical disclaimer', '#disclaimer']] },
];

/* ═══════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════ */

/** Adds `.in` to every [data-reveal] element once it scrolls into view. */
function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const els = root.querySelectorAll('[data-reveal]');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

/** Tracks which section is currently centred in the viewport. */
function useActiveSection(ids) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT SHOWCASE PANELS (illustrative example data)
   ═══════════════════════════════════════════════════════════════ */
const DOSES = [
  { name: 'Metformin 500mg', meta: '8:00 AM · With breakfast', state: 'taken' },
  { name: 'Atorvastatin 20mg', meta: '9:00 PM · Evening', state: 'due' },
  { name: 'Lisinopril 10mg', meta: '2:00 PM · With water', state: 'taken' },
  { name: 'Vitamin D 1000 IU', meta: '8:00 AM · With breakfast', state: 'taken' },
];

const ALERTS = [
  { level: 'major', label: 'Major', pair: 'Warfarin + Ibuprofen', text: 'May raise the risk of bleeding. Speak to your pharmacist before combining.' },
  { level: 'moderate', label: 'Moderate', pair: 'Lisinopril + Potassium supplements', text: 'Potassium levels can rise. Your doctor may want to monitor this.' },
  { level: 'minor', label: 'Minor', pair: 'Atorvastatin + Grapefruit juice', text: 'Large amounts may increase side effects. Moderation is advised.' },
];

const EFFECT_DAYS = [
  { d: 'Mon', v: 20 }, { d: 'Tue', v: 35 }, { d: 'Wed', v: 70 }, { d: 'Thu', v: 55 },
  { d: 'Fri', v: 30 }, { d: 'Sat', v: 15 }, { d: 'Sun', v: 10 },
];

const ShowcasePanel = ({ id }) => {
  if (id === 'schedule') {
    return (
      <div className="sp sp-schedule">
        <div className="sp-head"><strong>Today</strong><span>3 of 4 taken</span></div>
        <div className="hc-progress"><span style={{ width: '75%' }} /></div>
        {DOSES.map((d) => (
          <div className="hc-row" key={d.name}>
            <div>
              <div className="hc-name">{d.name}</div>
              <div className="hc-meta">{d.meta}</div>
            </div>
            {d.state === 'taken'
              ? <span className="tag tag--ok"><I.Check width={11} height={11} />Taken</span>
              : <span className="tag tag--due"><span className="due-dot" />Due</span>}
          </div>
        ))}
      </div>
    );
  }
  if (id === 'interactions') {
    return (
      <div className="sp">
        <div className="sp-head"><strong>Interaction check</strong><span>3 findings</span></div>
        {ALERTS.map((a) => (
          <div className={`alert-row alert-row--${a.level}`} key={a.pair}>
            <span className="alert-badge">{a.label}</span>
            <div>
              <div className="alert-pair">{a.pair}</div>
              <div className="alert-text">{a.text}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (id === 'effects') {
    return (
      <div className="sp">
        <div className="sp-head"><strong>Symptom severity · last 7 days</strong><span>Headache</span></div>
        <div className="bars">
          {EFFECT_DAYS.map((b, i) => (
            <div className="bar-col" key={b.d}>
              <span className="bar" style={{ '--h': `${b.v}%`, '--i': i }} />
              <span className="bar-l">{b.d}</span>
            </div>
          ))}
        </div>
        <div className="insight">
          <I.Activity width={16} height={16} />
          <span>Severity peaked on Wednesday, the day a new medication was started. Worth mentioning to your doctor.</span>
        </div>
      </div>
    );
  }
  return (
    <div className="sp sp-report">
      <div className="doc">
        <div className="doc-title">Medication summary</div>
        <div className="doc-sub">Prepared for your appointment</div>
        <div className="doc-line doc-line--h">Current medications</div>
        <div className="doc-line">Metformin 500mg · twice daily</div>
        <div className="doc-line">Lisinopril 10mg · once daily</div>
        <div className="doc-line">Atorvastatin 20mg · evening</div>
        <div className="doc-line doc-line--h">Allergies</div>
        <div className="doc-line">Penicillin</div>
        <div className="doc-line doc-line--h">Adherence · last 30 days</div>
        <div className="doc-line">91% of doses taken on time</div>
      </div>
      <span className="doc-btn"><I.Download width={14} height={14} />Save as PDF</span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
const LandingPage = ({ onLogin, onSignIn }) => {
  const rootRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lisinoprilTaken, setLisinoprilTaken] = useState(false);
  const [tab, setTab] = useState(0);
  const [tabPaused, setTabPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const active = useActiveSection(SECTION_IDS);
  useScrollReveal(rootRef);

  /* Hero entrance + navbar shadow */
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* Hero card: second dose flips between Due and Taken */
  useEffect(() => {
    const id = setInterval(() => setLisinoprilTaken((v) => !v), 3600);
    return () => clearInterval(id);
  }, []);

  /* Showcase auto-advance (stops once the visitor interacts) */
  useEffect(() => {
    if (tabPaused) return undefined;
    const id = setInterval(() => setTab((t) => (t + 1) % SHOWCASE.length), 6000);
    return () => clearInterval(id);
  }, [tabPaused]);

  /* Escape closes the modal and the page doesn't scroll behind it */
  useEffect(() => {
    if (!showModal) return undefined;
    const onKey = (e) => e.key === 'Escape' && setShowModal(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showModal]);

  const openLogin = () => onSignIn();
  const openRegister = () => { setAuthMode('register'); setShowModal(true); };
  const submit = (e) => { e.preventDefault(); onLogin(); };
  const pickTab = (i) => { setTab(i); setTabPaused(true); };

  const trackPointer = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const takenCount = lisinoprilTaken ? 2 : 1;
  const progress = (takenCount / 2) * 100;

  return (
    <div className={`lp ${ready ? 'is-ready' : ''}`} ref={rootRef}>
      {/* ───────────── NAV ───────────── */}
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-w">
          <a className="lp-logo" href="#top" aria-label="Medicine Cabinet home">
            <span className="logo-pill-icon"><I.Pill width={18} height={18} /></span>
            <span className="logo-text">Medicine Cabinet</span>
          </a>

          <nav className="lp-links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''}>{l.label}</a>
            ))}
          </nav>

          <div className="lp-nav-r">
            <button id="nav-signin" className="nav-ghost-btn" onClick={openLogin}>Sign in</button>
            <button id="nav-cta" className="nav-cta-btn" onClick={openRegister}>Get started</button>
          </div>
        </div>
      </header>

      {/* ───────────── HERO ───────────── */}
      <section className="lp-hero" id="top">
        <div className="hero-bg" aria-hidden="true">
          <span className="blob blob-a" />
          <span className="blob blob-b" />
          <span className="hero-grid" />
        </div>

        <div className="lp-w hero-inner">
          <div className="hero-left">
            <span className="hero-badge a-in" style={{ '--d': '0ms' }}>
              <span className="badge-dot" />
              Secure medication management
            </span>

            <h1 className="hero-h1">
              <span className="h1-mask"><span className="h1-line a-in" style={{ '--d': '90ms' }}>Every medication.</span></span>
              <span className="h1-mask"><span className="h1-line h1-accent a-in" style={{ '--d': '200ms' }}>One safe place.</span></span>
            </h1>

            <p className="hero-sub a-in" style={{ '--d': '320ms' }}>
              Track doses, catch risky drug interactions before they happen, log side effects,
              and share a clear health summary with your doctor. Built for patients,
              caregivers and the clinicians who treat them.
            </p>

            <div className="hero-actions a-in" style={{ '--d': '420ms' }}>
              <button id="hero-cta" className="btn-primary btn-primary--lg" onClick={openRegister}>
                Start your cabinet
                <I.Arrow width={18} height={18} />
              </button>
              <a className="btn-secondary btn-secondary--lg" href="#product">Take the tour</a>
            </div>

            <ul className="hero-checks a-in" style={{ '--d': '520ms' }}>
              <li><I.Check width={14} height={14} />Free to start</li>
              <li><I.Check width={14} height={14} />Set up in two minutes</li>
              <li><I.Check width={14} height={14} />Export or delete any time</li>
            </ul>

            <p className="hero-note a-in" style={{ '--d': '580ms' }}>
              Information only. Not a substitute for medical advice.
            </p>
          </div>

          <div className="hero-visual a-in a-in--card" style={{ '--d': '300ms' }}>
            <div className="hero-card" aria-label="Example medication schedule">
              <div className="hc-head">
                <strong>Today's schedule</strong>
                <span className="hc-count" key={takenCount}>{takenCount} of 2 taken</span>
              </div>
              <div className="hc-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${progress}%` }} />
              </div>

              <div className="hc-row">
                <div>
                  <div className="hc-name">Metformin 500mg</div>
                  <div className="hc-meta">8:00 AM · With breakfast</div>
                </div>
                <span className="tag tag--ok"><I.Check width={11} height={11} />Taken</span>
              </div>

              <div className="hc-row">
                <div>
                  <div className="hc-name">Lisinopril 10mg</div>
                  <div className="hc-meta">2:00 PM · With water</div>
                </div>
                {lisinoprilTaken ? (
                  <span className="tag tag--ok tag--pop" key="taken"><I.Check width={11} height={11} />Taken</span>
                ) : (
                  <span className="tag tag--due tag--pop" key="due"><span className="due-dot" />Due</span>
                )}
              </div>

              <div className="hc-alert">
                <I.Warn width={18} height={18} />
                <div>
                  <div className="hc-alert-title">Major interaction</div>
                  <div className="hc-alert-text">Warfarin + Ibuprofen may raise bleeding risk. Ask your pharmacist.</div>
                </div>
              </div>
            </div>
            <span className="hero-chip hero-chip--a"><I.Bell width={14} height={14} />Reminder sent</span>
            <span className="hero-chip hero-chip--b"><I.Shield width={14} height={14} />Safety check passed</span>
          </div>
        </div>

        {/* Capability strip */}
        <div className="lp-w">
          <ul className="cap-strip" data-reveal>
            {CAPABILITIES.map(({ Icon, label }) => (
              <li key={label}><Icon width={18} height={18} />{label}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── FEATURES ───────────── */}
      <section className="lp-section" id="features">
        <div className="lp-w">
          <span className="eyebrow" data-reveal>Features</span>
          <h2 className="sec-h2" data-reveal style={{ '--d': '60ms' }}>Everything you need to stay on track</h2>
          <p className="sec-sub" data-reveal style={{ '--d': '120ms' }}>
            Medicine Cabinet covers the whole routine, from the first prescription to the
            conversation with your doctor, so nothing depends on memory.
          </p>

          <div className="feat-grid">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <article
                key={title}
                className="feat-card"
                data-reveal
                style={{ '--d': `${(i % 4) * 90}ms` }}
                onMouseMove={trackPointer}
              >
                <span className="feat-icon"><Icon width={22} height={22} /></span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── PRODUCT SHOWCASE ───────────── */}
      <section className="lp-section lp-section--tint" id="product">
        <div className="lp-w">
          <span className="eyebrow" data-reveal>Product tour</span>
          <h2 className="sec-h2" data-reveal style={{ '--d': '60ms' }}>See it in action</h2>
          <p className="sec-sub" data-reveal style={{ '--d': '120ms' }}>
            A closer look at the four screens you will use every day. Example data shown for illustration.
          </p>

          <div className="showcase" data-reveal>
            <div className="sc-tabs" role="tablist">
              {SHOWCASE.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={tab === i}
                  className={`sc-tab ${tab === i ? 'is-on' : ''}`}
                  onClick={() => pickTab(i)}
                >
                  <span className="sc-tab-icon"><s.Icon width={20} height={20} /></span>
                  <span className="sc-tab-copy">
                    <strong>{s.title}</strong>
                    <span>{s.desc}</span>
                  </span>
                  {tab === i && !tabPaused && <span className="sc-timer" key={`t-${tab}`} />}
                </button>
              ))}
            </div>

            <div className="sc-stage">
              <div className="sc-window">
                <div className="sc-bar" aria-hidden="true"><i /><i /><i /><span>medicinecabinet.app</span></div>
                <div className="sc-body" key={SHOWCASE[tab].id}>
                  <ShowcasePanel id={SHOWCASE[tab].id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── DEEP DIVES ───────────── */}
      <section className="lp-section">
        <div className="lp-w">
          <div className="dive" data-reveal>
            <div className="dive-copy">
              <span className="eyebrow">Interaction checker</span>
              <h3>Know about a problem before it becomes one</h3>
              <p>
                Adding a new prescription, an over-the-counter painkiller or a supplement?
                Medicine Cabinet compares it against everything you already take and tells
                you straight away if the combination needs attention.
              </p>
              <ul className="ticks">
                <li><I.Check width={14} height={14} />Three severity levels: major, moderate and minor</li>
                <li><I.Check width={14} height={14} />Plain-language explanations, not medical jargon</li>
                <li><I.Check width={14} height={14} />A clear suggested next step for every alert</li>
              </ul>
            </div>
            <div className="dive-visual">
              <div className="sp sp--card">
                {ALERTS.map((a) => (
                  <div className={`alert-row alert-row--${a.level}`} key={a.pair}>
                    <span className="alert-badge">{a.label}</span>
                    <div>
                      <div className="alert-pair">{a.pair}</div>
                      <div className="alert-text">{a.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dive dive--flip" data-reveal>
            <div className="dive-copy">
              <span className="eyebrow">Side effects and patterns</span>
              <h3>Turn "I think it started last week" into facts</h3>
              <p>
                Log a symptom in a few seconds with its severity and when it happened. Over
                time you will see how symptoms line up with doses and medication changes,
                which gives your doctor something concrete to work with.
              </p>
              <ul className="ticks">
                <li><I.Check width={14} height={14} />Quick daily logging with severity ratings</li>
                <li><I.Check width={14} height={14} />Weekly charts that show how symptoms change</li>
                <li><I.Check width={14} height={14} />Linked to the medications you were taking at the time</li>
              </ul>
            </div>
            <div className="dive-visual">
              <div className="sp sp--card">
                <div className="sp-head"><strong>Symptom severity · last 7 days</strong><span>Headache</span></div>
                <div className="bars">
                  {EFFECT_DAYS.map((b, i) => (
                    <div className="bar-col" key={b.d}>
                      <span className="bar" style={{ '--h': `${b.v}%`, '--i': i }} />
                      <span className="bar-l">{b.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dive" data-reveal>
            <div className="dive-copy">
              <span className="eyebrow">Doctor reports</span>
              <h3>Make every appointment count</h3>
              <p>
                Short appointments are easy to waste trying to remember what you take and
                how you have been. Generate one clean summary, print it or save it as a
                PDF, and hand your clinician the full picture in seconds.
              </p>
              <ul className="ticks">
                <li><I.Check width={14} height={14} />Medications, doses and schedules in one view</li>
                <li><I.Check width={14} height={14} />Allergies, side effects and adherence included</li>
                <li><I.Check width={14} height={14} />Ready to print or save with a single click</li>
              </ul>
            </div>
            <div className="dive-visual">
              <div className="sp sp--card sp-report">
                <div className="doc">
                  <div className="doc-title">Medication summary</div>
                  <div className="doc-sub">Prepared for your appointment</div>
                  <div className="doc-line doc-line--h">Current medications</div>
                  <div className="doc-line">Metformin 500mg · twice daily</div>
                  <div className="doc-line">Lisinopril 10mg · once daily</div>
                  <div className="doc-line doc-line--h">Adherence · last 30 days</div>
                  <div className="doc-line">91% of doses taken on time</div>
                </div>
                <span className="doc-btn"><I.Download width={14} height={14} />Save as PDF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── AUDIENCE ───────────── */}
      <section className="lp-section lp-section--white" id="audience">
        <div className="lp-w">
          <span className="eyebrow" data-reveal>Who it's for</span>
          <h2 className="sec-h2" data-reveal style={{ '--d': '60ms' }}>Made for everyone involved in your care</h2>
          <p className="sec-sub" data-reveal style={{ '--d': '120ms' }}>
            Medication safety is a team effort. Medicine Cabinet gives each person what they need.
          </p>

          <div className="aud-grid">
            {AUDIENCE.map(({ Icon, who, tag, points }, i) => (
              <article key={who} className="aud-card" data-reveal style={{ '--d': `${i * 110}ms` }}>
                <span className="aud-icon"><Icon width={26} height={26} /></span>
                <h3>{who}</h3>
                <span className="aud-tag">{tag}</span>
                <ul>
                  {points.map((p) => (
                    <li key={p}><I.Check width={14} height={14} />{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="lp-section" id="how">
        <div className="lp-w">
          <span className="eyebrow" data-reveal>How it works</span>
          <h2 className="sec-h2" data-reveal style={{ '--d': '60ms' }}>Up and running in four steps</h2>
          <p className="sec-sub" data-reveal style={{ '--d': '120ms' }}>
            No lengthy setup, no training. Most people are tracking within minutes.
          </p>

          <div className="steps-grid">
            <span className="steps-line" data-reveal aria-hidden="true" />
            {STEPS.map((s, i) => (
              <div key={s.title} className="step" data-reveal style={{ '--d': `${150 + i * 130}ms` }}>
                <span className="step-n">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── SECURITY ───────────── */}
      <section className="lp-section lp-section--tight" id="security">
        <div className="lp-w">
          <div className="privacy-panel" data-reveal>
            <span className="pp-glow" aria-hidden="true" />
            <div className="pp-top">
              <span className="eyebrow eyebrow--light">Security and privacy</span>
              <h2>Your health data stays yours</h2>
              <p>
                Medicine Cabinet treats everything as sensitive. You decide what is stored,
                who can see it, and you can export or delete all of it in one click.
              </p>
            </div>
            <ul className="pp-grid">
              {SECURITY.map(({ Icon, title, desc }, i) => (
                <li key={title} className="pp-item" style={{ '--d': `${250 + i * 90}ms` }}>
                  <span className="pp-check"><Icon width={18} height={18} /></span>
                  <div>
                    <strong>{title}</strong>
                    <span>{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── COMPARISON ───────────── */}
      <section className="lp-section lp-section--white">
        <div className="lp-w lp-w--narrow">
          <span className="eyebrow" data-reveal>Why Medicine Cabinet</span>
          <h2 className="sec-h2" data-reveal style={{ '--d': '60ms' }}>More than a list on the fridge</h2>
          <p className="sec-sub" data-reveal style={{ '--d': '120ms' }}>
            Paper and notes apps store information. Medicine Cabinet helps you act on it.
          </p>

          <div className="cmp" data-reveal>
            <div className="cmp-row cmp-row--head">
              <span />
              {COMPARE_COLS.map((c, i) => (
                <span key={c} className={i === 2 ? 'cmp-us' : ''}>{c}</span>
              ))}
            </div>
            {COMPARE_ROWS.map((r) => (
              <div className="cmp-row" key={r.label}>
                <span className="cmp-label">{r.label}</span>
                {r.v.map((yes, i) => (
                  <span key={i} className={`cmp-cell ${i === 2 ? 'cmp-us' : ''}`}>
                    {yes
                      ? <span className="cmp-yes"><I.Check width={13} height={13} /></span>
                      : <span className="cmp-no"><I.Cross width={12} height={12} /></span>}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="lp-section" id="faq">
        <div className="lp-w lp-w--narrow">
          <span className="eyebrow" data-reveal>FAQ</span>
          <h2 className="sec-h2" data-reveal style={{ '--d': '60ms' }}>Questions, answered</h2>
          <p className="sec-sub" data-reveal style={{ '--d': '120ms' }}>
            Still unsure about something? Start with these.
          </p>

          <div className="faq" data-reveal>
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={`faq-item ${open ? 'is-open' : ''}`}>
                  <button
                    className="faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq-plus"><I.Plus width={16} height={16} /></span>
                  </button>
                  <div className="faq-a"><div><p>{f.a}</p></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── FINAL CTA ───────────── */}
      <section className="lp-cta">
        <div className="lp-w">
          <div className="cta-card" data-reveal>
            <span className="cta-glow" aria-hidden="true" />
            <h2>Ready to organise your cabinet?</h2>
            <p>Free to start. Takes about two minutes. Your first safety check is moments away.</p>
            <div className="cta-actions">
              <button id="cta-final" className="btn-primary btn-primary--lg btn-primary--light" onClick={openRegister}>
                Create your account
                <I.Arrow width={18} height={18} />
              </button>
              <button className="btn-ghost-light" onClick={openLogin}>I already have an account</button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="lp-footer">
        <div className="lp-w">
          <div className="foot-grid">
            <div className="foot-brand">
              <a className="lp-logo" href="#top">
                <span className="logo-pill-icon"><I.Pill width={18} height={18} /></span>
                <span className="logo-text">Medicine Cabinet</span>
              </a>
              <p>One safe place for every medication, interaction check and doctor summary.</p>
            </div>
            {FOOTER_COLS.map((c) => (
              <div key={c.title} className="foot-col">
                <h4>{c.title}</h4>
                {c.links.map(([label, href]) => (
                  <a key={label} href={href}>{label}</a>
                ))}
              </div>
            ))}
          </div>

          <div className="foot-bottom" id="disclaimer">
            <span>© 2026 Medicine Cabinet. All rights reserved.</span>
            <span className="footer-disclaimer">
              Medical disclaimer: Medicine Cabinet is an informational tool and is not a doctor
              or pharmacist. It does not provide medical advice. Always check with a qualified
              clinician before starting, stopping or changing any medication.
            </span>
          </div>
        </div>
      </footer>

      {/* ───────────── AUTH MODAL ───────────── */}
      {showModal && (
        <div className="login-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-label={authMode === 'login' ? 'Sign in' : 'Create account'}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="login-modal-close" onClick={() => setShowModal(false)} aria-label="Close login">✕</button>
            <div className="login-modal-glow" />

            <div className="login-modal-logo">
              <span className="logo-pill-icon"><I.Pill width={16} height={16} /></span>
              <span className="logo-text">Medicine Cabinet</span>
            </div>

            <div className="auth-tabs">
              <button id="tab-login" className={`auth-tab ${authMode === 'login' ? 'act' : ''}`} onClick={() => setAuthMode('login')}>Sign In</button>
              <button id="tab-register" className={`auth-tab ${authMode === 'register' ? 'act' : ''}`} onClick={() => setAuthMode('register')}>Register</button>
            </div>

            <form className="auth-form" onSubmit={submit}>
              {authMode === 'register' && (
                <div className="af">
                  <label htmlFor="f-name">Full Name</label>
                  <input id="f-name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div className="af">
                <label htmlFor="f-email">Email</label>
                <input id="f-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="af">
                <label htmlFor="f-pass">Password</label>
                <input id="f-pass" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {authMode === 'login' && <a href="#" className="af-forgot">Forgot password?</a>}

              <button id="auth-submit" type="submit" className="auth-submit-btn">
                {authMode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}
                <I.Arrow width={15} height={15} />
              </button>

              <div className="af-divider"><span>or continue with</span></div>

              <button type="button" id="btn-google" className="auth-google-btn">
                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="auth-terms">
              By signing up you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.
              Your data is encrypted and never sold.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
