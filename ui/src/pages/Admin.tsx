import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

interface DecodedToken {
  role?: string;
  ["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?: string;
}

interface User {
  id: number;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
        decoded.role;

      if (role !== "Admin") {
        alert("Bu sayfaya erişim yetkin yok!");
        navigate("/dashboard");
        return;
      }

      const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      };

      fetchUsers();
    } catch {
      navigate("/");
      return;
    }
  }, [navigate, token]);

  const call = async (url: string) => {
    await axios.post(
      url,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const res = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğine emin misin?")) return;

    await axios.delete(`http://localhost:5000/api/admin/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const resetMfa = async (id: number) => {
    const res = await axios.post(
      `http://localhost:5000/api/admin/reset-mfa/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const w = window.open("");
    if (w) {
      w.document.write("<h2>Yeni MFA QR</h2>");
      w.document.write(`<img src="${res.data.qrCode}" />`);
      w.document.write("<h3>Recovery Codes</h3>");
      (res.data.codes as string[]).forEach((c) => w.document.write(`<p>${c}</p>`));
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ padding: "40px", flex: 1 }}>
        <h2>Admin Panel</h2>

        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Active</th>
              <th>CreatedAt</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.displayName?.trim() || u.email.split("@")[0]}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? "✅" : "❌"}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>

                <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button onClick={() => call(`http://localhost:5000/api/admin/toggle-active/${u.id}`)}>
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>

                  {u.role !== "Admin" ? (
                    <button onClick={() => call(`http://localhost:5000/api/admin/make-admin/${u.id}`)}>
                      Make Admin
                    </button>
                  ) : (
                    <button onClick={() => call(`http://localhost:5000/api/admin/make-viewer/${u.id}`)}>
                      Make Viewer
                    </button>
                  )}

                  <button onClick={() => resetMfa(u.id)}>
                    Reset MFA
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    style={{ background: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button style={{ marginTop: 20 }} onClick={() => navigate("/dashboard")}>
          Dashboard'a Dön
        </button>
      </div>
    </div>
  );
}

export default Admin;
