import { createFileRoute } from "@tanstack/react-router";
import { Pagina } from "@/components/Pagina";
import { FichaCard } from "@/components/FichaCard";
import { ejercicios } from "@/data/ejercicios";

const TITULO = "Ejercicios y movilizaciones — Cuidados ELA";
const DESCRIPCION =
  "Fichas de movilidad pasiva, fisioterapia respiratoria y transferencias seguras, con pasos y vídeo en el popup.";

export const Route = createFileRoute("/ejercicios")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: EjerciciosPage,
});

function EjerciciosPage() {
  return (
    <Pagina
      titulo="Ejercicios"
      descripcion="Pulsa en cualquier ficha para ver el paso a paso y el vídeo. Movimientos lentos y nunca hasta el dolor."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {ejercicios.map((ficha) => (
          <FichaCard key={ficha.id} ficha={ficha} />
        ))}
      </div>
    </Pagina>
  );
}