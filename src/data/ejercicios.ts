import type { Ficha } from "./tipos";

/** EDITA AQUÍ las fichas de ejercicios. */
export const ejercicios: Ficha[] = [
  {
    id: "movilidad-superior",
    tipo: "muscular",
    titulo: "Movilidad pasiva de miembro superior",
    resumen: "Recorrido articular de dedos, muñeca, codo y hombro para evitar rigidez.",
    frecuencia: "Todos los días, por la mañana",
    duracion: "10 min",
    pasos: [
      "Coge la mano y abre y cierra los dedos suavemente, 10 veces.",
      "Flexiona y extiende la muñeca, y haz círculos lentos en ambos sentidos.",
      "Flexiona y extiende el codo sujetando brazo y antebrazo.",
      "Eleva el brazo hacia delante hasta donde llegue sin dolor, 10 veces.",
    ],
    precauciones: [
      "No superar los 90º de hombro si hay dolor.",
      "Nunca tirar de la mano o los dedos para movilizar el brazo.",
    ],
    videoYoutube: "3JQCTdbdhrE",
  },
  {
    id: "movilidad-inferior",
    tipo: "muscular",
    titulo: "Movilidad pasiva de miembro inferior",
    resumen: "Cadera, rodilla y tobillo para prevenir contracturas y trombosis.",
    frecuencia: "Todos los días",
    duracion: "10 min",
    pasos: [
      "Flexiona la cadera y la rodilla llevando la rodilla hacia el pecho, 10 veces.",
      "Separa y junta la pierna manteniéndola estirada, 10 veces.",
      "Haz círculos con el tobillo y flexiona el pie hacia arriba, manteniendo 20 segundos.",
    ],
    precauciones: [
      "Si una pierna está hinchada, caliente o dolorosa, no movilices y avisa al médico.",
    ],
    videoYoutube: "3JQCTdbdhrE",
  },
  {
    id: "respiratorio",
    tipo: "respiratorio",
    titulo: "Ejercicio respiratorio y air stacking",
    resumen: "Mantiene la expansión pulmonar y facilita una tos eficaz.",
    frecuencia: "1-2 veces al día",
    duracion: "10 min",
    pasos: [
      "Colocar al paciente a 45º.",
      "Insuflar con el ambú acumulando aire (3 series de 5 insuflaciones).",
      "Tras la última, pedir tos aplicando presión abdominal ascendente.",
      "Descansar 1 minuto entre series.",
    ],
    precauciones: ["No realizar en la hora siguiente a las comidas."],
    videoYoutube: "cRgLg1o1u5c",
  },
  {
    id: "transferencias",
    tipo: "muscular",
    titulo: "Transferencia cama - silla con grúa",
    resumen: "Técnica segura para el paciente y para la espalda del cuidador.",
    frecuencia: "Cada vez que se levanta",
    pasos: [
      "Coloca el arnés con el paciente de lado, centrado con la columna.",
      "Engancha las cintas: las cortas arriba, las largas en las piernas.",
      "Eleva despacio y comprueba que el arnés sujeta bien antes de separar de la cama.",
      "Desplaza la grúa con el paciente lo más bajo posible.",
    ],
    precauciones: [
      "Nunca hagas la transferencia solo si el paciente no colabora.",
      "Frena siempre las ruedas de la silla antes de descender.",
    ],
  },
  {
    id: "estiramientos",
    tipo: "muscular",
    titulo: "Estiramientos de cuello y espalda",
    resumen: "Alivia la tensión cervical por la debilidad de la musculatura del cuello.",
    frecuencia: "Tarde, días alternos",
    duracion: "8 min",
    pasos: [
      "Sujeta la cabeza con ambas manos y llévala suavemente hacia un lado, 20 segundos.",
      "Repite hacia el otro lado y hacia delante.",
      "Masaje suave de trapecios sin presionar la columna.",
    ],
    precauciones: ["Movimientos muy lentos: la musculatura cervical está debilitada."],
  },
];