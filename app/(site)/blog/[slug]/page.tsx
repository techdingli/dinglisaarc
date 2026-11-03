import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { RichText } from "@/components/rich-text";
import { formatDate } from "@/lib/blog";
import { getPost, getPosts } from "@/lib/cms";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: post.cover, alt: post.coverAlt }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <section className="border-b border-line bg-band">
        <div className="container-x py-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" /> All articles
          </Link>
        </div>
      </section>

      <header className="container-x max-w-4xl pt-12 lg:pt-16">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
          {post.tag} &middot; {formatDate(post.date)}
          {post.updated && <> &middot; Updated {formatDate(post.updated)}</>}
        </p>
        <h1 className="mt-4 text-5xl leading-[0.95] sm:text-6xl">{post.title}</h1>
        <p className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p>
      </header>

      <div className="container-x mt-10 max-w-4xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-band">
          <Image
            src={post.cover}
            alt={post.coverAlt}
            fill
            priority
            sizes="(min-width: 1024px) 896px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="container-x max-w-3xl pb-16 lg:pb-20">
        <RichText data={post.body} />

        <aside className="mt-14 rounded-2xl bg-ink p-8 text-white sm:p-10">
          <h2 className="text-3xl sm:text-4xl">Talk to our team</h2>
          <p className="mt-3 max-w-xl text-white/70">
            Questions about the show, a machine or a project? We respond within one
            working day.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Contact us
            </Link>
            <a
              href={`tel:${site.phone.tollFree}`}
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
            >
              <Phone className="size-4" /> {site.phone.tollFree}
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
