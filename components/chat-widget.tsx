"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp, Loader2, MessageCircle, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "dsa-chat-v1";

const STARTERS = [
  "I need a boom lift",
  "Scissor lift for indoor work",
  "I want to rent a machine",
  "Show me used equipment",
];

/** Minimal, safe markdown: paragraphs, "- " bullets, **bold** and [links](url). */
function renderInline(text: string, onNavigate?: () => void): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(<strong key={m.index}>{m[1]}</strong>);
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

function Markdown({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return (
            <ul key={i} className="my-1.5 list-disc space-y-1 pl-4">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\s*[-*•]\s+/, ""), onNavigate)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="my-1.5 first:mt-0 last:mb-0">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(l.replace(/^\s*[-*•]\s+/, "• "), onNavigate)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

export function ChatWidget({ greeting }: { greeting: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [leadRef, setLeadRef] = useState<string>();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Restore the conversation for this browser tab.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved?.messages) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off restore from sessionStorage
        setMessages(saved.messages);
        setLeadRef(saved.leadRef);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, leadRef }));
    } catch {}
  }, [messages, leadRef]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    // Drop a failed (empty) assistant turn so the history alternates cleanly.
    const history = [...messages.filter((m) => m.content), { role: "user" as const, content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const append = (chunk: string) =>
      setMessages((prev) => {
        const next = prev.slice();
        const lastMsg = next[next.length - 1];
        next[next.length - 1] = { ...lastMsg, content: lastMsg.content + chunk };
        return next;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-40), leadRef }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => null);
        append(err?.error ?? "Sorry, something went wrong. Please try again.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line) continue;
          const event = JSON.parse(line);
          if (event.type === "text") append(event.text);
          else if (event.type === "lead") setLeadRef((r) => r ?? event.reference);
          else if (event.type === "error") append(event.message);
        }
      }
    } catch {
      append("Sorry, the connection dropped. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // On a phone the panel covers the page, so get out of the way after a link.
  function closeOnSmallScreen() {
    if (!window.matchMedia("(min-width: 640px)").matches) setOpen(false);
  }

  function reset() {
    setMessages([]);
    setLeadRef(undefined);
  }

  const waiting = busy && messages[messages.length - 1]?.content === "";

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Dingli AWP India"
          className="fixed inset-x-0 bottom-0 z-[60] flex h-[85dvh] flex-col overflow-hidden rounded-t-2xl border border-line bg-white shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[min(640px,calc(100dvh-8rem))] sm:w-[400px] sm:rounded-2xl"
        >
          <div className="flex items-center justify-between gap-3 bg-ink px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-brand">
                <MessageCircle className="size-5" />
              </span>
              <div>
                <p className="font-display text-xl leading-none">Dingli AWP India</p>
                <p className="mt-1 text-xs text-white/60">Equipment advice &amp; quotes</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  disabled={busy}
                  className="rounded-md px-2 py-1 text-xs text-white/60 hover:text-white disabled:opacity-40"
                >
                  New chat
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid size-8 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-band px-4 py-5 text-sm leading-relaxed">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-ink shadow-sm">
              {greeting}
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-brand/30 bg-white px-3 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-white">
                  {m.content}
                </div>
              ) : m.content ? (
                <div key={i} className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-ink shadow-sm">
                  <Markdown text={m.content} onNavigate={closeOnSmallScreen} />
                </div>
              ) : null,
            )}

            {waiting && (
              <div className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3.5 shadow-sm" aria-label="Assistant is typing">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}

            {leadRef && (
              <p className="text-center text-xs text-muted">
                Enquiry sent &middot; reference <span className="font-semibold text-ink">{leadRef}</span>
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-line bg-white p-3"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder="Ask about a machine..."
              aria-label="Your message"
              className="max-h-32 flex-1 resize-none rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white transition-colors hover:bg-brand-dark disabled:opacity-40"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-expanded={open}
        className={`fixed bottom-5 right-5 z-[60] items-center gap-2 rounded-full bg-brand px-4 py-3.5 font-semibold text-white shadow-lg shadow-brand/30 transition-transform hover:scale-105 hover:bg-brand-dark sm:bottom-6 sm:right-6 sm:flex ${open ? "hidden" : "flex"}`}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        <span className="hidden text-sm sm:inline">{open ? "Close" : "Ask us anything"}</span>
      </button>
    </>
  );
}
