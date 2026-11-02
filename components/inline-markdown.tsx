import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Safe inline markdown: **bold** (which may contain links) and [links](url). Internal links use next/link;
 * anything that isn't a site path or http(s) URL renders as plain text.
 */
export function renderInline(text: string, onNavigate?: () => void): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(<strong key={m.index}>{renderInline(m[1], onNavigate)}</strong>);
    } else {
      const href = m[3];
      const cls = "font-semibold text-brand underline underline-offset-2";
      out.push(
        href.startsWith("/") ? (
          <Link key={m.index} href={href} className={cls} onClick={onNavigate}>
            {m[2]}
          </Link>
        ) : /^https?:\/\//.test(href) ? (
          <a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {m[2]}
          </a>
        ) : (
          m[2]
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
