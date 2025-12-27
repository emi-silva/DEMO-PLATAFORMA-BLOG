## Plataforma de Blog (Next.js + MDX + Prisma)

Este proyecto implementa un blog moderno con Next.js (App Router), editor MDX con vista previa, API CRUD y persistencia opcional en PostgreSQL mediante Prisma. Está listo para funcionar en modo demo sin base de datos, y con pocos pasos puedes conectarlo a tu propia instancia.

### Tecnologías
- Next.js 16 (App Router) y Turbopack.
- MDX (render y preview con remark/rehype).
- Prisma ORM + PostgreSQL (opcional).
- Estilos con Tailwind (clases utilitarias incluidas).
- Pruebas unitarias con Vitest.

### Estructura principal
- `src/app/page.tsx`: portada y listado de posts.
- `src/app/posts/[slug]/page.tsx`: detalle de un post, render MDX.
- `src/app/editor/page.tsx`: editor con formulario + vista previa.
- `src/app/api/posts/route.ts`: API para listar/crear.
- `src/app/api/posts/[slug]/route.ts`: API para leer/actualizar/eliminar.
- `src/lib/posts.ts`: acceso a datos y fallback sin DB.
- `prisma/schema.prisma`: modelos `Post` y `Tag`.
- `prisma/seed.ts`: datos semilla técnicos (MDX, Next.js, Prisma, testing).

### Modo demo (sin base de datos)
Si tu `.env` no define `DATABASE_URL`, el backend usa contenido en memoria para que todo funcione sin PostgreSQL. Esto habilita el feed, el detalle y la API `GET` con posts de ejemplo. Las mutaciones (`POST`, `PUT`, `DELETE`) requieren DB y devolverán error si no hay conexión configurada.

### Configuración con PostgreSQL (opcional)
1. Instala dependencias:
```bash
npm install
```
2. Copia el archivo de ejemplo y ajusta tu conexión:
```bash
cp .env.example .env
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/blog_platform?schema=public"
```
3. Genera cliente y aplica el esquema:
```bash
npx prisma generate
npx prisma migrate dev --name init
```
4. Carga datos de ejemplo:
```bash
npx prisma db seed
```

### Ejecutar en desarrollo
```bash
npm run dev
# Abre http://localhost:3000
```

### Endpoints
- `GET /api/posts?tag=mdx&includeDrafts=true`: lista posts (filtro por etiqueta y borradores opcional).
- `POST /api/posts`: crea post (campos: `title`, `content`, `tags`, `excerpt?`, `slug?`, `published?`).
- `GET /api/posts/:slug`: obtiene un post.
- `PUT /api/posts/:slug`: actualiza un post.
- `DELETE /api/posts/:slug`: elimina un post.

### Editor MDX
La página `/editor` permite redactar con MDX y ver una previsualización en vivo. El formulario envía el payload al endpoint `/api/posts`. En modo demo verás la preview y el flujo, y con DB activa se guardará en PostgreSQL.

### Scripts útiles
- `npm run lint`: ejecuta ESLint.
- `npm run test`: corre Vitest.
- `npx prisma migrate dev`: crea/aplica migraciones.
- `npx prisma db seed`: siembra datos de ejemplo.

### Notas de despliegue
- Asegura `DATABASE_URL` en producción si usarás PostgreSQL (Neon, Supabase o RDS).
- En Vercel, el build usa `npm run build` que ya ejecuta `prisma generate`.
- Si no defines `DATABASE_URL`, el sitio despliega en modo demo (contenido en memoria).
- Revisa cachés de datos con `revalidate` por segmento en App Router.

### Deploy en Vercel
1. Sube el repo y crea un proyecto en Vercel.
2. Configura variables de entorno (opcional): `DATABASE_URL`.
3. Asegura Node `>=18` (Vercel ya usa 18/20 por defecto).
4. Deploy: Vercel ejecutará `npm install` y `npm run build` (se genera Prisma y compila Next).
5. Si usas DB gestionada, habilita pool de conexiones (p.ej. Neon/Supabase) para funciones serverless.

### Personalización
- Conecta autenticación en `src/lib/auth.ts`.
- Ajusta estilos en `src/app/globals.css`.
- Extiende componentes MDX en `src/components/`.
