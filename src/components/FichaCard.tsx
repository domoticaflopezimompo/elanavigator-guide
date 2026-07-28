import { useState } from "react";
import { PlayCircle, Clock, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FichaDialogo } from "@/components/FichaDialogo";
import { Acciones } from "@/components/Acciones";
import type { Ficha } from "@/data/tipos";

export function FichaCard({
  ficha,
  onEditar,
  onEliminar,
}: {
  ficha: Ficha;
  onEditar?: () => void;
  onEliminar?: () => void;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <div className="group border-border bg-card hover:border-primary/40 relative flex w-full flex-col rounded-2xl border transition hover:shadow-md">
        {onEditar && onEliminar ? (
          <div className="absolute top-3 right-3 z-10">
            <Acciones nombre={ficha.titulo} onEditar={onEditar} onEliminar={onEliminar} />
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="focus-visible:ring-ring flex w-full flex-col gap-3 p-5 text-left focus-visible:ring-2 focus-visible:outline-none"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-card-foreground pr-20 text-lg font-semibold">{ficha.titulo}</h3>
            {ficha.videoYoutube ? (
              <PlayCircle className="text-primary h-6 w-6 shrink-0" aria-label="Incluye vídeo" />
            ) : null}
          </div>
          <p className="text-muted-foreground text-base">{ficha.resumen}</p>
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
          <span className="text-primary text-sm font-medium group-hover:underline">
            Ver instrucciones
          </span>
        </button>
      </div>

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