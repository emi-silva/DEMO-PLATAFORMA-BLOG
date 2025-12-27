import { NextResponse } from "next/server";
import { createPost, listPosts } from "@/lib/posts";
import { postPayloadSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag") ?? undefined;
  const includeDrafts = searchParams.get("includeDrafts") === "true";

  const posts = await listPosts({ tag, includeDrafts });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = postPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const post = await createPost(parsed.data);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo crear la entrada." }, { status: 500 });
  }
}
