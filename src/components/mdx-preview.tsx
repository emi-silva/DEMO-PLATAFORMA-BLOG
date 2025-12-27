"use client";

import { useEffect, useState } from "react";
import { run } from "@mdx-js/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";

export function MdxPreview({ value }: { value: string }) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function compile() {
      try {
        const result = await run(
          value || "Escribe tu contenido MDX aquí...",
          {
            ...runtime,
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          } as unknown as Parameters<typeof run>[1],
        );

        if (!cancelled) {
          const Content = result.default as React.ComponentType;
          setComponent(() => Content);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setComponent(null);
          setError(err instanceof Error ? err.message : "No pudimos previsualizar el MDX");
        }
      }
    }

    compile();

    return () => {
      cancelled = true;
    };
  }, [value]);

  if (error) {
    return <p className="text-sm text-red-400">Previsualización falló: {error}</p>;
  }

  if (!Component) {
    return <p className="text-sm text-zinc-400">Previsualizando contenido...</p>;
  }

  return (
    <div className="mdx-body">
      <Component />
    </div>
  );
}
