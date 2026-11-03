/* eslint-disable @next/next/no-img-element -- rendered inside Payload's admin, outside next/image's config */

/** Dingli logo on the admin login screen. */
export function Logo() {
  return <img src="/logo.svg" alt="Dingli AWP India" style={{ height: 64, width: "auto" }} />;
}

/** Small mark in the admin navigation. */
export function Icon() {
  return <img src="/logo.svg" alt="Dingli AWP India" style={{ height: 22, width: "auto" }} />;
}
