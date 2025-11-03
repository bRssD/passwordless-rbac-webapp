import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleEnroll = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName: name }),
      });

      if (!response.ok) {
        const text = await response.text();
        alert("Hata: " + text);
        return;
      }

      const data = await response.json();

      localStorage.setItem("email", email);
      localStorage.setItem("displayName", name);

      if (data.qrCode) {
        localStorage.setItem("qr", data.qrCode);
        localStorage.setItem("secret", data.secret);
      }

      alert("Kayıt oluşturuldu!");
      navigate("/enroll-qr");
    } catch {
      alert("Sunucuya ulaşılamıyor!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center" style={{ width: "350px" }}>
        <h3>Passwordless Rbac Login</h3>
        <p className="text-muted mb-3">Authenticator tabanlı giriş sistemi</p>

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="E-posta adresinizi girin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={handleEnroll}>
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}

export default Login;
