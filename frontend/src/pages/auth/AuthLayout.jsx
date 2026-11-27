import {
  IconPill, IconShield, IconCheck, IconWarn, IconArrowLeft, IconHeart,
} from './icons';
import './Auth.css';

const COPY = {
  login: {
    eyebrow: 'Welcome back',
    headline: 'Your cabinet is right where you left it.',
    sub: 'Pick up with today\'s doses, your safety alerts and your health summary.',
    points: [
      'See what is due today at a glance',
      'Get warned before medications clash',
      'Share a clear summary with your doctor',
    ],
  },
  register: {
    eyebrow: 'Get started',
    headline: 'One safe place for every medication.',
    sub: 'Create your account in about two minutes and run your first safety check straight away.',
    points: [
      'Free to start, no card needed',
      'Private by default, export or delete any time',
      'Built for patients, caregivers and clinicians',
    ],
  },
};

/**
 * Shared split-screen shell for the sign in and sign up pages.
 * Left: brand panel with an animated preview. Right: the form.
 */
const AuthLayout = ({ mode, onBack, children }) => {
  const c = COPY[mode];

  return (
    <div className="au">
      {/* ───────── Brand panel ───────── */}
      <aside className="au-brand" aria-hidden="false">
        <span className="au-glow au-glow--a" aria-hidden="true" />
        <span className="au-glow au-glow--b" aria-hidden="true" />
        <span className="au-grid" aria-hidden="true" />

        <button type="button" className="au-logo" onClick={onBack} aria-label="Back to home">
          <span className="au-logo-icon"><IconPill width={18} height={18} /></span>
          <span>Medicine Cabinet</span>
        </button>

        <div className="au-brand-body">
          <span className="au-eyebrow">{c.eyebrow}</span>
          <h2>{c.headline}</h2>
          <p>{c.sub}</p>

          <ul className="au-points">
            {c.points.map((p, i) => (
              <li key={p} style={{ '--d': `${300 + i * 120}ms` }}>
                <span><IconCheck width={12} height={12} /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="au-preview" aria-hidden="true">
          <div className="au-preview-row">
            <span className="au-preview-ic au-preview-ic--ok"><IconShield width={16} height={16} /></span>
            <div>
              <strong>Safety check passed</strong>
              <span>No interactions found</span>
            </div>
          </div>
          <div className="au-preview-row">
            <span className="au-preview-ic au-preview-ic--warn"><IconWarn width={16} height={16} /></span>
            <div>
              <strong>1 item to review</strong>
              <span>Ask your pharmacist</span>
            </div>
          </div>
          <div className="au-preview-row">
            <span className="au-preview-ic au-preview-ic--heart"><IconHeart width={16} height={16} /></span>
            <div>
              <strong>Adherence this week</strong>
              <span>Doses taken on time</span>
            </div>
          </div>
        </div>

        <p className="au-brand-foot">Information only. Not a substitute for medical advice.</p>
      </aside>

      {/* ───────── Form panel ───────── */}
      <main className="au-panel">
        <button type="button" className="au-back" onClick={onBack}>
          <IconArrowLeft width={16} height={16} />
          Back to home
        </button>

        <div className="au-card">{children}</div>

        <p className="au-legal">
          By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </p>
      </main>
    </div>
  );
};

export default AuthLayout;
