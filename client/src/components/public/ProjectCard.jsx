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

function ProjectCard({ project }) {
  const liveUrl = normalizeExternalUrl(project?.links?.live);
  const githubUrl = normalizeExternalUrl(project?.links?.github);
  const caseStudyUrl = normalizeExternalUrl(project?.links?.caseStudy);
  const primaryUrl = liveUrl || caseStudyUrl || githubUrl;
  const coverImageUrl = project?.coverImage?.url;

  return (
    <article className="glass-panel group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:border-white/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="mb-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={project.title}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-56 items-end bg-gradient-to-br from-white/10 via-white/[0.04] to-[var(--accent)]/15 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">{project.category}</p>
              <p className="mt-2 text-lg font-medium text-white/80">{project.title}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">{project.category}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{project.title}</h3>
        </div>
        {primaryUrl ? (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[var(--accent)] hover:text-white"
          >
            <ArrowUpRight size={18} />
          </a>
        ) : (
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/60">
            <ArrowUpRight size={18} />
          </span>
        )}
      </div>

      <p className="mt-5 text-sm leading-7 text-white/65">{project.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(project.techStack || []).map((item) => (
          <span key={`${project.slug}-${item}`} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
            {item}
          </span>
        ))}
      </div>

      {liveUrl || githubUrl || caseStudyUrl ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70 transition hover:border-[var(--accent)] hover:text-white"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70 transition hover:border-[var(--accent)] hover:text-white"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70 transition hover:border-[var(--accent)] hover:text-white"
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
