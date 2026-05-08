import './ProfilePage.css';

const profile = {
    user: {
        name: 'Jay T',
        email: 'Jay@example.com',
        avatarInitials: 'JT',
        bio: 'Horror, sci-fi, and slow-burn thrillers. Always looking for the next great soundtrack.',
    },
    stats: {
        watched: 128,
        favorites: 24,
        ratings: 91,
        watchlist: 17,
    },
    favorites: [],
    recentlyWatched: [],
    watchlist: [],
};

function ProfilePage() {
    return (
        <main className="profile-page">
            <div className="profile-shell">
                <section className="profile-hero">
                    <div className="profile-avatar">{profile.user.avatarInitials}</div>

                    <div className="profile-identity">
                        <p className="profile-kicker">Cinematch Profile</p>
                        <h1>{profile.user.name}</h1>
                        <p className="profile-email">{profile.user.email}</p>
                        <p className="profile-bio">{profile.user.bio}</p>
                    </div>

                    <div className="profile-actions">
                        <button type="button" className="profile-button">
                            Edit Profile
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default ProfilePage;