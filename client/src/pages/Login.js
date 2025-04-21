import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("patient");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:6969/api/login", {
        username,
        password,
        loginType, // "patient" or "staff"
      });

      onLogin(res.data); // { userId, role }
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login to HealthPoint</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Login As:</label>
        <select
          value={loginType}
          onChange={(e) => setLoginType(e.target.value)}
        >
          <option value="patient">Patient</option>
          <option value="staff">Staff</option>
        </select>

        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
