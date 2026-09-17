import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20, "Enter a valid phone number")
  .regex(/^[+()\d\s-]+$/, "Enter a valid phone number");

/** Contact / quote / callback enquiries. */
export const enquirySchema = z.object({
  kind: z.enum(["contact", "quote", "callback"]),
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone,
  email: z.string().trim().email("Enter a valid email").max(120).or(z.literal("")),
  company: z.string().trim().max(120).optional(),
  interest: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5, "Tell us what you need").max(2000),
  /**
   * Honeypot. Deliberately unconstrained so a filled value passes validation
   * and is caught by the bot check in the route, which fakes a success
   * response rather than revealing that the field is a trap.
   */
  website: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/** Warranty registration - must be filed within 30 days of delivery. */
export const warrantySchema = z.object({
  kind: z.literal("warranty"),
  model: z.string().trim().min(2, "Enter the model or SKU").max(80),
  serial: z.string().trim().min(2, "Enter the serial number").max(80),
  deliveryDate: z.string().trim().min(1, "Select the delivery date"),
  invoiceNumber: z.string().trim().max(80).optional(),
  ownerName: z.string().trim().min(2, "Enter the owner name").max(100),
  company: z.string().trim().min(2, "Enter the company name").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email").max(120),
  city: z.string().trim().min(2, "Enter the deployment city").max(80),
  state: z.string().trim().min(2, "Enter the state").max(80),
  siteName: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(2000).optional(),
  /** Honeypot - see the note on enquirySchema. */
  website: z.string().optional(),
});

export type WarrantyInput = z.infer<typeof warrantySchema>;

export const leadSchema = z.discriminatedUnion("kind", [
  enquirySchema.extend({ kind: z.literal("contact") }),
  enquirySchema.extend({ kind: z.literal("quote") }),
  enquirySchema.extend({ kind: z.literal("callback") }),
  warrantySchema,
]);

export type LeadInput = z.infer<typeof leadSchema>;

export const INTEREST_OPTIONS = [
  "Boom Lifts",
  "Scissor Lifts",
  "Vertical Lifts",
  "Spider Lifts",
  "AC+ All-Electric Range",
  "Parts & Service",
  "Operator Training",
  "Other",
] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other",
] as const;
