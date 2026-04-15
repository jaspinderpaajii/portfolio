import { ArrowDown, ArrowUp, Pencil, Plus, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createVideo,
  deleteVideo,
  fetchVideosAdmin,
  reorderVideos,
  updateVideo
} from "../../api/adminApi.js";
import { AdminField, AdminTextarea, AdminToggle } from "../../components/admin/AdminFields.jsx";
import MediaUploader from "../../components/admin/MediaUploader.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import { blankVideo } from "../../data/sectionTemplates.js";

function inferAssetType(item) {
  if (item?.assetType === "photo") {
    return "photo";
  }

  return item?.video?.url ? "video" : item?.image?.url ? "photo" : "video";
}

function AdminVideosPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blankVideo);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVideosAdmin()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(blankVideo);
    setEditingId(null);
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        assetType: form.assetType,
        featured: form.featured,
        published: form.published,
        video: form.video,
        image: form.image,
        thumbnail: form.thumbnail
      };

      const saved = editingId ? await updateVideo(editingId, payload) : await createVideo(payload);

      if (editingId) {
        setItems((current) => current.map((item) => (item._id === saved._id ? saved : item)));
      } else {
        setItems((current) => [...current, saved].sort((a, b) => (a.order || 0) - (b.order || 0)));
      }

      setMessage(editingId ? "Creative item updated." : "Creative item created.");
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save creative item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this creative item?");
    if (!confirmed) {
      return;
    }

    await deleteVideo(id);
    setItems((current) => current.filter((item) => item._id !== id));
    if (editingId === id) {
      resetForm();
    }
  }

  async function moveItem(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    setItems(nextItems);
    await reorderVideos(nextItems.map((item) => item._id));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <div className="space-y-5">
        <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Creative</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Manage creative work</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
            Upload videos or photos, assign categories, publish selectively, and control order without changing the rest of the site.
            </p>
          </div>

        <div className="space-y-3">
          {loading ? (
            <div className="admin-card text-sm text-slate-500">Loading creative items...</div>
          ) : (
            items.map((item, index) => (
              <div key={item._id} className="admin-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <StatusBadge active={item.published} />
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                        {inferAssetType(item)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{item.category}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description || "No description yet."}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="admin-button-muted" onClick={() => moveItem(index, -1)}>
                      <ArrowUp size={16} />
                    </button>
                    <button type="button" className="admin-button-muted" onClick={() => moveItem(index, 1)}>
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-button-muted"
                      onClick={() => {
                        setEditingId(item._id);
                        setForm({
                          ...blankVideo,
                          ...item,
                          assetType: inferAssetType(item),
                          video: item.video || null,
                          image: item.image || null,
                          thumbnail: item.thumbnail || null
                        });
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="admin-button-muted" onClick={() => handleDelete(item._id)}>
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
            <p className="text-sm font-medium text-slate-900">{editingId ? "Edit Creative Item" : "New Creative Item"}</p>
            <p className="text-xs text-slate-500">Built for category filters, featured placements, and both photo and video uploads.</p>
          </div>
          <button type="button" className="admin-button-muted" onClick={resetForm}>
            <Plus size={16} />
            New
          </button>
        </div>

        <AdminField label="Title" value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
        <AdminField label="Category" value={form.category} onChange={(event) => updateField("category", event.target.value)} required />
        <AdminTextarea
          label="Description"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />

        <div className="space-y-3">
          <span className="text-sm font-medium text-slate-800">Media Type</span>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                form.assetType === "video"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => updateField("assetType", "video")}
            >
              Video
            </button>
            <button
              type="button"
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                form.assetType === "photo"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
              onClick={() => updateField("assetType", "photo")}
            >
              Photo
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AdminToggle label="Featured" checked={form.featured} onChange={(value) => updateField("featured", value)} />
          <AdminToggle label="Published" checked={form.published} onChange={(value) => updateField("published", value)} />
        </div>

        {form.assetType === "video" ? (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">Video File</span>
                <MediaUploader
                  label="Upload Video"
                  resourceType="video"
                  onUploaded={(asset) => updateField("video", asset)}
                />
              </div>
              {form.video?.url ? (
                <video className="h-56 w-full rounded-[1.5rem] bg-slate-950 object-cover" src={form.video.url} controls />
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-8 text-sm text-slate-500">
                  Upload a video file to Cloudinary.
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">Thumbnail</span>
                <MediaUploader
                  label="Upload Thumbnail"
                  resourceType="image"
                  onUploaded={(asset) => updateField("thumbnail", asset)}
                />
              </div>
              {form.thumbnail?.url ? (
                <img src={form.thumbnail.url} alt="Video thumbnail" className="h-48 w-full rounded-[1.5rem] object-cover" />
              ) : null}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800">Photo</span>
              <MediaUploader
                label="Upload Photo"
                resourceType="image"
                onUploaded={(asset) => updateField("image", asset)}
              />
            </div>
            {form.image?.url ? (
              <img src={form.image.url} alt="Creative upload" className="h-56 w-full rounded-[1.5rem] object-cover" />
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-8 text-sm text-slate-500">
                Upload a photo to feature it in the creative gallery.
              </div>
            )}
          </div>
        )}

        {message ? <p className="text-sm text-slate-600">{message}</p> : null}

        <button type="submit" className="admin-button w-full justify-center" disabled={saving}>
          {saving ? <Save size={16} /> : <Upload size={16} />}
          {saving ? "Saving..." : editingId ? "Update Creative Item" : "Create Creative Item"}
        </button>
      </form>
    </div>
  );
}

export default AdminVideosPage;
