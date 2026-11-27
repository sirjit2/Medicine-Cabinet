import { useState, useEffect, useRef } from 'react';
import AuthLayout from './AuthLayout';
import AuthField from './AuthField';
import {
  IconUser, IconMail, IconLock, IconArrow, IconCheck,
  IconHeart, IconUsers, IconStethoscope,
} from './icons';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ROLES = [
  { id: 'patient', label: 'Patient', Icon: IconHeart },
  { id: 'caregiver', label: 'Caregiver', Icon: IconUsers },
  { id: 'clinician', label: 'Clinician', Icon: IconStethoscope },
];

const STRENGTH_LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

/** 0 (too short) to 4 (strong) */
const scorePassword = (pw) => {
  if (pw.length < 8) return 0;
  let s = 1;
  if (pw.length >= 12) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s += 1;
  return Math.min(s, 4);
};

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Enter your full name.';
  if (!v.email.trim()) e.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address doesn\'t look right.';
  if (v.password.length < 8) e.password = 'Use at least 8 characters.';
  if (!v.confirm) e.confirm = 'Re-enter your password.';
  else if (v.confirm !== v.password) e.confirm = 'Passwords don\'t match.';
  if (!v.terms) e.terms = 'Please accept the terms to continue.';
  return e;
};

/**
 * Get started (sign up) page.
 * NOTE: there is no backend yet, so a valid form simply creates a local session.
 * Replace the timeout in `handleSubmit` with a real API call later.
 */
const SignUp = ({ onSuccess, onBack, onSwitch }) => {
  const [values, setValues] = useState({
    name: '', email: '', password: '', confirm: '', role: 'patient', terms: false,
  });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | done
  const [shake, setShake] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const errors = validate(values);
  const show = (name) => (touched[name] ? errors[name] : undefined);
  const score = scorePassword(values.password);

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));
  const blur = (name) => () => setTouched((t) => ({ ...t, [name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== 'idle') return;

    setTouched({ name: true, email: true, password: true, confirm: true, terms: true });
    if (Object.keys(errors).length > 0) {
      setShake((n) => n + 1);
      return;
    }

    setStatus('loading');
    timers.current.push(
      setTimeout(() => setStatus('done'), 1000),
      setTimeout(() => onSuccess(), 1600)
    );
  };

  return (
    <AuthLayout mode="register" onBack={onBack}>
      <header className="au-head">
        <h1>Create your account</h1>
        <p>Free to start. Takes about two minutes.</p>
      </header>

      <form
        key={shake}
        className={`au-form ${shake ? 'is-shaking' : ''}`}
        onSubmit={handleSubmit}
        noValidate
      >
        <fieldset className="au-roles" style={{ '--d': '40ms' }}>
          <legend>I'm using Medicine Cabinet as a</legend>
          <div className="au-role-grid">
            {ROLES.map(({ id, label, Icon }) => (
              <label key={id} className={`au-role ${values.role === id ? 'is-on' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value={id}
                  checked={values.role === id}
                  onChange={set('role')}
                />
                <Icon width={20} height={20} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <AuthField
          id="su-name"
          label="Full name"
          Icon={IconUser}
          value={values.name}
          onChange={set('name')}
          onBlur={blur('name')}
          error={show('name')}
          placeholder="Jane Doe"
          autoComplete="name"
          autoFocus
          style={{ '--d': '100ms' }}
        />

        <AuthField
          id="su-email"
          label="Email"
          Icon={IconMail}
          type="email"
          value={values.email}
          onChange={set('email')}
          onBlur={blur('email')}
          error={show('email')}
          placeholder="you@example.com"
          autoComplete="email"
          style={{ '--d': '160ms' }}
        />

        <div style={{ '--d': '220ms' }} className="au-pw-wrap">
          <AuthField
            id="su-password"
            label="Password"
            Icon={IconLock}
            type="password"
            value={values.password}
            onChange={set('password')}
            onBlur={blur('password')}
            error={show('password')}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <div className={`au-meter s-${values.password ? score : 'none'}`} aria-live="polite">
            <span className="au-meter-bars" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="au-meter-label">
              {values.password ? STRENGTH_LABELS[score] : 'Use 12+ characters with a mix of letters, numbers and symbols'}
            </span>
          </div>
        </div>

        <AuthField
          id="su-confirm"
          label="Confirm password"
          Icon={IconLock}
          type="password"
          value={values.confirm}
          onChange={set('confirm')}
          onBlur={blur('confirm')}
          error={show('confirm')}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          style={{ '--d': '280ms' }}
        />

        <div style={{ '--d': '340ms' }}>
          <label className="au-check">
            <input
              type="checkbox"
              checked={values.terms}
              onChange={(e) => {
                setValues((v) => ({ ...v, terms: e.target.checked }));
                setTouched((t) => ({ ...t, terms: true }));
              }}
            />
            <span className="au-check-box"><IconCheck width={12} height={12} /></span>
            <span>I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a></span>
          </label>
          {show('terms') && <p className="au-error au-error--block" role="alert">{show('terms')}</p>}
        </div>

        <button
          type="submit"
          className={`au-submit is-${status}`}
          disabled={status !== 'idle'}
          style={{ '--d': '400ms' }}
        >
          <span className="au-submit-label">
            Create account
            <IconArrow width={18} height={18} />
          </span>
          <span className="au-submit-spin" aria-hidden="true" />
          <span className="au-submit-done" aria-hidden="true">
            <IconCheck width={18} height={18} />
            Account created
          </span>
        </button>

        <p className="au-switch" style={{ '--d': '460ms' }}>
          Already have an account?{' '}
          <button type="button" className="au-link" onClick={onSwitch}>Sign in</button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
