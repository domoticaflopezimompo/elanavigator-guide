export type Categoria =
  | "medicacion"
  | "ejercicio"
  | "logopedia"
  | "higiene"
  | "comida"
  | "respiracion";

export type Franja = "manana" | "mediodia" | "tarde" | "noche";

/**
 * Recurrencia de una tarea:
 * - { tipo: "diaria" }                      -> todos los días
 * - { tipo: "semanal", dias: [1,3,5] }      -> 0 = domingo ... 6 = sábado
 * - { tipo: "fecha", fechas: ["2026-08-03"] } -> días concretos (YYYY-MM-DD)
 */
export type Recurrencia =
  | { tipo: "diaria" }
  | { tipo: "semanal"; dias: number[] }
  | { tipo: "fecha"; fechas: string[] };

export interface Tarea {
  id: string;
  titulo: string;
  categoria: Categoria;
  franja: Franja;
  hora?: string;
  resumen: string;
  /** Pasos a seguir, en orden. */
  pasos: string[];
  /** Avisos importantes que el cuidador debe tener presentes. */
  avisos?: string[];
  /** ID del vídeo de YouTube (solo el ID, no la URL completa). */
  videoYoutube?: string;
  duracion?: string;
  recurrencia: Recurrencia;
}

export interface Medicamento {
  id: string;
  nombre: string;
  dosis: string;
  via: string;
  horarios: string[];
  conComida: "con" | "sin" | "indiferente";
  para: string;
  notas?: string;
  siSeOlvida: string;
}

export interface Ficha {
  id: string;
  titulo: string;
  resumen: string;
  frecuencia: string;
  duracion?: string;
  pasos: string[];
  precauciones?: string[];
  videoYoutube?: string;
}

export interface Contacto {
  id: string;
  nombre: string;
  rol: string;
  telefono: string;
  nota?: string;
  urgente?: boolean;
}

export interface Protocolo {
  id: string;
  situacion: string;
  pasos: string[];
}