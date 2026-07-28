import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock, Utensils } from "lucide-react";
import { Pagina } from "@/components/Pagina";
import { medicacion } from "@/data/medicacion";

const TITULO = "Medicación — Cuidados ELA";
const DESCRIPCION =
  "Pauta de medicación completa: fármaco, dosis, vía, horarios, si va con comida y qué hacer si se olvida una toma.";

export const Route = createFileRoute("/medicacion")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: MedicacionPage,
});

const COMIDA = {
  con: "Con comida",
  sin: "En ayunas",
  indiferente: "Indiferente",
} as const;

function MedicacionPage() {
  return (
    <Pagina
      titulo="Medicación"
      descripcion="Comprueba siempre el fármaco, la dosis y la hora antes de administrar. Anota cada toma en la hoja de seguimiento."
    >
      <div className="mb-6 flex gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
        <p className="text-base">
          No tritures ningún comprimido sin confirmarlo antes con la enfermera de referencia:
          algunos pierden efecto o irritan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {medicacion.map((med) => (
          <article key={med.id} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold text-card-foreground">{med.nombre}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{med.para}</p>

            <dl className="mt-4 space-y-2 text-base">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">Dosis</dt>
                <dd className="font-medium">{med.dosis}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-muted-foreground">Vía</dt>
                <dd>{med.via}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {med.horarios.map((hora) => (
                <span
                  key={hora}
                  className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  <Clock className="h-3.5 w-3.5" />
                  {hora}
                </span>
              ))}
              <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                <Utensils className="h-3.5 w-3.5" />
                {COMIDA[med.conComida]}
              </span>
            </div>

            {med.notas ? <p className="mt-4 text-sm leading-relaxed">{med.notas}</p> : null}

            <p className="mt-3 rounded-xl bg-muted p-3 text-sm leading-relaxed">
              <span className="font-semibold">Si se olvida: </span>
              {med.siSeOlvida}
            </p>
          </article>
        ))}
      </div>
    </Pagina>
  );
}