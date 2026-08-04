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
  ubicacion?: string;
  detalle: string;
  notas?: string[];
  imagenes?: string[];
}

export function InfoDialogo({
  abierto,
  onOpenChange,
  titulo,
  icono,
  etiqueta,
  ubicacion,
  detalle,
  notas,
  imagenes,
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

        {ubicacion ? (
          <p className="text-base">
            <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Ubicación:{" "}
            </span>
            {ubicacion}
          </p>
        ) : null}

        <TextoConImagenes texto={detalle} className="space-y-1 text-base" />

        {imagenes && imagenes.length > 0 ? (
          <div className="flex flex-col items-center gap-3">
            {imagenes.map((imagen, indice) => (
              <img
                key={`${imagen}-${indice}`}
                src={imagen}
                alt=""
                loading="lazy"
                className="border-border mx-auto max-h-72 w-full max-w-md rounded-xl border object-contain"
              />
            ))}
          </div>
        ) : null}

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