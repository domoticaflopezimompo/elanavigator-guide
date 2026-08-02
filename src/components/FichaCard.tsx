import { useState } from "react";
import { PlayCircle, Clock, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FichaDialogo } from "@/components/FichaDialogo";
import { Acciones } from "@/components/Acciones";
import { IconoFicha } from "@/components/IconoFicha";
import { CATEGORIAS } from "@/lib/agenda";
import type { Categoria, Ficha } from "@/data/tipos";

export function FichaCard({
  ficha,
  categoria,
  etiqueta,
  onEditar,
  onEliminar,
  onSubir,
  onBajar,
  puedeSubir,
  puedeBajar,
}: {
  ficha: Ficha;
  categoria?: Categoria;
  /** Nombre de la sección mostrado en la pastilla de color. */
  etiqueta?: string;
  onEditar?: () => void;
  onEliminar?: () => void;
  onSubir?: () => void;
  onBajar?: () => void;
  puedeSubir?: boolean;
  puedeBajar?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const cat = categoria ? CATEGORIAS[categoria] : null;

  return (
    <>
      <div className="group border-border bg-card hover:border-primary/40 relative flex w-full flex-col rounded-2xl border transition hover:shadow-md">
        {onEditar && onEliminar ? (
          <div className="absolute top-3 right-3 z-10">
            <Acciones
              nombre={ficha.titulo}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onSubir={onSubir}
              onBajar={onBajar}
              puedeSubir={puedeSubir}
              puedeBajar={puedeBajar}
            />
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="focus-visible:ring-ring flex w-full flex-col gap-3 p-5 text-left focus-visible:ring-2 focus-visible:outline-none"
        >
          <div className="flex items-start gap-3">
            <IconoFicha icono={ficha.icono} />
            <h3 className="text-card-foreground pr-32 text-lg font-semibold">{ficha.titulo}</h3>
          </div>
          <p className="text-muted-foreground text-base">{ficha.resumen}</p>
          <div className="flex flex-wrap gap-2">
            {cat ? (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.clase}`}>
                {etiqueta ?? cat.etiqueta}
              </span>
            ) : null}
            {ficha.videoYoutube ? (
              <Badge variant="secondary" className="gap-1 font-normal">
                <PlayCircle className="h-3.5 w-3.5" />
                Vídeo
              </Badge>
            ) : null}
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
            {cat ? (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.clase}`}>
                {etiqueta ?? cat.etiqueta}
              </span>
            ) : null}
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