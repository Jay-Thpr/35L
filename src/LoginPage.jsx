import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Enter your password.');
      return;
    }

    try {
      await onLogin(trimmedEmail, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Cinematch login">
        <div className="auth-copy">
          <p className="auth-eyebrow">Cinematch</p>
          <h1>Welcome back</h1>
          <p>
            Sign in to store movie ratings, track what you've watched, and get movie recommendations!
          </p>
        </div>

        <form className="auth-panel" onSubmit={handleSubmit}>
          <div className="auth-panel__header">
            <h2>Log in</h2>
            
          </div>

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="auth-form-error">{error}</p>}

          <button className="auth-primary-action" type="submit">
            Log in
          </button>

          <p className="auth-panel__switch">
            Don&apos;t have an account?{' '}
            <button type="button" className="auth-panel__link" onClick={() => navigate('/signup')}>
              Sign up
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
