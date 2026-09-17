import { Reveal } from "@/components/motion";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  blurb,
  align = "center",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  blurb?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  const centered = align === "center";

  return (
    <Reveal
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} mb-12`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-4xl sm:text-5xl ${tone === "dark" ? "text-white" : "text-ink"}`}
      >
        {title} {accent && <span className="text-brand">{accent}</span>}
      </h2>
      {blurb && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            tone === "dark" ? "text-white/70" : "text-muted"
          }`}
        >
          {blurb}
        </p>
      )}
    </Reveal>
  );
}
