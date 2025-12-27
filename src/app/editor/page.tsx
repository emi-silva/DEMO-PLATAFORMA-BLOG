"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { MdxPreview } from "@/components/mdx-preview";
import { slugify } from "@/lib/slugify";

const starter = `# Escribe con MDX

- Usa **markdown** o componentes React.
- Añade \`<Callout />\` o cualquier JSX permitido.
- Etiquetas separadas por comas en el campo correspondiente.

## Bloque de código

\`\`\`ts
import { prisma } from "@/lib/prisma";

async function demo() {
  const posts = await prisma.post.findMany();
  console.log(posts);
}
\`\`\``;

export default function EditorPage() {
  const [title, setTitle] = useState("Nuevo post MDX");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("Comparte ideas, actualizaciones o tutoriales en tu propio flujo.");
  const [tags, setTags] = useState("nextjs, mdx, prisma");
  const [content, setContent] = useState(starter);
  const [published, setPublished] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(
    () => ({
      title,
      slug: slug || slugify(title),
      excerpt,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      content,
      published,
    }),
    [content, excerpt, published, slug, tags, title],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("Guardando...");
    setError(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error ?? "No se pudo guardar");
      }

      setStatus("Entrada guardada. Revisa la portada o ve al detalle.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setStatus(null);
    }
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-3">
        <Link href="/" className="text-sm text-amber-200 hover:text-amber-100">
          ← Volver al feed
        </Link>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Editor</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Componer contenido enriquecido</h1>
          <p className="max-w-2xl text-zinc-300">
            MDX en vivo con vista previa. Las peticiones se envían al endpoint /api/posts para persistir en PostgreSQL
            vía Prisma.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-amber-400/60 focus:ring"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="opcional"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-amber-400/60 focus:ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Etiquetas (coma separadas)</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-amber-400/60 focus:ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Resumen</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-amber-400/60 focus:ring"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Contenido MDX</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-3 font-mono text-sm text-white outline-none ring-amber-400/60 focus:ring"
              rows={14}
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 rounded border-white/40 bg-black/40 text-amber-400"
              />
              Publicar inmediatamente
            </label>
            <button
              type="submit"
              className="rounded-full bg-amber-500 px-4 py-2 text-black font-semibold shadow shadow-amber-500/40 transition hover:-translate-y-0.5 hover:bg-amber-400"
            >
              Guardar
            </button>
          </div>

          {status ? <p className="text-sm text-emerald-300">{status}</p> : null}
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </form>

        <div className="space-y-3 rounded-3xl border border-amber-500/20 bg-zinc-950/70 p-6 shadow-2xl shadow-amber-500/15">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-amber-300">
            <span>Vista previa MDX</span>
            <span className="rounded-full bg-amber-500/20 px-2 py-1 text-[10px] text-amber-100">En vivo</span>
          </div>
          <MdxPreview value={content} />
        </div>
      </div>
    </main>
  );
}
