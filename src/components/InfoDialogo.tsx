import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconoFicha } from "@/components/IconoFicha";
import { TextoConImagenes } from "@/components/TextoConImagenes";

interface Props {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  titulo: string;
  icono?: string;
  etiqueta?: string;
  detalle: string;
  notas?: string[];
}

export function InfoDialogo({
  abierto,
  onOpenChange,
  titulo,
  icono,
  etiqueta,
  detalle,
  notas,
}: Props) {
  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl leading-tight">
            {icono ? <IconoFicha icono={icono} className="h-10 w-10 rounded-full text-xl" /> : null}
            {titulo}
          </DialogTitle>
          {etiqueta ? (
            <DialogDescription className="text-base capitalize">{etiqueta}</DialogDescription>
          ) : null}
        </DialogHeader>

        <TextoConImagenes texto={detalle} className="space-y-1 text-base" />

        {notas && notas.length > 0 ? (
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
              Notas
            </h3>
            <ul className="space-y-1.5 text-base">
              {notas.map((nota) => (
                <li key={nota} className="flex gap-2">
                  <span aria-hidden className="text-primary">
                    •
                  </span>
                  <span>{nota}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}