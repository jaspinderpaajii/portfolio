import { useEffect, useState } from "react";
import { fetchProjects, fetchSiteSnapshot } from "../../api/publicApi.js";
import ProjectCard from "../../components/public/ProjectCard.jsx";
import SectionIntro from "../../components/public/SectionIntro.jsx";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchSiteSnapshot()])
      .then(([projectData, snapshot]) => {
        setProjects(projectData);
        const accent = snapshot?.sections?.settings?.data?.accent;
        if (accent) {
          document.documentElement.style.setProperty("--accent", accent);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="shell pt-16 md:pt-24">
      <SectionIntro
        eyebrow="Projects"
        title="A closer look at the ideas I’ve built and brought to life."
        body="These projects reflect the way I think, build, and solve problems through code. From interface experiments to practical web builds, each one has helped me sharpen the way I approach digital experiences."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {loading ? (
          <div className="glass-panel p-8 text-white/60">Loading projects...</div>
        ) : (
          projects.map((project) => <ProjectCard key={project._id} project={project} />)
        )}
      </div>
    </section>
  );
}

export default ProjectsPage;
