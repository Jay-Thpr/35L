import { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    onLogin(trimmedEmail, rememberMe);
  }

  return (
    <main className="login-page">
      <section className="login-hero" aria-label="Cinematch login">
        <div className="login-copy">
          <p className="eyebrow">Cinematch</p>
          <h1>Welcome back</h1>
          <p>
            Sign in to keep your watched movies, ratings, and recommendations connected to your account.
          </p>
        </div>

        <form className="login-panel" onSubmit={handleSubmit}>
          <div className="login-panel__header">
            <h2>Log in</h2>
            <p>Use your account to continue.</p>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
            />
          </label>

          <label className="remember-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Keep me signed in</span>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-action" type="submit">
            Log in
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
