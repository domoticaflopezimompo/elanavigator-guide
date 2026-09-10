import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const INTERVALO_REFRESCO = 15_000;

/**
 * Colección compartida: se guarda en la nube, así todos los dispositivos
 * que abren la web ven y editan exactamente el mismo contenido.
 *
 * La sincronización usa tiempo real cuando está disponible y, además, una
 * recarga periódica (y al volver a la pestaña) por si la conexión en vivo
 * está bloqueada por la red o el servidor.
 */
export function useColeccion<T extends { id: string }>(clave: string, iniciales: T[]) {
  const [items, setItems] = useState<T[]>(iniciales);
  const [cargado, setCargado] = useState(false);
  const inicialesRef = useRef(iniciales);
  inicialesRef.current = iniciales;
  // Marca del último cambio aplicado, para no pisar lo que acabamos de guardar.
  const ultimaMarcaRef = useRef<number>(0);

  useEffect(() => {
    let activo = true;
    ultimaMarcaRef.current = 0;

    const aplicar = (datos: T[] | null | undefined, marca?: string | null) => {
      const instante = marca ? Date.parse(marca) : Date.now();
      if (Number.isFinite(instante) && instante < ultimaMarcaRef.current) return;
      ultimaMarcaRef.current = Number.isFinite(instante) ? instante : Date.now();
      setItems(datos ?? []);
    };

    const cargar = async () => {
      const { data, error } = await supabase
        .from("colecciones")
        .select("datos, updated_at")
        .eq("clave", clave)
        .maybeSingle();

      if (error) console.error(`[colecciones:${clave}] error al leer:`, error);

      if (!activo) return;

      if (data) {
        aplicar(data.datos as unknown as T[], data.updated_at);
      } else {
        // Primera vez: sembramos el contenido inicial en la nube.
        const { error: errorSemilla } = await supabase
          .from("colecciones")
          .upsert({ clave, datos: inicialesRef.current as never }, { onConflict: "clave" });
        if (errorSemilla)
          console.error(`[colecciones:${clave}] error al sembrar:`, errorSemilla);
        if (activo) setItems(inicialesRef.current);
      }
      if (activo) setCargado(true);
    };

    void cargar();

    const canal = supabase
      .channel(`colecciones-${clave}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "colecciones", filter: `clave=eq.${clave}` },
        (payload) => {
          const fila = payload.new as { datos?: T[]; updated_at?: string } | null;
          if (fila?.datos) aplicar(fila.datos, fila.updated_at);
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

  const persistir = useCallback(
    async (siguientes: T[]) => {
      setItems(siguientes);
      const marca = new Date().toISOString();
      ultimaMarcaRef.current = Date.parse(marca);
      const { data, error } = await supabase
        .from("colecciones")
        .upsert({ clave, datos: siguientes as never, updated_at: marca }, { onConflict: "clave" })
        .select()
        .maybeSingle();

      if (error) {
        console.error(`[colecciones:${clave}] error al guardar:`, error);
        return;
      }
      if (!data) {
        console.error(`[colecciones:${clave}] el guardado no devolvió ninguna fila.`);
      }
    },
    [clave],
  );

  const crear = useCallback(
    (item: Omit<T, "id"> & { id?: string }) => {
      const nuevo = { ...item, id: item.id || `${clave}-${Date.now()}` } as T;
      void persistir([...items, nuevo]);
    },
    [clave, items, persistir],
  );

  const actualizar = useCallback(
    (item: T) => void persistir(items.map((actual) => (actual.id === item.id ? item : actual))),
    [items, persistir],
  );

  const eliminar = useCallback(
    (id: string) => void persistir(items.filter((actual) => actual.id !== id)),
    [items, persistir],
  );

  const restaurar = useCallback(() => void persistir(inicialesRef.current), [persistir]);

  /** Mueve un elemento una posición arriba (-1) o abajo (+1). */
  const mover = useCallback(
    (id: string, direccion: -1 | 1) => {
      const indice = items.findIndex((actual) => actual.id === id);
      const destino = indice + direccion;
      if (indice === -1 || destino < 0 || destino >= items.length) return;
      const siguientes = [...items];
      const [movido] = siguientes.splice(indice, 1);
      siguientes.splice(destino, 0, movido);
      void persistir(siguientes);
    },
    [items, persistir],
  );

  /** Intercambia la posición de dos elementos. */
  const intercambiar = useCallback(
    (idA: string, idB: string) => {
      const a = items.findIndex((actual) => actual.id === idA);
      const b = items.findIndex((actual) => actual.id === idB);
      if (a === -1 || b === -1) return;
      const siguientes = [...items];
      [siguientes[a], siguientes[b]] = [siguientes[b], siguientes[a]];
      void persistir(siguientes);
    },
    [items, persistir],
  );

  return { items, cargado, crear, actualizar, eliminar, restaurar, mover, intercambiar };
}
