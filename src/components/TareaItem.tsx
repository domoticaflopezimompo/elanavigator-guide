import { Check, Clock, PlayCircle } from "lucide-react";
import { CATEGORIAS } from "@/lib/agenda";
import { Acciones } from "@/components/Acciones";
import type { Tarea } from "@/data/tipos";

interface Props {
  tarea: Tarea;
  hecha: boolean;
  /** Etiqueta que sustituye a la de la categoría (p. ej. «Cuidador»). */
  etiqueta?: { texto: string; clase: string };
  /** Hora ya pasada y sin completar. */
  atrasada?: boolean;
  /** Siguiente tarea pendiente del día. */
  proxima?: boolean;
  onAbrir: () => void;
  onAlternar: () => void;
  onEditar?: () => void;
  onEliminar?: () => void;
  onSubir?: () => void;
  onBajar?: () => void;
  puedeSubir?: boolean;
  puedeBajar?: boolean;
}

export function TareaItem({
  tarea,
  hecha,
  etiqueta,
  atrasada,
  proxima,
  onAbrir,
  onAlternar,
  onEditar,
  onEliminar,
  onSubir,
  onBajar,
  puedeSubir,
  puedeBajar,
}: Props) {
  const categoria = CATEGORIAS[tarea.categoria];

  return (
    <div
      className={[
        "flex items-stretch gap-2 rounded-2xl border bg-card transition",
        hecha
          ? "border-border/60 opacity-60"
          : atrasada
            ? "border-destructive/40 bg-destructive/5 hover:shadow-sm"
            : proxima
              ? "border-primary/60 shadow-sm"
              : "border-border hover:border-primary/40 hover:shadow-sm",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onAlternar}
        aria-pressed={hecha}
        aria-label={hecha ? `Marcar ${tarea.titulo} como pendiente` : `Marcar ${tarea.titulo} como hecha`}
        className="flex items-center rounded-l-2xl pl-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition",
            hecha
              ? "border-primary bg-primary text-primary-foreground"
              : atrasada
                ? "border-destructive/50"
                : "border-border",
          ].join(" ")}
        >
          {hecha ? <Check className="h-6 w-6" /> : null}
        </span>
      </button>

      <button
        type="button"
        onClick={onAbrir}
        className="flex-1 py-4 pr-4 pl-2 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${etiqueta?.clase ?? categoria.clase}`}
          >
            {etiqueta?.texto ?? categoria.etiqueta}
          </span>
          {tarea.hora ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {tarea.hora}
            </span>
          ) : null}
          {tarea.videoYoutube ? (
            <PlayCircle className="h-4 w-4 text-primary" aria-label="Incluye vídeo" />
          ) : null}
          {!hecha && atrasada ? (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              Pendiente
            </span>
          ) : null}
          {!hecha && !atrasada && proxima ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Ahora
            </span>
          ) : null}
        </div>
        <h3
          className={[
            "mt-1.5 text-lg leading-snug font-semibold",
            hecha ? "text-muted-foreground line-through" : "text-card-foreground",
          ].join(" ")}
        >
          {tarea.titulo}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{tarea.resumen}</p>
      </button>

      {onEditar && onEliminar ? (
        <div className="flex items-center pr-3">
          <Acciones
            nombre={tarea.titulo}
            onEditar={onEditar}
            onEliminar={onEliminar}
            onSubir={onSubir}
            onBajar={onBajar}
            puedeSubir={puedeSubir}
            puedeBajar={puedeBajar}
          />
        </div>
      ) : null}
    </div>
  );
}