import { useState } from "react";
import api from "../api/axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/api/auth/login", form);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-box">
        <h2>Login</h2>
        <input placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
