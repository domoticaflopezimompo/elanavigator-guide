import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Colección compartida: se guarda en la nube, así todos los dispositivos
 * que abren la web ven y editan exactamente el mismo contenido.
 */
export function useColeccion<T extends { id: string }>(clave: string, iniciales: T[]) {
  const [items, setItems] = useState<T[]>(iniciales);
  const [cargado, setCargado] = useState(false);
  const inicialesRef = useRef(iniciales);
  inicialesRef.current = iniciales;

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      const { data } = await supabase
        .from("colecciones")
        .select("datos")
        .eq("clave", clave)
        .maybeSingle();

      if (!activo) return;

      if (data) {
        setItems((data.datos as unknown as T[]) ?? []);
      } else {
        // Primera vez: sembramos el contenido inicial en la nube.
        await supabase
          .from("colecciones")
          .upsert({ clave, datos: inicialesRef.current as never }, { onConflict: "clave" });
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
          const fila = payload.new as { datos?: T[] } | null;
          if (fila?.datos) setItems(fila.datos);
        },
      )
      .subscribe();

    return () => {
      activo = false;
      void supabase.removeChannel(canal);
    };
  }, [clave]);

  const persistir = useCallback(
    (siguientes: T[]) => {
      setItems(siguientes);
      void supabase
        .from("colecciones")
        .upsert(
          { clave, datos: siguientes as never, updated_at: new Date().toISOString() },
          { onConflict: "clave" },
        );
    },
    [clave],
  );

  const crear = useCallback(
    (item: Omit<T, "id"> & { id?: string }) => {
      const nuevo = { ...item, id: item.id || `${clave}-${Date.now()}` } as T;
      persistir([...items, nuevo]);
    },
    [clave, items, persistir],
  );

  const actualizar = useCallback(
    (item: T) => persistir(items.map((actual) => (actual.id === item.id ? item : actual))),
    [items, persistir],
  );

  const eliminar = useCallback(
    (id: string) => persistir(items.filter((actual) => actual.id !== id)),
    [items, persistir],
  );

  const restaurar = useCallback(() => persistir(inicialesRef.current), [persistir]);

  /** Mueve un elemento una posición arriba (-1) o abajo (+1). */
  const mover = useCallback(
    (id: string, direccion: -1 | 1) => {
      const indice = items.findIndex((actual) => actual.id === id);
      const destino = indice + direccion;
      if (indice === -1 || destino < 0 || destino >= items.length) return;
      const siguientes = [...items];
      const [movido] = siguientes.splice(indice, 1);
      siguientes.splice(destino, 0, movido);
      persistir(siguientes);
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
      persistir(siguientes);
    },
    [items, persistir],
  );

  return { items, cargado, crear, actualizar, eliminar, restaurar, mover, intercambiar };
}
