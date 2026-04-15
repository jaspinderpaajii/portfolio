import { useEffect, useState } from "react";
import { fetchShowcase, fetchSiteSnapshot } from "../../api/publicApi.js";
import FilterTabs from "../../components/public/FilterTabs.jsx";
import SectionIntro from "../../components/public/SectionIntro.jsx";
import VideoCard from "../../components/public/VideoCard.jsx";

function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSnapshot().then((snapshot) => {
      const accent = snapshot?.sections?.settings?.data?.accent;
      if (accent) {
        document.documentElement.style.setProperty("--accent", accent);
      }
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

  return (
    <section className="shell pt-16 md:pt-24">
      <SectionIntro
        eyebrow="Creative"
        title="A space for the visuals and edits I want people to step into."
        body="This page brings together videos and photos that reflect how I think about storytelling, atmosphere, and composition. Each piece captures a part of the creative work I’ve been shaping."
      />
      <div className="mt-10">
        <FilterTabs items={categories} value={selectedCategory} onChange={setSelectedCategory} />
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {loading ? (
          <div className="glass-panel p-8 text-white/60">Loading creative work...</div>
        ) : items.length ? (
          items.map((item) => <VideoCard key={item._id} item={item} />)
        ) : (
          <div className="glass-panel p-8 text-white/60">No creative items found for this category yet.</div>
        )}
      </div>
    </section>
  );
}

export default ShowcasePage;
