import Link from "next/link";
import { format } from "date-fns";
import type { Post, Tag } from "@prisma/client";
import { TagPill } from "./tag-pill";

export function PostCard({ post }: { post: Post & { tags: Tag[] } }) {
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-amber-500/20">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-400">
        <span>{post.publishedAt ? format(post.publishedAt, "dd MMM yyyy") : "Borrador"}</span>
        <span className="text-amber-300">{post.tags.length ? "Etiquetado" : "Sin etiquetas"}</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white drop-shadow-sm">
          <Link href={`/posts/${post.slug}`} className="hover:text-amber-300">
            {post.title}
          </Link>
        </h2>
        {post.excerpt ? <p className="text-base text-zinc-200/80">{post.excerpt}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <TagPill key={tag.slug} label={tag.name} />
        ))}
      </div>
    </article>
  );
}
