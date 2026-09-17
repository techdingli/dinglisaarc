"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { INDIAN_STATES, warrantySchema, type WarrantyInput } from "@/lib/leads";
import { Field, FormStatus, Honeypot, inputClass } from "@/components/form-fields";

type State = "idle" | "submitting" | "success" | "error";

export function WarrantyForm() {
  const [state, setState] = useState<State>("idle");
  const [reference, setReference] = useState<string>();
  const [serverError, setServerError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WarrantyInput>({
    resolver: zodResolver(warrantySchema),
    defaultValues: {
      kind: "warranty",
      model: "",
      serial: "",
      deliveryDate: "",
      invoiceNumber: "",
      ownerName: "",
      company: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      siteName: "",
      notes: "",
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
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setState("error");
    }
  });

  if (state === "success") {
    return (
      <div className="space-y-4">
        <FormStatus state="success" reference={reference} />
        <p className="text-sm text-muted">
          Keep this reference for your records. You&apos;ll receive confirmation with your
          warranty ID and assigned service centre within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-4">
      <Honeypot register={register("website")} />
      <input type="hidden" {...register("kind")} />

      <fieldset className="space-y-4">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">
          Machine details
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Model / SKU" required error={errors.model?.message}>
            <input
              {...register("model")}
              className={inputClass(errors.model?.message)}
              placeholder="e.g. BT44RT"
            />
          </Field>
          <Field label="Serial number" required error={errors.serial?.message}>
            <input
              {...register("serial")}
              className={inputClass(errors.serial?.message)}
              placeholder="Machine serial number"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Delivery date"
            required
            error={errors.deliveryDate?.message}
            hint="Register within 30 days of delivery."
          >
            <input
              type="date"
              {...register("deliveryDate")}
              className={inputClass(errors.deliveryDate?.message)}
            />
          </Field>
          <Field label="Invoice number" error={errors.invoiceNumber?.message}>
            <input
              {...register("invoiceNumber")}
              className={inputClass(errors.invoiceNumber?.message)}
              placeholder="Optional"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-t border-line pt-6">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">
          Owner details
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Owner name" required error={errors.ownerName?.message}>
            <input
              {...register("ownerName")}
              className={inputClass(errors.ownerName?.message)}
              autoComplete="name"
            />
          </Field>
          <Field label="Company" required error={errors.company?.message}>
            <input
              {...register("company")}
              className={inputClass(errors.company?.message)}
              autoComplete="organization"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" required error={errors.phone?.message}>
            <input
              {...register("phone")}
              className={inputClass(errors.phone?.message)}
              inputMode="tel"
              autoComplete="tel"
            />
          </Field>
          <Field label="Email" required error={errors.email?.message}>
            <input
              {...register("email")}
              className={inputClass(errors.email?.message)}
              inputMode="email"
              autoComplete="email"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-t border-line pt-6">
        <legend className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">
          Deployment
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" required error={errors.city?.message}>
            <input
              {...register("city")}
              className={inputClass(errors.city?.message)}
              autoComplete="address-level2"
            />
          </Field>
          <Field label="State" required error={errors.state?.message}>
            <select {...register("state")} className={inputClass(errors.state?.message)}>
              <option value="">Select a state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Site / project name" error={errors.siteName?.message}>
          <input {...register("siteName")} className={inputClass(errors.siteName?.message)} />
        </Field>

        <Field label="Notes" error={errors.notes?.message}>
          <textarea
            {...register("notes")}
            rows={3}
            className={`${inputClass(errors.notes?.message)} resize-y`}
            placeholder="Anything our service team should know."
          />
        </Field>
      </fieldset>

      <FormStatus state={state} error={serverError} />

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <ShieldCheck className="size-4" /> Register Warranty
          </>
        )}
      </button>
    </form>
  );
}
