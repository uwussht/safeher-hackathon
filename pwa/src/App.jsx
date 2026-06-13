import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ActiveSOS from "./pages/ActiveSOS";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Overview from "./pages/Overview";
import AdvancedIntel from "./pages/AdvancedIntel";
import ActivityLogs from "./pages/ActivityLogs";
import SystemConfig from "./pages/SystemConfig";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"        element={<Home />} />
        <Route path="/active"  element={<ActiveSOS />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<div>Support — coming soon</div>} />

        {/* Admin section — paths match navItems in every page */}
        <Route path="/admin"        element={<Overview />} />
        <Route path="/admin/map"    element={<Admin />} />
        <Route path="/admin/intel"  element={<AdvancedIntel />} />
        <Route path="/admin/logs"   element={<ActivityLogs />} />
        <Route path="/admin/config" element={<SystemConfig />} />
      </Routes>
    </BrowserRouter>
  );
}