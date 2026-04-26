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
  ...props
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <Component
      ref={ref}
      data-reveal={origin}
      className={`motion-reveal ${visible ? "motion-reveal-visible" : ""} ${className}`.trim()}
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
