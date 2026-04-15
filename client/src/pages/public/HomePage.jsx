import { ArrowRight, Download, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSiteSnapshot } from "../../api/publicApi.js";
import ProjectCard from "../../components/public/ProjectCard.jsx";
import SectionIntro from "../../components/public/SectionIntro.jsx";
import VideoCard from "../../components/public/VideoCard.jsx";

function HomePage() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSnapshot()
      .then(setSnapshot)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const accent = snapshot?.sections?.settings?.data?.accent;
    if (accent) {
      document.documentElement.style.setProperty("--accent", accent);
    }
    document.title = snapshot?.sections?.settings?.data?.seoTitle || "Aryan Verma | Portfolio";
  }, [snapshot]);

  const home = snapshot?.sections?.home?.data;
  const about = snapshot?.sections?.about?.data;
  const skills = snapshot?.sections?.skills?.data;
  const contact = snapshot?.sections?.contact?.data;
  const settings = snapshot?.sections?.settings?.data;
  const sectionOrder = useMemo(() => home?.featuredSections || ["projects", "showcase", "skills"], [home]);
  const resumeUrl = settings?.resumeUrl || "/Aryan-Verma-Resume.docx";
  const resumeLabel = settings?.resumeLabel || "Download Resume";

  if (loading) {
    return <div className="shell py-24 text-white/60">Loading portfolio...</div>;
  }

  const sectionBlocks = {
    projects: (
      <section className="shell mt-24" key="projects">
        <SectionIntro
          eyebrow="Selected Work"
          title="Projects shaped with clarity and momentum."
          body="This is a selection of projects I’ve built to explore ideas, improve my problem-solving, and turn what I learn into experiences that feel clean, useful, and intentional."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {snapshot?.featuredProjects?.length ? (
            snapshot.featuredProjects.map((project) => <ProjectCard key={project._id} project={project} />)
          ) : (
            <div className="glass-panel p-8 text-white/55">Add featured projects from the admin dashboard to populate this section.</div>
          )}
        </div>
      </section>
    ),
    showcase: (
      <section className="shell mt-24" key="showcase">
        <SectionIntro
          eyebrow="Creative"
          title="Motion, rhythm, and storytelling in a cleaner frame."
          body="Here I’ve brought together both edits and visuals that reflect how I think about pacing, mood, framing, and storytelling. It’s a space for the creative work I want people to experience together."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {snapshot?.featuredVideos?.length ? (
            snapshot.featuredVideos.map((item) => <VideoCard key={item._id} item={item} />)
          ) : (
            <div className="glass-panel p-8 text-white/55">
              No creative pieces yet. Add videos or photos from the admin panel and they’ll appear here automatically.
            </div>
          )}
        </div>
      </section>
    ),
    skills: (
      <section className="shell mt-24" key="skills">
        <SectionIntro
          eyebrow="Capabilities"
          title={skills?.title || "Core capabilities."}
          body="These are the skills I’ve been building through projects, practice, and continuous learning, and they shape the way I approach both development and creative work."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {(skills?.items || []).map((item) => (
            <div key={item} className="glass-panel p-5 text-sm text-white/70">
              {item}
            </div>
          ))}
        </div>
      </section>
    )
  };

  return (
    <>
      <section className="shell relative pt-14 md:pt-20">
        <div className="absolute right-0 top-10 hidden h-72 w-72 rounded-full bg-[var(--accent)]/20 blur-3xl md:block" />
        <div className="grid items-end gap-12 lg:grid-cols-[1.25fr,0.75fr]">
          <div>
            <p className="eyebrow">Personal Portfolio</p>
            <p className="mt-6 font-display text-5xl leading-none text-white md:text-7xl">{home?.name || "Aryan Verma"}</p>
            <p className="mt-5 max-w-xl text-lg text-white/55 md:text-xl">{home?.role}</p>
            <h1 className="mt-10 max-w-4xl font-display text-5xl leading-[0.95] text-white md:text-[6rem]">
              {home?.headline}
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 md:text-lg">{home?.subheadline}</p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/45 md:text-base">{home?.intro}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/projects" className="public-button">
                View Projects
                <ArrowRight size={16} />
              </Link>
              <a
                href={resumeUrl}
                className="public-button bg-transparent"
                target={resumeUrl.startsWith("/") ? undefined : "_blank"}
                rel={resumeUrl.startsWith("/") ? undefined : "noreferrer"}
                download={resumeUrl.startsWith("/") ? true : undefined}
              >
                {resumeLabel}
                <Download size={16} />
              </a>
            </div>
          </div>

          <div className="glass-panel relative overflow-hidden p-6 md:p-8">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
            <div className="flex items-center gap-3 text-sm text-white/55">
              <Sparkles size={16} className="text-[var(--accent)]" />
              {home?.availability}
            </div>
            <div className="mt-8 space-y-4">
              {(home?.heroStats || []).map((stat) => (
                <div key={stat.label} className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-sm uppercase tracking-[0.18em] text-white/35">{stat.label}</span>
                  <span className="font-display text-4xl text-white">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/35">About Snapshot</p>
              <p className="mt-3 text-sm leading-7 text-white/65">{about?.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-16 overflow-hidden">
        <div className="glass-panel flex flex-wrap gap-3 px-4 py-4 md:px-6">
          {(home?.marquee || []).map((item) => (
            <div key={item} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/55">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-24 grid gap-10 lg:grid-cols-[1fr,1fr]">
        <SectionIntro eyebrow="About" title={about?.title || "About"} body={about?.body} />
        <div className="grid gap-4">
          {(about?.highlights || []).map((item) => (
            <div key={item} className="glass-panel p-5 text-sm leading-7 text-white/65">
              {item}
            </div>
          ))}
        </div>
      </section>

      {sectionOrder.map((key) => sectionBlocks[key]).filter(Boolean)}

      <section className="shell mt-24 pb-10">
        <div className="glass-panel grid gap-8 p-8 lg:grid-cols-[1fr,0.7fr] lg:items-end lg:p-10">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl text-white md:text-6xl">{contact?.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">{contact?.message}</p>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-white/45">{contact?.email}</p>
            <p className="text-sm text-white/45">{contact?.phone}</p>
            <Link to="/contact" className="public-button">
              Contact Aryan
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
