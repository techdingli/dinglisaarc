import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/motion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the Dingli AWP India team about equipment, parts, service or operator training. Toll-free support across India and SAARC.",
};

export default function ContactPage() {
  const whatsapp = site.phone.whatsapp.replace(/[^\d]/g, "");

  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Contact
          </p>
          <h1 className="text-5xl sm:text-6xl">Talk to Our Team</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Equipment enquiries, spare parts, service or training - we&apos;ll point you
            to the right person.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <div className="space-y-8">
              <ContactRow icon={Phone} label="Toll free">
                <a
                  href={`tel:${site.phone.tollFree}`}
                  className="font-display text-3xl transition-colors hover:text-brand"
                >
                  {site.phone.tollFree}
                </a>
              </ContactRow>

              <ContactRow icon={Phone} label="Sales">
                <a
                  href={`tel:${site.phone.sales}`}
                  className="text-lg font-semibold transition-colors hover:text-brand"
                >
                  {site.phone.sales}
                </a>
              </ContactRow>

              <ContactRow icon={MessageCircle} label="WhatsApp">
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-semibold transition-colors hover:text-brand"
                >
                  {site.phone.whatsapp}
                </a>
              </ContactRow>

              <ContactRow icon={Mail} label="Email">
                <a
                  href={`mailto:${site.email.sales}`}
                  className="block font-semibold transition-colors hover:text-brand"
                >
                  {site.email.sales}
                </a>
                <a
                  href={`mailto:${site.email.support}`}
                  className="block text-muted transition-colors hover:text-brand"
                >
                  {site.email.support} (service)
                </a>
              </ContactRow>

              <ContactRow icon={MapPin} label="Office">
                <p className="leading-relaxed">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.pin}
                </p>
              </ContactRow>

              <ContactRow icon={Clock} label="Hours">
                <p>{site.hours}</p>
                <p className="text-muted">24/7 emergency service hotline</p>
              </ContactRow>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-xl border border-line p-6 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)] sm:p-8">
              <h2 className="text-2xl">Send us a message</h2>
              <p className="mb-6 mt-1 text-sm text-muted">
                Fields marked with <span className="text-brand">*</span> are required.
              </p>
              <EnquiryForm kind="contact" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-tint">
        <Icon className="size-5 text-brand" />
      </span>
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}
