import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import ProfilePage from './ProfilePage';
import Navbar from './Navbar';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const demoUser = {
  email: 'demo@cinematch.local',
  user_metadata: {
    full_name: 'Demo User',
  },
};

function App() {
  const [currentUser, setCurrentUser] = useState(isSupabaseConfigured ? null : demoUser);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setCurrentUser(null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(email, password) {
    if (!isSupabaseConfigured) {
      setCurrentUser({
        ...demoUser,
        email,
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function handleSignup(email, password) {
    if (!isSupabaseConfigured) {
      setCurrentUser({
        ...demoUser,
        email,
      });
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    await supabase.from('users').insert({ email, name: email.split('@')[0], preferences: '{}' });
  }

  async function handleLogout() {
    if (!isSupabaseConfigured) {
      setCurrentUser(null);
      return;
    }

    await supabase.auth.signOut();
  }

  if (loading) return null;

  return (
    <>
      {currentUser && <Navbar user={currentUser} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
        <Route path="/" element={currentUser ? <HomePage userId={currentUser.id} /> : <Navigate to="/login" replace />} />
        <Route path="/search" element={currentUser ? <SearchPage userId={currentUser.id} /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={currentUser ? <ProfilePage userEmail={currentUser.email} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
