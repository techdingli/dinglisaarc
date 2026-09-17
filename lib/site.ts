export const site = {
  name: "Dingli AWP India",
  legalName: "Dingli AWP India (SAARC)",
  tagline: "Authorised India & SAARC partner for Dingli aerial work platforms",
  url: "https://www.dinglisaarc.com",

  phone: {
    tollFree: "1800-572-5720",
    sales: "+91-98846-48464",
    whatsapp: "+91-88269-99522",
  },
  email: {
    sales: "info@dinglisaarc.com",
    support: "support@dinglisaarc.com",
  },
  address: {
    line1: "Sahney Towers, 81, First Floor",
    line2: "Poonamallee High Road, Nerkundram",
    city: "Chennai",
    state: "Tamil Nadu",
    pin: "600107",
  },
  hours: "Mon-Sat, 9:00-18:00 IST",

  /** External app already deployed on Vercel. */
  dealerConnectUrl: process.env.NEXT_PUBLIC_DEALER_CONNECT_URL ?? "#",
} as const;

export const heroStats = [
  { value: 300, suffix: "+", label: "Global Patents" },
  { value: 80, suffix: "+", label: "Countries Served" },
  { value: 250, suffix: "+", label: "Model Variants" },
  { value: 44, suffix: "m", label: "Max Working Height" },
] as const;

export const nav = [
  { label: "Equipment", href: "/equipment" },
  { label: "Categories", href: "/categories" },
  { label: "AC+ Series", href: "/ac-plus-series" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Dealers", href: "/dealers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const industries = [
  { name: "Construction", blurb: "High-rise, civil and infrastructure projects." },
  { name: "Maintenance", blurb: "Plant upkeep, lighting and facade access." },
  { name: "Warehousing", blurb: "Racking, picking and inventory at height." },
  { name: "Aviation & Ports", blurb: "Hangar, terminal and dockside servicing." },
  { name: "Railways & Metros", blurb: "Overhead lines, tunnels and stations." },
  { name: "Facility Management", blurb: "Malls, campuses and commercial estates." },
  { name: "Logistics", blurb: "Distribution centres and cold storage." },
  { name: "Events", blurb: "Rigging, staging and temporary installs." },
] as const;

export const services = [
  { name: "Installation & Commissioning", blurb: "Site handover with operator walkthrough." },
  { name: "Operator Training", blurb: "IPAF and IOSH aligned certification programmes." },
  { name: "Inspection & Repair", blurb: "Scheduled inspections and breakdown response." },
  { name: "Genuine Spare Parts", blurb: "Original Dingli parts held in Indian stock." },
  { name: "Annual Maintenance", blurb: "AMC packages up to five years." },
  { name: "Refurbishment", blurb: "Fleet restoration and resale preparation." },
  { name: "Remote Diagnostics", blurb: "Telematics-led fault detection." },
  { name: "24/7 Support", blurb: "Toll-free hotline with 50+ field engineers." },
] as const;

export const differentiators = [
  { title: "95% Fleet Uptime", blurb: "Preventive servicing keeps machines earning." },
  { title: "24/7 Toll-Free Support", blurb: "A nationwide engineer network on call." },
  { title: "Buy-Back Guarantee", blurb: "Structured exit on qualifying purchases." },
  { title: "Rent-to-Buy & EMI", blurb: "Financing that matches project cash flow." },
  { title: "Up to 5-Year AMC", blurb: "Fixed maintenance cost over the asset life." },
  { title: "Largest All-Electric Range", blurb: "AC+ machines for zero-emission sites." },
  { title: "Anti-Corrosion Build", blurb: "Specified for coastal and humid conditions." },
] as const;

export const faqs = [
  {
    q: "What types of aerial work platforms do you supply?",
    a: "Telescopic and articulated boom lifts, electric slab and rough terrain scissor lifts, self-propelled vertical masts, stock pickers, and Teupen spider lifts - across diesel, hybrid and all-electric power.",
  },
  {
    q: "What is the maximum working height available?",
    a: "The range runs from roughly 5 m vertical masts up to the BT44RT telescopic boom at 44.44 m working height.",
  },
  {
    q: "Do you provide after-sales service across India?",
    a: "Yes. Service is delivered through a nationwide network with factory-trained engineers, backed by a 24/7 toll-free hotline and genuine parts held in Indian stock.",
  },
  {
    q: "What is the AC+ Series?",
    a: "AC+ is the all-electric, oil-free line built for zero-emission and indoor sites, with lower running costs and reduced maintenance compared with hydraulic equivalents.",
  },
  {
    q: "Do you offer operator training?",
    a: "Yes - operator certification programmes aligned to IPAF and IOSH standards, delivered on site or at our facilities.",
  },
  {
    q: "Can I rent instead of buying?",
    a: "Rent-to-buy and EMI structures are available alongside outright purchase. Talk to the sales team about the right fit for your project.",
  },
  {
    q: "How do I register equipment for warranty?",
    a: "Submit the warranty registration form within 30 days of delivery. You will receive a warranty ID and an assigned service centre within 24 hours.",
  },
  {
    q: "Do you cover the wider SAARC region?",
    a: "Yes. We are the authorised partner for India and the SAARC region - contact us for country-specific lead times.",
  },
] as const;
