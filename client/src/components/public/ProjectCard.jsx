import { ArrowUpRight, FileText, Github, Globe } from "lucide-react";

function normalizeExternalUrl(url) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

function ProjectCard({ project, className = "" }) {
  const liveUrl = normalizeExternalUrl(project?.links?.live);
  const githubUrl = normalizeExternalUrl(project?.links?.github);
  const caseStudyUrl = normalizeExternalUrl(project?.links?.caseStudy);
  const primaryUrl = liveUrl || caseStudyUrl || githubUrl;
  const coverImageUrl = project?.coverImage?.url;

  return (
    <article className={`glass-panel section-frame interactive-tilt group relative overflow-hidden p-5 md:p-6 ${className}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.92)] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="mb-6 overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/5">
        {coverImageUrl ? (
          <div className="relative">
            <img
              src={coverImageUrl}
              alt={project.title}
              className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-transparent opacity-70" />
            <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-white/70 backdrop-blur-md">
              {project.category}
            </div>
          </div>
        ) : (
          <div className="flex h-56 items-end bg-gradient-to-br from-white/10 via-white/[0.04] to-[rgba(var(--accent-rgb),0.18)] p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">{project.category}</p>
              <p className="mt-2 text-lg font-medium text-white/80">{project.title}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/38">{project.category}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white md:text-[1.75rem]">{project.title}</h3>
        </div>
        {primaryUrl ? (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-[rgba(var(--accent-rgb),0.55)] hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowUpRight size={18} />
          </a>
        ) : (
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/60">
            <ArrowUpRight size={18} />
          </span>
        )}
      </div>

      <p className="mt-5 text-sm leading-7 text-white/62">{project.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(project.techStack || []).map((item) => (
          <span
            key={`${project.slug}-${item}`}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/58"
          >
            {item}
          </span>
        ))}
      </div>

      {liveUrl || githubUrl || caseStudyUrl ? (
        <div className="mt-7 flex flex-wrap gap-3">
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70 transition hover:border-[rgba(var(--accent-rgb),0.55)] hover:text-white"
            >
              <Globe size={14} />
              Live Site
            </a>
          ) : null}
          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70 transition hover:border-[rgba(var(--accent-rgb),0.55)] hover:text-white"
            >
              <Github size={14} />
              GitHub
            </a>
          ) : null}
          {caseStudyUrl ? (
            <a
              href={caseStudyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70 transition hover:border-[rgba(var(--accent-rgb),0.55)] hover:text-white"
            >
              <FileText size={14} />
              Case Study
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export default ProjectCard;
