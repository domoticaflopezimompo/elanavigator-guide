import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagina } from "@/components/Pagina";
import { Acciones } from "@/components/Acciones";
import { EditorDialogo, type Campo, type Valores } from "@/components/EditorDialogo";
import { useColeccion } from "@/hooks/use-coleccion";
import { protocolos } from "@/data/contactos";
import type { Protocolo } from "@/data/tipos";

const TITULO = "Protocolos de emergencia — Cuidados ELA";
const DESCRIPCION =
  "Qué hacer ante atragantamiento, dificultad para respirar, fallo del ventilador o caída, paso a paso.";

export const Route = createFileRoute("/emergencias")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: EmergenciasPage,
});

const CAMPOS: Campo[] = [
  { nombre: "situacion", etiqueta: "Situación", tipo: "texto", marcador: "Atragantamiento" },
  { nombre: "pasos", etiqueta: "Pasos", tipo: "lista", ayuda: "Un paso por línea, en orden." },
];

const VACIO: Valores = { situacion: "", pasos: [] };

function EmergenciasPage() {
  const { items, crear, actualizar, eliminar, mover } = useColeccion<Protocolo>(
    "protocolos",
    protocolos,
  );
  const [editando, setEditando] = useState<Protocolo | null>(null);
  const [creando, setCreando] = useState(false);

  const guardar = (valores: Valores) => {
    const base = {
      situacion: (valores.situacion as string).trim() || "Sin título",
      pasos: (valores.pasos as string[]).map((linea) => linea.trim()).filter(Boolean),
    };
    if (editando) actualizar({ ...editando, ...base });
    else crear(base);
  };

  return (
    <Pagina
      titulo="Emergencias"
      descripcion="Mantén la calma y ve por orden. Los teléfonos están en la sección Teléfonos."
      accion={
        <Button
          onClick={() => {
            setEditando(null);
            setCreando(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Añadir protocolo
        </Button>
      }
    >
      <Link
        to="/telefonos"
        className="border-destructive/40 bg-destructive/5 hover:bg-destructive/10 mb-8 flex items-center gap-4 rounded-2xl border p-5 transition"
      >
        <span className="bg-destructive text-destructive-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
          <Phone className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-lg font-semibold">Ir a los teléfonos</span>
          <span className="text-muted-foreground block text-sm">
            112, neumología, enfermería y servicio técnico.
          </span>
        </span>
      </Link>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <ShieldAlert className="text-destructive h-5 w-5" />
          Qué hacer si…
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((protocolo, indice) => (
            <article key={protocolo.id} className="border-border bg-card rounded-2xl border p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="bg-destructive/10 text-destructive mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium">
                    Emergencias
                  </span>
                  <h3 className="text-lg font-semibold">{protocolo.situacion}</h3>
                </div>
                <Acciones
                  nombre={protocolo.situacion}
                  onSubir={() => mover(protocolo.id, -1)}
                  onBajar={() => mover(protocolo.id, 1)}
                  puedeSubir={indice > 0}
                  puedeBajar={indice < items.length - 1}
                  onEditar={() => {
                    setCreando(false);
                    setEditando(protocolo);
                  }}
                  onEliminar={() => eliminar(protocolo.id)}
                />
              </div>
              <ol className="mt-3 space-y-2">
                {protocolo.pasos.map((paso, indice) => (
                  <li key={paso} className="flex gap-3 text-base leading-relaxed">
                    <span className="bg-destructive/10 text-destructive mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                      {indice + 1}
                    </span>
                    <span>{paso}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center">
            No hay protocolos. Pulsa «Añadir protocolo».
          </p>
        ) : null}
      </section>

      <EditorDialogo
        abierto={creando || editando !== null}
        onOpenChange={(valor) => {
          if (!valor) {
            setCreando(false);
            setEditando(null);
          }
        }}
        titulo={editando ? "Editar protocolo" : "Nuevo protocolo"}
        campos={CAMPOS}
        valores={
          editando ? { situacion: editando.situacion, pasos: editando.pasos } : VACIO
        }
        onGuardar={guardar}
      />
    </Pagina>
  );
}
