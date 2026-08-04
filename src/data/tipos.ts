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
  /** Ficha de la sección general de la que procede esta tarea. */
  origen?: { seccion: string; fichaId: string };
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
  /** Imagen del medicamento (URL o imagen subida). */
  imagen?: string;
}

export interface Ficha {
  id: string;
  titulo: string;
  /** Emoji, texto corto o URL de imagen que representa la ficha. */
  icono?: string;
  resumen: string;
  frecuencia: string;
  duracion?: string;
  pasos: string[];
  precauciones?: string[];
  videoYoutube?: string;
  /** Tipo de ficha, usado para agrupar (por ejemplo en Ejercicios). */
  tipo?: string;
  /** Dispositivo de material asociado (ejercicio respiratorio). */
  dispositivo?: string;
}

export interface Info {
  id: string;
  titulo: string;
  /** Emoji, texto corto o URL de imagen que representa la ficha. */
  icono?: string;
  /** Tipo de información: casa, material o familia. */
  tipo?: string;
  /** Tipo de material (solo si tipo = "material"). */
  material?: string;
  /** Ubicación del material (solo si tipo = "material"). */
  ubicacion?: string;
  detalle: string;
  notas?: string[];
  /** Imágenes que se muestran al abrir la ficha. */
  imagenes?: string[];
}

export interface Contacto {
  id: string;
  nombre: string;
  /** Emoji, texto corto o URL de imagen que representa el contacto. */
  icono?: string;
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