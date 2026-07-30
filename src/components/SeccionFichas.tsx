import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagina } from "@/components/Pagina";
import { FichaCard } from "@/components/FichaCard";
import { EditorDialogo, type Campo, type Valores } from "@/components/EditorDialogo";
import { useColeccion } from "@/hooks/use-coleccion";
import type { Ficha } from "@/data/tipos";
import type { ReactNode } from "react";

const CAMPOS_BASE: Campo[] = [
  { nombre: "titulo", etiqueta: "Título", tipo: "texto" },
  { nombre: "resumen", etiqueta: "Resumen", tipo: "area" },
  { nombre: "frecuencia", etiqueta: "Frecuencia", tipo: "texto", marcador: "Todos los días" },
  { nombre: "duracion", etiqueta: "Duración", tipo: "texto", marcador: "10 min" },
  { nombre: "pasos", etiqueta: "Pasos", tipo: "lista", ayuda: "Un paso por línea." },
  {
    nombre: "precauciones",
    etiqueta: "Precauciones",
    tipo: "lista",
    ayuda: "Un aviso por línea. Puede quedar vacío.",
  },
  {
    nombre: "videoYoutube",
    etiqueta: "ID del vídeo de YouTube",
    tipo: "texto",
    ayuda: "Solo el ID, por ejemplo dQw4w9WgXcQ.",
  },
];

const VACIA: Valores = {
  titulo: "",
  resumen: "",
  frecuencia: "",
  duracion: "",
  pasos: [],
  precauciones: [],
  videoYoutube: "",
};

function aValores(ficha: Ficha): Valores {
  return {
    titulo: ficha.titulo,
    resumen: ficha.resumen,
    frecuencia: ficha.frecuencia,
    duracion: ficha.duracion ?? "",
    pasos: ficha.pasos,
    precauciones: ficha.precauciones ?? [],
    videoYoutube: ficha.videoYoutube ?? "",
    tipo: ficha.tipo ?? "",
  };
}

function limpiar(lista: string[]) {
  return lista.map((linea) => linea.trim()).filter(Boolean);
}

interface Props {
  titulo: string;
  descripcion: string;
  clave: string;
  iniciales: Ficha[];
  /** Si se indica, las fichas se agrupan por su campo `tipo` con una cabecera. */
  grupos?: { valor: string; etiqueta: string; descripcion?: string }[];
  children?: ReactNode;
}

export function SeccionFichas({
  titulo,
  descripcion,
  clave,
  iniciales,
  grupos,
  children,
}: Props) {
  const { items, crear, actualizar, eliminar, mover, intercambiar } = useColeccion<Ficha>(
    clave,
    iniciales,
  );
  const [editando, setEditando] = useState<Ficha | null>(null);
  const [creando, setCreando] = useState(false);

  const campos: Campo[] = grupos
    ? [
        CAMPOS_BASE[0],
        {
          nombre: "tipo",
          etiqueta: "Tipo",
          tipo: "select",
          opciones: grupos.map((grupo) => ({ valor: grupo.valor, etiqueta: grupo.etiqueta })),
        },
        ...CAMPOS_BASE.slice(1),
      ]
    : CAMPOS_BASE;

  const vacia: Valores = grupos ? { ...VACIA, tipo: grupos[0].valor } : VACIA;

  const guardar = (valores: Valores) => {
    const base = {
      titulo: (valores.titulo as string).trim() || "Sin título",
      resumen: valores.resumen as string,
      frecuencia: valores.frecuencia as string,
      duracion: (valores.duracion as string) || undefined,
      pasos: limpiar(valores.pasos as string[]),
      precauciones: limpiar(valores.precauciones as string[]),
      videoYoutube: (valores.videoYoutube as string).trim() || undefined,
      tipo: grupos ? ((valores.tipo as string) || grupos[0].valor) : undefined,
    };
    if (editando) actualizar({ ...editando, ...base });
    else crear(base);
  };

  const tarjeta = (ficha: Ficha, lista: Ficha[], indice: number) => (
    <FichaCard
      key={ficha.id}
      ficha={ficha}
      onSubir={() =>
        grupos ? intercambiar(ficha.id, lista[indice - 1].id) : mover(ficha.id, -1)
      }
      onBajar={() =>
        grupos ? intercambiar(ficha.id, lista[indice + 1].id) : mover(ficha.id, 1)
      }
      puedeSubir={indice > 0}
      puedeBajar={indice < lista.length - 1}
      onEditar={() => {
        setCreando(false);
        setEditando(ficha);
      }}
      onEliminar={() => eliminar(ficha.id)}
    />
  );

  return (
    <Pagina
      titulo={titulo}
      descripcion={descripcion}
      accion={
        <Button
          onClick={() => {
            setEditando(null);
            setCreando(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Añadir ficha
        </Button>
      }
    >
      {children}

      {grupos ? (
        <div className="space-y-8">
          {grupos.map((grupo, posicion) => {
            const lista = items.filter((ficha) =>
              posicion === 0
                ? !ficha.tipo || ficha.tipo === grupo.valor
                : ficha.tipo === grupo.valor,
            );
            if (lista.length === 0) return null;
            return (
              <section key={grupo.valor}>
                <div className="border-primary/30 mb-4 border-l-4 pl-3">
                  <h2 className="text-xl font-semibold tracking-tight">{grupo.etiqueta}</h2>
                  {grupo.descripcion ? (
                    <p className="text-muted-foreground text-sm">{grupo.descripcion}</p>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {lista.map((ficha, indice) => tarjeta(ficha, lista, indice))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((ficha, indice) => tarjeta(ficha, items, indice))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center">
          No hay fichas todavía. Pulsa «Añadir ficha» para crear la primera.
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
        titulo={editando ? "Editar ficha" : "Nueva ficha"}
        campos={campos}
        valores={editando ? aValores(editando) : vacia}
        onGuardar={guardar}
      />
    </Pagina>
  );
}