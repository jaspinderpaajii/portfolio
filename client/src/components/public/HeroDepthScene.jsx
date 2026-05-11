import { useMemo, useRef, useState } from "react";

const stickerPositions = [
  { lat: -6, lon: 0 },
  { lat: 24, lon: 48 },
  { lat: -28, lon: 92 },
  { lat: 32, lon: 146 },
  { lat: -10, lon: 188 },
  { lat: 18, lon: 236 },
  { lat: -34, lon: 292 },
  { lat: 8, lon: 328 }
];

function formatStatSticker(stat) {
  if (!stat?.label && !stat?.value) return null;
  return [stat.value, stat.label].filter(Boolean).join(" ");
}

function HeroDepthScene({ heroStats = [], marquee = [] }) {
  const [pointer, setPointer] = useState({ x: 50, y: 46 });
  const [sphereRotation, setSphereRotation] = useState({ x: -8, y: -24 });
  const [isDraggingSphere, setIsDraggingSphere] = useState(false);
  const dragRef = useRef(null);
  const sphereStickers = useMemo(() => {
    const labels = [
      ...marquee,
      ...heroStats.map(formatStatSticker),
      "Portfolio OS",
      "Interactive UI"
    ]
      .filter(Boolean)
      .filter((item, index, list) => list.indexOf(item) === index)
      .slice(0, stickerPositions.length);

    return labels.map((label, index) => ({
      label,
      ...stickerPositions[index]
    }));
  }, [heroStats, marquee]);

  function handlePointerMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPointer({ x, y });
  }

  function resetPointer() {
    setPointer({ x: 50, y: 46 });
  }

  function handleSpherePointerDown(event) {
    event.preventDefault();
    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startRotationX: sphereRotation.x,
      startRotationY: sphereRotation.y
    };
    setIsDraggingSphere(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleSpherePointerMove(event) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragRef.current.startClientX;
    const deltaY = event.clientY - dragRef.current.startClientY;
    setSphereRotation({
      x: dragRef.current.startRotationX - deltaY * 0.62,
      y: dragRef.current.startRotationY + deltaX * 0.62
    });
  }

  function stopSphereDrag(event) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDraggingSphere(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleSphereKeyDown(event) {
    const step = event.shiftKey ? 28 : 14;
    const keyRotation = {
      ArrowUp: { x: -step, y: 0 },
      ArrowDown: { x: step, y: 0 },
      ArrowLeft: { x: 0, y: -step },
      ArrowRight: { x: 0, y: step }
    }[event.key];

    if (!keyRotation) return;
    event.preventDefault();
    setSphereRotation((current) => ({
      x: current.x + keyRotation.x,
      y: current.y + keyRotation.y
    }));
  }

  const tiltX = (50 - pointer.y) / 11;
  const tiltY = (pointer.x - 50) / 10;

  const stageStyle = {
    transform: `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
  };

  const orbStyle = {
    transform: `translate3d(${(pointer.x - 50) / 5}px, ${(pointer.y - 50) / 7}px, 0)`
  };

  const sphereStyle = {
    "--sphere-rotate-x": `${sphereRotation.x + (50 - pointer.y) / 10}deg`,
    "--sphere-rotate-y": `${sphereRotation.y + (pointer.x - 50) / 10}deg`
  };

  const orbitStyle = {
    transform: `translate3d(${(pointer.x - 50) / 8}px, ${(pointer.y - 50) / 10}px, 0)`
  };

  const spotlightStyle = {
    background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(var(--accent-rgb), 0.24), transparent 34%)`
  };

  return (
    <div className="hero-depth relative min-h-[26rem] md:min-h-[31rem]" onMouseMove={handlePointerMove} onMouseLeave={resetPointer}>
      <span className="build-arm-target build-arm-target-right" aria-hidden="true" />
      <span className="handoff-payload handoff-payload-hero-sphere" aria-hidden="true">
        <i />
        <b />
        <b />
      </span>
      <div className="hero-depth-stage" style={stageStyle}>
        <div className="hero-depth-spotlight" style={spotlightStyle} />
        <div className="hero-grid-plane" />
        <div className="hero-assembly-gantry" aria-hidden="true">
          <span />
          <span />
          <i />
        </div>
        <div className="hero-orbit hero-orbit-one" style={orbitStyle} />
        <div className="hero-orbit hero-orbit-two" style={orbitStyle} />

        <div className="hero-orb-shell-wrap" style={orbStyle}>
          <div className="hero-orb-seat" aria-hidden="true" />
          <div className="hero-orb-inspection-frame" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="hero-orb-tethers" aria-hidden="true">
            <span />
            <span />
          </div>
          <div
            className="hero-orb-sphere"
            data-dragging={isDraggingSphere ? "true" : "false"}
            role="button"
            tabIndex={0}
            aria-label="Rotate portfolio sphere"
            style={sphereStyle}
            onPointerDown={handleSpherePointerDown}
            onPointerMove={handleSpherePointerMove}
            onPointerUp={stopSphereDrag}
            onPointerCancel={stopSphereDrag}
            onKeyDown={handleSphereKeyDown}
          >
            <div className="hero-orb-glow" />
            <div className="hero-orb-shell">
              <div className="hero-orb-core" />
              <div className="hero-orb-surface" style={sphereStyle}>
                <div className="hero-orb-grid" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hero-orb-sticker-field" aria-hidden="true">
                  {sphereStickers.map((sticker) => (
                    <span
                      className="hero-orb-sticker"
                      key={sticker.label}
                      style={{
                        "--sticker-lat": `${sticker.lat}deg`,
                        "--sticker-lon": `${sticker.lon}deg`
                      }}
                    >
                      {sticker.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hero-orb-highlight" />
            </div>
          </div>
          <div className="hero-orb-cradle" aria-hidden="true">
            <span />
            <span />
            <i />
            <b />
          </div>
        </div>

      </div>
    </div>
  );
}

export default HeroDepthScene;
