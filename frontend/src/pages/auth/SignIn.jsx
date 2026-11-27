import { useState, useEffect, useRef } from 'react';
import AuthLayout from './AuthLayout';
import AuthField from './AuthField';
import { IconMail, IconLock, IconArrow, IconCheck } from './icons';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'That email address doesn\'t look right.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
};

/**
 * Sign in page.
 * NOTE: there is no backend yet, so a valid form simply signs the user in.
 * Replace the timeout in `handleSubmit` with a real API call later.
 */
const SignIn = ({ onSuccess, onBack, onSwitch }) => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState('idle'); // idle | loading | done
  const [shake, setShake] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const errors = validate(values);
  const show = (name) => (touched[name] ? errors[name] : undefined);

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));
  const blur = (name) => () => setTouched((t) => ({ ...t, [name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== 'idle') return;

    setTouched({ email: true, password: true });
    if (Object.keys(errors).length > 0) {
      setShake((n) => n + 1);
      return;
    }

    setStatus('loading');
    timers.current.push(
      setTimeout(() => setStatus('done'), 900),
      setTimeout(() => onSuccess(), 1500)
    );
  };

  return (
    <AuthLayout mode="login" onBack={onBack}>
      <header className="au-head" style={{ '--d': '0ms' }}>
        <h1>Sign in</h1>
        <p>Welcome back. Enter your details to open your cabinet.</p>
      </header>

      <form
        key={shake}
        className={`au-form ${shake ? 'is-shaking' : ''}`}
        onSubmit={handleSubmit}
        noValidate
      >
        <AuthField
          id="si-email"
          label="Email"
          Icon={IconMail}
          type="email"
          value={values.email}
          onChange={set('email')}
          onBlur={blur('email')}
          error={show('email')}
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          style={{ '--d': '80ms' }}
        />

        <AuthField
          id="si-password"
          label="Password"
          Icon={IconLock}
          type="password"
          value={values.password}
          onChange={set('password')}
          onBlur={blur('password')}
          error={show('password')}
          placeholder="Enter your password"
          autoComplete="current-password"
          style={{ '--d': '140ms' }}
          action={<a href="#" className="au-link au-link--sm">Forgot password?</a>}
        />

        <label className="au-check" style={{ '--d': '200ms' }}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span className="au-check-box"><IconCheck width={12} height={12} /></span>
          Keep me signed in on this device
        </label>

        <button
          type="submit"
          className={`au-submit is-${status}`}
          disabled={status !== 'idle'}
          style={{ '--d': '260ms' }}
        >
          <span className="au-submit-label">
            Sign in
            <IconArrow width={18} height={18} />
          </span>
          <span className="au-submit-spin" aria-hidden="true" />
          <span className="au-submit-done" aria-hidden="true">
            <IconCheck width={18} height={18} />
            Signed in
          </span>
        </button>

        <p className="au-switch" style={{ '--d': '320ms' }}>
          New to Medicine Cabinet?{' '}
          <button type="button" className="au-link" onClick={onSwitch}>Create an account</button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
