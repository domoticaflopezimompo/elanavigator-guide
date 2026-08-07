export interface CitaCalendario {
  id: string;
  titulo: string;
  horaInicio: string;
  horaFin: string;
  ubicacion?: string;
  descripcion?: string;
  enlace: string;
}

export interface RespuestaCitas {
  citas: CitaCalendario[];
  error?: string;
}

/**
 * Pide las citas del día al backend propio (/api/calendar/events).
 * El navegador nunca ve credenciales de Google.
 */
export async function listarCitasDelDia({
  data,
}: {
  data: { fecha: string; calendarId?: string; zonaHoraria?: string };
}): Promise<RespuestaCitas> {
  const params = new URLSearchParams({ date: data.fecha });
  if (data.calendarId) params.set("calendarId", data.calendarId);
  if (data.zonaHoraria) params.set("tz", data.zonaHoraria);

  try {
    const res = await fetch(`/api/calendar/events?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    const json = (await res.json()) as RespuestaCitas;
    if (!res.ok) {
      return { citas: [], error: json.error ?? `No se pudieron leer las citas (${res.status}).` };
    }
    return json;
  } catch {
    return { citas: [], error: "Error al conectar con el calendario." };
  }
}
