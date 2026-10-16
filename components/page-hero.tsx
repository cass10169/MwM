export function PageHero({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  align?: "left" | "center";
}) {
  return (
    <section className={`page-hero ${align === "center" ? "page-hero-centered" : ""}`}>
      <div className="container-wide">
        <p className="eyebrow ink">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </section>
  );
}
