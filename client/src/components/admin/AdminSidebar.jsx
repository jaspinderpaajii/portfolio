import { LayoutDashboard, LogOut, MonitorPlay, Settings2, SquarePen, Video, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchSection } from "../../api/adminApi.js";
import { adminSidebarLinks } from "../../data/adminSections.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const iconMap = {
  Dashboard: LayoutDashboard,
  Homepage: SquarePen,
  About: SquarePen,
  Skills: SquarePen,
  Contact: SquarePen,
  "Site Settings": Settings2,
  Projects: MonitorPlay,
  Creative: Video
};

function SidebarLink({ item, onClick }) {
  const Icon = iconMap[item.label] || SquarePen;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
          isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  );
}

function AdminSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const [adminBrand, setAdminBrand] = useState("Aryan Control");

  useEffect(() => {
    fetchSection("settings")
      .then((section) => {
        setAdminBrand(section?.data?.adminBrand || "Aryan Control");
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[290px] flex-col border-r border-slate-200 bg-white p-5 transition md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Admin</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{adminBrand}</h2>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 md:hidden"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-8 space-y-2">
          {adminSidebarLinks.map((item) => (
            <SidebarLink key={item.path} item={item} onClick={onClose} />
          ))}
        </div>

        <div className="mt-auto rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-900">{user?.name || "Admin"}</p>
          <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
          <button
            type="button"
            className="admin-button-muted mt-4 w-full justify-center"
            onClick={logout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
