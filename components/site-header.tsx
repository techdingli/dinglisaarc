"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? "shadow-[0_1px_16px_rgba(0,0,0,0.08)]" : "border-b border-line"
      }`}
    >
      {/* Utility strip */}
      <div className="hidden bg-ink text-white lg:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <p className="text-white/70">{site.tagline}</p>
          <div className="flex items-center gap-5">
            <a href={`tel:${site.phone.tollFree}`} className="hover:text-brand-light">
              Toll free {site.phone.tollFree}
            </a>
            <a href={`mailto:${site.email.sales}`} className="hover:text-brand-light">
              {site.email.sales}
            </a>
          </div>
        </div>
      </div>

      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label={`${site.name} home`}>
          <Image
            src="/logo.svg"
            alt={site.name}
            width={277}
            height={100}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-semibold transition-colors hover:text-brand ${
                  active ? "text-brand" : "text-ink-soft"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${site.phone.sales}`}
            className="hidden items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-brand md:flex"
          >
            <Phone className="size-4" />
            {site.phone.sales}
          </a>
          <Link
            href="/contact"
            className="hidden rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:block"
          >
            Request a Quote
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-md border border-line xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-50 overflow-y-auto border-t border-line bg-white xl:hidden">
          <nav className="container-x flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line py-4 text-base font-semibold text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/warranty"
              className="border-b border-line py-4 text-base font-semibold text-ink"
            >
              Warranty Registration
            </Link>
            <div className="flex flex-col gap-3 py-6">
              <a
                href={`tel:${site.phone.tollFree}`}
                className="rounded-md border border-line px-5 py-3 text-center text-sm font-semibold"
              >
                Call {site.phone.tollFree}
              </a>
              <Link
                href="/contact"
                className="rounded-md bg-brand px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Request a Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
