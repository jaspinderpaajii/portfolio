import { ArrowUpRight, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchSiteSnapshot, submitContact } from "../../api/publicApi.js";
import SectionIntro from "../../components/public/SectionIntro.jsx";

function ContactPage() {
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, message: "", error: false });

  useEffect(() => {
    fetchSiteSnapshot().then((snapshot) => {
      setContact(snapshot?.sections?.contact?.data);
      const accent = snapshot?.sections?.settings?.data?.accent;
      if (accent) {
        document.documentElement.style.setProperty("--accent", accent);
      }
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ loading: true, message: "", error: false });

    try {
      await submitContact(form);
      setStatus({ loading: false, message: "Message sent. I’ll get back to you soon.", error: false });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        loading: false,
        message: error.response?.data?.message || "Something went wrong while sending your message.",
        error: true
      });
    }
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="shell pt-16 md:pt-24">
      <SectionIntro eyebrow="Contact" title={contact?.title || "Let’s talk."} body={contact?.message} />
      <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="glass-panel p-6 md:p-8">
          <p className="eyebrow">Direct</p>
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/35">Email</p>
              <p className="mt-2 text-lg text-white">{contact?.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/35">Phone</p>
              <p className="mt-2 text-lg text-white">{contact?.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/35">Location</p>
              <p className="mt-2 text-lg text-white">{contact?.location}</p>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {(contact?.socials || []).map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/65 transition hover:border-white/20 hover:text-white"
              >
                {item.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </div>

        <form className="glass-panel space-y-5 p-6 md:p-8" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm text-white/65">Name</span>
              <input
                className="input-base"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-white/65">Email</span>
              <input
                className="input-base"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </label>
          </div>
          <label className="block space-y-2">
            <span className="text-sm text-white/65">Subject</span>
            <input className="input-base" value={form.subject} onChange={(event) => updateField("subject", event.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-white/65">Message</span>
            <textarea
              className="input-base min-h-[180px] resize-y"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              required
            />
          </label>
          {status.message ? (
            <p className={`text-sm ${status.error ? "text-rose-300" : "text-emerald-300"}`}>{status.message}</p>
          ) : null}
          <button type="submit" className="public-button" disabled={status.loading}>
            <Send size={16} />
            {status.loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactPage;
