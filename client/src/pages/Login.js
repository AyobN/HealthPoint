import { useState } from "react";
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
        loginType,
      });

      onLogin(res.data);
    } catch (err) {
      setError("Invalid credentials.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      <header
        style={{ background: "#004080", color: "white", padding: "1rem" }}
      >
        <h1 style={{ margin: 0 }}>HealthPoint</h1>
      </header>

      <div
        style={{
          maxWidth: "400px",
          margin: "4rem auto",
          padding: "2rem",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div>
            <label>Login As:</label>
            <select
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="patient">Patient</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: "0.75rem",
              background: "#004080",
              color: "white",
              border: "none",
            }}
          >
            Login
          </button>

          {error && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
