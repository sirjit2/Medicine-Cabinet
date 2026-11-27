import { useState } from 'react';
import { IconEye, IconEyeOff, IconAlert } from './icons';

/**
 * Labelled input with an icon, inline error and optional password toggle.
 * Fully controlled; the parent owns value, error and touched state.
 */
const AuthField = ({
  id,
  label,
  Icon,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  hint,
  placeholder,
  autoComplete,
  action,
  autoFocus = false,
  style,
}) => {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && reveal ? 'text' : type;
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;

  return (
    <div className={`au-field ${error ? 'has-error' : ''}`} style={style}>
      <div className="au-label-row">
        <label htmlFor={id}>{label}</label>
        {action}
      </div>

      <div className="au-input">
        {Icon && <Icon className="au-input-icon" width={18} height={18} />}
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        {isPassword && (
          <button
            type="button"
            className="au-reveal"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            aria-pressed={reveal}
          >
            {reveal ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
          </button>
        )}
      </div>

      {error ? (
        <p className="au-error" id={`${id}-err`} role="alert">
          <IconAlert width={14} height={14} />
          {error}
        </p>
      ) : hint ? (
        <p className="au-hint" id={`${id}-hint`}>{hint}</p>
      ) : null}
    </div>
  );
};

export default AuthField;
