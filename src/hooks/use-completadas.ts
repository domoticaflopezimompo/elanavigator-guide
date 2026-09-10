import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const INTERVALO_REFRESCO = 15_000;

/**
 * Tareas marcadas como hechas de un día. Se guardan en la base de datos
 * compartida para que todos los dispositivos vean las mismas marcas.
 */
export function useCompletadas(claveDia: string) {
  const [completadas, setCompletadas] = useState<string[]>([]);
  const clave = `completadas:${claveDia}`;
  const ultimaMarcaRef = useRef<number>(0);

  useEffect(() => {
    let activo = true;
    ultimaMarcaRef.current = 0;
    setCompletadas([]);

    const aplicar = (datos: unknown, marca?: string | null) => {
      const instante = marca ? Date.parse(marca) : Date.now();
      if (Number.isFinite(instante) && instante < ultimaMarcaRef.current) return;
      ultimaMarcaRef.current = Number.isFinite(instante) ? instante : Date.now();
      setCompletadas(Array.isArray(datos) ? (datos as string[]) : []);
    };

    const cargar = async () => {
      const { data, error } = await supabase
        .from("colecciones")
        .select("datos, updated_at")
        .eq("clave", clave)
        .maybeSingle();

      if (error) console.error(`[colecciones:${clave}] error al leer:`, error);
      if (!activo || !data) return;
      aplicar(data.datos, data.updated_at);
    };

    void cargar();

    const canal = supabase
      .channel(`colecciones-${clave}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "colecciones", filter: `clave=eq.${clave}` },
        (payload) => {
          const fila = payload.new as { datos?: unknown; updated_at?: string } | null;
          if (fila?.datos !== undefined) aplicar(fila.datos, fila.updated_at);
        },
      )
      .subscribe();

    const temporizador = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      void cargar();
    }, INTERVALO_REFRESCO);

    const alVolver = () => {
      if (document.visibilityState === "visible") void cargar();
    };
    document.addEventListener("visibilitychange", alVolver);
    window.addEventListener("focus", alVolver);

    return () => {
      activo = false;
      clearInterval(temporizador);
      document.removeEventListener("visibilitychange", alVolver);
      window.removeEventListener("focus", alVolver);
      void supabase.removeChannel(canal);
    };
  }, [clave]);

  const alternar = useCallback(
    (id: string) => {
      setCompletadas((previas) => {
        const siguientes = previas.includes(id)
          ? previas.filter((valor) => valor !== id)
          : [...previas, id];

        const marca = new Date().toISOString();
        ultimaMarcaRef.current = Date.parse(marca);
        void supabase
          .from("colecciones")
          .upsert({ clave, datos: siguientes as never, updated_at: marca }, { onConflict: "clave" })
          .then(({ error }) => {
            if (error) console.error(`[colecciones:${clave}] error al guardar:`, error);
          });

        return siguientes;
      });
    },
    [clave],
  );

  return { completadas, alternar };
}
