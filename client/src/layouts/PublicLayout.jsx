import { Outlet } from "react-router-dom";
import Footer from "../components/public/Footer.jsx";
import Navbar from "../components/public/Navbar.jsx";

function PublicLayout() {
  return (
    <div className="ambient-bg relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="grid-fade absolute inset-0" />
      </div>
      <Navbar />
      <main className="relative z-10 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
