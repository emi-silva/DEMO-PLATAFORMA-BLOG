import { NextRequest, NextResponse } from "next/server";
import { deletePost, getPostBySlug, updatePost } from "@/lib/posts";
import { postPayloadSchema } from "@/lib/validators";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  // Exponemos solo publicados en el endpoint público por defecto.
  const post = await getPostBySlug(slug, false);
  if (!post) return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const body = await request.json();
  const parsed = postPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const post = await updatePost(slug, parsed.data);
    if (!post) return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo actualizar la entrada." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    await deletePost(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo eliminar la entrada." }, { status: 500 });
  }
}
