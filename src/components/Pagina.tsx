import type { ReactNode } from "react";

export function Pagina({
  titulo,
  descripcion,
  children,
}: {
  titulo: string;
  descripcion: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-5xl px-4 pt-6 pb-28 md:px-6 md:pb-16">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{titulo}</h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">{descripcion}</p>
      </header>
      {children}
      <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        Esta web es una ayuda organizativa para el equipo de cuidados. No sustituye las
        indicaciones del equipo médico.
      </p>
    </main>
  );
}