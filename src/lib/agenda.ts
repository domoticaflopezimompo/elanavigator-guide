import type { Categoria, Franja, Tarea } from "@/data/tipos";
import { tareas as tareasIniciales } from "@/data/tareas";

export const FRANJAS: { id: Franja; etiqueta: string }[] = [
  { id: "manana", etiqueta: "Mañana" },
  { id: "mediodia", etiqueta: "Mediodía" },
  { id: "tarde", etiqueta: "Tarde" },
  { id: "noche", etiqueta: "Noche" },
];

export const CATEGORIAS: Record<Categoria, { etiqueta: string; clase: string }> = {
  medicacion: { etiqueta: "Medicación", clase: "bg-cat-medicacion/15 text-cat-medicacion" },
  ejercicio: { etiqueta: "Ejercicio", clase: "bg-cat-ejercicio/15 text-cat-ejercicio" },
  logopedia: { etiqueta: "Logopedia", clase: "bg-cat-logopedia/15 text-cat-logopedia" },
  higiene: { etiqueta: "Higiene", clase: "bg-cat-higiene/15 text-cat-higiene" },
  comida: { etiqueta: "Comida", clase: "bg-cat-comida/15 text-cat-comida" },
  respiracion: { etiqueta: "Respiración", clase: "bg-cat-respiracion/15 text-cat-respiracion" },
};

/** Clave YYYY-MM-DD en hora local (no usar toISOString: desplaza el día). */
export function claveFecha(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function tareasDelDia(fecha: Date, lista: Tarea[] = tareasIniciales): Tarea[] {
  const clave = claveFecha(fecha);
  const diaSemana = fecha.getDay();

  // Se respeta el orden manual de la lista (se puede reordenar con las flechas).
  return lista.filter((tarea) => {
    const r = tarea.recurrencia;
    if (r.tipo === "diaria") return true;
    if (r.tipo === "semanal") return r.dias.includes(diaSemana);
    return r.fechas.includes(clave);
  });
}

export function esMismoDia(a: Date, b: Date): boolean {
  return claveFecha(a) === claveFecha(b);
}

export function formatoLargo(fecha: Date): string {
  return fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Minutos desde medianoche de una hora "HH:MM". Null si no es válida. */
export function minutosDeHora(hora?: string): number | null {
  if (!hora) return null;
  const encontrado = /^(\d{1,2}):(\d{2})/.exec(hora.trim());
  if (!encontrado) return null;
  const h = Number(encontrado[1]);
  const m = Number(encontrado[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

/** Minutos desde medianoche de una fecha. */
export function minutosDeFecha(fecha: Date): number {
  return fecha.getHours() * 60 + fecha.getMinutes();
}

/** Hora corta "HH:MM" en formato local. */
export function horaCorta(fecha: Date): string {
  return fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

/** Franja del día a la que pertenece una hora concreta. */
export function franjaDeMinutos(minutos: number): Franja {
  if (minutos >= 5 * 60 && minutos < 12 * 60) return "manana";
  if (minutos < 16 * 60) return "mediodia";
  if (minutos < 21 * 60) return "tarde";
  return "noche";
}

const ORDEN_FRANJA: Franja[] = ["manana", "mediodia", "tarde", "noche"];

/** Compara dos franjas por su orden natural en el día. */
export function indiceFranja(franja: Franja): number {
  return ORDEN_FRANJA.indexOf(franja);
}