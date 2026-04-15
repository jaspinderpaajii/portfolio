import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSection, saveSection } from "../../api/adminApi.js";
import { AdminField, AdminTextarea, AdminToggle } from "../../components/admin/AdminFields.jsx";
import { ObjectListEditor, StringListEditor } from "../../components/admin/ListEditors.jsx";
import MediaUploader from "../../components/admin/MediaUploader.jsx";
import { sectionLabels } from "../../data/adminSections.js";
import { sectionDefaults } from "../../data/sectionTemplates.js";

function AdminSectionPage() {
  const { sectionKey } = useParams();
  const [data, setData] = useState(sectionDefaults[sectionKey] || {});
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchSection(sectionKey)
      .then((section) => {
        setData({ ...sectionDefaults[sectionKey], ...section.data });
        setPublished(section.published);
      })
      .finally(() => setLoading(false));
  }, [sectionKey]);

  function updateField(key, value) {
    setData((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      await saveSection(sectionKey, { data, published });
      setMessage("Saved successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save section.");
    } finally {
      setSaving(false);
    }
  }

  function renderSectionFields() {
    switch (sectionKey) {
      case "home":
        return (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <AdminField label="Name" value={data.name || ""} onChange={(event) => updateField("name", event.target.value)} />
              <AdminField label="Role" value={data.role || ""} onChange={(event) => updateField("role", event.target.value)} />
            </div>
            <AdminTextarea label="Headline" value={data.headline || ""} onChange={(event) => updateField("headline", event.target.value)} />
            <AdminTextarea
              label="Subheadline"
              value={data.subheadline || ""}
              onChange={(event) => updateField("subheadline", event.target.value)}
            />
            <AdminTextarea label="Intro" value={data.intro || ""} onChange={(event) => updateField("intro", event.target.value)} />
            <AdminField
              label="Availability"
              value={data.availability || ""}
              onChange={(event) => updateField("availability", event.target.value)}
            />
            <StringListEditor
              label="Featured Sections Order"
              items={data.featuredSections || []}
              onChange={(items) => updateField("featuredSections", items)}
              placeholder="projects"
            />
            <ObjectListEditor
              label="Hero Stats"
              items={data.heroStats || []}
              onChange={(items) => updateField("heroStats", items)}
              fields={[
                { key: "label", label: "Label", placeholder: "Years building" },
                { key: "value", label: "Value", placeholder: "03" }
              ]}
            />
            <StringListEditor
              label="Marquee Items"
              items={data.marquee || []}
              onChange={(items) => updateField("marquee", items)}
              placeholder="Frontend Development"
            />
          </div>
        );
      case "about":
        return (
          <div className="space-y-5">
            <AdminField label="Title" value={data.title || ""} onChange={(event) => updateField("title", event.target.value)} />
            <AdminTextarea label="Body" value={data.body || ""} onChange={(event) => updateField("body", event.target.value)} />
            <StringListEditor
              label="Highlights"
              items={data.highlights || []}
              onChange={(items) => updateField("highlights", items)}
            />
            <StringListEditor
              label="Education"
              items={data.education || []}
              onChange={(items) => updateField("education", items)}
            />
          </div>
        );
      case "skills":
        return (
          <div className="space-y-5">
            <AdminField label="Title" value={data.title || ""} onChange={(event) => updateField("title", event.target.value)} />
            <StringListEditor label="Skills" items={data.items || []} onChange={(items) => updateField("items", items)} />
          </div>
        );
      case "contact":
        return (
          <div className="space-y-5">
            <AdminField label="Title" value={data.title || ""} onChange={(event) => updateField("title", event.target.value)} />
            <div className="grid gap-5 md:grid-cols-2">
              <AdminField label="Email" value={data.email || ""} onChange={(event) => updateField("email", event.target.value)} />
              <AdminField label="Phone" value={data.phone || ""} onChange={(event) => updateField("phone", event.target.value)} />
            </div>
            <AdminField
              label="Location"
              value={data.location || ""}
              onChange={(event) => updateField("location", event.target.value)}
            />
            <AdminTextarea label="Message" value={data.message || ""} onChange={(event) => updateField("message", event.target.value)} />
            <ObjectListEditor
              label="Social Links"
              items={data.socials || []}
              onChange={(items) => updateField("socials", items)}
              fields={[
                { key: "label", label: "Label", placeholder: "GitHub" },
                { key: "url", label: "URL", placeholder: "https://github.com/username" }
              ]}
            />
          </div>
        );
      case "settings":
        return (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <AdminField
                label="Site Name"
                value={data.siteName || ""}
                onChange={(event) => updateField("siteName", event.target.value)}
              />
              <AdminField
                label="Admin Brand"
                value={data.adminBrand || ""}
                onChange={(event) => updateField("adminBrand", event.target.value)}
              />
            </div>
            <AdminTextarea
              label="Footer Text"
              value={data.footerText || ""}
              onChange={(event) => updateField("footerText", event.target.value)}
            />
            <div className="grid gap-5 md:grid-cols-[1fr,180px]">
              <AdminField
                label="Accent Color"
                value={data.accent || "#c47b49"}
                onChange={(event) => updateField("accent", event.target.value)}
              />
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-800">Color Picker</span>
                <input
                  type="color"
                  className="h-[54px] w-full rounded-2xl border border-slate-200 bg-white p-2"
                  value={data.accent || "#c47b49"}
                  onChange={(event) => updateField("accent", event.target.value)}
                />
              </label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <AdminField
                label="Resume Button Label"
                value={data.resumeLabel || "Download Resume"}
                onChange={(event) => updateField("resumeLabel", event.target.value)}
              />
              <AdminField
                label="Resume URL"
                value={data.resumeUrl || ""}
                onChange={(event) => updateField("resumeUrl", event.target.value)}
              />
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Resume File</p>
                  <p className="mt-1 text-xs text-slate-500">Upload a PDF or Word document to update the public resume button.</p>
                </div>
                <MediaUploader
                  label="Upload Resume"
                  resourceType="raw"
                  onUploaded={(asset) => updateField("resumeUrl", asset.url)}
                />
              </div>
              {data.resumeUrl ? (
                <a
                  href={data.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
                >
                  Preview Current Resume
                </a>
              ) : (
                <p className="text-xs text-slate-500">No custom resume uploaded yet. The current fallback resume will still work.</p>
              )}
            </div>
            <AdminField
              label="SEO Title"
              value={data.seoTitle || ""}
              onChange={(event) => updateField("seoTitle", event.target.value)}
            />
            <AdminTextarea
              label="SEO Description"
              value={data.seoDescription || ""}
              onChange={(event) => updateField("seoDescription", event.target.value)}
            />
          </div>
        );
      default:
        return <div className="text-sm text-slate-500">Unknown section.</div>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Content Editor</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{sectionLabels[sectionKey] || sectionKey}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Edit structured content for this section and publish changes to the public site.
          </p>
        </div>
        <button type="button" className="admin-button" onClick={handleSave} disabled={saving || loading}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="admin-card">
        <AdminToggle label="Published" checked={published} onChange={setPublished} />
      </div>

      <div className="admin-card">{loading ? <p className="text-sm text-slate-500">Loading section...</p> : renderSectionFields()}</div>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}

export default AdminSectionPage;
