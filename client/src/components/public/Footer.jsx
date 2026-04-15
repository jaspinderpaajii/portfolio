import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSiteSnapshot } from "../../api/publicApi.js";

function Footer() {
  const [footerText, setFooterText] = useState("Crafted for premium storytelling and editable through the private CMS.");

  useEffect(() => {
    fetchSiteSnapshot()
      .then((snapshot) => {
        setFooterText(
          snapshot?.sections?.settings?.data?.footerText ||
            "Crafted for premium storytelling and editable through the private CMS."
        );
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative z-10 border-t border-white/5">
      <div className="shell flex flex-col gap-4 py-8 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
        <p>{footerText}</p>
        <div className="flex flex-wrap gap-5">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          <Link to="/projects" className="transition hover:text-white">
            Projects
          </Link>
          <Link to="/creative" className="transition hover:text-white">
            Creative
          </Link>
          <Link to="/contact" className="transition hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
