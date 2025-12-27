import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPostBySlug } from "@/lib/posts";
import { TagPill } from "@/components/tag-pill";
import { MdxContent } from "@/components/mdx-content";

export const revalidate = 0;

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-0">
      <Link
        href="/"
        className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-amber-200 transition hover:border-amber-400"
      >
        ← Volver al feed
      </Link>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Publicación</p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <span>
            {post.publishedAt ? format(post.publishedAt, "dd MMM yyyy") : "Borrador guardado"}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-amber-200">
            {post.published ? "Publicado" : "Borrador"}
          </span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagPill key={tag.slug} label={tag.name} />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-zinc-950/60 p-6 shadow-2xl shadow-black/40">
        <MdxContent source={post.content} />
      </div>
    </main>
  );
}
