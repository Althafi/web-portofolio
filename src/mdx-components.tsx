import type { MDXComponents } from "mdx/types";

/** Gaya isi studi kasus (MDX) sesuai frame "Project detail". */
const components = {
  h2: ({ children, id }) => (
    <h2 id={id} className="mt-10 mb-3 scroll-mt-24 text-h3 text-fg first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3 id={id} className="mt-6 mb-2 scroll-mt-24 text-lg font-semibold text-fg">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="text-base leading-[1.7] text-muted">{children}</p>,
  ul: ({ children }) => (
    <ul className="space-y-1.5 text-base leading-[1.7] text-muted marker:text-accent [&>li]:relative [&>li]:pl-5">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1.5 pl-5 text-base leading-[1.7] text-muted marker:font-mono marker:text-accent">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="before:absolute before:top-[0.8em] before:left-0 before:size-1.5 before:rounded-full before:bg-accent">
      {children}
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-fg underline decoration-border underline-offset-4 hover:decoration-accent">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
  code: ({ children }) => (
    <code className="rounded-[5px] bg-surface px-1.5 py-0.5 font-mono text-[0.875em] text-fg">
      {children}
    </code>
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
