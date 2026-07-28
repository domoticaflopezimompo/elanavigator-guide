import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoYoutube } from "@/components/VideoYoutube";
import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  titulo: string;
  resumen?: string;
  meta?: ReactNode;
  pasos: string[];
  avisos?: string[];
  videoYoutube?: string;
}

export function FichaDialogo({
  abierto,
  onOpenChange,
  titulo,
  resumen,
  meta,
  pasos,
  avisos,
  videoYoutube,
}: Props) {
  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl leading-tight">{titulo}</DialogTitle>
          {resumen ? (
            <DialogDescription className="text-base">{resumen}</DialogDescription>
          ) : null}
        </DialogHeader>

        {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}

        {videoYoutube ? <VideoYoutube id={videoYoutube} titulo={titulo} /> : null}

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Paso a paso
          </h3>
          <ol className="space-y-3">
            {pasos.map((paso, indice) => (
              <li key={paso} className="flex gap-3 text-base leading-relaxed">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {indice + 1}
                </span>
                <span>{paso}</span>
              </li>
            ))}
          </ol>
        </div>

        {avisos && avisos.length > 0 ? (
          <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Importante
            </h3>
            <ul className="space-y-1.5 text-base leading-relaxed text-foreground">
              {avisos.map((aviso) => (
                <li key={aviso} className="flex gap-2">
                  <span aria-hidden className="text-destructive">
                    •
                  </span>
                  <span>{aviso}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}