import type { Contacto, Protocolo } from "./tipos";

/** EDITA AQUÍ los teléfonos reales. */
export const contactos: Contacto[] = [
  {
    id: "emergencias",
    nombre: "Emergencias",
    rol: "112",
    telefono: "112",
    nota: "Atragantamiento, parada respiratoria, pérdida de conciencia.",
    urgente: true,
  },
  {
    id: "neumologia",
    nombre: "Neumología / Unidad respiratoria",
    rol: "Ventilación y secreciones",
    telefono: "+34 900 000 001",
    nota: "Problemas con el ventilador, saturación baja, secreciones que no se movilizan.",
    urgente: true,
  },
  {
    id: "enfermeria",
    nombre: "Enfermera de referencia ELA",
    rol: "Seguimiento diario",
    telefono: "+34 900 000 002",
    nota: "Dudas de medicación, sondas, curas y material.",
  },
  {
    id: "medico",
    nombre: "Médico de familia",
    rol: "Centro de salud",
    telefono: "+34 900 000 003",
    nota: "Recetas, bajas y visitas a domicilio.",
  },
  {
    id: "neurologia",
    nombre: "Neurología",
    rol: "Hospital de referencia",
    telefono: "+34 900 000 004",
  },
  {
    id: "familia",
    nombre: "Familiar responsable",
    rol: "Primera llamada tras el 112",
    telefono: "+34 600 000 000",
  },
  {
    id: "tecnico",
    nombre: "Servicio técnico del ventilador",
    rol: "Empresa de oxigenoterapia, 24 h",
    telefono: "+34 900 000 005",
    nota: "Avería del equipo, alarmas persistentes, recambios.",
  },
];

export const protocolos: Protocolo[] = [
  {
    id: "atragantamiento",
    situacion: "Atragantamiento",
    pasos: [
      "Incorpora al paciente y anima a toser si puede.",
      "Si no expulsa y no respira: llama al 112 en manos libres.",
      "Aspira secreciones y aplica tos asistida con el ambú.",
      "No introduzcas los dedos a ciegas en la boca.",
    ],
  },
  {
    id: "disnea",
    situacion: "Dificultad para respirar",
    pasos: [
      "Incorpora el cabecero a 45-60º y afloja la ropa.",
      "Coloca la ventilación no invasiva y comprueba fugas.",
      "Mide la saturación: si baja de 92% y no remonta en 5 minutos, llama a neumología.",
      "Si empeora rápido o hay confusión, llama al 112.",
    ],
  },
  {
    id: "fallo-equipo",
    situacion: "Fallo del ventilador o del aspirador",
    pasos: [
      "Retira la mascarilla y ventila con el ambú.",
      "Conecta la batería de reserva o el equipo secundario.",
      "Llama al servicio técnico 24 h.",
      "Si no puedes ventilar de forma eficaz, llama al 112.",
    ],
  },
  {
    id: "caida",
    situacion: "Caída",
    pasos: [
      "No levantes al paciente solo ni de forma brusca.",
      "Comprueba consciencia, respiración y posibles golpes en la cabeza.",
      "Si hay dolor intenso, deformidad o golpe en la cabeza, llama al 112.",
      "Si está bien, levanta con grúa o entre dos personas.",
    ],
  },
];