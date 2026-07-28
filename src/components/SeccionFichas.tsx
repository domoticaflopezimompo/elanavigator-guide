import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagina } from "@/components/Pagina";
import { FichaCard } from "@/components/FichaCard";
import { EditorDialogo, type Campo, type Valores } from "@/components/EditorDialogo";
import { useColeccion } from "@/hooks/use-coleccion";
import type { Ficha } from "@/data/tipos";
import type { ReactNode } from "react";

const CAMPOS: Campo[] = [
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
  children?: ReactNode;
}

export function SeccionFichas({ titulo, descripcion, clave, iniciales, children }: Props) {
  const { items, crear, actualizar, eliminar } = useColeccion<Ficha>(clave, iniciales);
  const [editando, setEditando] = useState<Ficha | null>(null);
  const [creando, setCreando] = useState(false);

  const guardar = (valores: Valores) => {
    const base = {
      titulo: (valores.titulo as string).trim() || "Sin título",
      resumen: valores.resumen as string,
      frecuencia: valores.frecuencia as string,
      duracion: (valores.duracion as string) || undefined,
      pasos: limpiar(valores.pasos as string[]),
      precauciones: limpiar(valores.precauciones as string[]),
      videoYoutube: (valores.videoYoutube as string).trim() || undefined,
    };
    if (editando) actualizar({ ...editando, ...base });
    else crear(base);
  };

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

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((ficha) => (
          <FichaCard
            key={ficha.id}
            ficha={ficha}
            onEditar={() => {
              setCreando(false);
              setEditando(ficha);
            }}
            onEliminar={() => eliminar(ficha.id)}
          />
        ))}
      </div>

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
        campos={CAMPOS}
        valores={editando ? aValores(editando) : VACIA}
        onGuardar={guardar}
      />
    </Pagina>
  );
}