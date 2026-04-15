function SectionIntro({ eyebrow, title, body, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-4 font-display text-4xl leading-none text-white md:text-6xl">{title}</h2>
      {body ? <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">{body}</p> : null}
    </div>
  );
}

export default SectionIntro;
