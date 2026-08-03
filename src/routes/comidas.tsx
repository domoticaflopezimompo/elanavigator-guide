import { createFileRoute } from "@tanstack/react-router";

const TITULO = "Comidas — Cuidados ELA";
const DESCRIPCION =
  "Planificador de comidas del equipo de cuidados: menús, recetas y compra semanal para la persona con ELA.";

const URL_PLANIFICADOR = "http://192.168.1.15:8123/8c37d706_mealie_planner";

export const Route = createFileRoute("/comidas")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ComidasPage,
});

function ComidasPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-4 pb-24 md:px-6 md:pb-8">
      <h1 className="sr-only">Comidas</h1>
      <div className="border-border overflow-hidden rounded-2xl border bg-card">
        <iframe
          src={URL_PLANIFICADOR}
          title="Planificador de comidas"
          className="h-[calc(100vh-9rem)] w-full md:h-[calc(100vh-8rem)]"
          allow="fullscreen"
        />
      </div>
      <p className="text-muted-foreground mt-3 text-xs">
        El planificador se carga desde la red local de la casa. Si no aparece, conéctate al wifi de
        casa o abre {URL_PLANIFICADOR} en el navegador.
      </p>
    </main>
  );
}
