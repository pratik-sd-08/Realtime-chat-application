import { useEffect, useState } from "react";
import api from "../api/axios";

function Sidebar({ setActiveUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/auth/users"); 
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="sidebar">
      <h3>Users</h3>

      {users.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No users found</p>
      ) : (
        users.map((user) => (
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
        ))
      )}
    </div>
  );
}

export default Sidebar;
