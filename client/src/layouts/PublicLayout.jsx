import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/public/Footer.jsx";
import Navbar from "../components/public/Navbar.jsx";
import PageBuildRig from "../components/public/PageBuildRig.jsx";

function PublicLayout() {
  const location = useLocation();
  const [stageVisible, setStageVisible] = useState(false);

  useEffect(() => {
    setStageVisible(false);
    const frame = requestAnimationFrame(() => setStageVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <div className="ambient-bg relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-ribbons absolute inset-0" />
        <div className="ambient-sheen absolute inset-0" />
        <div className="absolute inset-0 opacity-55">
          <div className="grid-fade absolute inset-0" />
        </div>
        <div className="factory-spine factory-spine-left" />
        <div className="factory-spine factory-spine-right" />
        <div className="factory-bolt-trail factory-bolt-trail-left" />
        <div className="factory-bolt-trail factory-bolt-trail-right" />
        <div className="noise-overlay absolute inset-0" />
      </div>
      <PageBuildRig />
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
