import { LoaderCircle, Upload } from "lucide-react";
import { useState } from "react";
import { uploadAsset } from "../../api/adminApi.js";

function acceptForResourceType(resourceType) {
  if (resourceType === "video") {
    return "video/*";
  }

  if (resourceType === "raw") {
    return ".pdf,.doc,.docx";
  }

  return "image/*";
}

function MediaUploader({ resourceType = "image", label, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const asset = await uploadAsset(file, resourceType);
      onUploaded(asset);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400">
        {uploading ? <LoaderCircle size={16} className="animate-spin" /> : <Upload size={16} />}
        {uploading ? "Uploading..." : label}
        <input type="file" className="hidden" accept={acceptForResourceType(resourceType)} onChange={handleChange} />
      </label>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export default MediaUploader;
