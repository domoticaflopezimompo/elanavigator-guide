import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [intento, setIntento] = useState(0);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setEstado("cargando");
    temporizador.current = setTimeout(() => {
      setEstado((actual) => (actual === "cargando" ? "error" : actual));
    }, 12000);
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, [intento]);

  const recargar = () => setIntento((n) => n + 1);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-4 pb-24 md:px-6 md:pb-8">
      <h1 className="sr-only">Comidas</h1>
      <div className="border-border relative overflow-hidden rounded-2xl border bg-card">
        {estado !== "error" ? (
          <iframe
            key={intento}
            src={URL_PLANIFICADOR}
            title="Planificador de comidas"
            className="h-[calc(100vh-9rem)] w-full md:h-[calc(100vh-8rem)]"
            allow="fullscreen"
            onLoad={() => setEstado("listo")}
            onError={() => setEstado("error")}
          />
        ) : (
          <div className="flex h-[calc(100vh-9rem)] w-full flex-col items-center justify-center gap-4 px-6 text-center md:h-[calc(100vh-8rem)]">
            <WifiOff className="text-muted-foreground h-10 w-10" aria-hidden="true" />
            <div>
              <p className="font-semibold">No se pudo cargar el planificador</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Comprueba que estás conectado al wifi de casa y vuelve a intentarlo.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button onClick={recargar}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Recargar planificador
              </Button>
              <Button variant="outline" asChild>
                <a href={URL_PLANIFICADOR} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Abrir en otra pestaña
                </a>
              </Button>
            </div>
          </div>
        )}

        {estado === "cargando" ? (
          <div className="bg-card/90 absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="text-primary h-8 w-8 animate-spin" aria-hidden="true" />
            <p className="text-muted-foreground text-sm">Cargando planificador de comidas…</p>
          </div>
        ) : null}
      </div>
      {estado === "listo" ? (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={recargar}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Recargar
          </Button>
        </div>
      ) : null}
      <p className="text-muted-foreground mt-3 text-xs">
        El planificador se carga desde la red local de la casa. Si no aparece, conéctate al wifi de
        casa o abre {URL_PLANIFICADOR} en el navegador.
      </p>
    </main>
  );
}
