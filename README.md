## Blog Platform (Next.js + MDX + Prisma)

Plataforma de blogs moderna con editor MDX en vivo, API CRUD, Prisma y PostgreSQL.

### Stack
- Next.js 16 (App Router) + Tailwind 4
- MDX render y previsualización (remark/rehype + `@mdx-js/mdx`)
- Prisma ORM + PostgreSQL
- API routes para posts y etiquetas
- Pruebas unitarias con Vitest

### Configuración rápida
1) Instala dependencias
```bash
npm install
```

2) Crea tu `.env` a partir del ejemplo y ajusta la URL de base de datos
```bash
cp .env.example .env
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/blog_platform?schema=public"
```

3) Genera Prisma Client y aplica el esquema a tu base
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init   # o usa npm run db:push para entornos locales rápidos
```

4) Carga datos de demo (posts MDX + etiquetas)
```bash
npm run prisma:seed
```

5) Arranca el servidor de desarrollo
```bash
npm run dev
# abre http://localhost:3000
```

### Flujos clave
- `GET /api/posts?tag=mdx&includeDrafts=true` — listar posts (opcionalmente por tag o incluyendo borradores).
- `POST /api/posts` — crear (payload: `title`, `content`, `tags`, `excerpt?`, `slug?`, `published?`).
- `GET /api/posts/:slug` — detalle.
- `PUT /api/posts/:slug` — actualizar.
- `DELETE /api/posts/:slug` — eliminar.

### Editor MDX
- Página `/editor` incluye formulario con vista previa en vivo.
- Guarda usando el endpoint `/api/posts` y persiste en PostgreSQL.

### Scripts útiles
- `npm run lint` — ESLint.
- `npm run test` — Vitest (ej. utilidades).
- `npm run prisma:migrate` — crear migración (requiere base de datos disponible).
- `npm run prisma:seed` — datos de ejemplo.

### Siguientes pasos
- Conecta tu proveedor de autenticación en `src/lib/auth.ts` (placeholders listos).
- Añade políticas de autorización en las rutas de API.
- Personaliza estilos/temas según tu marca.
