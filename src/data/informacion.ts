import type { Info } from "./tipos";

/** EDITA AQUÍ la información de la casa. */
export const informacion: Info[] = [
  {
    id: "acceso",
    titulo: "Acceso a la casa",
    detalle:
      "Portal con videoportero. Las llaves de repuesto están en el cajón de la entrada, dentro de la caja azul.",
    notas: ["Código del portal: pídelo a la familia.", "El ascensor entra la silla de ruedas."],
  },
  {
    id: "wifi",
    titulo: "Wifi",
    detalle: "Red: CASA-ELA. La contraseña está pegada debajo del router, en el salón.",
  },
  {
    id: "material",
    titulo: "Dónde está el material",
    detalle:
      "Aspirador y sondas en la mesilla de la habitación. Ambú y mascarillas en el armario blanco. Pañales, empapadores y guantes en el altillo del baño.",
    notas: ["Repón lo que gastes y avisa cuando quede poco."],
  },
  {
    id: "rutina-casa",
    titulo: "Rutina de la casa",
    detalle:
      "Desayuno sobre las 9:00, comida a las 14:00 y cena a las 21:00. Persianas arriba por la mañana y ventilar la habitación 10 minutos.",
  },
  {
    id: "avisos",
    titulo: "Avisos importantes",
    detalle:
      "El ventilador y el aspirador van siempre enchufados a la regleta con batería, nunca a la del salón.",
    notas: ["No cambiar los parámetros del ventilador.", "Anotar cualquier incidencia en el turno."],
  },
];