import { useState } from 'react';
import LoginPage from './LoginPage';
import SearchPage from './SearchPage';

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

function App() {
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

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <SearchPage />;
}

export default App;
