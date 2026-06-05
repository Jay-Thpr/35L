import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthMovieCarousel from './AuthMovieCarousel';
import './AuthPage.css';

function SignupPage({ onSignup }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Keep basic validation client-side before calling auth.
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
      // App handles Supabase signup or the local demo bypass.
      await onSignup(trimmedEmail, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    }
    
  }

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Cinematch sign up">
        <div className="auth-copy">
          <p className="auth-eyebrow">Cinematch</p>
          <h1>Create your account</h1>
          <p>
            Start saving watched movies, ratings, and recommendations in one place.
          </p>
        </div>

        <form className="auth-panel" onSubmit={handleSubmit}>
          <div className="auth-panel__header">
            <h2>Sign up</h2>
            <p>Create an account to continue.</p>
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
              autoComplete="new-password"
            />
          </label>

          {error && <p className="auth-form-error">{error}</p>}

          <button className="auth-primary-action" type="submit">
            Sign up
          </button>
        </form>
      </section>
      <AuthMovieCarousel />
    </main>
  );
}

export default SignupPage;
