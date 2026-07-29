import type { Ficha } from "./tipos";

/** EDITA AQUÍ las fichas de cuidados diarios del paciente. */
export const cuidados: Ficha[] = [
  {
    id: "aspiracion-secreciones",
    titulo: "Limpieza de mocos y secreciones",
    resumen:
      "Ayuda a sacar las secreciones de la boca y la garganta cuando la tos no es eficaz.",
    frecuencia: "Cuando haya ruido de secreciones o antes de comer y dormir",
    duracion: "5 min",
    pasos: [
      "Lávate las manos y ponte guantes limpios.",
      "Incorpora al paciente a unos 45º y explícale lo que vas a hacer.",
      "Si se usa aspirador, conecta una sonda nueva y comprueba la presión.",
      "Introduce la sonda sin aspirar; aspira solo al sacarla, con movimientos suaves.",
      "No aspires más de 10-15 segundos seguidos; deja descansar entre intentos.",
      "Limpia la boca y los labios y ofrece hidratación si puede tragar.",
    ],
    precauciones: [
      "Para si aparece color azulado, sangrado o mucha agitación y avisa al equipo médico.",
      "Nunca reutilices una sonda de un día para otro.",
    ],
    videoYoutube: "",
  },
  {
    id: "higiene-ocular",
    titulo: "Higiene de los ojos",
    resumen: "Limpieza e hidratación ocular para evitar sequedad, legañas e irritación.",
    frecuencia: "Mañana y noche, o cuando haya legañas",
    duracion: "3 min",
    pasos: [
      "Lávate las manos y prepara suero fisiológico y gasas estériles.",
      "Usa una gasa distinta para cada ojo.",
      "Limpia desde el lagrimal hacia fuera, con un solo pase por gasa.",
      "Seca con una gasa limpia sin frotar.",
      "Aplica lágrimas artificiales si están pautadas.",
    ],
    precauciones: [
      "Si el ojo está rojo, con pus o el paciente tiene dolor, consulta al médico.",
      "Nunca uses algodón: deja fibras.",
    ],
    videoYoutube: "",
  },
  {
    id: "higiene-bucal",
    titulo: "Higiene de la boca",
    resumen: "Boca limpia e hidratada para prevenir infecciones y molestias al tragar.",
    frecuencia: "Después de cada comida",
    duracion: "5 min",
    pasos: [
      "Incorpora al paciente y coloca una toalla bajo la barbilla.",
      "Cepilla dientes, encías y lengua con un cepillo suave.",
      "Si no puede enjuagarse, usa torundas humedecidas y retira el exceso.",
      "Hidrata los labios con vaselina o crema labial.",
    ],
    precauciones: ["No introduzcas mucho líquido si hay riesgo de atragantamiento."],
    videoYoutube: "",
  },
  {
    id: "cambios-posturales",
    titulo: "Cambios posturales y cuidado de la piel",
    resumen: "Previene úlceras por presión y mejora el descanso.",
    frecuencia: "Cada 2-3 horas durante el día",
    duracion: "10 min",
    pasos: [
      "Avisa al paciente y pide ayuda si el cambio es completo.",
      "Alterna decúbito lateral derecho, boca arriba y lateral izquierdo.",
      "Coloca almohadas entre rodillas, bajo brazos y en la espalda.",
      "Revisa talones, sacro, caderas y codos buscando zonas rojas.",
      "Aplica crema hidratante o ácidos grasos sin masajear las rojeces.",
    ],
    precauciones: [
      "No arrastres la piel al mover: levanta con la sábana.",
      "Si una zona roja no desaparece al retirar la presión, avísalo.",
    ],
    videoYoutube: "",
  },
  {
    id: "aseo-diario",
    titulo: "Aseo diario en la cama",
    resumen: "Higiene corporal completa manteniendo intimidad y temperatura.",
    frecuencia: "Todos los días",
    duracion: "20 min",
    pasos: [
      "Prepara todo antes: agua templada, jabón, toallas y ropa limpia.",
      "Cierra ventanas y descubre solo la zona que estés lavando.",
      "Lava de arriba abajo: cara, brazos, tronco, piernas y por último zona genital.",
      "Seca bien pliegues y entre los dedos.",
      "Viste con ropa cómoda y sin costuras que aprieten.",
    ],
    precauciones: ["Comprueba siempre la temperatura del agua en tu antebrazo."],
    videoYoutube: "",
  },
];
