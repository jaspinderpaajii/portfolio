import { Mail, MonitorPlay, NotebookPen, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboard } from "../../api/adminApi.js";

const metricConfig = [
  { key: "sections", label: "Content Sections", icon: NotebookPen },
  { key: "projects", label: "Projects", icon: MonitorPlay },
  { key: "videos", label: "Creative Items", icon: Video },
  { key: "messages", label: "Messages", icon: Mail }
];

function AdminDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard().then(setData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Overview</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Everything editable, all in one place.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Use the sidebar to manage each section of the public portfolio and keep the content flowing without touching code.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/projects" className="admin-button-muted">
            Manage Projects
          </Link>
          <Link to="/admin/videos" className="admin-button">
            Manage Videos
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metricConfig.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.key} className="admin-card">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-6 text-4xl font-semibold text-slate-900">{data?.metrics?.[metric.key] ?? "--"}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr,1.2fr]">
        <div className="admin-card">
          <p className="text-sm font-medium text-slate-900">Publishing Snapshot</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Published Projects</span>
              <span className="text-lg font-semibold text-slate-900">{data?.metrics?.publishedProjects ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-600">Published Videos</span>
              <span className="text-lg font-semibold text-slate-900">{data?.metrics?.publishedVideos ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-900">Recent Messages</p>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Latest five</span>
          </div>
          <div className="mt-5 space-y-3">
            {data?.recentMessages?.length ? (
              data.recentMessages.map((message) => (
                <div key={message._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900">{message.name}</p>
                    <p className="text-xs text-slate-500">{new Date(message.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{message.email}</p>
                  {message.subject ? <p className="mt-3 text-sm font-medium text-slate-800">{message.subject}</p> : null}
                  <p className="mt-2 text-sm leading-6 text-slate-600">{message.message}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                No messages yet. Contact form submissions will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
