import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email?: string;
  role?: string;
  ["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?: string;
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]?: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [email, setEmail] = useState("Bilinmiyor");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const emailVal =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
        decoded.email;

      const roleVal =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded.role;

      setEmail(emailVal || "Bilinmiyor");
      setRole(roleVal || "");
    } catch (err) {
      console.error("Token decode error:", err);
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container text-center mt-5">
      <h2>Dashboard</h2>
      <p>Hoş geldin <strong>{email}</strong> 👋</p>

      {role === "Admin" && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => navigate("/admin")}
        >
          Admin Paneline Git
        </button>
      )}

      <br />
      <button className="btn btn-danger" onClick={handleLogout}>
        Çıkış Yap
      </button>
    </div>
  );
}

export default Dashboard;
