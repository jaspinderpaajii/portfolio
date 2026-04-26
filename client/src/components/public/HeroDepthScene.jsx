import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

function HeroDepthScene({ availability, heroStats = [], aboutBody, marquee = [] }) {
  const [pointer, setPointer] = useState({ x: 50, y: 46 });
  const featuredStats = useMemo(() => heroStats.slice(0, 3), [heroStats]);
  const accentPills = useMemo(() => marquee.slice(0, 3), [marquee]);

  function handlePointerMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPointer({ x, y });
  }

  function resetPointer() {
    setPointer({ x: 50, y: 46 });
  }

  const tiltX = (50 - pointer.y) / 11;
  const tiltY = (pointer.x - 50) / 10;

  const stageStyle = {
    transform: `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  };

  const orbStyle = {
    transform: `translate3d(${(pointer.x - 50) / 5}px, ${(pointer.y - 50) / 7}px, 0)`
  };

  const orbitStyle = {
    transform: `translate3d(${(pointer.x - 50) / 8}px, ${(pointer.y - 50) / 10}px, 0)`
  };

  const spotlightStyle = {
    background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(var(--accent-rgb), 0.24), transparent 34%)`
  };

  return (
    <div className="hero-depth relative min-h-[30rem] md:min-h-[35rem]" onMouseMove={handlePointerMove} onMouseLeave={resetPointer}>
      <div className="hero-depth-stage" style={stageStyle}>
        <div className="hero-depth-spotlight" style={spotlightStyle} />
        <div className="hero-grid-plane" />
        <div className="hero-orbit hero-orbit-one" style={orbitStyle} />
        <div className="hero-orbit hero-orbit-two" style={orbitStyle} />

        <div className="hero-orb-shell-wrap" style={orbStyle}>
          <div className="hero-orb-glow" />
          <div className="hero-orb-shell">
            <div className="hero-orb-core" />
            <div className="hero-orb-highlight" />
          </div>
        </div>

        <div
          className="hero-floating-card hero-floating-card-primary hidden md:block"
          style={{ transform: `translate3d(${(pointer.x - 50) / 12}px, ${(pointer.y - 50) / 10}px, 28px)` }}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/42">
            <Sparkles size={14} className="text-[var(--accent)]" />
            Availability
          </div>
          <p className="mt-3 text-sm leading-7 text-white/72">
            {availability || "Open to building thoughtful digital work."}
          </p>
        </div>

        <div
          className="hero-floating-card hero-floating-card-secondary"
          style={{ transform: `translate3d(${(50 - pointer.x) / 10}px, ${(pointer.y - 50) / 11}px, 44px)` }}
        >
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">About Snapshot</p>
          <p className="mt-4 max-h-[11rem] overflow-hidden text-sm leading-7 text-white/68">
            {aboutBody || "A more visual way to frame the technical and creative direction behind the portfolio."}
          </p>
        </div>

        {featuredStats.map((stat, index) => (
          <div
            key={stat.label}
            className={`hero-floating-card hero-stat-card hero-stat-card-${index + 1}`}
            style={{
              transform: `translate3d(${((index % 2 === 0 ? 1 : -1) * (pointer.x - 50)) / 12}px, ${((pointer.y - 50) * (index + 1)) / 24}px, ${32 + index * 12}px)`
            }}
          >
            <p className="text-[0.64rem] uppercase tracking-[0.22em] text-white/35">{stat.label}</p>
            <p className="mt-4 font-display text-3xl leading-none text-white">{stat.value}</p>
          </div>
        ))}

        {accentPills.length ? (
          <div
            className="hero-floating-card hero-floating-card-tags hidden lg:flex"
            style={{ transform: `translate3d(${(pointer.x - 50) / 13}px, ${(50 - pointer.y) / 10}px, 36px)` }}
          >
            <div className="flex flex-wrap gap-2">
              {accentPills.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[0.68rem] text-white/58">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HeroDepthScene;
