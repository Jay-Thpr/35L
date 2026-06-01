import { supabase, isSupabaseConfigured } from './supabaseClient';

const defaultProfile = {
  user: {
    displayName: '',
    username: '',
    email: '',
    avatarInitials: 'CM',
    bio: '',
    favoriteMovie: '',
    favoriteGenres: [],
  },
  stats: [
    { label: 'Watched', value: 0 },
    { label: 'Favorites', value: 0 },
    { label: 'Ratings', value: 0 },
    { label: 'Watchlist', value: 0 },
  ],
  recentlyWatched: [],
  favorites: [],
  watchlist: [],
};

function getInitials(displayName, email) {
  const nameParts = (displayName || '').trim().split(/\s+/).filter(Boolean);
  if (nameParts.length > 0) {
    return nameParts.slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('');
  }
  return (email || '').charAt(0).toUpperCase() || 'CM';
}

function rowToProfile(row) {
  let preferences = {};
  try {
    preferences = row.preferences ? JSON.parse(row.preferences) : {};
  } catch {
    preferences = {};
  }

  const user = {
    displayName: row.name || '',
    username: preferences.username || '',
    email: row.email || '',
    bio: preferences.bio || '',
    favoriteMovie: preferences.favoriteMovie || '',
    favoriteGenres: preferences.favoriteGenres || [],
    avatarInitials: getInitials(row.name, row.email),
  };

  return { ...defaultProfile, user };
}

export async function getMyProfile(email) {
  if (!isSupabaseConfigured || !email) {
    return { ...defaultProfile, user: { ...defaultProfile.user, email: email || '' } };
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error || !data) {
    return { ...defaultProfile, user: { ...defaultProfile.user, email } };
  }

  return rowToProfile(data);
}

export async function updateMyProfile(email, profileUpdates) {
  const preferences = JSON.stringify({
    username: profileUpdates.username || '',
    bio: profileUpdates.bio || '',
    favoriteMovie: profileUpdates.favoriteMovie || '',
    favoriteGenres: profileUpdates.favoriteGenres || [],
  });

  if (isSupabaseConfigured && email) {
    await supabase
      .from('users')
      .update({ name: profileUpdates.displayName, preferences })
      .eq('email', email);
  }

  return {
    ...defaultProfile,
    user: {
      ...profileUpdates,
      email,
      avatarInitials: getInitials(profileUpdates.displayName, email),
    },
  };
}
