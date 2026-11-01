import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, Factory, Globe2, Lightbulb } from "lucide-react";
import { CountUp, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { team } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dingli AWP India supplies, commissions and services aerial work platforms from Dingli, one of the world's largest manufacturers, across India and SAARC.",
};

const stats = [
  { value: 300, suffix: "+", label: "Global Patents" },
  { value: 80, suffix: "+", label: "Countries Served" },
  { value: 250, suffix: "+", label: "Model Variants" },
  { value: 2005, suffix: "", label: "Founded" },
];

const pillars = [
  {
    icon: Factory,
    title: "Manufacturing scale",
    blurb:
      "Production across multiple factories, with dedicated R&D centres developing the boom, scissor and vertical mast platforms.",
  },
  {
    icon: Lightbulb,
    title: "Engineering depth",
    blurb:
      "More than 300 global patents covering drive systems, chassis design, safety interlocks and all-electric powertrains.",
  },
  {
    icon: Globe2,
    title: "Global footprint",
    blurb:
      "Machines working in over 80 countries, with the MEC and TEUPEN acquisitions widening the range into spider lifts.",
  },
  {
    icon: Award,
    title: "Certified to standard",
    blurb:
      "Products built to CE, ANSI, AS/NZ and JIS requirements, with ISO 9001 and ISO 14001 certified processes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            About Us
          </p>
          <h1 className="text-5xl sm:text-6xl">
            Dingli for <span className="text-brand">India &amp; SAARC</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            We supply, commission and service the full Dingli aerial work platform
            range - backed by genuine parts and factory-trained engineers.
          </p>
        </div>
      </section>

      <section className="border-b border-line py-14">
        <div className="container-x">
          <Stagger className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <p className="font-display text-5xl text-ink">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm uppercase tracking-wide text-muted">
                  {s.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why Dingli"
            title="Built by One of the World&apos;s"
            accent="Largest MEWP Makers"
            align="left"
          />

          <Stagger className="grid gap-6 sm:grid-cols-2">
            {pillars.map(({ icon: Icon, title, blurb }) => (
              <StaggerItem
                key={title}
                className="rounded-xl border border-line p-7"
              >
                <div className="mb-4 grid size-11 place-items-center rounded-lg bg-brand-tint">
                  <Icon className="size-5 text-brand" />
                </div>
                <h3 className="text-2xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{blurb}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-t border-line bg-band py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Team"
            title="The People Behind"
            accent="Dingli India"
            align="left"
          />

          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => {
              const initials = m.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2);
              return (
                <StaggerItem
                  key={m.name}
                  className="flex flex-col rounded-xl border border-line bg-white p-7"
                >
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={m.name}
                      width={80}
                      height={80}
                      className="size-20 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="grid size-20 place-items-center rounded-full bg-brand-tint font-display text-3xl text-brand"
                      aria-hidden
                    >
                      {initials}
                    </div>
                  )}
                  <h3 className="mt-5 text-2xl">{m.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                    {m.role}
                  </p>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{m.focus}</p>
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand"
                    >
                      LinkedIn <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="bg-ink py-20">
        <div className="container-x text-center">
          <Reveal>
            <h2 className="text-4xl text-white sm:text-5xl">
              Let&apos;s find the right machine
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Tell us the working height and site conditions - we&apos;ll take it from
              there.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block rounded-md bg-brand px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Contact the team
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
