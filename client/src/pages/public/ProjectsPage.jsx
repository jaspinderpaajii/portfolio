import { ArrowRight, ArrowUpRight, FileText, Github, Globe, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects, fetchSiteSnapshot } from "../../api/publicApi.js";
import FilterTabs from "../../components/public/FilterTabs.jsx";
import MotionReveal from "../../components/public/MotionReveal.jsx";
import ProjectCard from "../../components/public/ProjectCard.jsx";
import SectionIntro from "../../components/public/SectionIntro.jsx";
import { applyAccentTheme } from "../../theme.js";

function normalizeExternalUrl(url) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchSiteSnapshot()])
      .then(([projectData, snapshot]) => {
        setProjects(projectData);
        applyAccentTheme(snapshot?.sections?.settings?.data?.accent);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(projects.map((project) => project.category).filter(Boolean))];
    return ["All", ...uniqueCategories];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") {
      return projects;
    }

    return projects.filter((project) => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  const featuredProject = useMemo(
    () => filteredProjects.find((project) => project.featured) || filteredProjects[0] || null,
    [filteredProjects]
  );

  const archiveProjects = useMemo(
    () => filteredProjects.filter((project) => project._id !== featuredProject?._id),
    [featuredProject, filteredProjects]
  );

  const liveUrl = normalizeExternalUrl(featuredProject?.links?.live);
  const githubUrl = normalizeExternalUrl(featuredProject?.links?.github);
  const caseStudyUrl = normalizeExternalUrl(featuredProject?.links?.caseStudy);
  const projectCountLabel = `${filteredProjects.length.toString().padStart(2, "0")} projects`;
  const categoryCountLabel = `${Math.max(categories.length - 1, 0).toString().padStart(2, "0")} categories`;
  const featuredCountLabel = `${projects.filter((project) => project.featured).length.toString().padStart(2, "0")} featured`;

  return (
    <section className="shell pt-12 md:pt-16">
      <MotionReveal className="glass-panel section-frame surface-line relative overflow-hidden px-6 py-8 md:px-10 md:py-12 lg:px-12" origin="scale">
        <div className="hero-glow animate-drift absolute left-[-5rem] top-10 h-44 w-44 rounded-full opacity-65" />
        <div
          className="absolute right-[-3rem] top-16 h-60 w-60 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle at center, rgba(122, 188, 255, 0.32), transparent 72%)" }}
        />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/65">
              <Sparkles size={14} className="text-[var(--accent)]" />
              Project archive
            </div>
            <SectionIntro
              eyebrow="Projects"
              title="A closer look at the ideas I've built and how I choose to present them."
              body="This page brings together the projects that have shaped the way I think through interfaces, structure, interaction, and problem solving. Some are experiments, some are more practical builds, but each one reflects a part of how I approach digital work."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[projectCountLabel, categoryCountLabel, featuredCountLabel].map((label) => (
              <div key={label} className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Overview</p>
                <p className="mt-5 font-display text-3xl text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionReveal>

      <MotionReveal className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" delay={100}>
        <div>
          <p className="eyebrow">Filter the archive</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
            Explore everything together or narrow the archive by category to see how different kinds of work take shape.
          </p>
        </div>
        <FilterTabs items={categories} value={selectedCategory} onChange={setSelectedCategory} />
      </MotionReveal>

      {loading ? (
        <div className="glass-panel section-frame mt-12 p-8 text-white/60">Loading projects...</div>
      ) : featuredProject ? (
        <>
          <MotionReveal className="mt-12" delay={140}>
            <SectionIntro
              eyebrow="Featured Case Study"
              title={featuredProject.title}
              body={featuredProject.description || featuredProject.summary}
            />
          </MotionReveal>

          <MotionReveal className="glass-panel section-frame interactive-tilt mt-10 overflow-hidden" origin="scale" delay={160}>
            <div className="grid gap-0 lg:grid-cols-[1.08fr,0.92fr]">
              <div className="relative min-h-[320px] overflow-hidden border-b border-white/10 lg:min-h-full lg:border-b-0 lg:border-r">
                {featuredProject.coverImage?.url ? (
                  <>
                    <img
                      src={featuredProject.coverImage.url}
                      alt={featuredProject.title}
                      className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-transparent opacity-75" />
                  </>
                ) : (
                  <div className="flex h-full min-h-[320px] items-end bg-gradient-to-br from-white/10 via-white/[0.04] to-[rgba(var(--accent-rgb),0.18)] p-8">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.26em] text-white/40">{featuredProject.category}</p>
                      <p className="mt-3 font-display text-4xl text-white">{featuredProject.title}</p>
                    </div>
                  </div>
                )}

                <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/72 backdrop-blur-md">
                  {featuredProject.category}
                </div>
              </div>

              <div className="p-6 md:p-8 lg:p-10">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow">Featured build</p>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/55">
                    Spotlight
                  </div>
                </div>

                <p className="mt-6 text-base leading-8 text-white/64">
                  {featuredProject.description || featuredProject.summary}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {(featuredProject.techStack || []).map((item) => (
                    <span key={`${featuredProject.slug}-${item}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Role</p>
                    <p className="mt-4 text-sm leading-6 text-white/68">Builder, designer, and problem solver across the full experience.</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Focus</p>
                    <p className="mt-4 text-sm leading-6 text-white/68">Clarity, interaction, and making the interface feel more intentional.</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">Outcome</p>
                    <p className="mt-4 text-sm leading-6 text-white/68">A project that reflects how I think technically and visually at the same time.</p>
                  </div>
                </div>

                {(liveUrl || githubUrl || caseStudyUrl) ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {liveUrl ? (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="public-button"
                      >
                        <Globe size={16} />
                        Visit live project
                      </a>
                    ) : null}
                    {githubUrl ? (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/72 transition hover:border-white/20 hover:text-white"
                      >
                        <Github size={16} />
                        View code
                      </a>
                    ) : null}
                    {caseStudyUrl ? (
                      <a
                        href={caseStudyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/72 transition hover:border-white/20 hover:text-white"
                      >
                        <FileText size={16} />
                        Read case study
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/55">
                    External links have not been added for this project yet, but the build still forms part of the archive.
                  </div>
                )}
              </div>
            </div>
          </MotionReveal>

          <MotionReveal className="mt-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" delay={180}>
            <SectionIntro
              eyebrow="Project Archive"
              title={selectedCategory === "All" ? "The rest of the archive." : `${selectedCategory} work in focus.`}
              body="The rest of the work stays here in a more flexible archive, so it still feels curated without losing the breadth of what I've been building."
            />
            {archiveProjects.length ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/62">
                Scroll through the archive
                <ArrowRight size={15} />
              </div>
            ) : null}
          </MotionReveal>

          <div className="mt-10 grid auto-rows-fr gap-5 lg:grid-cols-3">
            {archiveProjects.length ? (
              archiveProjects.map((project, index) => (
                <MotionReveal key={project._id} delay={index * 70} distance={24} origin="scale">
                  <ProjectCard
                    project={project}
                    className={index % 5 === 0 ? "lg:col-span-2" : ""}
                  />
                </MotionReveal>
              ))
            ) : (
              <div className="glass-panel section-frame p-8 text-white/58 lg:col-span-3">
                {selectedCategory === "All"
                  ? "There isn't a larger archive yet because only one project is currently published."
                  : `No additional projects are published in ${selectedCategory} yet.`}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="glass-panel section-frame mt-12 p-8 text-white/60">No published projects are available yet.</div>
      )}

      <MotionReveal className="mt-20 pb-8" delay={180}>
        <div className="glass-panel section-frame surface-line grid gap-6 p-8 md:grid-cols-[1fr,auto] md:items-end">
          <div>
            <p className="eyebrow">Next step</p>
            <h2 className="mt-5 font-display text-4xl leading-[0.96] text-white md:text-5xl">
              Each project here is one part of the larger direction I’m still building toward.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/62">
              The archive keeps growing as I refine both technical work and how I present it, so this page is meant to feel alive instead of frozen.
            </p>
          </div>

          <Link to="/contact" className="public-button">
            Start a conversation
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </MotionReveal>
    </section>
  );
}

export default ProjectsPage;
