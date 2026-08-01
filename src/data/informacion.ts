import type { Info } from "./tipos";

/** EDITA AQUÍ la información de la casa. */
export const informacion: Info[] = [
  {
    id: "acceso",
    titulo: "Acceso a la casa",
    tipo: "casa",
    icono: "🔑",
    detalle:
      "Portal con videoportero. Las llaves de repuesto están en el cajón de la entrada, dentro de la caja azul.",
    notas: ["Código del portal: pídelo a la familia.", "El ascensor entra la silla de ruedas."],
  },
  {
    id: "wifi",
    titulo: "Wifi",
    tipo: "casa",
    icono: "📶",
    detalle: "Red: CASA-ELA. La contraseña está pegada debajo del router, en el salón.",
  },
  {
    id: "material",
    titulo: "Dónde está el material",
    tipo: "casa",
    icono: "📦",
    detalle:
      "Aspirador y sondas en la mesilla de la habitación. Ambú y mascarillas en el armario blanco. Pañales, empapadores y guantes en el altillo del baño.",
    notas: ["Repón lo que gastes y avisa cuando quede poco."],
  },
  {
    id: "rutina-casa",
    titulo: "Rutina de la casa",
    tipo: "casa",
    icono: "🕘",
    detalle:
      "Desayuno sobre las 9:00, comida a las 14:00 y cena a las 21:00. Persianas arriba por la mañana y ventilar la habitación 10 minutos.",
  },
  {
    id: "avisos",
    titulo: "Avisos importantes",
    tipo: "casa",
    icono: "⚠️",
    detalle:
      "El ventilador y el aspirador van siempre enchufados a la regleta con batería, nunca a la del salón.",
    notas: ["No cambiar los parámetros del ventilador.", "Anotar cualquier incidencia en el turno."],
  },
  {
    id: "aspirador",
    titulo: "Aspirador de secreciones",
    tipo: "material",
    material: "respiratorio",
    icono: "🫁",
    detalle:
      "En la mesilla de la habitación, con sondas de recambio en el cajón. Vaciar y limpiar el vaso después de cada uso.",
  },
  {
    id: "ambu",
    titulo: "Ambú y mascarillas",
    tipo: "material",
    material: "respiratorio",
    icono: "🎈",
    detalle: "Armario blanco de la habitación. Comprobar que la válvula funciona una vez por semana.",
  },
  {
    id: "grua",
    titulo: "Grúa de transferencias",
    tipo: "material",
    material: "muscular",
    icono: "🛠️",
    detalle: "Plegada junto al armario. Cargar la batería cada noche.",
  },
  {
    id: "higiene-material",
    titulo: "Material de higiene",
    tipo: "material",
    material: "higiene",
    icono: "🧼",
    detalle: "Pañales, empapadores, guantes y esponjas en el altillo del baño.",
  },
  {
    id: "familia-referencia",
    titulo: "Familiar de referencia",
    tipo: "familia",
    icono: "👨‍👩‍👦",
    detalle:
      "La hija coordina los turnos y las compras. Avisar de cualquier incidencia al terminar el turno.",
  },
];