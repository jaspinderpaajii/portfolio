import { ArrowUpRight, Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchSiteSnapshot, submitContact } from "../../api/publicApi.js";
import MotionReveal from "../../components/public/MotionReveal.jsx";
import SectionIntro from "../../components/public/SectionIntro.jsx";
import { applyAccentTheme } from "../../theme.js";

function ContactPage() {
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, message: "", error: false });

  useEffect(() => {
    fetchSiteSnapshot().then((snapshot) => {
      setContact(snapshot?.sections?.contact?.data);
      applyAccentTheme(snapshot?.sections?.settings?.data?.accent);
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

  const socialLinks = contact?.socials || [];
  const directLinks = useMemo(
    () => [
      { label: "Email", value: contact?.email, icon: Mail },
      { label: "Phone", value: contact?.phone, icon: Phone },
      { label: "Location", value: contact?.location, icon: MapPin }
    ].filter((item) => item.value),
    [contact]
  );

  return (
    <section className="shell pt-12 md:pt-16">
      <MotionReveal className="glass-panel section-frame surface-line relative overflow-hidden px-6 py-8 md:px-10 md:py-12 lg:px-12" origin="scale">
        <div className="hero-glow animate-drift absolute left-[-4rem] top-10 h-44 w-44 rounded-full opacity-65" />
        <div
          className="absolute right-[-3rem] top-16 h-60 w-60 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle at center, rgba(122, 188, 255, 0.32), transparent 72%)" }}
        />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.08fr,0.92fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/65">
              <Sparkles size={14} className="text-[var(--accent)]" />
              Contact scene
            </div>
            <SectionIntro
              eyebrow="Contact"
              title={contact?.title || "Let's talk."}
              body={
                contact?.message ||
                "If you'd like to collaborate, talk through an idea, or reach out about an opportunity, this is where the conversation starts."
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Response</p>
              <p className="mt-5 font-display text-3xl text-white">Direct</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Channel</p>
              <p className="mt-5 font-display text-3xl text-white">{socialLinks.length.toString().padStart(2, "0")}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Purpose</p>
              <p className="mt-5 font-display text-3xl text-white">Build</p>
            </div>
          </div>
        </div>
      </MotionReveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="space-y-6">
          <MotionReveal className="glass-panel section-frame p-6 md:p-8" delay={110}>
            <p className="eyebrow">Direct Contact</p>
            <div className="mt-6 grid gap-4">
              {directLinks.length ? (
                directLinks.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <MotionReveal key={item.label} delay={index * 70} distance={20} origin="left">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/78">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">{item.label}</p>
                            <p className="mt-2 text-sm leading-6 text-white/72">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    </MotionReveal>
                  );
                })
              ) : (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/60">
                  Add direct contact details from the CMS and they'll appear here automatically.
                </div>
              )}
            </div>
          </MotionReveal>

          <MotionReveal className="glass-panel section-frame p-6 md:p-8" delay={150}>
            <p className="eyebrow">Social Presence</p>
            <div className="mt-6 grid gap-3">
              {socialLinks.length ? (
                socialLinks.map((item, index) => (
                  <MotionReveal key={item.label} delay={index * 70} distance={20} origin="right">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/68 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/35">{item.label}</p>
                          <p className="mt-2 text-sm text-white/72">Open profile</p>
                        </div>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] transition group-hover:border-white/20">
                        <ArrowUpRight size={16} />
                      </div>
                    </a>
                  </MotionReveal>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/60">
                  Add social links in the CMS to make this section feel more connected.
                </div>
              )}
            </div>
          </MotionReveal>

          <MotionReveal className="glass-panel section-frame p-6 md:p-8" delay={190}>
            <p className="eyebrow">What This Is For</p>
            <p className="mt-5 text-sm leading-8 text-white/64">
              Whether it's a project, internship, freelance opportunity, collaboration, or simply a good conversation around building better digital work, this page is meant to make that first step feel easy.
            </p>
          </MotionReveal>
        </div>

        <MotionReveal
          as="form"
          className="glass-panel section-frame surface-line space-y-5 p-6 md:p-8 lg:p-10"
          onSubmit={handleSubmit}
          origin="scale"
          delay={160}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Send a Message</p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                A simple direct form for when you already know you want to reach out.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/55">
              Message form
            </div>
          </div>

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
              className="input-base min-h-[220px] resize-y"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              required
            />
          </label>

          {status.message ? (
            <p className={`text-sm ${status.error ? "text-rose-300" : "text-emerald-300"}`}>{status.message}</p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-md text-xs uppercase tracking-[0.18em] text-white/35">
              Thoughtful messages, collaboration ideas, and opportunities are always welcome.
            </p>
            <button type="submit" className="public-button" disabled={status.loading}>
              <Send size={16} />
              {status.loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

export default ContactPage;
