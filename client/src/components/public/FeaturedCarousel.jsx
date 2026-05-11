import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function getPreviewImage(item) {
  return item?.coverImage?.url || item?.image?.url || item?.thumbnail?.url || "";
}

function FeaturedCarousel({
  items = [],
  itemLabel = "item",
  emptyState = null,
  renderItem
}) {
  const shellRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCycling, setIsCycling] = useState(false);
  const [cycleDirection, setCycleDirection] = useState("next");
  const [hasRigAssembled, setHasRigAssembled] = useState(false);

  useEffect(() => {
    setActiveIndex((current) => {
      if (!items.length) {
        return 0;
      }

      return Math.min(current, items.length - 1);
    });
  }, [items.length]);

  useEffect(() => {
    if (!isCycling) {
      return undefined;
    }

    const timer = window.setTimeout(() => setIsCycling(false), 1800);
    return () => window.clearTimeout(timer);
  }, [isCycling]);

  useEffect(() => {
    const node = shellRef.current;

    if (!node || hasRigAssembled) {
      return undefined;
    }

    let assemblyTimer = 0;

    function completeRigAssembly() {
      window.clearTimeout(assemblyTimer);
      assemblyTimer = window.setTimeout(() => {
        setHasRigAssembled(true);
        setIsCycling(false);
      }, 5600);
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      completeRigAssembly();
      return () => window.clearTimeout(assemblyTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          completeRigAssembly();
          observer.unobserve(node);
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -18% 0px" }
    );

    observer.observe(node);

    return () => {
      window.clearTimeout(assemblyTimer);
      observer.disconnect();
    };
  }, [hasRigAssembled]);

  if (!items.length) {
    return emptyState;
  }

  const activeItem = items[activeIndex];
  const activeTitle = activeItem?.title || `Featured ${itemLabel}`;
  const activeMeta = activeItem?.category || activeItem?.assetType || `Featured ${itemLabel}`;
  const activeDescription = activeItem?.summary || activeItem?.description || "";
  const progressWidth = `${((activeIndex + 1) / items.length) * 100}%`;

  const triggerCycle = (direction = "next") => {
    setCycleDirection(direction);

    if (hasRigAssembled) {
      setIsCycling(false);
      return;
    }

    setIsCycling(false);
    window.requestAnimationFrame(() => {
      setIsCycling(true);
    });
  };

  const goToPrevious = () => {
    triggerCycle("prev");
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    triggerCycle("next");
    setActiveIndex((current) => (current + 1) % items.length);
  };

  const goToIndex = (index) => {
    if (index === activeIndex) {
      return;
    }

    triggerCycle(index > activeIndex ? "next" : "prev");
    setActiveIndex(index);
  };

  return (
    <div
      ref={shellRef}
      className={`featured-carousel-shell carousel-build-rig glass-panel section-frame mx-auto mt-10 overflow-hidden p-4 md:p-5 lg:p-6 carousel-cycle-${cycleDirection} ${isCycling && !hasRigAssembled ? "carousel-cycle-building" : ""} ${hasRigAssembled ? "carousel-rig-complete" : ""}`}
    >
      <span className="build-arm-target build-arm-target-right" aria-hidden="true" />
      <div className="carousel-build-arm carousel-build-arm-left" aria-hidden="true">
        <span />
        <i />
        <b />
      </div>
      <div className="carousel-build-arm carousel-build-arm-right" aria-hidden="true">
        <span />
        <i />
        <b />
      </div>
      <div className="carousel-build-blueprint" aria-hidden="true" />
      <div className="carousel-build-clamps" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="carousel-build-scan" aria-hidden="true" />
      <span className="handoff-payload handoff-payload-carousel-frame" aria-hidden="true">
        <i />
        <b />
        <b />
      </span>
      <div className="featured-carousel-glow" />
      <div className="carousel-assembly-body relative z-[1]">
        <div className="carousel-header-module flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-6">
          <div className="max-w-3xl">
            <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/45">Featured {itemLabel}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[0.64rem] uppercase tracking-[0.2em] text-white/58">
                {activeMeta}
              </span>
              <span className="text-sm text-white/42">
                {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 max-w-2xl font-display text-3xl leading-none text-white md:text-4xl">{activeTitle}</h3>
            {activeDescription ? (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">{activeDescription}</p>
            ) : null}
            <div className="featured-carousel-progress mt-4">
              <span style={{ width: progressWidth }} />
            </div>
          </div>

          <div className="carousel-control-module flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevious}
              className="carousel-nav-button"
              aria-label={`Show previous ${itemLabel}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="carousel-nav-button"
              aria-label={`Show next ${itemLabel}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="featured-carousel-stage carousel-assembly-stage mt-5 overflow-hidden">
          <div className="carousel-depth-backplate" aria-hidden="true" />
          <div className="carousel-depth-rail carousel-depth-rail-left" aria-hidden="true" />
          <div className="carousel-depth-rail carousel-depth-rail-right" aria-hidden="true" />
          <div className="carousel-conveyor-infeed" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="carousel-placement-carriage" aria-hidden="true">
            <span />
            <span />
            <i />
          </div>
          <div className="carousel-cycle-sparks" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="carousel-seat-locks" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="carousel-bolt-field" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="carousel-media-slab">
            <span className="handoff-payload handoff-payload-carousel-media" aria-hidden="true">
              <i />
              <b />
              <b />
            </span>
            <div className="carousel-layer-stack" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="featured-carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
              {items.map((item, index) => (
                <div key={item._id || `${itemLabel}-${index}`} className="featured-carousel-slide">
                  <div className="featured-carousel-slide-inner">
                    {renderItem(item, index)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {items.length > 1 ? (
          <div className="featured-carousel-rail carousel-rail-module mt-4">
            {items.map((item, index) => {
              const previewImage = getPreviewImage(item);
              const chipMeta = item?.category || item?.assetType || itemLabel;

              return (
                <button
                  key={`jump-${item._id || index}`}
                  type="button"
                  className={`carousel-chip ${index === activeIndex ? "carousel-chip-active" : ""}`}
                  onClick={() => goToIndex(index)}
                  aria-label={`Go to ${item?.title || `${itemLabel} ${index + 1}`}`}
                >
                  {previewImage ? (
                    <img src={previewImage} alt="" aria-hidden="true" className="carousel-chip-image" />
                  ) : (
                    <div className="carousel-chip-image carousel-chip-image-fallback" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.62rem] uppercase tracking-[0.24em] text-white/42">
                      {chipMeta}
                    </span>
                    <span className="mt-1 block truncate text-left text-sm tracking-normal text-white/72">
                      {item?.title || `${itemLabel} ${index + 1}`}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default FeaturedCarousel;
