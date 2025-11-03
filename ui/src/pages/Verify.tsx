import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Verify() {
  const [code, setCode] = useState<string>("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  const handleVerify = async () => {
    if (!code) return alert("Lütfen kodu giriniz");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify", {
        email,
        code
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Doğrulama başarılı!");
        navigate("/dashboard");
      } else {
        alert("Kod geçersiz!");
      }
    } catch (err) {
      alert("Doğrulama hatası!");
      console.error(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center" style={{ width: "350px" }}>
        <h3>Doğrulama</h3>
        <p className="text-muted">E-posta: {email}</p>

        <input
          type="text"
          className="form-control mb-2"
          placeholder="6 haneli kod"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button className="btn btn-success w-100 mb-2" onClick={handleVerify}>
          Kodu Doğrula
        </button>

        <button className="btn btn-secondary w-100" onClick={() => navigate("/")}>
          Geri Dön
        </button>
      </div>
    </div>
  );
}

export default Verify;
