import { ArrowRight, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSiteSnapshot } from "../../api/publicApi.js";
import HeroDepthScene from "../../components/public/HeroDepthScene.jsx";
import MotionReveal from "../../components/public/MotionReveal.jsx";
import ProjectCard from "../../components/public/ProjectCard.jsx";
import SectionIntro from "../../components/public/SectionIntro.jsx";
import VideoCard from "../../components/public/VideoCard.jsx";
import { applyAccentTheme } from "../../theme.js";

function HomePage() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSnapshot()
      .then(setSnapshot)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    applyAccentTheme(snapshot?.sections?.settings?.data?.accent);
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
    return (
      <div className="shell py-24">
        <div className="glass-panel p-8 text-white/60">Loading portfolio...</div>
      </div>
    );
  }

  const sectionBlocks = {
    projects: (
      <MotionReveal as="section" className="shell mt-24" key="projects" delay={80}>
        <SectionIntro
          eyebrow="Selected Work"
          title="Projects shaped with clarity and momentum."
          body="This is a selection of projects I've built to explore ideas, improve my problem-solving, and turn what I learn into experiences that feel clean, useful, and intentional."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {snapshot?.featuredProjects?.length ? (
            snapshot.featuredProjects.map((project, index) => (
              <MotionReveal key={project._id} delay={index * 90} distance={24} origin="scale">
                <ProjectCard project={project} />
              </MotionReveal>
            ))
          ) : (
            <div className="glass-panel p-8 text-white/55">Add featured projects from the admin dashboard to populate this section.</div>
          )}
        </div>
      </MotionReveal>
    ),
    showcase: (
      <MotionReveal as="section" className="shell mt-24" key="showcase" delay={120}>
        <SectionIntro
          eyebrow="Creative"
          title="Motion, rhythm, and storytelling in a cleaner frame."
          body="Here I've brought together both edits and visuals that reflect how I think about pacing, mood, framing, and storytelling. It's a space for the creative work I want people to experience together."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {snapshot?.featuredVideos?.length ? (
            snapshot.featuredVideos.map((item, index) => (
              <MotionReveal key={item._id} delay={index * 90} distance={24} origin="scale">
                <VideoCard item={item} />
              </MotionReveal>
            ))
          ) : (
            <div className="glass-panel p-8 text-white/55">
              No creative pieces yet. Add videos or photos from the admin panel and they'll appear here automatically.
            </div>
          )}
        </div>
      </MotionReveal>
    ),
    skills: (
      <MotionReveal as="section" className="shell mt-24" key="skills" delay={160}>
        <SectionIntro
          eyebrow="Capabilities"
          title={skills?.title || "Core capabilities."}
          body="These are the skills I've been building through projects, practice, and continuous learning, and they shape the way I approach both development and creative work."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {(skills?.items || []).map((item, index) => (
            <MotionReveal key={item} delay={index * 70} distance={22} origin="up">
              <div className="glass-panel p-5 text-sm text-white/70">{item}</div>
            </MotionReveal>
          ))}
        </div>
      </MotionReveal>
    )
  };

  return (
    <>
      <MotionReveal as="section" className="shell relative pt-14 md:pt-20" origin="scale">
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

          <HeroDepthScene
            availability={home?.availability}
            heroStats={home?.heroStats}
            aboutBody={about?.body}
            marquee={home?.marquee}
          />
        </div>
      </MotionReveal>

      <MotionReveal as="section" className="shell mt-16 overflow-hidden" delay={120}>
        <div className="glass-panel flex flex-wrap gap-3 px-4 py-4 md:px-6">
          {(home?.marquee || []).map((item) => (
            <div key={item} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/55">
              {item}
            </div>
          ))}
        </div>
      </MotionReveal>

      <MotionReveal as="section" className="shell mt-24 grid gap-10 lg:grid-cols-[1fr,1fr]" delay={140}>
        <SectionIntro eyebrow="About" title={about?.title || "About"} body={about?.body} />
        <div className="grid gap-4">
          {(about?.highlights || []).map((item, index) => (
            <MotionReveal key={item} delay={index * 80} distance={24} origin="right">
              <div className="glass-panel p-5 text-sm leading-7 text-white/65">{item}</div>
            </MotionReveal>
          ))}
        </div>
      </MotionReveal>

      {sectionOrder.map((key) => sectionBlocks[key]).filter(Boolean)}

      <MotionReveal as="section" className="shell mt-24 pb-10" delay={180}>
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
      </MotionReveal>
    </>
  );
}

export default HomePage;
