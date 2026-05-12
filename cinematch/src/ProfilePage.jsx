import { useEffect, useState } from 'react';
import './ProfilePage.css';
import { getMyProfile, saveMyProfile } from './profileApi';

function ProfileField({ label, value, placeholder }) {
  return (
    <div className={value ? 'profile-field' : 'profile-field profile-field--empty'}>
      <span>{label}</span>
      <strong>{value || placeholder}</strong>
    </div>
  );
}

function EditableField({ label, value, placeholder, onChange }) {
  return (
    <label className="profile-edit-field">
      <span>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function MovieList({ title, description, movies, emptyText }) {
  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {movies.length > 0 ? (
        <div className="profile-movie-list">
          {movies.map((movie) => (
            <article className="profile-movie" key={movie.title}>
              <div>
                <h3>{movie.title}</h3>
                <p>{movie.detail}</p>
              </div>
              {movie.rating && <span className="profile-rating">{movie.rating}</span>}
            </article>
          ))}
        </div>
      ) : (
        <div className="profile-empty">{emptyText}</div>
      )}
    </section>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [draftProfile, setDraftProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const loadedProfile = await getMyProfile();
      setProfile(loadedProfile);
      setDraftProfile(loadedProfile.user);
    }

    loadProfile();
  }, []);

  if (!profile || !draftProfile) {
    return (
      <main className="profile-page">
        <div className="profile-shell">
          <div className="profile-section">Loading profile...</div>
        </div>
      </main>
    );
  }

  function updateDraft(field, value) {
    setDraftProfile((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
    setStatusMessage('');
  }

  function updateDraftGenres(value) {
    const favoriteGenres = value
      .split(',')
      .map((genre) => genre.trim)
      .filter(Boolean);

    updateDraft('favoriteGenres', favoriteGenres);
  }

  function startEditing() {
    setDraftProfile(profile.user);
    setIsEditing(true);
    setStatusMessage('');
  }

  function cancelEditing() {
    setDraftProfile(profile.user);
    setIsEditing(false);
    setStatusMessage('');
  }

  async function saveProfile() {
    const updatedProfile = await saveMyProfile(draftProfile);

    setProfile(updatedProfile);
    setDraftProfile(updatedProfile.user);
    setIsEditing(false);
    setStatusMessage('Profile saved.');
  }

  const hasBio = Boolean(profile.user.bio);

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <section className="profile-hero">
          <div className="profile-avatar" aria-hidden="true">
            {profile.user.avatarInitials}
          </div>

          <div className="profile-identity">
            <p className="profile-kicker">Private Dashboard</p>
            <h1>{profile.user.displayName}</h1>
            <p className="profile-email">{profile.user.email}</p>
            <p className={hasBio ? 'profile-bio' : 'profile-bio profile-bio--empty'}>
              {profile.user.bio || 'Add a short bio so your profile feels more personal.'}
            </p>
          </div>

          <div className="profile-actions">
            <button type="button" className="profile-button" onClick={startEditing}>
              Edit Profile
            </button>
          </div>
        </section>

        <section className="profile-completion" aria-label="Profile setup prompts">
          <div>
            <h2>Complete your profile</h2>
            <p>Add the details you want to use across Cinematch.</p>
          </div>
          <div className="profile-prompts">
            <span className={profile.user.username ? 'is-complete' : ''}>
              {profile.user.username ? 'Username added' : 'Add a username'}
            </span>
            <span className={profile.user.bio ? 'is-complete' : ''}>
              {profile.user.bio ? 'Bio added' : 'Add a bio'}
            </span>
            <span className={profile.user.favoriteGenres.length ? 'is-complete' : ''}>
              {profile.user.favoriteGenres.length ? 'Genres added' : 'Choose genres'}
            </span>
          </div>
        </section>

        <section className="profile-stats" aria-label="Movie activity">
          {profile.stats.map((stat) => (
            <div className="profile-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="profile-grid">
          <div className="profile-section">
            <div className="profile-section__header">
              <div>
                <h2>Profile Details</h2>
                <p>Your account basics and movie preferences.</p>
              </div>
              {isEditing && (
                <div className="profile-form-actions">
                  <button type="button" className="profile-button profile-button--secondary" onClick={cancelEditing}>
                    Cancel
                  </button>
                  <button type="button" className="profile-button" onClick={saveProfile}>
                    Save
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="profile-fields">
                <EditableField
                  label="Display name"
                  value={draftProfile.displayName}
                  onChange={(value) => updateDraft('displayName', value)}
                  placeholder="Add your display name"
                />
                <EditableField
                  label="Username"
                  value={draftProfile.username}
                  onChange={(value) => updateDraft('username', value)}
                  placeholder="Add a username"
                />
                <label className="profile-edit-field">
                  <span>Bio</span>
                  <textarea
                    value={draftProfile.bio}
                    onChange={(event) => updateDraft('bio', event.target.value)}
                    placeholder="Add a short bio"
                    rows="4"
                  />
                </label>
                <EditableField
                  label="Favorite movie"
                  value={draftProfile.favoriteMovie}
                  onChange={(value) => updateDraft('favoriteMovie', value)}
                  placeholder="Add your favorite movie"
                />
                <EditableField
                  label="Favorite genres"
                  value={draftProfile.favoriteGenres.join(', ')}
                  onChange={updateDraftGenres}
                  placeholder="Sci-Fi, Horror, Thriller"
                />
                {statusMessage && <p className="profile-status">{statusMessage}</p>}
              </div>
            ) : (
              <div className="profile-fields">
                <ProfileField label="Display name" value={profile.user.displayName} />
                <ProfileField label="Username" value={profile.user.username} placeholder="Add a username" />
                <ProfileField label="Favorite movie" value={profile.user.favoriteMovie} />
                {statusMessage && <p className="profile-status">{statusMessage}</p>}
              </div>
            )}
          </div>

          <div className="profile-section">
            <div className="profile-section__header">
              <div>
                <h2>Favorite Genres</h2>
                <p>These help shape your recommendations.</p>
              </div>
            </div>

            <div className="profile-tags">
              {profile.user.favoriteGenres.length > 0 ? (
                profile.user.favoriteGenres.map((genre) => <span key={genre}>{genre}</span>)
              ) : (
                <div className="profile-empty">Choose your favorite genres.</div>
              )}
            </div>
          </div>
        </section>

        <div className="profile-grid profile-grid--movies">
          <MovieList
            title="Recently Watched"
            description="A quick view of your latest activity."
            movies={profile.recentlyWatched}
            emptyText="Movies you watch will appear here."
          />
          <MovieList
            title="Favorites"
            description="Movies you want to keep close."
            movies={profile.favorites}
            emptyText="Mark movies as favorites to build this list."
          />
          <MovieList
            title="Watchlist"
            description="Movies saved for later."
            movies={profile.watchlist}
            emptyText="Add movies to your watchlist from search."
          />
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
