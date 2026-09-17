/**
 * Dealer Connect portal URL.
 *
 * Deliberately kept out of lib/site.ts: that module is imported by client
 * components, and a non-NEXT_PUBLIC_ env var resolves to undefined in the
 * browser bundle. Reading it from here keeps the value server-side, where it is
 * rendered straight into an href.
 *
 * The URL itself isn't sensitive - it ends up visible in the markup either way -
 * but it never needs to reach client-side JavaScript, so it doesn't get a
 * public prefix.
 */
export function dealerConnectUrl(): string | null {
  return process.env.DEALER_CONNECT_URL?.trim() || null;
}
