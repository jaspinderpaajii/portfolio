import { ArrowRight, Expand, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FilterTabs from "../../components/public/FilterTabs.jsx";
import MotionReveal from "../../components/public/MotionReveal.jsx";
import SectionIntro from "../../components/public/SectionIntro.jsx";
import VideoCard from "../../components/public/VideoCard.jsx";
import { fetchShowcase, fetchSiteSnapshot } from "../../api/publicApi.js";
import { applyAccentTheme } from "../../theme.js";

function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    fetchSiteSnapshot().then((snapshot) => {
      applyAccentTheme(snapshot?.sections?.settings?.data?.accent);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchShowcase(selectedCategory === "All" ? undefined : selectedCategory)
      .then((response) => {
        setItems(response.items);
        setCategories(response.categories?.length ? response.categories : ["All"]);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  useEffect(() => {
    function handleKeydown(event) {
      if (event.key === "Escape") {
        setActiveItem(null);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const featuredItem = useMemo(
    () => items.find((item) => item.featured) || items[0] || null,
    [items]
  );

  const archiveItems = useMemo(
    () => items.filter((item) => item._id !== featuredItem?._id),
    [featuredItem, items]
  );

  const photoCount = items.filter((item) => item.assetType === "photo" || item?.image?.url).length;
  const videoCount = items.filter((item) => item.assetType === "video" || item?.video?.url).length;

  function openItem(item) {
    setActiveItem(item);
  }

  function closeItem() {
    setActiveItem(null);
  }

  const featuredPreviewUrl = featuredItem?.image?.url || featuredItem?.thumbnail?.url;
  const featuredAssetType =
    featuredItem?.assetType === "photo" ? "photo" : featuredItem?.video?.url ? "video" : featuredItem?.image?.url ? "photo" : "video";

  return (
    <section className="shell pt-12 md:pt-16">
      <MotionReveal className="glass-panel section-frame surface-line relative overflow-hidden px-6 py-8 md:px-10 md:py-12 lg:px-12" origin="scale">
        <div className="hero-glow animate-drift absolute left-[-4rem] top-10 h-44 w-44 rounded-full opacity-65" />
        <div
          className="absolute right-[-3rem] top-16 h-60 w-60 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle at center, rgba(122, 188, 255, 0.32), transparent 72%)" }}
        />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.08fr,0.92fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/65">
              <Sparkles size={14} className="text-[var(--accent)]" />
              Creative archive
            </div>
            <SectionIntro
              eyebrow="Creative"
              title="A more immersive space for the visuals, edits, and atmosphere I want people to step into."
              body="This page brings together photos and videos in a way that feels closer to a curated gallery than a feed. Each piece reflects how I think about composition, rhythm, mood, and the feeling a visual can leave behind."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Archive</p>
              <p className="mt-5 font-display text-3xl text-white">{items.length.toString().padStart(2, "0")} pieces</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Photo</p>
              <p className="mt-5 font-display text-3xl text-white">{photoCount.toString().padStart(2, "0")}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Video</p>
              <p className="mt-5 font-display text-3xl text-white">{videoCount.toString().padStart(2, "0")}</p>
            </div>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" delay={100}>
        <div>
          <p className="eyebrow">Filter the gallery</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
            Move through the full gallery or narrow it by category to focus on one kind of mood, edit, or visual direction at a time.
          </p>
        </div>
        <FilterTabs items={categories} value={selectedCategory} onChange={setSelectedCategory} />
      </MotionReveal>

      {loading ? (
        <div className="glass-panel section-frame mt-12 p-8 text-white/60">Loading creative work...</div>
      ) : featuredItem ? (
        <>
          <MotionReveal className="mt-12" delay={140}>
            <SectionIntro
              eyebrow="Featured Piece"
              title={featuredItem.title}
              body={featuredItem.description || "A featured piece from the creative archive that sets the tone for the rest of the gallery."}
            />
          </MotionReveal>

          <MotionReveal className="glass-panel section-frame interactive-tilt mt-10 overflow-hidden" origin="scale" delay={160}>
            <div className="grid gap-0 lg:grid-cols-[1.05fr,0.95fr]">
              <div className="relative min-h-[320px] overflow-hidden border-b border-white/10 bg-black lg:min-h-full lg:border-b-0 lg:border-r">
                {featuredAssetType === "video" && featuredItem?.video?.url ? (
                  <video
                    className="h-full w-full object-cover"
                    src={featuredItem.video.url}
                    poster={featuredPreviewUrl || undefined}
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : featuredPreviewUrl ? (
                  <img src={featuredPreviewUrl} alt={featuredItem.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-white/45">
                    Upload media from the CMS to feature it here.
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-transparent opacity-70" />
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/72 backdrop-blur-md">
                    {featuredItem.category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/72 backdrop-blur-md">
                    {featuredAssetType}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 lg:p-10">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow">Featured frame</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/60 transition hover:border-white/20 hover:text-white"
                    onClick={() => openItem(featuredItem)}
                  >
                    <Expand size={14} />
                    Expand
                  </button>
                </div>

                <p className="mt-6 text-base leading-8 text-white/64">
                  {featuredItem.description || "A highlighted piece from the archive that gives a stronger sense of the visual atmosphere I want the page to carry."}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Category</p>
                    <p className="mt-4 text-sm leading-6 text-white/68">{featuredItem.category}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Format</p>
                    <p className="mt-4 text-sm leading-6 capitalize text-white/68">{featuredAssetType}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Gallery</p>
                    <p className="mt-4 text-sm leading-6 text-white/68">A visual archive shaped through pacing, atmosphere, and presentation.</p>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/60">
                  This featured piece sets the tone for the rest of the page, but the goal of the archive is to let each visual feel like part of a larger world rather than a disconnected upload.
                </div>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal className="mt-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" delay={180}>
            <SectionIntro
              eyebrow="Creative Archive"
              title={selectedCategory === "All" ? "More from the gallery." : `${selectedCategory} gallery in focus.`}
              body="The rest of the archive stays flexible and visual-first, so the page can feel curated while still leaving room for range and experimentation."
            />
            {archiveItems.length ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/62">
                Open any piece to take a closer look
                <ArrowRight size={15} />
              </div>
            ) : null}
          </MotionReveal>

          <div className="mt-10 grid auto-rows-fr gap-5 lg:grid-cols-3">
            {archiveItems.length ? (
              archiveItems.map((item, index) => (
                <MotionReveal key={item._id} delay={index * 70} distance={24} origin="scale">
                  <VideoCard
                    item={item}
                    className={index % 5 === 0 ? "lg:col-span-2" : ""}
                    onOpen={openItem}
                  />
                </MotionReveal>
              ))
            ) : (
              <div className="glass-panel section-frame p-8 text-white/58 lg:col-span-3">
                {selectedCategory === "All"
                  ? "There isn't a larger creative archive yet because only one published piece is available."
                  : `No additional creative pieces are published in ${selectedCategory} yet.`}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="glass-panel section-frame mt-12 p-8 text-white/60">No creative items found for this category yet.</div>
      )}

      <MotionReveal className="mt-20 pb-8" delay={180}>
        <div className="glass-panel section-frame surface-line grid gap-6 p-8 md:grid-cols-[1fr,auto] md:items-end">
          <div>
            <p className="eyebrow">Gallery note</p>
            <h2 className="mt-5 font-display text-4xl leading-[0.96] text-white md:text-5xl">
              The archive keeps growing as I keep refining what I want my visual work to feel like.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/62">
              Some pieces are quieter, some are more cinematic, and some are experiments, but together they help define the creative side of the portfolio more clearly.
            </p>
          </div>

          <button type="button" className="public-button" onClick={() => featuredItem && openItem(featuredItem)}>
            View featured piece
            <Expand size={16} />
          </button>
        </div>
      </MotionReveal>

      {activeItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-xl" onClick={closeItem}>
          <div
            className="glass-panel section-frame relative w-full max-w-5xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/70 backdrop-blur-md transition hover:border-white/20 hover:text-white"
              onClick={closeItem}
            >
              Close
            </button>

            <div className="grid gap-0 lg:grid-cols-[1.05fr,0.95fr]">
              <div className="relative min-h-[320px] bg-black">
                {(activeItem.assetType === "video" || activeItem?.video?.url) && activeItem?.video?.url ? (
                  <video
                    className="h-full w-full object-cover"
                    src={activeItem.video.url}
                    poster={activeItem?.image?.url || activeItem?.thumbnail?.url || undefined}
                    controls
                    autoPlay
                    playsInline
                  />
                ) : activeItem?.image?.url || activeItem?.thumbnail?.url ? (
                  <img
                    src={activeItem.image?.url || activeItem.thumbnail?.url}
                    alt={activeItem.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-white/45">
                    No preview available for this item.
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 lg:p-10">
                <p className="eyebrow">Creative Detail</p>
                <h3 className="mt-5 font-display text-4xl leading-[0.96] text-white">{activeItem.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                    {activeItem.category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase text-white/60">
                    {activeItem.assetType || (activeItem?.video?.url ? "video" : "photo")}
                  </span>
                </div>
                <p className="mt-6 text-base leading-8 text-white/64">
                  {activeItem.description || "This piece sits inside the archive as part of the visual and editorial direction the creative page is meant to carry."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ShowcasePage;
