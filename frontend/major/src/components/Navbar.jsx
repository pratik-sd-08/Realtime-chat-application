import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <h2 className="logo">ChatApp</h2>

        {user && (
          <div style={{ fontSize: "14px", opacity: 0.8 }}>
            👤 {user.name}
          </div>
        )}
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

      
    </div>
  );
}

export default Navbar;
