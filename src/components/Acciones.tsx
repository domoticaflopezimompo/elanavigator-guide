import { useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  onEditar: () => void;
  onEliminar: () => void;
  nombre: string;
  onSubir?: () => void;
  onBajar?: () => void;
  puedeSubir?: boolean;
  puedeBajar?: boolean;
}

const BOTON =
  "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring rounded-lg p-2 transition focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30";

/** Botones de mover, editar y eliminar de una tarjeta. */
export function Acciones({
  onEditar,
  onEliminar,
  nombre,
  onSubir,
  onBajar,
  puedeSubir = true,
  puedeBajar = true,
}: Props) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div className="flex shrink-0 items-center gap-1">
      {onSubir ? (
        <button
          type="button"
          aria-label={`Mover ${nombre} hacia arriba`}
          disabled={!puedeSubir}
          onClick={(evento) => {
            evento.stopPropagation();
            onSubir();
          }}
          className={BOTON}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      ) : null}
      {onBajar ? (
        <button
          type="button"
          aria-label={`Mover ${nombre} hacia abajo`}
          disabled={!puedeBajar}
          onClick={(evento) => {
            evento.stopPropagation();
            onBajar();
          }}
          className={BOTON}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      ) : null}
      <button
        type="button"
        aria-label={`Editar ${nombre}`}
        onClick={(evento) => {
          evento.stopPropagation();
          onEditar();
        }}
        className={BOTON}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={`Eliminar ${nombre}`}
        onClick={(evento) => {
          evento.stopPropagation();
          setConfirmando(true);
        }}
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:ring-ring rounded-lg p-2 transition focus-visible:ring-2 focus-visible:outline-none"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <AlertDialog open={confirmando} onOpenChange={setConfirmando}>
        <AlertDialogContent onClick={(evento) => evento.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar «{nombre}»?</AlertDialogTitle>
            <AlertDialogDescription>
              Se borrará para todos los dispositivos y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onEliminar()}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}