import React from "react";
import { useNavigate } from "react-router-dom";

function EnrollQR() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const qr = localStorage.getItem("qr");
  const secret = localStorage.getItem("secret");

  if (!email || !qr) {
    navigate("/");
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center" style={{ width: "350px" }}>
        <h3>Authenticator Kurulumu</h3>
        <p className="text-muted mb-2">E-posta: {email}</p>

        <img src={qr!} alt="QR Code" style={{ width: "200px", height: "200px" }} />

        <p className="text-muted mt-2">QR taranamıyorsa secret:</p>
        <code>{secret}</code>

        <button
          className="btn btn-success w-100 mt-3"
          onClick={() => navigate("/verify")}
        >
          Devam Et
        </button>
      </div>
    </div>
  );
}

export default EnrollQR;
