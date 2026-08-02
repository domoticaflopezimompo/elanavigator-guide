import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { archivoAImagen } from "@/lib/imagen";

/** Recuadro compacto para poner una imagen a una ficha (subida o enlace). */
export function SelectorImagen({
  valor,
  nombre,
  onCambiar,
}: {
  valor?: string;
  nombre: string;
  onCambiar: (imagen?: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [url, setUrl] = useState(valor ?? "");

  return (
    <>
      <button
        type="button"
        title={valor ? "Cambiar imagen" : "Añadir imagen"}
        aria-label={`Imagen de ${nombre}`}
        onClick={() => {
          setUrl(valor ?? "");
          setAbierto(true);
        }}
        className="border-border text-muted-foreground hover:border-primary/50 hover:text-primary flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-dashed transition"
      >
        {valor ? (
          <img src={valor} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="h-5 w-5" />
        )}
      </button>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Imagen de {nombre}</DialogTitle>
          </DialogHeader>

          {url ? (
            <div className="relative">
              <img
                src={url}
                alt=""
                className="border-border max-h-56 w-full rounded-xl border object-contain"
              />
              <button
                type="button"
                aria-label="Quitar imagen"
                onClick={() => setUrl("")}
                className="bg-destructive text-destructive-foreground absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <Input
            value={url}
            placeholder="https://…/imagen.jpg"
            onChange={(evento) => setUrl(evento.target.value)}
          />

          <label className="border-border text-muted-foreground hover:bg-muted flex cursor-pointer items-center justify-center rounded-xl border border-dashed px-3 py-2 text-sm">
            Subir imagen del dispositivo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (evento) => {
                const archivo = evento.target.files?.[0];
                if (archivo) setUrl(await archivoAImagen(archivo));
                evento.target.value = "";
              }}
            />
          </label>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                onCambiar(url.trim() || undefined);
                setAbierto(false);
              }}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
