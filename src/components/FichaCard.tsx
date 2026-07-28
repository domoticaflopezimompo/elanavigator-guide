import { useState } from "react";
import { PlayCircle, Clock, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FichaDialogo } from "@/components/FichaDialogo";
import type { Ficha } from "@/data/tipos";

export function FichaCard({ ficha }: { ficha: Ficha }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="group flex w-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-card-foreground">{ficha.titulo}</h3>
          {ficha.videoYoutube ? (
            <PlayCircle className="h-6 w-6 shrink-0 text-primary" aria-label="Incluye vídeo" />
          ) : null}
        </div>
        <p className="text-base text-muted-foreground">{ficha.resumen}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1 font-normal">
            <Repeat className="h-3.5 w-3.5" />
            {ficha.frecuencia}
          </Badge>
          {ficha.duracion ? (
            <Badge variant="secondary" className="gap-1 font-normal">
              <Clock className="h-3.5 w-3.5" />
              {ficha.duracion}
            </Badge>
          ) : null}
        </div>
        <span className="text-sm font-medium text-primary group-hover:underline">
          Ver instrucciones
        </span>
      </button>

      <FichaDialogo
        abierto={abierto}
        onOpenChange={setAbierto}
        titulo={ficha.titulo}
        resumen={ficha.resumen}
        pasos={ficha.pasos}
        avisos={ficha.precauciones}
        videoYoutube={ficha.videoYoutube}
        meta={
          <>
            <Badge variant="secondary" className="font-normal">
              {ficha.frecuencia}
            </Badge>
            {ficha.duracion ? (
              <Badge variant="secondary" className="font-normal">
                {ficha.duracion}
              </Badge>
            ) : null}
          </>
        }
      />
    </>
  );
}