import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagina } from "@/components/Pagina";
import { Acciones } from "@/components/Acciones";
import { EditorDialogo, type Campo, type Valores } from "@/components/EditorDialogo";
import { useColeccion } from "@/hooks/use-coleccion";
import { contactos } from "@/data/contactos";
import type { Contacto } from "@/data/tipos";

const TITULO = "Teléfonos del equipo de cuidados — ELA";
const DESCRIPCION =
  "Agenda de teléfonos del equipo de cuidados: emergencias, neumología, enfermería, médico de familia y servicio técnico.";

export const Route = createFileRoute("/telefonos")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: TelefonosPage,
});

const CAMPOS: Campo[] = [
  { nombre: "nombre", etiqueta: "Nombre", tipo: "texto" },
  { nombre: "rol", etiqueta: "Rol o servicio", tipo: "texto", marcador: "Enfermera de referencia" },
  { nombre: "telefono", etiqueta: "Teléfono", tipo: "texto", marcador: "+34 600 000 000" },
  { nombre: "nota", etiqueta: "Cuándo llamar", tipo: "area" },
  {
    nombre: "urgente",
    etiqueta: "Prioridad",
    tipo: "select",
    opciones: [
      { valor: "no", etiqueta: "Normal" },
      { valor: "si", etiqueta: "Urgente (destacado en rojo)" },
    ],
  },
];

const VACIO: Valores = { nombre: "", rol: "", telefono: "", nota: "", urgente: "no" };

function aValores(contacto: Contacto): Valores {
  return {
    nombre: contacto.nombre,
    rol: contacto.rol,
    telefono: contacto.telefono,
    nota: contacto.nota ?? "",
    urgente: contacto.urgente ? "si" : "no",
  };
}

function TelefonosPage() {
  const { items, crear, actualizar, eliminar, mover } = useColeccion<Contacto>(
    "contactos",
    contactos,
  );
  const [editando, setEditando] = useState<Contacto | null>(null);
  const [creando, setCreando] = useState(false);

  const guardar = (valores: Valores) => {
    const base = {
      nombre: (valores.nombre as string).trim() || "Sin nombre",
      rol: valores.rol as string,
      telefono: (valores.telefono as string).trim(),
      nota: (valores.nota as string).trim() || undefined,
      urgente: valores.urgente === "si",
    };
    if (editando) actualizar({ ...editando, ...base });
    else crear(base);
  };

  return (
    <Pagina
      titulo="Teléfonos"
      descripcion="Pulsa un número para llamar directamente. Mantén la agenda al día."
      accion={
        <Button
          onClick={() => {
            setEditando(null);
            setCreando(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Añadir teléfono
        </Button>
      }
    >
      <section className="grid gap-3 sm:grid-cols-2">
        {items.map((contacto, indice) => (
          <div
            key={contacto.id}
            className={[
              "flex items-start gap-3 rounded-2xl border p-5 transition",
              contacto.urgente
                ? "border-destructive/40 bg-destructive/5"
                : "border-border bg-card hover:border-primary/40 hover:shadow-sm",
            ].join(" ")}
          >
            <a
              href={`tel:${contacto.telefono.replace(/\s/g, "")}`}
              className="flex min-w-0 flex-1 items-center gap-4"
            >
              <span
                className={[
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                  contacto.urgente
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary/10 text-primary",
                ].join(" ")}
              >
                <Phone className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold">{contacto.nombre}</span>
                <span className="text-muted-foreground block text-sm">{contacto.rol}</span>
                <span
                  className={[
                    "mt-1 block text-xl font-bold tracking-tight",
                    contacto.urgente ? "text-destructive" : "text-primary",
                  ].join(" ")}
                >
                  {contacto.telefono}
                </span>
                {contacto.nota ? (
                  <span className="text-muted-foreground mt-1 block text-sm">{contacto.nota}</span>
                ) : null}
              </span>
            </a>
            <Acciones
              nombre={contacto.nombre}
              onSubir={() => mover(contacto.id, -1)}
              onBajar={() => mover(contacto.id, 1)}
              puedeSubir={indice > 0}
              puedeBajar={indice < items.length - 1}
              onEditar={() => {
                setCreando(false);
                setEditando(contacto);
              }}
              onEliminar={() => eliminar(contacto.id)}
            />
          </div>
        ))}
      </section>

      {items.length === 0 ? (
        <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center">
          No hay teléfonos guardados. Pulsa «Añadir teléfono».
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
        titulo={editando ? "Editar teléfono" : "Nuevo teléfono"}
        campos={CAMPOS}
        valores={editando ? aValores(editando) : VACIO}
        onGuardar={guardar}
      />
    </Pagina>
  );
}
