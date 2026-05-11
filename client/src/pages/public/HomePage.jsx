import { ArrowRight, CheckCircle2, Download, Mail, Phone, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSiteSnapshot } from "../../api/publicApi.js";
import FeaturedCarousel from "../../components/public/FeaturedCarousel.jsx";
import HeroDepthScene from "../../components/public/HeroDepthScene.jsx";
import MotionReveal from "../../components/public/MotionReveal.jsx";
import ProjectCard from "../../components/public/ProjectCard.jsx";
import SectionIntro from "../../components/public/SectionIntro.jsx";
import VideoCard from "../../components/public/VideoCard.jsx";

function AssemblyChrome({ label = "module", belt = true }) {
  return (
    <div className={`assembly-chrome ${belt ? "" : "assembly-chrome-no-belt"}`.trim()} aria-hidden="true">
      <div className="assembly-chrome-rail assembly-chrome-rail-top" />
      <div className="assembly-chrome-rail assembly-chrome-rail-bottom" />
      {belt ? <div className="assembly-chrome-belt" /> : null}
      <div className="assembly-transfer-rail assembly-transfer-rail-left" />
      <div className="assembly-transfer-rail assembly-transfer-rail-right" />
      <div className="assembly-chrome-sockets">
        <span />
        <span />
        <span />
        <span />
      </div>
      {belt ? (
        <div className="assembly-layer-queue">
          <span />
          <span />
          <span />
        </div>
      ) : null}
    </div>
  );
}

const assemblyRevealProps = {
  threshold: 0.14,
  rootMargin: "0px 0px -22% 0px",
  buildLead: 1800,
  settleDelay: 7600
};

function HomePage() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSnapshot()
      .then(setSnapshot)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", "#f5f7fa");
    document.documentElement.style.setProperty("--accent-rgb", "245 247 250");
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
  const emailHref = contact?.email ? `mailto:${contact.email}` : null;
  const phoneHref = contact?.phone ? `tel:${contact.phone.replace(/[^\d+]/g, "")}` : null;
  const skillItems = skills?.items || [];

  if (loading) {
    return (
      <div className="shell py-24">
        <div className="glass-panel p-8 text-white/60">Loading portfolio...</div>
      </div>
    );
  }

  const sectionBlocks = {
    projects: (
      <MotionReveal as="section" className="shell build-surface build-projects work-assembly-section mt-16" key="projects" delay={80} {...assemblyRevealProps}>
        <AssemblyChrome label="project bay" />
        <SectionIntro
          eyebrow="Selected Work"
          title="Projects shaped with clarity and momentum."
          body="This is a selection of projects I've built to explore ideas, improve my problem-solving, and turn what I learn into experiences that feel clean, useful, and intentional."
        />
        <FeaturedCarousel
          items={snapshot?.featuredProjects || []}
          itemLabel="project"
          emptyState={
            <div className="glass-panel mt-10 p-8 text-white/55">
              Add featured projects from the admin dashboard to populate this section.
            </div>
          }
          renderItem={(project) => (
            <ProjectCard project={project} variant="media" className="h-full featured-carousel-card" />
          )}
        />
      </MotionReveal>
    ),
    showcase: (
      <MotionReveal as="section" className="shell build-surface build-showcase work-assembly-section mt-16" key="showcase" delay={120} {...assemblyRevealProps}>
        <AssemblyChrome label="media bay" />
        <SectionIntro
          eyebrow="Creative"
          title="Motion, rhythm, and storytelling in a cleaner frame."
          body="Here I've brought together both edits and visuals that reflect how I think about pacing, mood, framing, and storytelling. It's a space for the creative work I want people to experience together."
        />
        <FeaturedCarousel
          items={snapshot?.featuredVideos || []}
          itemLabel="creative piece"
          emptyState={
            <div className="glass-panel mt-10 p-8 text-white/55">
              No creative pieces yet. Add videos or photos from the admin panel and they'll appear here automatically.
            </div>
          }
          renderItem={(item) => (
            <VideoCard item={item} variant="media" className="h-full featured-carousel-card" />
          )}
        />
      </MotionReveal>
    ),
    skills: (
      <MotionReveal as="section" className="shell build-surface build-skills mt-20" key="skills" delay={160} {...assemblyRevealProps}>
        <AssemblyChrome label="skills bay" />
        <SectionIntro
          eyebrow="Capabilities"
          title={skills?.title || "Core capabilities."}
          body="These are the skills I've been building through projects, practice, and continuous learning, and they shape the way I approach both development and creative work."
        />
        <div className="skills-assembly-header mt-8" aria-hidden="true">
          <span>Component feed</span>
          <i />
          <b>{skillItems.length} modules</b>
        </div>
        <div className="skills-build-grid mt-4">
          <span className="build-arm-target build-arm-target-right" aria-hidden="true" />
          {skillItems.map((item, index) => (
            <MotionReveal key={item} delay={index * 115} distance={18} origin="right">
              <div className="glass-panel skill-tile section-frame relative p-4 text-sm font-medium leading-7 text-white/72 md:p-5">
                <span className="handoff-payload handoff-payload-skill" aria-hidden="true">
                  <i />
                  <b />
                </span>
                <i className="skill-tile-loader" aria-hidden="true">
                  <b />
                  <b />
                  <b />
                </i>
                <span className="skill-tile-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="skill-tile-label">{item}</span>
                <span className="skill-tile-catch" aria-hidden="true" />
              </div>
            </MotionReveal>
          ))}
        </div>
      </MotionReveal>
    )
  };

  return (
    <>
      <MotionReveal as="section" className="shell build-surface build-hero portfolio-assembly-hero relative pt-8 md:pt-10" origin="scale" threshold={0.2} buildLead={760}>
        <AssemblyChrome label="hero assembly" belt={false} />
        <div className="hero-build-crane hero-build-crane-left" aria-hidden="true">
          <span />
          <i />
          <b />
        </div>
        <div className="hero-build-crane hero-build-crane-right" aria-hidden="true">
          <span />
          <i />
          <b />
        </div>
        <div className="grid items-start gap-8 overflow-hidden lg:grid-cols-[minmax(0,1.38fr),minmax(18rem,0.62fr)]">
          <div className="hero-copy-panel min-w-0">
            <span className="build-arm-target build-arm-target-left" aria-hidden="true" />
            <div className="hero-copy-locks" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/65">
              <Sparkles size={14} className="text-white" />
              Personal Portfolio
            </div>
            <p className="mt-6 font-display text-5xl leading-none text-white md:text-6xl">{home?.name || "Aryan Verma"}</p>
            <p className="mt-4 max-w-xl text-base font-medium text-white/72 md:text-lg">{home?.role}</p>
            <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[0.96] text-white md:text-[3.8rem] xl:text-[4.05rem]">
              {home?.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">{home?.subheadline}</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/48 md:text-base">{home?.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/projects" className="public-button">
                View Projects
                <ArrowRight size={16} />
              </Link>
              <a
                href={resumeUrl}
                className="public-button-subtle"
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
            heroStats={home?.heroStats}
            marquee={home?.marquee}
          />
        </div>
      </MotionReveal>

      <MotionReveal as="section" className="shell build-surface build-tools mt-10 overflow-hidden" delay={120} {...assemblyRevealProps}>
        <AssemblyChrome label="tool rack" belt={false} />
        <div className="glass-panel feature-strip flex flex-wrap gap-3 px-4 py-4 md:px-6">
          <span className="build-arm-target build-arm-target-right" aria-hidden="true" />
          <span className="handoff-payload handoff-payload-tool-strip" aria-hidden="true">
            <i />
            <b />
            <b />
          </span>
          {(home?.marquee || []).map((item, index) => (
            <div key={item} className="feature-strip-chip">
              <span className="feature-strip-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="feature-strip-label">{item}</span>
              <i aria-hidden="true" />
            </div>
          ))}
        </div>
      </MotionReveal>

      <MotionReveal as="section" className="shell build-surface build-about about-build-surface mt-12 grid gap-10 lg:grid-cols-[0.9fr,1.1fr]" delay={140} {...assemblyRevealProps}>
        <AssemblyChrome label="about bay" />
        <SectionIntro eyebrow="About" title={about?.title || "About"} body={about?.body} />
        <div className="about-card-stack grid gap-4">
          <span className="build-arm-target build-arm-target-right" aria-hidden="true" />
          <div className="about-stack-header" aria-hidden="true">
            <span>Profile modules</span>
            <i />
            <b />
            <b />
            <b />
          </div>
          {(about?.highlights || []).map((item, index) => (
            <MotionReveal key={item} delay={index * 430} distance={24} origin="right">
              <div className="about-build-card glass-panel section-frame relative p-5 text-sm leading-7 text-white/66">
                <span className="handoff-payload handoff-payload-about" aria-hidden="true">
                  <i />
                  <b />
                  <b />
                </span>
                <i className="about-card-placer" aria-hidden="true">
                  <b />
                  <b />
                </i>
                <div className="about-card-locks" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <span className="about-card-rail" aria-hidden="true" />
                <div className="relative z-[1] flex gap-4">
                  <span className="about-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="about-card-text">{item}</span>
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>
      </MotionReveal>

      {sectionOrder.map((key) => sectionBlocks[key]).filter(Boolean)}

      <MotionReveal as="section" className="shell build-surface build-contact mt-20 pb-10" delay={180} {...assemblyRevealProps}>
        <AssemblyChrome label="final bay" />
        <div className="contact-build-panel glass-panel section-frame grid gap-8 p-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-stretch lg:p-10">
          <div className="contact-build-scan" aria-hidden="true" />
          <span className="handoff-payload handoff-payload-contact-seal" aria-hidden="true">
            <i />
            <b />
            <b />
          </span>
          <div className="contact-final-bridge" aria-hidden="true">
            <span />
            <span />
            <i />
            <b />
          </div>
          <div className="contact-final-locks" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="contact-copy-module">
            <span className="build-arm-target build-arm-target-left" aria-hidden="true" />
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl text-white md:text-6xl">{contact?.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">{contact?.message}</p>
            <div className="contact-status-rail">
              <span>
                <CheckCircle2 size={15} />
                Ready for new builds
              </span>
              <i aria-hidden="true" />
            </div>
          </div>
          <div className="contact-terminal-module">
            <span className="build-arm-target build-arm-target-right" aria-hidden="true" />
            <div className="contact-terminal-clamps" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="contact-terminal-header">
              <div aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>Output channel</p>
            </div>
            <div className="contact-channel-grid">
              {emailHref ? (
                <a className="contact-channel-card" href={emailHref}>
                  <Mail size={17} />
                  <span>Email</span>
                  <strong>{contact.email}</strong>
                </a>
              ) : null}
              {phoneHref ? (
                <a className="contact-channel-card" href={phoneHref}>
                  <Phone size={17} />
                  <span>Phone</span>
                  <strong>{contact.phone}</strong>
                </a>
              ) : null}
            </div>
            <div className="contact-action-row">
              <Link to="/contact" className="public-button contact-primary-action">
                Start a conversation
                <Send size={16} />
              </Link>
              <a
                href={resumeUrl}
                className="public-button-subtle contact-secondary-action"
                target={resumeUrl.startsWith("/") ? undefined : "_blank"}
                rel={resumeUrl.startsWith("/") ? undefined : "noreferrer"}
                download={resumeUrl.startsWith("/") ? true : undefined}
              >
                {resumeLabel}
                <Download size={16} />
              </a>
            </div>
          </div>
        </div>
      </MotionReveal>
    </>
  );
}

export default HomePage;
