import { Calendar, MapPin } from "lucide-react";
import type { CitaCalendario } from "@/lib/calendar.functions";

interface Props {
  cita: CitaCalendario;
}

export function CitaCalendarioItem({ cita }: Props) {
  return (
    <a
      href={cita.enlace}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-stretch gap-2 rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-center rounded-l-2xl pl-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background">
          <Calendar className="h-5 w-5 text-primary" />
        </span>
      </div>

      <div className="flex-1 py-4 pr-4 pl-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Cita
          </span>
          {cita.horaInicio ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {cita.horaInicio}
              {cita.horaFin ? ` – ${cita.horaFin}` : null}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1.5 text-lg leading-snug font-semibold text-card-foreground">
          {cita.titulo}
        </h3>
        {cita.ubicacion ? (
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {cita.ubicacion}
          </p>
        ) : null}
      </div>
    </a>
  );
}
