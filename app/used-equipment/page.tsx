import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, PackageSearch, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { site } from "@/lib/site";
import { usedMachines, type UsedMachine } from "@/lib/used-equipment";

export const metadata: Metadata = {
  title: "Used Equipment",
  description:
    "Pre-owned boom lifts and scissor lifts for sale. Tell us what you need and we'll match it from current stock.",
};

const statusLabel = { available: "Available", reserved: "Reserved", sold: "Sold" } as const;

function UsedCard({ m }: { m: UsedMachine }) {
  const status = m.status ?? "available";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white">
      <div className="relative aspect-4/3 bg-band">
        {m.image ? (
          <Image
            src={m.image}
            alt={`${m.brand ? `${m.brand} ` : ""}${m.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={m.images?.length ? "object-cover" : "object-contain p-5"}
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">Photo coming soon</div>
        )}
        <span
          className={`absolute left-3 top-3 rounded px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
            status === "available" ? "bg-brand text-white" : "bg-ink text-white"
          }`}
        >
          {statusLabel[status]}
        </span>
        {m.year && (
          <span className="absolute right-3 top-3 rounded bg-white/90 px-2 py-1 text-[11px] font-semibold text-ink-soft backdrop-blur">
            {m.year}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          {m.spec.category ?? "Pre-owned"}
          {m.brand && m.brand !== "Dingli" && <> &middot; {m.brand}</>}
        </p>
        <h3 className="mt-1 text-2xl text-ink">{m.model}</h3>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
          {[
            ["Working height", m.spec.workingHeight ?? "-"],
            ["Capacity", m.spec.capacity ?? "-"],
            // Shown only when the listing has them.
            ["Hours", m.hours != null ? m.hours.toLocaleString("en-IN") : null],
            ["Condition", m.condition ?? null],
          ]
            .filter(([, v]) => v !== null)
            .map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="font-semibold text-ink">{value}</dd>
              </div>
            ))}
        </dl>

        {m.notes && <p className="mt-3 text-sm leading-relaxed text-muted">{m.notes}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {m.location && (
              <p className="flex items-center gap-1 text-xs text-muted">
                <MapPin className="size-3.5" /> {m.location}
              </p>
            )}
            <p className="mt-0.5 font-display text-2xl text-ink">{m.price ?? "Price on request"}</p>
          </div>
          <Link
            href={`#enquire`}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-ink px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand"
          >
            Enquire <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function UsedEquipmentPage() {
  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Used Equipment
          </p>
          <h1 className="text-5xl sm:text-6xl">
            Pre-Owned <span className="text-brand">Aerial Platforms</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Boom lifts and scissor lifts available now. Stock moves quickly - if
            you don&apos;t see what you need, tell us and we&apos;ll match it.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          {usedMachines.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-muted">
                Showing <span className="font-semibold text-ink">{usedMachines.length}</span>{" "}
                machine{usedMachines.length === 1 ? "" : "s"} in stock
              </p>
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {usedMachines.map((m) => (
                  <StaggerItem key={m.id}>
                    <UsedCard m={m} />
                  </StaggerItem>
                ))}
              </Stagger>
            </>
          ) : (
            <Reveal className="mx-auto max-w-2xl rounded-2xl border border-dashed border-line bg-band px-8 py-14 text-center">
              <PackageSearch className="mx-auto size-10 text-brand" />
              <h2 className="mt-4 text-3xl">New stock is being listed</h2>
              <p className="mt-3 text-muted">
                Our current pre-owned machines will appear here shortly. Tell us the
                type and working height you&apos;re after and we&apos;ll send you what&apos;s
                available.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="#enquire"
                  className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  Register your interest
                </Link>
                <a
                  href={`tel:${site.phone.tollFree}`}
                  className="inline-flex items-center gap-2 rounded-md border border-ink px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  <Phone className="size-4" /> {site.phone.tollFree}
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section id="enquire" className="scroll-mt-28 border-t border-line bg-band py-16 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Looking for something specific?
            </p>
            <h2 className="text-4xl sm:text-5xl">Tell us what you need</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              Share the machine type, working height, budget and location. We&apos;ll
              come back with matching used stock, or a new or rental option if
              that suits the job better.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted">
              <Clock className="size-4 text-brand" /> Response within one working day
            </p>
          </Reveal>
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            <EnquiryForm
              kind="quote"
              submitLabel="Send Enquiry"
              defaultInterest="Used Equipment"
              defaultMessage="I'm looking for used equipment: "
            />
          </div>
        </div>
      </section>
    </>
  );
}
