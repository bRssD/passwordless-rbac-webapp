import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import EnrollQR from "./pages/EnrollQR"; 
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import RecoveryCodes from "./pages/admin/RecoveryCodes";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/enroll-qr" element={<EnrollQR />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={<Dashboard />} />
		<Route path="/admin" element={<Admin />} />
		<Route path="/admin/recovery-codes" element={<RecoveryCodes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
