import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

function getPreviewImage(item) {
  return item?.coverImage?.url || item?.image?.url || item?.thumbnail?.url || "";
}

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

  const activeItem = items[activeIndex];
  const activeTitle = activeItem?.title || `Featured ${itemLabel}`;
  const activeMeta = activeItem?.category || activeItem?.assetType || `Featured ${itemLabel}`;
  const activeDescription = activeItem?.summary || activeItem?.description || "";
  const progressWidth = `${((activeIndex + 1) / items.length) * 100}%`;

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  return (
    <div className="featured-carousel-shell glass-panel section-frame mt-10 overflow-hidden p-4 md:p-6">
      <div className="featured-carousel-glow" />
      <div className="relative z-[1]">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-5">
          <div className="max-w-3xl">
            <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/45">Featured {itemLabel}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-white/58">
                {activeMeta}
              </span>
              <span className="text-sm text-white/42">
                {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 max-w-2xl font-display text-3xl text-white md:text-4xl">{activeTitle}</h3>
            {activeDescription ? (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 md:text-base">{activeDescription}</p>
            ) : null}
            <div className="featured-carousel-progress mt-5">
              <span style={{ width: progressWidth }} />
            </div>
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

        <div className="featured-carousel-stage mt-6 overflow-hidden">
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

        {items.length > 1 ? (
          <div className="featured-carousel-rail mt-5">
            {items.map((item, index) => {
              const previewImage = getPreviewImage(item);
              const chipMeta = item?.category || item?.assetType || itemLabel;

              return (
                <button
                  key={`jump-${item._id || index}`}
                  type="button"
                  className={`carousel-chip ${index === activeIndex ? "carousel-chip-active" : ""}`}
                  onClick={() => setActiveIndex(index)}
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
