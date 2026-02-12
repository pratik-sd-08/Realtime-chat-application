import { useState } from "react";
import api from "../api/axios";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/api/auth/signup", form);
    window.location.href = "/login";
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-box">
        <h2>Create Account</h2>
        <input placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button>Signup</button>
      </form>
    </div>
  );
}

export default Signup;
