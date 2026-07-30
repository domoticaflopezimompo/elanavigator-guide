import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagina } from "@/components/Pagina";
import { Acciones } from "@/components/Acciones";
import { EditorDialogo, type Campo, type Valores } from "@/components/EditorDialogo";
import { useColeccion } from "@/hooks/use-coleccion";
import { informacion } from "@/data/informacion";
import type { Info } from "@/data/tipos";

const TITULO = "Información de la casa — Cuidados ELA";
const DESCRIPCION =
  "Todo lo práctico de la casa: acceso y llaves, wifi, dónde está el material, rutinas y avisos para el equipo de cuidados.";

export const Route = createFileRoute("/informacion")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InformacionPage,
});

const CAMPOS: Campo[] = [
  { nombre: "titulo", etiqueta: "Título", tipo: "texto", marcador: "Wifi" },
  { nombre: "detalle", etiqueta: "Información", tipo: "area" },
  {
    nombre: "notas",
    etiqueta: "Notas",
    tipo: "lista",
    ayuda: "Una nota por línea. Puede quedar vacío.",
  },
];

const VACIO: Valores = { titulo: "", detalle: "", notas: [] };

function aValores(info: Info): Valores {
  return { titulo: info.titulo, detalle: info.detalle, notas: info.notas ?? [] };
}

function InformacionPage() {
  const { items, crear, actualizar, eliminar, mover } = useColeccion<Info>(
    "informacion",
    informacion,
  );
  const [editando, setEditando] = useState<Info | null>(null);
  const [creando, setCreando] = useState(false);

  const guardar = (valores: Valores) => {
    const base = {
      titulo: (valores.titulo as string).trim() || "Sin título",
      detalle: valores.detalle as string,
      notas: (valores.notas as string[]).map((linea) => linea.trim()).filter(Boolean),
    };
    if (editando) actualizar({ ...editando, ...base });
    else crear(base);
  };

  return (
    <Pagina
      titulo="Información"
      descripcion="Información práctica de la casa para cualquier persona que venga a cuidar."
      accion={
        <Button
          onClick={() => {
            setEditando(null);
            setCreando(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Añadir información
        </Button>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2">
        {items.map((info, indice) => (
          <article
            key={info.id}
            className="border-border bg-card hover:border-primary/40 relative flex flex-col gap-3 rounded-2xl border p-5 transition hover:shadow-sm"
          >
            <div className="absolute top-3 right-3">
              <Acciones
                nombre={info.titulo}
                onSubir={() => mover(info.id, -1)}
                onBajar={() => mover(info.id, 1)}
                puedeSubir={indice > 0}
                puedeBajar={indice < items.length - 1}
                onEditar={() => {
                  setCreando(false);
                  setEditando(info);
                }}
                onEliminar={() => eliminar(info.id)}
              />
            </div>
            <h2 className="flex items-center gap-2 pr-36 text-lg font-semibold">
              <span className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                <Home className="h-4 w-4" />
              </span>
              {info.titulo}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">{info.detalle}</p>
            {info.notas && info.notas.length > 0 ? (
              <ul className="space-y-1.5 text-base">
                {info.notas.map((nota) => (
                  <li key={nota} className="flex gap-2">
                    <span aria-hidden className="text-primary">
                      •
                    </span>
                    <span>{nota}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>

      {items.length === 0 ? (
        <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center">
          No hay información todavía. Pulsa «Añadir información».
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
        titulo={editando ? "Editar información" : "Nueva información"}
        campos={CAMPOS}
        valores={editando ? aValores(editando) : VACIO}
        onGuardar={guardar}
      />
    </Pagina>
  );
}