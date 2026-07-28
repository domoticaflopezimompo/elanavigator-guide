import { Pencil, Trash2 } from "lucide-react";

interface Props {
  onEditar: () => void;
  onEliminar: () => void;
  nombre: string;
}

/** Botones de editar y eliminar de una tarjeta. */
export function Acciones({ onEditar, onEliminar, nombre }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        aria-label={`Editar ${nombre}`}
        onClick={(evento) => {
          evento.stopPropagation();
          onEditar();
        }}
        className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring rounded-lg p-2 transition focus-visible:ring-2 focus-visible:outline-none"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={`Eliminar ${nombre}`}
        onClick={(evento) => {
          evento.stopPropagation();
          if (window.confirm(`¿Eliminar "${nombre}"?`)) onEliminar();
        }}
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:ring-ring rounded-lg p-2 transition focus-visible:ring-2 focus-visible:outline-none"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}