import type { Ficha } from "./tipos";

/** EDITA AQUÍ las fichas de logopedia y pautas de deglución. */
export const logopedia: Ficha[] = [
  {
    id: "praxias",
    titulo: "Praxias orofaciales",
    resumen: "Ejercicios de labios, lengua y mejillas para mantener la articulación.",
    frecuencia: "De lunes a viernes",
    duracion: "10 min",
    pasos: [
      "Sacar la lengua y mantenerla fuera 5 segundos. 10 repeticiones.",
      "Llevar la lengua a cada comisura de los labios, 10 veces.",
      "Inflar las mejillas y aguantar el aire 5 segundos.",
      "Sonrisa amplia alternando con morro fruncido, 10 veces.",
    ],
    precauciones: ["Parar si aparece fatiga: es preferible menos repeticiones bien hechas."],
    videoYoutube: "9jm5pTk1WgM",
  },
  {
    id: "voz",
    titulo: "Ejercicios de voz y respiración",
    resumen: "Trabaja la potencia vocal y el control del aire al hablar.",
    frecuencia: "Diario",
    duracion: "8 min",
    pasos: [
      "Inspirar por la nariz contando hasta 4 y soltar por la boca contando hasta 6.",
      "Sostener cada vocal 5 segundos con voz cómoda, sin forzar.",
      "Leer en voz alta una frase corta por respiración.",
    ],
    precauciones: ["No gritar ni forzar la voz: aumenta la fatiga."],
  },
  {
    id: "deglucion",
    titulo: "Pautas de deglución segura",
    resumen: "Reglas básicas en cada comida para evitar atragantamientos.",
    frecuencia: "En todas las comidas",
    pasos: [
      "Sentado a 90º, barbilla ligeramente hacia el pecho.",
      "Texturas homogéneas: puré fino, sin grumos ni tropezones.",
      "Líquidos siempre con espesante, consistencia miel.",
      "Cucharas pequeñas y comprobar que ha tragado antes de la siguiente.",
      "Permanecer incorporado 30 minutos después de comer.",
    ],
    precauciones: [
      "Señales de alarma: tos al tragar, voz húmeda, fiebre sin causa clara.",
      "Nunca dar de comer si el paciente está somnoliento.",
    ],
  },
  {
    id: "comunicacion",
    titulo: "Comunicación alternativa",
    resumen: "Cómo usar el tablero de letras y la tablet con pulsador.",
    frecuencia: "Siempre disponible",
    pasos: [
      "Colocar el tablero a la altura de los ojos y a un brazo de distancia.",
      "Hacer preguntas cerradas cuando la fatiga es alta (sí / no).",
      "Dar tiempo: no completar las frases por él o ella.",
      "Comprobar cada mañana que la tablet está cargada y el pulsador bien colocado.",
    ],
    precauciones: ["Evitar el ruido de fondo y hablar de frente, a su altura."],
  },
];