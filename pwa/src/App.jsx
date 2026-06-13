import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ActiveSOS from "./pages/ActiveSOS";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import Profile from './pages/Profile';
export default function App() {
  return (
    <BrowserRouter>
          <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/active" element={<ActiveSOS />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/admin" element={<Admin />} />
      {/* placeholders until built */}
      <Route path="/history" element={<div>SOS History — coming soon</div>} />
      <Route path="/support" element={<div>Support — coming soon</div>} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    </BrowserRouter>
  );
}