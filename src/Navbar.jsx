import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar__left">
        <NavLink to="/" className="navbar__logo">
          CINEMATCH
        </NavLink>
        <nav className="navbar__links">
          <NavLink to="/" className="navbar__link" end>
            Home
          </NavLink>
          <NavLink to="/search" className="navbar__link">
            Search
          </NavLink>
          <NavLink to="/profile" className="navbar__link">
            Profile
          </NavLink>
        </nav>
      </div>
      <div className="navbar__right">
        {user && (
          <>
            <span className="navbar__user">{user.user_metadata?.name || user.email}</span>
            <button className="navbar__logout" onClick={onLogout}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
