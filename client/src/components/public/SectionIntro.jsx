function SectionIntro({ eyebrow, title, body, align = "left" }) {
  return (
    <div className={`section-intro-build ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <span className="build-arm-target build-arm-target-left" aria-hidden="true" />
      <span className="section-intro-handoff" aria-hidden="true">
        <i />
        <b />
        <b />
      </span>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className={`section-title-plate ${align === "center" ? "section-title-plate-center" : ""}`} aria-hidden="true">
        <span />
        <span />
        <i />
      </div>
      <h2 className="mt-5 font-display text-4xl leading-[0.94] text-white md:text-6xl">{title}</h2>
      {body ? <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 md:text-lg">{body}</p> : null}
    </div>
  );
}

export default SectionIntro;
