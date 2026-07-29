import { createFileRoute } from "@tanstack/react-router";
import { SeccionFichas } from "@/components/SeccionFichas";
import { cuidados } from "@/data/cuidados";

const TITULO = "Cuidados diarios del paciente — Cuidados ELA";
const DESCRIPCION =
  "Cómo limpiar mocos y secreciones, higiene de ojos y boca, cambios posturales y aseo diario, paso a paso.";

export const Route = createFileRoute("/cuidados")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: CuidadosPage,
});

function CuidadosPage() {
  return (
    <SeccionFichas
      titulo="Cuidados"
      descripcion="Secreciones, ojos, boca, piel e higiene. Pulsa una ficha para ver los pasos."
      clave="cuidados"
      iniciales={cuidados}
    />
  );
}
