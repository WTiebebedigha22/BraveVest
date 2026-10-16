import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
import { COUNTRIES, findByIso, DEFAULT_COUNTRY, DEFAULT_COUNTRY_OBJ } from '@/constants/countries';
import './Auth.css';

const INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryIso: DEFAULT_COUNTRY,
  password: '',
  role: 'INVESTOR',
  acceptedTerms: false,
};

function normalizeNational(raw) {
  return raw.replace(/\D/g, '');
}

function toE164(nationalDigits, dialCode) {
  const clean = nationalDigits.replace(/^0+/, '');
  return `+${dialCode}${clean}`;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const country = useMemo(() => findByIso(form.countryIso) || DEFAULT_COUNTRY_OBJ(), [form.countryIso]);

  const update = (k) => (e) => {
    const v = k === 'acceptedTerms' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (fieldErrors[k]) setFieldErrors((fe) => ({ ...fe, [k]: undefined }));
  };

  function validate() {
    const fe = {};
    if (!form.firstName.trim() || form.firstName.trim().length < 2) fe.firstName = 'Enter your first name';
    if (!form.lastName.trim() || form.lastName.trim().length < 2) fe.lastName = 'Enter your last name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) fe.email = 'Enter a valid email';

    const digits = normalizeNational(form.phone);
    if (digits) {
      const nationalDigits = digits.replace(/^0+/, '');
      if (nationalDigits.length < country.minNational || nationalDigits.length > country.maxNational) {
        fe.phone = `Enter a valid ${country.name} number (${country.minNational}–${country.maxNational} digits)`;
      }
    }

    if (form.password.length < 8) fe.password = 'At least 8 characters';
    else if (!/[A-Z]/.test(form.password)) fe.password = 'Include an uppercase letter';
    else if (!/[a-z]/.test(form.password)) fe.password = 'Include a lowercase letter';
    else if (!/\d/.test(form.password)) fe.password = 'Include a number';

    if (!form.acceptedTerms) fe.acceptedTerms = 'You must accept the terms to continue';

    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const digits = normalizeNational(form.phone);
      const phoneE164 = digits ? toE164(digits, country.dial) : undefined;

      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: phoneE164,
        countryIso: country.iso,
        password: form.password,
        role: form.role,
      });
      navigate('/kyc');
    } catch (err) {
      const data = err?.response?.data;
      if (data?.details && typeof data.details === 'object') {
        const fe = {};
        for (const [k, v] of Object.entries(data.details)) {
          fe[k] = Array.isArray(v) ? v[0] : String(v);
        }
        setFieldErrors(fe);
        setError(data.message || 'Please check the highlighted fields');
      } else if (data?.code === 'EMAIL_EXISTS') {
        setFieldErrors({ email: 'An account with this email already exists' });
        setError('An account with this email already exists');
      } else {
        setError(data?.message || err.message || 'Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__mesh" aria-hidden />
      <div className="auth__card auth__card--wide">
        <Link to="/" className="auth__brand" aria-label="BraveVest home">
          <span className="auth__mark" aria-hidden /> BraveVest
        </Link>
        <h1 className="auth__title">Create your account.</h1>
        <p className="auth__sub">Start in under 5 minutes.</p>

        <form onSubmit={submit} noValidate>
          <fieldset className="auth__roles">
            <legend className="auth__roles-label">I want to</legend>
            <div className="auth__roles-row">
              {[
                { value: 'INVESTOR', label: 'Invest', hint: 'Fund vetted opportunities' },
                { value: 'BORROWER', label: 'Request funding', hint: 'Raise capital from investors' },
              ].map((r) => (
                <label key={r.value} className={`auth__role ${form.role === r.value ? 'auth__role--active' : ''}`}>
                  <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={update('role')} />
                  <span className="auth__role-title">{r.label}</span>
                  <span className="auth__role-hint">{r.hint}</span>
                </label>
              ))}
            </div>
            <p className="auth__roles-note">You can do both — this just sets up your starting dashboard.</p>
          </fieldset>

          <div className="auth__row">
            <Input label="First name" value={form.firstName} onChange={update('firstName')} autoComplete="given-name" error={fieldErrors.firstName} required />
            <Input label="Last name" value={form.lastName} onChange={update('lastName')} autoComplete="family-name" error={fieldErrors.lastName} required />
          </div>

          <Input label="Email" type="email" value={form.email} onChange={update('email')} autoComplete="email" inputMode="email" error={fieldErrors.email} required />

          <div className="auth__phone">
            <label className="auth__country">
              <span className="auth__country-label">Country</span>
              <select value={form.countryIso} onChange={update('countryIso')} aria-label="Country" className="auth__country-select">
                {COUNTRIES.map((c) => (
                  <option key={c.iso} value={c.iso}>{c.name} (+{c.dial})</option>
                ))}
              </select>
            </label>
            <div className="auth__phone-input">
              <Input
                label="Phone (optional)"
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                autoComplete="tel-national"
                inputMode="tel"
                hint={`${country.example} — ${country.minNational}–${country.maxNational} digits`}
                error={fieldErrors.phone}
                prefix={`+${country.dial}`}
              />
            </div>
          </div>

          <Input label="Password" type="password" value={form.password} onChange={update('password')} autoComplete="new-password" hint="Min 8 chars, with uppercase, lowercase, and a number" error={fieldErrors.password} required />

          <label className="auth__terms">
            <input type="checkbox" checked={form.acceptedTerms} onChange={update('acceptedTerms')} />
            <span>
              I agree to the <Link to="/terms" target="_blank" rel="noreferrer">Terms</Link>{' '}
              and <Link to="/privacy" target="_blank" rel="noreferrer">Privacy Policy</Link>
            </span>
          </label>
          {fieldErrors.acceptedTerms && <div className="auth__field-error" role="alert">{fieldErrors.acceptedTerms}</div>}

          {error && <div className="auth__error" role="alert">{error}</div>}

          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>

          <p className="auth__legal">
            BraveVest does not provide investment advice. All investments carry risk, including the risk of capital loss.
            Read our <Link to="/risk-disclosure" target="_blank" rel="noreferrer">Risk Disclosure</Link>.
          </p>
        </form>

        <div className="auth__foot">
          <span>Already have an account? <Link to="/login">Sign in</Link></span>
        </div>
      </div>
    </div>
  );
}
