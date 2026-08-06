import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Configuracion {
  googleCalendarEnabled?: boolean;
  googleCalendarId?: string;
}

const CLAVE = "config";

export function useConfiguracion() {
  const [config, setConfig] = useState<Configuracion>({
    googleCalendarEnabled: false,
    googleCalendarId: "primary",
  });
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      const { data, error } = await supabase
        .from("colecciones")
        .select("datos")
        .eq("clave", CLAVE)
        .maybeSingle();

      if (error) console.error("[configuracion] error al leer:", error);

      if (!activo) return;

      if (data?.datos) {
        setConfig((data.datos as unknown as Configuracion) ?? {});
      }
      setCargado(true);
    };

    void cargar();

    const canal = supabase
      .channel(`colecciones-${CLAVE}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "colecciones", filter: `clave=eq.${CLAVE}` },
        (payload) => {
          const fila = payload.new as { datos?: Configuracion } | null;
          if (fila?.datos) setConfig(fila.datos);
        },
      )
      .subscribe();

    return () => {
      activo = false;
      void supabase.removeChannel(canal);
    };
  }, []);

  const guardar = useCallback(async (siguiente: Configuracion) => {
    setConfig(siguiente);
    const { error } = await supabase
      .from("colecciones")
      .upsert(
        { clave: CLAVE, datos: siguiente as never, updated_at: new Date().toISOString() },
        { onConflict: "clave" },
      );

    if (error) {
      console.error("[configuracion] error al guardar:", error);
    }
  }, []);

  return { config, cargado, guardar };
}
