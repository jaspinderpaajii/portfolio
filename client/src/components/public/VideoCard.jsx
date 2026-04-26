function VideoCard({ item, className = "", priority = false, onOpen }) {
  const assetType = item?.assetType === "photo" ? "photo" : item?.video?.url ? "video" : item?.image?.url ? "photo" : "video";
  const imageUrl = item?.image?.url || item?.thumbnail?.url;
  const description = item?.description || "A creative entry that brings together the visual work I want to highlight.";

  return (
    <article className={`glass-panel section-frame interactive-tilt group overflow-hidden ${className}`}>
      <div className="relative aspect-[16/10] bg-black">
        {assetType === "video" && item?.video?.url ? (
          <video
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            src={item.video.url}
            poster={imageUrl || undefined}
            controls
            playsInline
            preload="metadata"
          />
        ) : imageUrl ? (
          <img src={imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/5 text-sm text-white/45">
            Upload a video or photo from the CMS
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-transparent opacity-80" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-white/70 backdrop-blur-md">
            {item.category}
          </span>
          <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-white/70 backdrop-blur-md">
            {assetType}
          </span>
        </div>
        {onOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-10"
            aria-label={`Open ${item.title}`}
            onClick={() => onOpen(item)}
          />
        ) : null}
      </div>
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
          {priority ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-white/58">
              Featured
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-7 text-white/60">
          {description}
        </p>
      </div>
    </article>
  );
}

export default VideoCard;
