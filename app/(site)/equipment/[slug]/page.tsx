import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/motion";
import { getProduct, products, productsInCategory } from "@/lib/catalog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Model not found" };

  const height = product.specs["Working Height"];
  return {
    title: `${product.name} - ${product.category}`,
    description: `${product.name} ${product.category.toLowerCase()}${
      height ? ` with ${height} working height` : ""
    }. Specifications, availability and pricing from Dingli AWP India.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = productsInCategory(product.categorySlug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const specEntries = Object.entries(product.specs);

  return (
    <>
      <section className="border-b border-line bg-band">
        <div className="container-x py-6">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" /> All equipment
          </Link>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-14 lg:grid-cols-2">
          {/* Imagery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-band">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-contain p-8"
                />
              ) : (
                <div className="grid h-full place-items-center text-muted">
                  No image available
                </div>
              )}
            </div>

            {product.gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.gallery.map((g) => (
                  <div
                    key={g}
                    className="relative aspect-square overflow-hidden rounded-lg border border-line bg-band"
                  >
                    <Image
                      src={g}
                      alt={`${product.name} detail`}
                      fill
                      sizes="20vw"
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              {product.category}
            </p>
            <h1 className="mt-2 text-5xl sm:text-6xl">{product.name}</h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-line px-3 py-1 text-sm font-medium">
                {product.power}
              </span>
              <span className="rounded-full border border-line px-3 py-1 text-sm font-medium">
                {product.family}
              </span>
            </div>

            {specEntries.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
                {specEntries.map(([k, v]) => (
                  <div key={k} className="bg-white p-5">
                    <dt className="text-xs uppercase tracking-wide text-muted">{k}</dt>
                    <dd className="mt-1 font-display text-3xl text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <ul className="mt-8 space-y-2.5">
              {[
                "Genuine Dingli parts held in Indian stock",
                "Nationwide service with factory-trained engineers",
                "Operator training and commissioning available",
                "Finance, AMC and buy-back options",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#enquire"
                className="rounded-md bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Request a Quote
              </Link>
              <a
                href={`tel:${site.phone.sales}`}
                className="inline-flex items-center gap-2 rounded-md border border-ink px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-white"
              >
                <Phone className="size-4" /> {site.phone.sales}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="bg-band py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-4xl">
              Enquire about the <span className="text-brand">{product.name}</span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Send us your site details and we&apos;ll confirm availability, lead time
              and pricing - usually within one working day.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
              <EnquiryForm
                kind="quote"
                showInterest={false}
                submitLabel="Send Enquiry"
                defaultMessage={`I'd like a quote for the ${product.name}.`}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20">
          <div className="container-x">
            <h2 className="mb-10 text-3xl">More {product.category}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
