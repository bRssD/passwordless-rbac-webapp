import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div style={{
      width: "200px",
      background: "#1e1e1e",
      color: "white",
      height: "100vh",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <h2>Admin Panel</h2>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/admin/dashboard" style={{ color: "white", textDecoration: "none" }}>
            Dashboard
          </Link>
        </li>

        <li style={{ marginBottom: "10px" }}>
          <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
            User Management
          </Link>
        </li>

        <li style={{ marginBottom: "10px" }}>
          <Link to="/admin/recovery-codes" style={{ color: "white", textDecoration: "none" }}>
            Recovery Codes
          </Link>
        </li>

        <li style={{ marginTop: "30px" }}>
          <Link to="/" style={{ color: "red", textDecoration: "none" }}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}
