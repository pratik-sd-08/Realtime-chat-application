import { useEffect, useState } from "react";
import api from "../api/axios";

function Sidebar({ setActiveUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
       const res = await api.get("/auth/users");
        setUsers(res.data);
      } catch (error) {
        console.error(
          "User fetch error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="sidebar">
      <h3>Users</h3>

      {loading && <p style={{ opacity: 0.6 }}>Loading...</p>}

      {!loading && users.length === 0 && (
        <p style={{ opacity: 0.6 }}>No users found</p>
      )}

      {users.map((user) => (
        <div
          key={user._id}
          className="user-item"
          onClick={() => setActiveUser(user)}
        >
          <span
            className={`status-dot ${user.online ? "online" : ""}`}
          />
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
