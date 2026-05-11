import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSiteSnapshot } from "../../api/publicApi.js";

function Footer() {
  const [footerText, setFooterText] = useState("Crafted for premium storytelling and editable through the private CMS.");
  const year = new Date().getFullYear();

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
    <footer className="public-footer relative z-10">
      <div className="shell py-8">
        <div className="footer-build-module">
          <div className="footer-build-rail" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="footer-build-copy">
            <span>Build complete</span>
            <p>{footerText}</p>
            <small>© {year} Aryan Verma</small>
          </div>
          <nav className="footer-build-nav" aria-label="Footer">
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/creative">Creative</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
