import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

function FeaturedCarousel({
  items = [],
  itemLabel = "item",
  emptyState = null,
  renderItem
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((current) => {
      if (!items.length) {
        return 0;
      }

      return Math.min(current, items.length - 1);
    });
  }, [items.length]);

  if (!items.length) {
    return emptyState;
  }

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  return (
    <div className="glass-panel section-frame mt-10 overflow-hidden p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/45">Featured {itemLabel}</p>
          <p className="mt-2 text-sm text-white/55">
            Showing {String(activeIndex + 1).padStart(2, "0")} of {String(items.length).padStart(2, "0")}
          </p>
        </div>
        <div className="flex items-center gap-2">
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

      <div className="mt-5 overflow-hidden">
        <div className="featured-carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {items.map((item, index) => (
            <div key={item._id || `${itemLabel}-${index}`} className="featured-carousel-slide">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <button
              key={`jump-${item._id || index}`}
              type="button"
              className={`carousel-chip ${index === activeIndex ? "carousel-chip-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${item?.title || `${itemLabel} ${index + 1}`}`}
            >
              <span className="font-medium text-white/72">{String(index + 1).padStart(2, "0")}</span>
              <span className="truncate">{item?.title || `${itemLabel} ${index + 1}`}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default FeaturedCarousel;
