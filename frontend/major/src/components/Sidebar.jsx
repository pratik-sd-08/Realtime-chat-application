import { useEffect, useState } from "react";
import api from "../api/axios";

function Sidebar({ setActiveUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/api/users"); // create this route later if not exists
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="sidebar">
      <h3>Users</h3>
      {users.map((user) => (
        <div
          key={user._id}
          className="user-item"
          onClick={() => setActiveUser(user)}
        >
          <span className={`status-dot ${user.online ? "online" : ""}`} />
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
