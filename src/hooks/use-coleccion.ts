import { useCallback, useEffect, useState } from "react";

const PREFIJO = "ela-cuidadores:datos:";

/**
 * Colección editable guardada en este dispositivo (localStorage).
 * Parte de los datos iniciales del proyecto y permite crear, editar y borrar.
 */
export function useColeccion<T extends { id: string }>(clave: string, iniciales: T[]) {
  const [items, setItems] = useState<T[]>(iniciales);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(PREFIJO + clave);
      if (guardado) setItems(JSON.parse(guardado) as T[]);
    } catch {
      /* almacenamiento no disponible */
    }
    setCargado(true);
  }, [clave]);

  const persistir = useCallback(
    (siguientes: T[]) => {
      setItems(siguientes);
      try {
        window.localStorage.setItem(PREFIJO + clave, JSON.stringify(siguientes));
      } catch {
        /* almacenamiento no disponible */
      }
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

  const restaurar = useCallback(() => persistir(iniciales), [iniciales, persistir]);

  return { items, cargado, crear, actualizar, eliminar, restaurar };
}