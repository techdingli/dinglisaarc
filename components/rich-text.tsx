import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText as LexicalRichText } from "@payloadcms/richtext-lexical/react";

/**
 * Article body from the CMS editor, styled to match the site. Element styles
 * are applied from the container so editors don't need to format anything.
 */
export function RichText({ data }: { data: SerializedEditorState }) {
  return (
    <LexicalRichText
      data={data}
      className={[
        "text-lg leading-relaxed text-ink-soft",
        "[&_p]:mt-5",
        "[&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink sm:[&_h2]:text-4xl",
        "[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:text-ink",
        "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-6 [&_ul_li]:marker:text-brand",
        "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-6",
        "[&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:font-semibold [&_strong]:text-ink",
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-5 [&_blockquote]:italic",
        "[&_img]:mt-6 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl",
        "[&_hr]:my-10 [&_hr]:border-line",
      ].join(" ")}
    />
  );
}
