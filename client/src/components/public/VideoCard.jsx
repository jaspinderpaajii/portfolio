function VideoCard({ item }) {
  const assetType = item?.assetType === "photo" ? "photo" : item?.video?.url ? "video" : item?.image?.url ? "photo" : "video";
  const imageUrl = item?.image?.url || item?.thumbnail?.url;

  return (
    <article className="glass-panel overflow-hidden">
      <div className="aspect-[16/10] bg-black">
        {assetType === "video" && item?.video?.url ? (
          <video
            className="h-full w-full object-cover"
            src={item.video.url}
            poster={imageUrl || undefined}
            controls
            playsInline
            preload="metadata"
          />
        ) : imageUrl ? (
          <img src={imageUrl} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-white/5 text-sm text-white/45">
            Upload a video or photo from the CMS
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          <div className="flex flex-wrap justify-end gap-2">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">{item.category}</span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-white/50">{assetType}</span>
          </div>
        </div>
        <p className="mt-3 text-sm leading-7 text-white/60">
          {item.description || "A creative entry that brings together the visual work I want to highlight."}
        </p>
      </div>
    </article>
  );
}

export default VideoCard;
