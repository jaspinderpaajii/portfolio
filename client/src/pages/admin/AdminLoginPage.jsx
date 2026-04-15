import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/admin/dashboard", { replace: true });
    } catch (loginError) {
      setError(
        loginError.response?.data?.message ||
          "Cannot reach the backend. Make sure the server is running and the MongoDB connection is valid."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white">
          <ShieldCheck size={22} />
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500">Private Admin</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Sign in to the dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Manage homepage content, projects, videos, contact links, and site settings from one place.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Email</span>
            <input
              className="admin-input"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Password</span>
            <input
              className="admin-input"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button type="submit" className="admin-button w-full justify-center py-3" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
