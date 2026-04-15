import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";

function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <AdminSidebar open={open} onClose={() => setOpen(false)} />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-slate-100/90 px-5 py-4 backdrop-blur md:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Private CMS</p>
              <h1 className="mt-1 text-lg font-semibold text-slate-900">Portfolio Control Room</h1>
            </div>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={18} />
            </button>
          </header>
          <main className="p-5 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
