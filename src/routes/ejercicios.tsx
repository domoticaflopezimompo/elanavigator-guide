import { createFileRoute } from "@tanstack/react-router";
import { SeccionFichas } from "@/components/SeccionFichas";
import { ejercicios } from "@/data/ejercicios";
import { informacion } from "@/data/informacion";
import { useColeccion } from "@/hooks/use-coleccion";
import type { Campo, Valores } from "@/components/EditorDialogo";
import type { Info } from "@/data/tipos";

const TITULO = "Ejercicios y movilidad — Cuidados ELA";
const DESCRIPCION =
  "Fichas de movilidad pasiva, ejercicio respiratorio y transferencias seguras, con pasos e instrucciones en vídeo.";

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
  const { items: infos } = useColeccion<Info>("informacion", informacion);

  const materiales = infos.filter((info) => info.tipo === "material");

  const extras = (estado: Valores): Campo[] =>
    estado.tipo === "respiratorio"
      ? [
          {
            nombre: "dispositivo",
            etiqueta: "Dispositivo",
            tipo: "select",
            ayuda: "Material de la sección Información › Material.",
            opciones: [
              { valor: "", etiqueta: "Sin dispositivo" },
              ...materiales.map((info) => ({ valor: info.titulo, etiqueta: info.titulo })),
            ],
          },
        ]
      : [];

  return (
    <SeccionFichas
      titulo="Ejercicios"
      descripcion="Movilidad, respiración y transferencias. Pulsa una ficha para ver los pasos y el vídeo."
      clave="ejercicios"
      iniciales={ejercicios}
      extras={extras}
      grupos={[
        {
          valor: "muscular",
          etiqueta: "Ejercicio muscular",
          descripcion: "Movilidad articular, estiramientos y transferencias seguras.",
        },
        {
          valor: "respiratorio",
          etiqueta: "Ejercicio respiratorio",
          descripcion: "Expansión pulmonar, tos asistida y manejo de secreciones.",
        },
      ]}
    />
  );
}
