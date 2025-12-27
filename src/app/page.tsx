import Link from "next/link";
import { listPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const revalidate = 0;

export default async function Home() {
  const posts = await listPosts();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-gradient-to-r from-zinc-900/80 via-zinc-900/50 to-zinc-800/60 p-10 shadow-2xl shadow-black/40 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">Blog Platform</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Plataforma moderna de contenidos con MDX + Prisma + PostgreSQL
        </h1>
        <p className="max-w-2xl text-lg text-zinc-200/85">
          Redacta en MDX, organiza con etiquetas y expone un API listo para integrar flujos de edición.
          Todo construido sobre Next.js App Router, con tipado completo y base de datos relacional.
        </p>
        <div className="flex flex-wrap gap-3 pt-2 text-sm font-semibold text-zinc-200">
          <Link
            href="/editor"
            className="rounded-full bg-amber-500 px-4 py-2 text-zinc-950 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:bg-amber-400"
          >
            Abrir editor MDX
          </Link>
          <Link
            href="/api/posts"
            className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-amber-200"
          >
            Ver API /posts
          </Link>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Últimas publicaciones</h2>
          <span className="text-sm text-zinc-400">{posts.length} entradas</span>
        </div>
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-zinc-300">
            Aún no hay publicaciones. Crea la primera desde el editor o con un POST a /api/posts.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
