import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Evita la advertencia de raíz cuando hay lockfiles fuera del proyecto.
    root: __dirname,
  },
};

export default nextConfig;
