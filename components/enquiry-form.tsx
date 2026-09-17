"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { enquirySchema, INTEREST_OPTIONS, type EnquiryInput } from "@/lib/leads";
import { Field, FormStatus, Honeypot, inputClass } from "@/components/form-fields";

type State = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({
  kind = "contact",
  showInterest = true,
  submitLabel = "Send Enquiry",
  defaultMessage = "",
}: {
  kind?: "contact" | "quote" | "callback";
  showInterest?: boolean;
  submitLabel?: string;
  defaultMessage?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const [reference, setReference] = useState<string>();
  const [serverError, setServerError] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      kind,
      name: "",
      phone: "",
      email: "",
      company: "",
      interest: "",
      message: defaultMessage,
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setState("submitting");
    setServerError(undefined);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      setReference(data.reference);
      setState("success");
      reset({ ...values, name: "", phone: "", email: "", company: "", message: "" });
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setState("error");
    }
  });

  if (state === "success") {
    return (
      <div className="space-y-4">
        <FormStatus state="success" reference={reference} />
        <button
          type="button"
          onClick={() => setState("idle")}
          className="text-sm font-semibold text-brand hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-4">
      <Honeypot register={register("website")} />
      <input type="hidden" {...register("kind")} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name?.message}>
          <input
            {...register("name")}
            className={inputClass(errors.name?.message)}
            placeholder="Your name"
            autoComplete="name"
          />
        </Field>

        <Field label="Phone" required error={errors.phone?.message}>
          <input
            {...register("phone")}
            className={inputClass(errors.phone?.message)}
            placeholder="+91 98765 43210"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            className={inputClass(errors.email?.message)}
            placeholder="you@company.com"
            inputMode="email"
            autoComplete="email"
          />
        </Field>

        <Field label="Company" error={errors.company?.message}>
          <input
            {...register("company")}
            className={inputClass(errors.company?.message)}
            placeholder="Company name"
            autoComplete="organization"
          />
        </Field>
      </div>

      {showInterest && (
        <Field label="What are you interested in?" error={errors.interest?.message}>
          <select {...register("interest")} className={inputClass(errors.interest?.message)}>
            <option value="">Select an option</option>
            {INTEREST_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Message" required error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={4}
          className={`${inputClass(errors.message?.message)} resize-y`}
          placeholder="Tell us about your site, required working height, and timeline."
        />
      </Field>

      <FormStatus state={state} error={serverError} />

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send className="size-4" /> {submitLabel}
          </>
        )}
      </button>
    </form>
  );
}
