import { ArrowDown, ArrowUp, ImagePlus, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  fetchProjectsAdmin,
  reorderProjects,
  updateProject
} from "../../api/adminApi.js";
import { AdminField, AdminTextarea, AdminToggle } from "../../components/admin/AdminFields.jsx";
import MediaUploader from "../../components/admin/MediaUploader.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import { blankProject } from "../../data/sectionTemplates.js";

function normalizeProject(project) {
  return {
    ...blankProject,
    ...project,
    techStackText: (project.techStack || []).join(", "),
    coverImage: project.coverImage || null,
    gallery: project.gallery || [],
    links: {
      ...blankProject.links,
      ...(project.links || {})
    }
  };
}

function toPayload(form) {
  return {
    title: form.title,
    summary: form.summary,
    description: form.description,
    category: form.category,
    techStack: form.techStackText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    links: form.links,
    featured: form.featured,
    published: form.published,
    coverImage: form.coverImage,
    gallery: form.gallery
  };
}

function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(blankProject);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProjectsAdmin()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setForm(blankProject);
    setEditingId(null);
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateLink(key, value) {
    setForm((current) => ({ ...current, links: { ...current.links, [key]: value } }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = toPayload(form);
      const saved = editingId ? await updateProject(editingId, payload) : await createProject(payload);

      if (editingId) {
        setProjects((current) => current.map((item) => (item._id === saved._id ? saved : item)));
      } else {
        setProjects((current) => [...current, saved].sort((a, b) => (a.order || 0) - (b.order || 0)));
      }

      setMessage(editingId ? "Project updated." : "Project created.");
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) {
      return;
    }

    await deleteProject(id);
    setProjects((current) => current.filter((item) => item._id !== id));
    if (editingId === id) {
      resetForm();
    }
  }

  async function moveProject(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= projects.length) {
      return;
    }

    const nextItems = [...projects];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    setProjects(nextItems);
    await reorderProjects(nextItems.map((item) => item._id));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Projects</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Manage project cards</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Create, edit, publish, and reorder projects shown across the public portfolio.
          </p>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="admin-card text-sm text-slate-500">Loading projects...</div>
          ) : (
            projects.map((project, index) => (
              <div key={project._id} className="admin-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                      <StatusBadge active={project.published} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{project.category}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{project.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="admin-button-muted" onClick={() => moveProject(index, -1)}>
                      <ArrowUp size={16} />
                    </button>
                    <button type="button" className="admin-button-muted" onClick={() => moveProject(index, 1)}>
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-button-muted"
                      onClick={() => {
                        setEditingId(project._id);
                        setForm(normalizeProject(project));
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="admin-button-muted" onClick={() => handleDelete(project._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <form className="admin-card space-y-5" onSubmit={handleSave}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-900">{editingId ? "Edit Project" : "New Project"}</p>
            <p className="text-xs text-slate-500">Cover image, links, tech stack, publish state, and ordering all supported.</p>
          </div>
          <button type="button" className="admin-button-muted" onClick={resetForm}>
            <Plus size={16} />
            New
          </button>
        </div>

        <AdminField label="Title" value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
        <AdminField label="Category" value={form.category} onChange={(event) => updateField("category", event.target.value)} />
        <AdminTextarea label="Summary" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} required />
        <AdminTextarea
          label="Description"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
        <AdminField
          label="Tech Stack"
          hint="Comma separated"
          value={form.techStackText}
          onChange={(event) => updateField("techStackText", event.target.value)}
        />

        <div className="grid gap-5 md:grid-cols-3">
          <AdminField label="Live URL" value={form.links.live} onChange={(event) => updateLink("live", event.target.value)} />
          <AdminField
            label="GitHub URL"
            value={form.links.github}
            onChange={(event) => updateLink("github", event.target.value)}
          />
          <AdminField
            label="Case Study URL"
            value={form.links.caseStudy}
            onChange={(event) => updateLink("caseStudy", event.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AdminToggle label="Featured" checked={form.featured} onChange={(value) => updateField("featured", value)} />
          <AdminToggle label="Published" checked={form.published} onChange={(value) => updateField("published", value)} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-800">Cover Image</span>
            <MediaUploader
              label="Upload Cover"
              resourceType="image"
              onUploaded={(asset) => updateField("coverImage", asset)}
            />
          </div>
          {form.coverImage?.url ? (
            <img src={form.coverImage.url} alt="Project cover" className="h-48 w-full rounded-[1.5rem] object-cover" />
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-8 text-sm text-slate-500">
              Upload a cover image for this project.
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-800">Gallery Images</span>
            <MediaUploader
              label="Add Gallery Image"
              resourceType="image"
              onUploaded={(asset) => updateField("gallery", [...form.gallery, asset])}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {form.gallery.map((asset, index) => (
              <div key={`${asset.url}-${index}`} className="relative overflow-hidden rounded-[1.5rem] border border-slate-200">
                <img src={asset.url} alt="Gallery item" className="h-40 w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800"
                  onClick={() => updateField("gallery", form.gallery.filter((_, currentIndex) => currentIndex !== index))}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {message ? <p className="text-sm text-slate-600">{message}</p> : null}

        <button type="submit" className="admin-button w-full justify-center" disabled={saving}>
          {saving ? <Save size={16} /> : <ImagePlus size={16} />}
          {saving ? "Saving..." : editingId ? "Update Project" : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default AdminProjectsPage;
