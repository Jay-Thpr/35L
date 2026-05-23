const PROFILE_STORAGE_KEY = 'cinematch.profile';

const defaultProfile = {
  user: {
    displayName: 'Jay T',
    username: '',
    email: 'jay@example.com',
    avatarInitials: 'JT',
    bio: '',
    favoriteMovie: 'Arrival',
    favoriteGenres: ['Sci-Fi', 'Horror', 'Thriller'],
  },
  stats: [
    { label: 'Watched', value: 128 },
    { label: 'Favorites', value: 24 },
    { label: 'Ratings', value: 91 },
    { label: 'Watchlist', value: 17 },
  ],
  recentlyWatched: [
    { title: 'Dune: Part Two', detail: 'Watched last night', rating: '4.5' },
    { title: 'The Holdovers', detail: 'Watched this week', rating: '4.0' },
    { title: 'Past Lives', detail: 'Watched this month', rating: '5.0' },
  ],
  favorites: [
    { title: 'Arrival', detail: 'Favorite movie', rating: '5.0' },
    { title: 'Alien', detail: 'Comfort rewatch', rating: '4.5' },
    { title: 'The Matrix', detail: 'All-time pick', rating: '5.0' },
  ],
  watchlist: [
    { title: 'Anatomy of a Fall', detail: 'Queued next', rating: null },
    { title: 'Perfect Days', detail: 'Recommended', rating: null },
    { title: 'The Zone of Interest', detail: 'Saved for later', rating: null },
  ],
};

function getInitials(displayName, email) {
  const nameParts = displayName.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length > 0) {
    return nameParts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  return email.charAt(0).toUpperCase() || 'CM';
}

function normalizeProfile(profile) {
  const user = {
    ...defaultProfile.user,
    ...profile.user,
  };

  return {
    ...defaultProfile,
    ...profile,
    user: {
      ...user,
      avatarInitials: getInitials(user.displayName, user.email),
    },
  };
}

export async function getMyProfile() {
  const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!savedProfile) {
    return defaultProfile;
  }

  try {
    return normalizeProfile(JSON.parse(savedProfile));
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    return defaultProfile;
  }
}

export async function updateMyProfile(profileUpdates) {
  const currentProfile = await getMyProfile();
  const updatedProfile = normalizeProfile({
    ...currentProfile,
    user: {
      ...currentProfile.user,
      ...profileUpdates,
    },
  });

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
  return updatedProfile;
}
