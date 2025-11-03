import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecoveryCodes() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [codes, setCodes] = useState<string[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() => alert("Kullanıcı listesi alınamadı"));
  }, []);

  const fetchCodes = async () => {
    if (!selectedUser) return;

    const res = await axios.get(
      `http://localhost:5000/api/admin/recovery-codes/${selectedUser}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = Array.isArray(res.data) ? res.data : JSON.parse(res.data);
    setCodes(data);
  };

  const generateCodes = async () => {
    if (!selectedUser) return;

    const res = await axios.post(
      `http://localhost:5000/api/admin/recovery-codes/${selectedUser}/generate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = Array.isArray(res.data) ? res.data : JSON.parse(res.data);
    setCodes(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recovery Codes</h2>

      <select
        onChange={(e) => setSelectedUser(Number(e.target.value))}
        defaultValue=""
      >
        <option value="">Select User</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.email}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 10 }}>
        <button onClick={fetchCodes}>Show Codes</button>
        <button onClick={generateCodes} style={{ marginLeft: 10 }}>
          Generate New Codes
        </button>
      </div>

      <pre style={{ marginTop: 20, background: "#eee", padding: 10 }}>
        {codes.length ? codes.join("\n") : "No codes yet"}
      </pre>
    </div>
  );
}
