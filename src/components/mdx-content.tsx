import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const components: MDXRemoteProps["components"] = {
  a: (props) => (
    <a {...props} className="text-amber-500 underline decoration-dotted underline-offset-4 hover:text-amber-400" />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="overflow-auto rounded-xl border border-white/10 bg-zinc-950/70 p-4 text-sm text-zinc-100 shadow-lg shadow-amber-500/10"
    />
  ),
  code: (props) => <code {...props} className="rounded bg-zinc-800/60 px-1.5 py-1 text-sm" />,
  blockquote: (props) => (
    <blockquote
      {...props}
      className="border-l-4 border-amber-400/70 bg-amber-50/5 px-4 py-2 text-amber-50/90"
    />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="mdx-body">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          },
        }}
      />
    </div>
  );
}
