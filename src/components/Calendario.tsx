import { ChevronLeft, ChevronRight } from "lucide-react";
import { claveFecha, esMismoDia, tareasDelDia } from "@/lib/agenda";

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

interface Props {
  mes: Date;
  seleccionada: Date;
  hoy: Date;
  onCambiarMes: (mes: Date) => void;
  onSeleccionar: (fecha: Date) => void;
}

export function Calendario({ mes, seleccionada, hoy, onCambiarMes, onSeleccionar }: Props) {
  const primero = new Date(mes.getFullYear(), mes.getMonth(), 1);
  const diasEnMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const desplazamiento = (primero.getDay() + 6) % 7; // lunes primero

  const celdas: (Date | null)[] = [
    ...Array.from({ length: desplazamiento }, () => null),
    ...Array.from(
      { length: diasEnMes },
      (_, i) => new Date(mes.getFullYear(), mes.getMonth(), i + 1),
    ),
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Mes anterior"
          onClick={() => onCambiarMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="text-base font-semibold capitalize">
          {mes.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          aria-label="Mes siguiente"
          onClick={() => onCambiarMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DIAS.map((dia, i) => (
          <span key={`${dia}-${i}`} className="py-1 text-xs font-medium text-muted-foreground">
            {dia}
          </span>
        ))}

        {celdas.map((fecha, indice) => {
          if (!fecha) return <span key={`vacio-${indice}`} />;
          const activa = esMismoDia(fecha, seleccionada);
          const esHoy = esMismoDia(fecha, hoy);
          const total = tareasDelDia(fecha).length;

          return (
            <button
              key={claveFecha(fecha)}
              type="button"
              onClick={() => onSeleccionar(fecha)}
              aria-current={activa ? "date" : undefined}
              className={[
                "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition",
                activa
                  ? "bg-primary font-semibold text-primary-foreground"
                  : esHoy
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground hover:bg-muted",
              ].join(" ")}
            >
              {fecha.getDate()}
              {total > 0 ? (
                <span
                  className={[
                    "mt-0.5 h-1.5 w-1.5 rounded-full",
                    activa ? "bg-primary-foreground" : "bg-primary/50",
                  ].join(" ")}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}