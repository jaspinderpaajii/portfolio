function SectionIntro({ eyebrow, title, body, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className={`mt-4 h-px w-24 bg-gradient-to-r from-[rgba(var(--accent-rgb),0.85)] to-transparent ${align === "center" ? "mx-auto" : ""}`} />
      <h2 className="mt-5 font-display text-4xl leading-[0.94] text-white md:text-6xl">{title}</h2>
      {body ? <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 md:text-lg">{body}</p> : null}
    </div>
  );
}

export default SectionIntro;
