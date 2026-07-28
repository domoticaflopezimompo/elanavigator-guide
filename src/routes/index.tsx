import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendario } from "@/components/Calendario";
import { TareaItem } from "@/components/TareaItem";
import { FichaDialogo } from "@/components/FichaDialogo";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCompletadas } from "@/hooks/use-completadas";
import { CATEGORIAS, FRANJAS, claveFecha, esMismoDia, formatoLargo, tareasDelDia } from "@/lib/agenda";
import type { Tarea } from "@/data/tipos";

const TITULO = "Tareas del día — Cuidados ELA";
const DESCRIPCION =
  "Calendario y tareas diarias del equipo de cuidadores: medicación, ejercicios, logopedia e instrucciones paso a paso con vídeo.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: Index,
});

function Index() {
  const hoy = useMemo(() => new Date(), []);
  const [seleccionada, setSeleccionada] = useState<Date>(hoy);
  const [mes, setMes] = useState<Date>(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const [abierta, setAbierta] = useState<Tarea | null>(null);

  const clave = claveFecha(seleccionada);
  const { completadas, alternar } = useCompletadas(clave);
  const delDia = useMemo(() => tareasDelDia(seleccionada), [seleccionada]);
  const hechas = delDia.filter((tarea) => completadas.includes(tarea.id)).length;

  return (
    <main className="mx-auto max-w-5xl px-4 pt-6 pb-28 md:px-6 md:pb-16">
      <header className="mb-6">
        <p className="text-sm font-medium text-primary">
          {esMismoDia(seleccionada, hoy) ? "Hoy" : "Día seleccionado"}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight capitalize md:text-4xl">
          {formatoLargo(seleccionada)}
        </h1>
        <div className="mt-4 max-w-md">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {hechas} de {delDia.length} tareas hechas
            </span>
            {delDia.length > 0 && hechas === delDia.length ? (
              <span className="font-medium text-primary">¡Día completo!</span>
            ) : null}
          </div>
          <Progress value={delDia.length ? (hechas / delDia.length) * 100 : 0} />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[320px_1fr] md:items-start">
        <div className="space-y-3 md:sticky md:top-20">
          <Calendario
            mes={mes}
            hoy={hoy}
            seleccionada={seleccionada}
            onCambiarMes={setMes}
            onSeleccionar={(fecha) => {
              setSeleccionada(fecha);
              setMes(new Date(fecha.getFullYear(), fecha.getMonth(), 1));
            }}
          />
          <p className="px-1 text-xs text-muted-foreground">
            Las tareas marcadas se guardan en este dispositivo, no se comparten entre teléfonos.
          </p>
        </div>

        <div className="space-y-6">
          {FRANJAS.map((franja) => {
            const tareasFranja = delDia.filter((tarea) => tarea.franja === franja.id);
            if (tareasFranja.length === 0) return null;

            return (
              <section key={franja.id}>
                <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {franja.etiqueta}
                </h2>
                <div className="space-y-3">
                  {tareasFranja.map((tarea) => (
                    <TareaItem
                      key={tarea.id}
                      tarea={tarea}
                      hecha={completadas.includes(tarea.id)}
                      onAbrir={() => setAbierta(tarea)}
                      onAlternar={() => alternar(tarea.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {delDia.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              No hay tareas programadas para este día.
            </p>
          ) : null}
        </div>
      </div>

      {abierta ? (
        <FichaDialogo
          abierto
          onOpenChange={(valor) => !valor && setAbierta(null)}
          titulo={abierta.titulo}
          resumen={abierta.resumen}
          pasos={abierta.pasos}
          avisos={abierta.avisos}
          videoYoutube={abierta.videoYoutube}
          meta={
            <>
              <Badge variant="secondary" className="font-normal">
                {CATEGORIAS[abierta.categoria].etiqueta}
              </Badge>
              {abierta.hora ? (
                <Badge variant="secondary" className="font-normal">
                  {abierta.hora}
                </Badge>
              ) : null}
              {abierta.duracion ? (
                <Badge variant="secondary" className="font-normal">
                  {abierta.duracion}
                </Badge>
              ) : null}
            </>
          }
        />
      ) : null}

      <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        Esta web es una ayuda organizativa para el equipo de cuidados. No sustituye las
        indicaciones del equipo médico.
      </p>
    </main>
  );
}
