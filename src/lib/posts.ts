import { prisma } from "./prisma";
import { slugify } from "./slugify";
import { type PostPayload } from "./validators";

const postInclude = {
  tags: true,
} as const;

const isDbEnabled = Boolean(process.env.DATABASE_URL);

type ListOptions = {
  tag?: string;
  includeDrafts?: boolean;
};

const demoPosts = [
  {
    id: 1,
    title: "Arquitectura Next.js 16 con App Router",
    slug: "nextjs-app-router-16",
    excerpt:
      "Patrones para sacar provecho del App Router: Server Components, caché y streaming para experiencias rápidas.",
    content: `# Next.js 16 en producción

App Router habilita layouts anidados, caché granular y streaming por defecto. Algunos puntos rápidos:

- Prefiere Server Components para datos y evita levantar estado en el cliente.
- Usa \'revalidate\' y caché por segmento para reducir TTFB.
- Activa rutas paralelas para dashboards complejos.

## Checklist de rendimiento

1. Marca assets críticos con \'priority\' en \'next/image\'.
2. Mueve librerías pesadas a server-only o lazy load en el cliente.
3. Observa el waterfall con \'next dev --turbo\' y ajusta cachés.

### Ejemplo de fetch con caché

\`\`\`ts
export async function getData() {
  const res = await fetch("https://api.internal/metrics", { next: { revalidate: 60 } });
  return res.json();
}
\`\`\`

Deja la UI libre para animaciones y control de foco, todo lo demás en el servidor.`,
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [
      { id: 1, name: "Next.js", slug: "nextjs" },
      { id: 2, name: "React", slug: "react" },
      { id: 3, name: "Rendimiento", slug: "rendimiento" },
    ],
  },
  {
    id: 2,
    title: "MDX como fuente única de documentación",
    slug: "mdx-docs-unificadas",
    excerpt:
      "MDX unifica contenido y componentes. Monta guías técnicas, changelogs y demos en el mismo canal.",
    content: `# MDX sin fricción

Combina Markdown y JSX para documentar productos o escribir tutoriales interactivos.

- Usa \`remark-gfm\` para tablas, listas de tareas y referencias.
- Inyecta componentes UI como \`<TagPill />\` para resaltar estados.
- Versiona el contenido junto al código y obtén previews con Vercel.

## Fragmento de componente

\`\`\`tsx
import { TagPill } from "@/components/tag-pill";

export function Estado() {
  return <TagPill label="beta" />;
}
\`\`\`

Escribe todo en español, incluye ejemplos reproducibles y mantiene la densidad técnica alta.`,
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [
      { id: 4, name: "MDX", slug: "mdx" },
      { id: 5, name: "Docs", slug: "docs" },
      { id: 6, name: "DX", slug: "dx" },
    ],
  },
  {
    id: 3,
    title: "Prisma + PostgreSQL listo para producción",
    slug: "prisma-postgresql-produccion",
    excerpt:
      "Configuración mínima para esquemas consistentes, migraciones seguras y seeds reproducibles con Prisma.",
    content: `# Prisma en modo serio

Define el esquema, ejecuta migraciones y usa seeds idempotentes para poblar entornos.

## Pasos clave

1. Ajusta \`.env\` con \`DATABASE_URL\` apuntando a tu clúster.
2. Corre \`npx prisma migrate deploy\` en producción.
3. Usa \`prisma generate\` en CI para mantener el cliente tipado.

### Ejemplo de consulta

\`\`\`ts
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { tags: true },
  orderBy: [{ publishedAt: "desc" }],
});
\`\`\`

Monitorea el pool de conexiones y limita cargas pesadas a tareas en background.`,
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [
      { id: 7, name: "Prisma", slug: "prisma" },
      { id: 8, name: "PostgreSQL", slug: "postgresql" },
      { id: 9, name: "Data", slug: "data" },
    ],
  },
  {
    id: 4,
    title: "Testing web con Vitest y Playwright",
    slug: "testing-vitest-playwright",
    excerpt:
      "Cómo equilibrar pruebas unitarias rápidas con tests end-to-end confiables usando Vitest y Playwright.",
    content: `# Estrategia de pruebas

Combina Vitest para lógica pura y Playwright para flujos críticos.

## Pirámide práctica

- Unidades: utils, hooks y validadores con Vitest.
- Integración: componentes con render en JSDOM.
- E2E: rutas clave con Playwright y datos semilla controlados.

### Ejemplo de test unitario

\`\`\`ts
import { slugify } from "@/lib/slugify";

it("normaliza acentos y espacios", () => {
  expect(slugify("¡Hola Mundo!")) .toBe("hola-mundo");
});
\`\`\`

Automatiza en CI, guarda artefactos y etiqueta los tests lentos.`,
    published: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [
      { id: 10, name: "Testing", slug: "testing" },
      { id: 11, name: "Vitest", slug: "vitest" },
      { id: 12, name: "Playwright", slug: "playwright" },
    ],
  },
];

function buildExcerpt(content: string, provided?: string) {
  if (provided?.trim()) return provided.trim();
  const snippet = content.replace(/[#>*_`\-]/g, "").slice(0, 220).trim();
  return snippet.length ? `${snippet}${snippet.endsWith(".") ? "" : "..."}` : "";
}

function filterDemoPosts(tag?: string, includeDrafts = false) {
  const filtered = demoPosts.filter((post) =>
    tag ? post.tags.some((t) => t.slug === slugify(tag)) : true,
  );
  return includeDrafts ? filtered : filtered.filter((p) => p.published);
}

async function ensureTags(rawTags: string[]) {
  const unique = Array.from(new Set(rawTags.map((tag) => tag.trim()).filter(Boolean)));
  const tags = await Promise.all(
    unique.map((tag) => {
      const tagSlug = slugify(tag);
      return prisma.tag.upsert({
        where: { slug: tagSlug },
        update: { name: tag },
        create: { name: tag, slug: tagSlug },
      });
    }),
  );
  return tags;
}

export async function listPosts(options: ListOptions = {}) {
  const { tag, includeDrafts = false } = options;
  if (!isDbEnabled) return filterDemoPosts(tag, includeDrafts);
  try {
    return await prisma.post.findMany({
      where: {
        ...(includeDrafts ? {} : { published: true }),
        ...(tag ? { tags: { some: { slug: slugify(tag) } } } : {}),
      },
      include: postInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("No se pudieron listar las entradas", error);
    // Fallback en memoria para que la UI no caiga sin base de datos.
    return filterDemoPosts(tag, includeDrafts);
  }
}

export async function getPostBySlug(slug: string, includeDrafts = false) {
  if (!isDbEnabled) {
    const match = demoPosts.find((post) => post.slug === slug && (includeDrafts || post.published));
    return match ?? null;
  }
  try {
    return await prisma.post.findFirst({
      where: { slug, ...(includeDrafts ? {} : { published: true }) },
      include: postInclude,
    });
  } catch (error) {
    console.error("No se pudo obtener la entrada", error);
    const match = demoPosts.find((post) => post.slug === slug && (includeDrafts || post.published));
    return match ?? null;
  }
}

export async function createPost(payload: PostPayload) {
  if (!isDbEnabled) {
    throw new Error("DATABASE_URL no está configurada. Conecta PostgreSQL para crear entradas reales.");
  }
  const tags = await ensureTags(payload.tags ?? []);
  const slug = slugify(payload.slug ?? payload.title);
  const published = payload.published ?? false;

  const post = await prisma.post.create({
    data: {
      title: payload.title,
      slug,
      excerpt: buildExcerpt(payload.content, payload.excerpt),
      content: payload.content,
      published,
      publishedAt: published ? new Date() : null,
      tags: { connect: tags.map((tag) => ({ id: tag.id })) },
    },
    include: postInclude,
  });

  return post;
}

export async function updatePost(slug: string, payload: PostPayload) {
  if (!isDbEnabled) {
    throw new Error("DATABASE_URL no está configurada. Conecta PostgreSQL para editar entradas reales.");
  }
  const existing = await prisma.post.findUnique({ where: { slug }, include: postInclude });
  if (!existing) return null;

  const tags = await ensureTags(payload.tags ?? []);
  const nextSlug = slugify(payload.slug ?? slug);
  const published = payload.published ?? existing.published;
  const publishedAt = published ? existing.publishedAt ?? new Date() : null;

  const post = await prisma.post.update({
    where: { slug },
    data: {
      title: payload.title ?? existing.title,
      slug: nextSlug,
      excerpt: buildExcerpt(payload.content ?? existing.content, payload.excerpt),
      content: payload.content ?? existing.content,
      published,
      publishedAt,
      tags: { set: tags.map((tag) => ({ id: tag.id })) },
    },
    include: postInclude,
  });

  return post;
}

export async function deletePost(slug: string) {
  if (!isDbEnabled) {
    throw new Error("DATABASE_URL no está configurada. Conecta PostgreSQL para borrar entradas reales.");
  }
  await prisma.post.delete({ where: { slug } });
}
