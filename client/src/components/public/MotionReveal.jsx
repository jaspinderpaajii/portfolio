import { useEffect, useRef, useState } from "react";

function MotionReveal({
  as: Component = "div",
  children,
  className = "",
  delay = 0,
  distance = 32,
  origin = "up",
  once = true,
  threshold = 0.16,
  rootMargin = "0px 0px -8% 0px",
  buildLead = 0,
  settleDelay = 6200,
  ...props
}) {
  const ref = useRef(null);
  const [prepping, setPrepping] = useState(false);
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    let revealTimer = 0;
    let settleTimer = 0;
    let viewportCheckTimer = 0;
    let hasTriggered = false;

    function isBuildSurface() {
      return node.classList.contains("build-surface");
    }

    function announceBuildSurface() {
      if (typeof window === "undefined" || !isBuildSurface()) {
        return;
      }

      window.dispatchEvent(new CustomEvent("portfolio:build-surface-visible", {
        detail: { target: node }
      }));
    }

    function revealNode() {
      setPrepping(false);
      setVisible(true);

      if (isBuildSurface()) {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => setSettled(true), settleDelay);
      }
    }

    function beginReveal() {
      announceBuildSurface();
      setSettled(false);

      if (buildLead > 0 && isBuildSurface()) {
        setPrepping(true);
        window.clearTimeout(revealTimer);
        revealTimer = window.setTimeout(revealNode, buildLead);
        return;
      }

      revealNode();
    }

    function triggerReveal(observer) {
      if (once && hasTriggered) {
        return;
      }

      hasTriggered = true;
      beginReveal();

      if (once && observer) {
        observer.unobserve(node);
      }
    }

    function isNodeInViewport() {
      const rect = node.getBoundingClientRect();
      const enterLine = isBuildSurface() ? window.innerHeight * 0.82 : window.innerHeight;

      return rect.bottom > window.innerHeight * 0.04 && rect.top < enterLine;
    }

    function scheduleViewportCheck(observer) {
      if (viewportCheckTimer) {
        return;
      }

      viewportCheckTimer = window.setTimeout(() => {
        viewportCheckTimer = 0;

        if (isNodeInViewport()) {
          triggerReveal(observer);
        }
      }, 40);
    }

    function handleViewportCheck() {
      scheduleViewportCheck(observer);
    }

    function handleBuildSurfacePrepare(event) {
      if (event.detail?.target === node) {
        triggerReveal(observer);
      }
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      announceBuildSurface();
      revealNode();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerReveal(observer);
        } else if (!once) {
          window.clearTimeout(revealTimer);
          window.clearTimeout(settleTimer);
          hasTriggered = false;
          setPrepping(false);
          setVisible(false);
          setSettled(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(node);
    scheduleViewportCheck(observer);
    window.addEventListener("portfolio:build-surface-prepare", handleBuildSurfacePrepare);
    window.addEventListener("scroll", handleViewportCheck, { passive: true });
    window.addEventListener("resize", handleViewportCheck);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(settleTimer);
      window.clearTimeout(viewportCheckTimer);
      observer.disconnect();
      window.removeEventListener("portfolio:build-surface-prepare", handleBuildSurfacePrepare);
      window.removeEventListener("scroll", handleViewportCheck);
      window.removeEventListener("resize", handleViewportCheck);
    };
  }, [once, threshold, rootMargin, buildLead, settleDelay]);

  return (
    <Component
      ref={ref}
      data-reveal={origin}
      className={`motion-reveal ${prepping ? "motion-reveal-prep" : ""} ${visible ? "motion-reveal-visible" : ""} ${settled ? "motion-reveal-settled" : ""} ${className}`.trim()}
      style={{
        "--reveal-delay": `${delay}ms`,
        "--reveal-distance": `${distance}px`
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export default MotionReveal;
