import { createFileRoute } from "@tanstack/react-router";
import { SeccionFichas } from "@/components/SeccionFichas";
import { logopedia } from "@/data/logopedia";

const TITULO = "Logopedia y deglución — Cuidados ELA";
const DESCRIPCION =
  "Ejercicios de voz y praxias, pautas de deglución segura y comunicación alternativa, con instrucciones y vídeo.";

export const Route = createFileRoute("/logopedia")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: LogopediaPage,
});

function LogopediaPage() {
  return (
    <SeccionFichas
      titulo="Logopedia"
      descripcion="Voz, articulación y alimentación segura. Pulsa una ficha para ver los pasos y el vídeo."
      clave="logopedia"
      iniciales={logopedia}
    />
  );
}
