import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { fetchSiteSnapshot } from "../../api/publicApi.js";

const links = [
  { label: "Projects", path: "/projects" },
  { label: "Creative", path: "/creative" },
  { label: "Contact", path: "/contact" }
];

function NavItems({ onClick }) {
  return links.map((link) => (
    <NavLink
      key={link.path}
      to={link.path}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-medium transition ${
          isActive
            ? "border border-white/10 bg-white/[0.1] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
            : "text-white/58 hover:bg-white/[0.055] hover:text-white"
        }`
      }
    >
      {link.label}
    </NavLink>
  ));
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [siteName, setSiteName] = useState("Aryan");

  useEffect(() => {
    fetchSiteSnapshot()
      .then((snapshot) => {
        setSiteName(snapshot?.sections?.settings?.data?.siteName || "Aryan");
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#07090d]/70 backdrop-blur-2xl">
      <div className="shell flex items-center justify-between py-4">
        <Link to="/" className="group inline-flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] font-display text-xl transition group-hover:border-[rgba(var(--accent-rgb),0.5)]">
            {siteName.slice(0, 1)}
          </span>
          <span className="font-display text-3xl tracking-tight">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:flex">
          <NavItems />
          <Link to="/contact" className="public-button py-2.5">
            Start a conversation
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="shell pb-5 md:hidden">
          <div className="glass-panel section-frame space-y-4 p-5">
            <div className="flex flex-col gap-3">
              <NavItems onClick={() => setOpen(false)} />
            </div>
            <Link to="/contact" className="public-button w-full justify-center" onClick={() => setOpen(false)}>
              Start a conversation
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
