import type { Metadata } from "next";
import { CalendarClock, FileCheck2, Headset, ShieldCheck } from "lucide-react";
import { WarrantyForm } from "@/components/warranty-form";
import { Reveal } from "@/components/motion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Warranty Registration",
  description:
    "Register your Dingli machine for warranty within 30 days of delivery to activate cover and get an assigned service centre.",
};

const steps = [
  {
    icon: FileCheck2,
    title: "Submit the details",
    blurb: "Model, serial number and delivery date, plus where the machine is deployed.",
  },
  {
    icon: CalendarClock,
    title: "Within 30 days",
    blurb: "Registration must be filed within 30 days of delivery to activate cover.",
  },
  {
    icon: ShieldCheck,
    title: "Confirmation in 24 hours",
    blurb: "You receive a warranty ID and your assigned service centre.",
  },
  {
    icon: Headset,
    title: "Service on call",
    blurb: "Priority response from the nearest factory-trained engineer.",
  },
];

export default function WarrantyPage() {
  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Warranty
          </p>
          <h1 className="text-5xl sm:text-6xl">Warranty Registration</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Register your machine to activate warranty cover and get matched to your
            nearest service centre.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, blurb }, i) => (
            <Reveal
              key={title}
              delay={i * 0.06}
              className="rounded-xl border border-line p-6"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-lg bg-brand-tint">
                <Icon className="size-5 text-brand" />
              </div>
              <h2 className="text-xl">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{blurb}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl rounded-xl border border-line p-6 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)] sm:p-9">
            <h2 className="text-3xl">Register your machine</h2>
            <p className="mb-8 mt-2 text-sm text-muted">
              Have your invoice and machine serial number to hand. Questions? Call{" "}
              <a href={`tel:${site.phone.tollFree}`} className="font-semibold text-brand">
                {site.phone.tollFree}
              </a>
              .
            </p>
            <WarrantyForm />
          </div>
        </div>
      </section>
    </>
  );
}
