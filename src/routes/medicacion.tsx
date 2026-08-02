import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Clock, Plus, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagina } from "@/components/Pagina";
import { Acciones } from "@/components/Acciones";
import { SelectorImagen } from "@/components/SelectorImagen";
import { EditorDialogo, type Campo, type Valores } from "@/components/EditorDialogo";
import { useColeccion } from "@/hooks/use-coleccion";
import { CATEGORIAS } from "@/lib/agenda";
import { medicacion } from "@/data/medicacion";
import type { Medicamento } from "@/data/tipos";

const TITULO = "Medicación — Cuidados ELA";
const DESCRIPCION =
  "Pauta de medicación completa: fármaco, dosis, vía, horarios, si va con comida y qué hacer si se olvida una toma.";

export const Route = createFileRoute("/medicacion")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: MedicacionPage,
});

const COMIDA = {
  con: "Con comida",
  sin: "En ayunas",
  indiferente: "Indiferente",
} as const;

const CAMPOS: Campo[] = [
  { nombre: "nombre", etiqueta: "Fármaco", tipo: "texto" },
  { nombre: "para", etiqueta: "Para qué es", tipo: "texto" },
  { nombre: "dosis", etiqueta: "Dosis", tipo: "texto", marcador: "1 comprimido de 50 mg" },
  { nombre: "via", etiqueta: "Vía", tipo: "texto", marcador: "Oral / PEG / subcutánea" },
  {
    nombre: "horarios",
    etiqueta: "Horarios",
    tipo: "lista",
    ayuda: "Una hora por línea (08:00).",
  },
  {
    nombre: "conComida",
    etiqueta: "Con comida",
    tipo: "select",
    opciones: [
      { valor: "indiferente", etiqueta: "Indiferente" },
      { valor: "con", etiqueta: "Con comida" },
      { valor: "sin", etiqueta: "En ayunas" },
    ],
  },
  { nombre: "notas", etiqueta: "Notas", tipo: "area" },
  { nombre: "siSeOlvida", etiqueta: "Si se olvida una toma", tipo: "area" },
];

const VACIO: Valores = {
  nombre: "",
  para: "",
  dosis: "",
  via: "",
  horarios: [],
  conComida: "indiferente",
  notas: "",
  siSeOlvida: "",
};

function aValores(med: Medicamento): Valores {
  return {
    nombre: med.nombre,
    para: med.para,
    dosis: med.dosis,
    via: med.via,
    horarios: med.horarios,
    conComida: med.conComida,
    notas: med.notas ?? "",
    siSeOlvida: med.siSeOlvida,
  };
}

function MedicacionPage() {
  const { items, crear, actualizar, eliminar, mover } = useColeccion<Medicamento>(
    "medicacion",
    medicacion,
  );
  const [editando, setEditando] = useState<Medicamento | null>(null);
  const [creando, setCreando] = useState(false);

  const guardar = (valores: Valores) => {
    const base = {
      nombre: (valores.nombre as string).trim() || "Sin nombre",
      para: valores.para as string,
      dosis: valores.dosis as string,
      via: valores.via as string,
      horarios: (valores.horarios as string[]).map((linea) => linea.trim()).filter(Boolean),
      conComida: valores.conComida as Medicamento["conComida"],
      notas: (valores.notas as string).trim() || undefined,
      siSeOlvida: valores.siSeOlvida as string,
    };
    if (editando) actualizar({ ...editando, ...base });
    else crear(base);
  };

  return (
    <Pagina
      titulo="Medicación"
      descripcion="Comprueba siempre el fármaco, la dosis y la hora antes de administrar. Anota cada toma en la hoja de seguimiento."
      accion={
        <Button
          onClick={() => {
            setEditando(null);
            setCreando(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Añadir medicamento
        </Button>
      }
    >
      <div className="border-destructive/25 bg-destructive/5 mb-6 flex gap-3 rounded-2xl border p-4">
        <AlertTriangle className="text-destructive h-5 w-5 shrink-0" />
        <p className="text-base">
          No tritures ningún comprimido sin confirmarlo antes con la enfermera de referencia:
          algunos pierden efecto o irritan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((med, indice) => (
          <article key={med.id} className="border-border bg-card rounded-2xl border p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORIAS.medicacion.clase}`}
                >
                  {CATEGORIAS.medicacion.etiqueta}
                </span>
                <h2 className="text-card-foreground text-lg font-semibold">{med.nombre}</h2>
                <p className="text-muted-foreground mt-0.5 text-sm">{med.para}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Acciones
                  nombre={med.nombre}
                  onSubir={() => mover(med.id, -1)}
                  onBajar={() => mover(med.id, 1)}
                  puedeSubir={indice > 0}
                  puedeBajar={indice < items.length - 1}
                  onEditar={() => {
                    setCreando(false);
                    setEditando(med);
                  }}
                  onEliminar={() => eliminar(med.id)}
                />
                <SelectorImagen
                  valor={med.imagen}
                  nombre={med.nombre}
                  onCambiar={(imagen) => actualizar({ ...med, imagen })}
                />
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-base">
              <div className="flex gap-2">
                <dt className="text-muted-foreground w-24 shrink-0">Dosis</dt>
                <dd className="font-medium">{med.dosis}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground w-24 shrink-0">Vía</dt>
                <dd>{med.via}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {med.horarios.map((hora) => (
                <span
                  key={hora}
                  className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
                >
                  <Clock className="h-3.5 w-3.5" />
                  {hora}
                </span>
              ))}
              <span className="bg-muted text-muted-foreground flex items-center gap-1 rounded-full px-3 py-1 text-sm">
                <Utensils className="h-3.5 w-3.5" />
                {COMIDA[med.conComida]}
              </span>
            </div>

            {med.notas ? <p className="mt-4 text-sm leading-relaxed">{med.notas}</p> : null}

            {med.siSeOlvida ? (
              <p className="bg-muted mt-3 rounded-xl p-3 text-sm leading-relaxed">
                <span className="font-semibold">Si se olvida: </span>
                {med.siSeOlvida}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center">
          No hay medicamentos. Pulsa «Añadir medicamento».
        </p>
      ) : null}

      <EditorDialogo
        abierto={creando || editando !== null}
        onOpenChange={(valor) => {
          if (!valor) {
            setCreando(false);
            setEditando(null);
          }
        }}
        titulo={editando ? "Editar medicamento" : "Nuevo medicamento"}
        campos={CAMPOS}
        valores={editando ? aValores(editando) : VACIO}
        onGuardar={guardar}
      />
    </Pagina>
  );
}
