import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion";
import { formatDate, posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, events and insights on aerial work platforms from Dingli AWP India - expos, product updates and practical guidance for working at height.",
};

export default function BlogPage() {
  const [lead, ...rest] = posts;

  return (
    <>
      <section className="border-b border-line bg-band py-14">
        <div className="container-x">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">Blog</p>
          <h1 className="text-5xl sm:text-6xl">
            News &amp; <span className="text-brand">Events</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Expos, product news and practical guidance on working at height from the
            Dingli AWP India team.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          {lead && (
            <Link
              href={`/blog/${lead.slug}`}
              className="group grid overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)] lg:grid-cols-2"
            >
              <div className="relative aspect-[4/3] bg-band">
                <Image
                  src={lead.cover}
                  alt={lead.coverAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                  {lead.tag} &middot; {formatDate(lead.date)}
                </p>
                <h2 className="mt-3 text-4xl transition-colors group-hover:text-brand sm:text-5xl">
                  {lead.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted">{lead.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-brand">
                  Read the article <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <StaggerItem key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)]"
                  >
                    <div className="relative aspect-[4/3] bg-band">
                      <Image
                        src={post.cover}
                        alt={post.coverAlt}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                        {post.tag} &middot; {formatDate(post.date)}
                      </p>
                      <h3 className="mt-2 text-2xl group-hover:text-brand">{post.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </>
  );
}
