import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Clock,
  Cpu,
  GraduationCap,
  Headset,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { CountUp, Parallax, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { EnquiryForm } from "@/components/enquiry-form";
import { ExpoFeature } from "@/components/expo-banner";
import { expo } from "@/lib/expo";
import { featuredProducts, familySummary, products } from "@/lib/catalog";
import { differentiators, faqs, heroStats, industries, site } from "@/lib/site";

const valuePillars = [
  {
    stat: "30-60%",
    title: "Lower total cost of ownership",
    blurb: "Electric drivetrains and longer service intervals cut running cost per hour.",
  },
  {
    stat: "Up to 30%",
    title: "Higher rental yield",
    blurb: "Higher uptime and faster turnaround keep machines on revenue-earning sites.",
  },
  {
    stat: "20-50%",
    title: "Longer asset life",
    blurb: "Anti-corrosion build and preventive servicing extend the working life.",
  },
];

const whyPoints = [
  { icon: BadgeCheck, title: "300+ Global Patents", blurb: "Engineering depth from a top-three global MEWP manufacturer." },
  { icon: Headset, title: "24/7 Service Network", blurb: "50+ factory-trained engineers across India and SAARC." },
  { icon: BatteryCharging, title: "AC+ All-Electric", blurb: "The widest oil-free, zero-emission range for indoor sites." },
  { icon: ShieldCheck, title: "Safety by Design", blurb: "Load sensing, tilt protection and secondary guarding as standard." },
  { icon: GraduationCap, title: "Operator Training", blurb: "IPAF and IOSH aligned certification for your crews." },
  { icon: Cpu, title: "Remote Diagnostics", blurb: "Telematics that flag faults before they stop the job." },
];

const statBand = [
  { value: 300, suffix: "+", label: "Global Patents" },
  { value: 600, suffix: "+", label: "Units Deployed in India" },
  { value: 50, suffix: "+", label: "Service Engineers" },
  { value: 80, suffix: "+", label: "Countries Served" },
];

export default function HomePage() {
  const featured = featuredProducts(6);
  const families = familySummary();
  const hero = featured[0];

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-line bg-white">
        <div
          className="pointer-events-none absolute -right-40 -top-40 size-[540px] rounded-full bg-brand/10 blur-3xl"
          aria-hidden
        />
        <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <h1 className="text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Elevate Every <span className="text-brand">Project</span> With
              World-Class Aerial Platforms
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Boom lifts, scissor lifts, vertical masts and spider lifts from 5 m to
              44 m - backed by nationwide service, genuine parts and 300+ global
              patents.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Explore Equipment <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-ink px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Request a Quote
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
              {heroStats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-4xl font-bold text-ink">
                      <CountUp value={s.value} suffix={s.suffix} />
                    </span>
                    <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-muted">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {hero?.image && (
            <Parallax speed={34} className="relative">
              <div className="relative mx-auto aspect-square w-full max-w-lg">
                <div className="absolute inset-0 rounded-[2rem] bg-band" />
                <div className="absolute right-6 top-6 z-10 rounded-lg bg-ink px-4 py-3 text-white shadow-lg">
                  <p className="font-display text-3xl leading-none">
                    {hero.specs["Working Height"] ?? "44.4 m"}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-white/60">
                    Working height
                  </p>
                </div>
                <Image
                  src={hero.image}
                  alt={hero.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-contain p-10"
                />
                <div className="absolute bottom-6 left-6 z-10 rounded-lg bg-brand px-4 py-2.5 text-white">
                  <p className="font-display text-xl leading-none">{hero.name}</p>
                  <p className="text-[11px] uppercase tracking-wider text-white/80">
                    {hero.category}
                  </p>
                </div>
              </div>
            </Parallax>
          )}
        </div>
      </section>

      {expo && <ExpoFeature expo={expo} />}

      {/* ------------------------------------------------------ Featured models */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Featured Models"
            title="Engineered for the"
            accent="Toughest Jobs"
            blurb={`A selection from ${products.length} models available across India and SAARC.`}
          />

          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12 text-center">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 rounded-md border border-ink px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-white"
            >
              View all {products.length} models <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- Complete range */}
      <section className="bg-band py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Equipment Range"
            title="The Complete Range of"
            accent="Aerial Work Platforms"
          />

          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {families.map((f) => (
              <StaggerItem key={f.family}>
                <Link
                  href={`/equipment?family=${encodeURIComponent(f.family)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.22)]"
                >
                  <div className="relative aspect-video overflow-hidden bg-white">
                    {f.image && (
                      <Image
                        src={f.image}
                        alt={f.family}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col border-t border-line p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-2xl">{f.family}</h3>
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-brand">
                        {f.count} models
                      </span>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {f.blurb}
                    </p>
                    {f.range && (
                      <p className="mt-4 border-t border-line pt-4 text-sm font-semibold text-ink">
                        Working height {f.range}
                      </p>
                    )}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------------------------------------------------------- Value pillars */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="The Value We Deliver"
            title="Lower Cost Per Hour,"
            accent="Higher Return"
          />

          <Stagger className="grid gap-8 md:grid-cols-3">
            {valuePillars.map((v) => (
              <StaggerItem key={v.title} className="border-t-2 border-brand pt-6">
                <p className="font-display text-5xl text-brand">{v.stat}</p>
                <h3 className="mt-3 text-xl">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.blurb}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* --------------------------------------------------------- Stats (dark) */}
      <section className="hatch relative overflow-hidden bg-ink py-20">
        <div className="container-x">
          <Stagger className="grid grid-cols-2 gap-10 lg:grid-cols-4">
            {statBand.map((s) => (
              <StaggerItem key={s.label} className="text-center">
                <p className="font-display text-5xl text-brand sm:text-6xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/60">
                  {s.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ------------------------------------------------------- Differentiators */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Built to Keep You Running"
            title="More Than a Machine -"
            accent="A Support System"
          />

          <Stagger className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((d) => (
              <StaggerItem key={d.title} className="bg-white p-6">
                <Wrench className="mb-4 size-6 text-brand" />
                <h3 className="text-lg">{d.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.blurb}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ------------------------------------------------------------- Why trust */}
      <section className="bg-band py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why India Trusts Us"
            title="Backed by Engineering,"
            accent="Proven on Site"
          />

          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyPoints.map(({ icon: Icon, title, blurb }) => (
              <StaggerItem key={title} className="rounded-xl border border-line bg-white p-6">
                <div className="mb-4 grid size-11 place-items-center rounded-lg bg-brand-tint">
                  <Icon className="size-5 text-brand" />
                </div>
                <h3 className="text-xl">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{blurb}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ------------------------------------------------------------ Industries */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Industries"
            title="Working at Height,"
            accent="Across Every Sector"
          />

          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((i) => (
              <StaggerItem
                key={i.name}
                className="group rounded-xl border border-line p-6 transition-colors hover:border-brand/40 hover:bg-brand-tint/40"
              >
                <h3 className="text-xl">{i.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{i.blurb}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ------------------------------------------------------------------ FAQ */}
      <section className="bg-band py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="FAQ" title="Questions," accent="Answered" />
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* -------------------------------------------------------- Quote + contact */}
      <section id="quote" className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Request a Quote
            </p>
            <h2 className="text-4xl sm:text-5xl">
              Ready to Elevate Your <span className="text-brand">Operations?</span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Tell us the working height, site conditions and timeline. Our team will
              recommend the right machine and send pricing.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                { icon: Clock, text: "Response within one working day" },
                { icon: Wrench, text: "Machine recommendation for your site" },
                { icon: ShieldCheck, text: "Finance, AMC and buy-back options explained" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-tint">
                    <Icon className="size-4 text-brand" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-xl border border-line bg-band p-6">
              <p className="text-sm text-muted">Prefer to talk?</p>
              <a
                href={`tel:${site.phone.tollFree}`}
                className="font-display text-3xl text-ink transition-colors hover:text-brand"
              >
                {site.phone.tollFree}
              </a>
              <p className="mt-1 text-sm text-muted">
                {site.hours} &middot; 24/7 emergency hotline
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-xl border border-line p-6 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)] sm:p-8">
              <EnquiryForm kind="quote" submitLabel="Request a Quote" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
