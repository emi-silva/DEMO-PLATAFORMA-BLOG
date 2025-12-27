import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slugify";

const prisma = new PrismaClient();

const posts = [
  {
    title: "Arquitectura Next.js 16 con App Router",
    slug: "nextjs-app-router-16",
    excerpt:
      "Patrones para sacar provecho del App Router: Server Components, caché y streaming para experiencias rápidas.",
    tags: ["Next.js", "React", "Rendimiento"],
    content: `# Next.js 16 en producción

App Router habilita layouts anidados, caché granular y streaming por defecto. Algunos puntos rápidos:

- Prefiere Server Components para datos y evita levantar estado en el cliente.
- Usa 'revalidate' y caché por segmento para reducir TTFB.
- Activa rutas paralelas para dashboards complejos.

## Checklist de rendimiento

1. Marca assets críticos con 'priority' en 'next/image'.
2. Mueve librerías pesadas a server-only o lazy load en el cliente.
3. Observa el waterfall con 'next dev --turbo' y ajusta cachés.

### Ejemplo de fetch con caché

\`\`\`ts
export async function getData() {
  const res = await fetch("https://api.internal/metrics", { next: { revalidate: 60 } });
  return res.json();
}
\`\`\`

Deja la UI libre para animaciones y control de foco, todo lo demás en el servidor.`,
  },
  {
    title: "MDX como fuente única de documentación",
    slug: "mdx-docs-unificadas",
    excerpt:
      "MDX unifica contenido y componentes. Monta guías técnicas, changelogs y demos en el mismo canal.",
    tags: ["MDX", "Docs", "DX"],
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
  },
  {
    title: "Prisma + PostgreSQL listo para producción",
    slug: "prisma-postgresql-produccion",
    excerpt:
      "Configuración mínima para esquemas consistentes, migraciones seguras y seeds reproducibles con Prisma.",
    tags: ["Prisma", "PostgreSQL", "Data"],
    content: `# Prisma en modo serio

Define el esquema, ejecuta migraciones y usa seeds idempotentes para poblar entornos.

## Pasos clave

1. Ajusta '.env' con 'DATABASE_URL' apuntando a tu clúster.
2. Corre 'npx prisma migrate deploy' en producción.
3. Usa 'prisma generate' en CI para mantener el cliente tipado.

### Ejemplo de consulta

\`\`\`ts
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { tags: true },
  orderBy: [{ publishedAt: "desc" }],
});
\`\`\`

Monitorea el pool de conexiones y limita cargas pesadas a tareas en background.`,
  },
  {
    title: "Testing web con Vitest y Playwright",
    slug: "testing-vitest-playwright",
    excerpt:
      "Cómo equilibrar pruebas unitarias rápidas con tests end-to-end confiables usando Vitest y Playwright.",
    tags: ["Testing", "Vitest", "Playwright"],
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
  },
];

async function main() {
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const tagRecords = await Promise.all(
    tags.map((tag) => {
      const tagSlug = slugify(tag);
      return prisma.tag.upsert({
        where: { slug: tagSlug },
        update: { name: tag },
        create: { name: tag, slug: tagSlug },
      });
    }),
  );

  for (const post of posts) {
    const related = tagRecords.filter((tag) => post.tags.includes(tag.name));
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        published: true,
        publishedAt: new Date(),
        tags: { set: related.map((tag) => ({ id: tag.id })) },
      },
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        published: true,
        publishedAt: new Date(),
        tags: { connect: related.map((tag) => ({ id: tag.id })) },
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seed completado 🚀");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
