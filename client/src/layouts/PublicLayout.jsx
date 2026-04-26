import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/public/Footer.jsx";
import Navbar from "../components/public/Navbar.jsx";

function PublicLayout() {
  const location = useLocation();
  const [stageVisible, setStageVisible] = useState(false);

  useEffect(() => {
    setStageVisible(false);
    const frame = requestAnimationFrame(() => setStageVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <div className="ambient-bg relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-45">
          <div className="grid-fade absolute inset-0" />
        </div>
        <div className="noise-overlay absolute inset-0" />
        <div className="hero-glow animate-drift absolute left-[-8rem] top-24 h-72 w-72 rounded-full opacity-60" />
        <div
          className="absolute right-[-6rem] top-36 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle at center, rgba(118, 188, 255, 0.32), transparent 68%)" }}
        />
        <div
          className="absolute bottom-[-8rem] left-1/3 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle at center, rgba(var(--accent-rgb), 0.24), transparent 70%)" }}
        />
      </div>
      <Navbar />
      <main className="relative z-10 pb-20">
        <div key={location.pathname} className={`route-stage ${stageVisible ? "route-stage-visible" : ""}`}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
