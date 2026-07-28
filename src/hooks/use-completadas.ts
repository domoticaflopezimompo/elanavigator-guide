import { useCallback, useEffect, useState } from "react";

const PREFIJO = "ela-cuidadores:completadas:";

/** Guarda las tareas marcadas como hechas para una fecha, en este dispositivo. */
export function useCompletadas(claveDia: string) {
  const [completadas, setCompletadas] = useState<string[]>([]);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(PREFIJO + claveDia);
      setCompletadas(guardado ? (JSON.parse(guardado) as string[]) : []);
    } catch {
      setCompletadas([]);
    }
  }, [claveDia]);

  const alternar = useCallback(
    (id: string) => {
      setCompletadas((previas) => {
        const siguientes = previas.includes(id)
          ? previas.filter((valor) => valor !== id)
          : [...previas, id];
        try {
          window.localStorage.setItem(PREFIJO + claveDia, JSON.stringify(siguientes));
        } catch {
          /* almacenamiento no disponible */
        }
        return siguientes;
      });
    },
    [claveDia],
  );

  return { completadas, alternar };
}