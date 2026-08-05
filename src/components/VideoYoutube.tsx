import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoYoutube({ id, titulo }: { id: string; titulo: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  useEffect(() => {
    const alCambiar = () =>
      setPantallaCompleta(document.fullscreenElement === contenedor.current);
    document.addEventListener("fullscreenchange", alCambiar);
    return () => document.removeEventListener("fullscreenchange", alCambiar);
  }, []);

  const alternar = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await contenedor.current?.requestFullscreen();
    } catch {
      // Algunos navegadores lo bloquean: el vídeo sigue teniendo su propio botón.
    }
  };

  return (
    <div className="space-y-2">
      <div
        ref={contenedor}
        className={
          pantallaCompleta
            ? "flex h-full w-full flex-col bg-black"
            : "overflow-hidden rounded-xl border border-border bg-muted"
        }
      >
        <div className={pantallaCompleta ? "flex-1" : "aspect-video"}>
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
            title={titulo}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {pantallaCompleta ? (
          <div className="flex justify-center p-3">
            <Button size="lg" variant="secondary" onClick={alternar}>
              <Minimize2 className="h-4 w-4" />
              Volver a la agenda
            </Button>
          </div>
        ) : null}
      </div>
      {!pantallaCompleta ? (
        <Button variant="outline" size="sm" className="w-full" onClick={alternar}>
          <Maximize2 className="h-4 w-4" />
          Ver a pantalla completa
        </Button>
      ) : null}
    </div>
  );
}