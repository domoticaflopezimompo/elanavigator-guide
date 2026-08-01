import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagina } from "@/components/Pagina";
import { Acciones } from "@/components/Acciones";
import { IconoFicha } from "@/components/IconoFicha";
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

const GRUPOS = [
  { valor: "casa", etiqueta: "Casa", descripcion: "Acceso, wifi, rutinas y avisos de la vivienda." },
  { valor: "material", etiqueta: "Material", descripcion: "Equipos y material, y dónde está cada cosa." },
  { valor: "familia", etiqueta: "Familia", descripcion: "Personas de referencia y cómo coordinarse." },
];

const MATERIALES = [
  { valor: "respiratorio", etiqueta: "Respiratorio" },
  { valor: "muscular", etiqueta: "Muscular" },
  { valor: "higiene", etiqueta: "Higiene" },
  { valor: "otros", etiqueta: "Otros" },
];

const campos = (estado: Valores): Campo[] => [
  { nombre: "titulo", etiqueta: "Título", tipo: "texto", marcador: "Wifi" },
  {
    nombre: "icono",
    etiqueta: "Icono",
    tipo: "texto",
    marcador: "🏠 o https://…/imagen.png",
    ayuda: "Pega un emoji o la URL de una imagen. Puede quedar vacío.",
  },
  {
    nombre: "tipo",
    etiqueta: "Tipo de información",
    tipo: "select",
    opciones: GRUPOS.map((grupo) => ({ valor: grupo.valor, etiqueta: grupo.etiqueta })),
  },
  ...(estado.tipo === "material"
    ? ([{ nombre: "material", etiqueta: "Tipo", tipo: "select", opciones: MATERIALES }] as Campo[])
    : []),
  { nombre: "detalle", etiqueta: "Información", tipo: "area" },
  {
    nombre: "notas",
    etiqueta: "Notas",
    tipo: "lista",
    ayuda: "Una nota por línea. Puede quedar vacío.",
  },
];

const VACIO: Valores = {
  titulo: "",
  icono: "",
  tipo: "casa",
  material: "respiratorio",
  detalle: "",
  notas: [],
};

function aValores(info: Info): Valores {
  return {
    titulo: info.titulo,
    icono: info.icono ?? "",
    tipo: info.tipo ?? "casa",
    material: info.material ?? "respiratorio",
    detalle: info.detalle,
    notas: info.notas ?? [],
  };
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
      icono: ((valores.icono as string) ?? "").trim() || undefined,
      tipo: (valores.tipo as string) || "casa",
      material:
        valores.tipo === "material" ? ((valores.material as string) || "otros") : undefined,
      detalle: valores.detalle as string,
      notas: (valores.notas as string[]).map((linea) => linea.trim()).filter(Boolean),
    };
    if (editando) actualizar({ ...editando, ...base });
    else crear(base);
  };

  const tarjeta = (info: Info, lista: Info[], indice: number) => (
    <article
      key={info.id}
      className="border-border bg-card hover:border-primary/40 relative flex flex-col gap-3 rounded-2xl border p-5 transition hover:shadow-sm"
    >
      <div className="absolute top-3 right-3">
        <Acciones
          nombre={info.titulo}
          onSubir={() => intercambiar(info.id, lista[indice - 1].id)}
          onBajar={() => intercambiar(info.id, lista[indice + 1].id)}
          puedeSubir={indice > 0}
          puedeBajar={indice < lista.length - 1}
          onEditar={() => {
            setCreando(false);
            setEditando(info);
          }}
          onEliminar={() => eliminar(info.id)}
        />
      </div>
      <h2 className="flex items-center gap-2 pr-36 text-lg font-semibold">
        {info.icono ? (
          <IconoFicha icono={info.icono} className="h-9 w-9 rounded-full text-lg" />
        ) : (
          <span className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <Home className="h-4 w-4" />
          </span>
        )}
        {info.titulo}
      </h2>
      {info.tipo === "material" && info.material ? (
        <span className="bg-primary/10 text-primary w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize">
          {info.material}
        </span>
      ) : null}
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
  );

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
      <Tabs defaultValue={GRUPOS[0].valor} className="w-full">
        <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1">
          {GRUPOS.map((grupo) => (
            <TabsTrigger key={grupo.valor} value={grupo.valor} className="flex-1">
              {grupo.etiqueta}
            </TabsTrigger>
          ))}
        </TabsList>
        {GRUPOS.map((grupo, posicion) => {
          const lista = items.filter((info) =>
            posicion === 0 ? !info.tipo || info.tipo === grupo.valor : info.tipo === grupo.valor,
          );
          return (
            <TabsContent key={grupo.valor} value={grupo.valor}>
              <p className="text-muted-foreground mb-4 text-sm">{grupo.descripcion}</p>
              {lista.length === 0 ? (
                <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center">
                  No hay información en esta sección todavía.
                </p>
              ) : (
                <section className="grid gap-4 sm:grid-cols-2">
                  {lista.map((info, indice) => tarjeta(info, lista, indice))}
                </section>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

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
        campos={campos}
        valores={editando ? aValores(editando) : VACIO}
        onGuardar={guardar}
      />
    </Pagina>
  );
}