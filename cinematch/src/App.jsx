import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import Navbar from './Navbar';

const AUTH_STORAGE_KEY = 'cinematch.currentUser';

function getSavedUser() {
  const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function buildUserData(email) {
  const displayName = email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    email,
    name: displayName || 'Movie Fan',
  };
}

function MainApp() {
  const [currentUser, setCurrentUser] = useState(getSavedUser);

  function handleLogin(email, rememberUser = true) {
    const user = buildUserData(email);

    if (rememberUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    setCurrentUser(user);
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Navbar user={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProfilePagePlaceholder() {
  return (
    <main style={{ padding: '48px 32px', color: 'white' }}>
      <h1>Profile page</h1>
      <p>Routing is wired. Build the real profile screen here next.</p>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

function ProfilePagePlaceholder() {
  return (
    <main style={{ padding: '48px 32px', color: 'white' }}>
      <h1>Profile page</h1>
      <p>Routing is wired. Build the real profile screen here next.</p>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
