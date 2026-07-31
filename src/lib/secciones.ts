import type { Categoria, Ficha, Medicamento } from "@/data/tipos";
import { cuidados } from "@/data/cuidados";
import { ejercicios } from "@/data/ejercicios";
import { logopedia } from "@/data/logopedia";
import { medicacion } from "@/data/medicacion";

/** Ficha normalizada para poder elegirla desde las tareas del día. */
export interface FichaSeccion {
  id: string;
  titulo: string;
  resumen: string;
  pasos: string[];
  avisos: string[];
  videoYoutube?: string;
  duracion?: string;
  categoria: Categoria;
  tipo?: string;
}

export interface Seccion {
  clave: string;
  etiqueta: string;
  categoria: Categoria;
}

export const SECCIONES: Seccion[] = [
  { clave: "medicacion", etiqueta: "Medicación", categoria: "medicacion" },
  { clave: "cuidados", etiqueta: "Cuidados", categoria: "higiene" },
  { clave: "ejercicios", etiqueta: "Ejercicios", categoria: "ejercicio" },
  { clave: "logopedia", etiqueta: "Logopedia", categoria: "logopedia" },
];

export const INICIALES: Record<string, unknown[]> = {
  medicacion,
  cuidados,
  ejercicios,
  logopedia,
};

/** Categoría (y por tanto color) de una ficha según su sección y su tipo. */
export function categoriaDe(seccion: string, tipo?: string): Categoria {
  if (seccion === "ejercicios") return tipo === "respiratorio" ? "respiracion" : "ejercicio";
  const encontrada = SECCIONES.find((item) => item.clave === seccion);
  return encontrada?.categoria ?? "higiene";
}

function deMedicamento(medicamento: Medicamento): FichaSeccion {
  return {
    id: medicamento.id,
    titulo: medicamento.nombre,
    resumen: `${medicamento.dosis} · ${medicamento.via} — ${medicamento.para}`,
    pasos: [
      `Dosis: ${medicamento.dosis} (${medicamento.via}).`,
      `Horarios: ${medicamento.horarios.join(", ")}.`,
      medicamento.notas ?? "",
    ].filter(Boolean),
    avisos: [`Si se olvida: ${medicamento.siSeOlvida}`],
    categoria: "medicacion",
  };
}

function deFicha(ficha: Ficha, seccion: string): FichaSeccion {
  return {
    id: ficha.id,
    titulo: ficha.titulo,
    resumen: ficha.resumen,
    pasos: ficha.pasos,
    avisos: ficha.precauciones ?? [],
    videoYoutube: ficha.videoYoutube,
    duracion: ficha.duracion,
    categoria: categoriaDe(seccion, ficha.tipo),
    tipo: ficha.tipo,
  };
}

/** Normaliza los elementos de una colección a fichas seleccionables. */
export function normalizar(seccion: string, items: unknown[]): FichaSeccion[] {
  if (seccion === "medicacion") return (items as Medicamento[]).map(deMedicamento);
  return (items as Ficha[]).map((ficha) => deFicha(ficha, seccion));
}
