"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

const base =
  "w-full rounded-md border bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60";

export function Field({
  label,
  error,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && (
        <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="size-3.5" />
          {error}
        </span>
      )}
    </label>
  );
}

export function inputClass(error?: string) {
  return `${base} ${error ? "border-red-400" : "border-line"}`;
}

/** Off-screen honeypot. Bots fill it, humans never see it. */
export function Honeypot({ register }: { register: Record<string, unknown> }) {
  return (
    <div className="absolute left-[-9999px] top-0" aria-hidden="true">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...register} />
      </label>
    </div>
  );
}

export function FormStatus({
  state,
  reference,
  error,
}: {
  state: "idle" | "submitting" | "success" | "error";
  reference?: string;
  error?: string;
}) {
  if (state === "success") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <p className="font-semibold">Thank you - we&apos;ve received your details.</p>
        <p className="mt-1">
          Our team will be in touch shortly
          {reference ? (
            <>
              . Your reference is <strong>{reference}</strong>.
            </>
          ) : (
            "."
          )}
        </p>
      </div>
    );
  }

  if (state === "error" && error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return null;
}
