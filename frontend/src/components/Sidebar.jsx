import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;

function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">BL</div>
        <div>
          <strong>Book Library</strong>
          <span>Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass}>
          <span>▦</span>
          Library
        </NavLink>
        <NavLink to="/collection" className={linkClass}>
          <span>◷</span>
          Collection
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout}>
          <span>↪</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
