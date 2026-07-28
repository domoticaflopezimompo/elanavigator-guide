import type { Categoria, Franja, Tarea } from "@/data/tipos";
import { tareas } from "@/data/tareas";

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

export function tareasDelDia(fecha: Date): Tarea[] {
  const clave = claveFecha(fecha);
  const diaSemana = fecha.getDay();

  return tareas
    .filter((tarea) => {
      const r = tarea.recurrencia;
      if (r.tipo === "diaria") return true;
      if (r.tipo === "semanal") return r.dias.includes(diaSemana);
      return r.fechas.includes(clave);
    })
    .sort((a, b) => (a.hora ?? "").localeCompare(b.hora ?? ""));
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