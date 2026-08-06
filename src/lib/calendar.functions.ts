import { createServerFn } from "@tanstack/react-start";

export interface CitaCalendario {
  id: string;
  titulo: string;
  horaInicio: string;
  horaFin: string;
  ubicacion?: string;
  descripcion?: string;
  enlace: string;
}

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  location?: string;
  description?: string;
  htmlLink?: string;
}

export const listarCitasDelDia = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { fecha: string; calendarId?: string; zonaHoraria?: string }) => data,
  )
  .handler(
    async ({
      data,
    }): Promise<{ citas: CitaCalendario[]; error?: string }> => {
      const calendarId = data.calendarId || "primary";
      const lovableKey = process.env["LOVABLE_API_KEY"];
      const connectionKey = process.env["GOOGLE_CALENDAR_API_KEY"];

      if (!lovableKey || !connectionKey) {
        return { citas: [], error: "El calendario no está configurado." };
      }

      const timeMin = `${data.fecha}T00:00:00Z`;
      const timeMax = `${data.fecha}T23:59:59Z`;

      const url = new URL(
        `https://connector-gateway.lovable.dev/google_calendar/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      );
      url.searchParams.set("timeMin", timeMin);
      url.searchParams.set("timeMax", timeMax);
      url.searchParams.set("singleEvents", "true");
      url.searchParams.set("orderBy", "startTime");
      url.searchParams.set("maxResults", "50");

      try {
        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": connectionKey,
          },
        });

        if (!res.ok) {
          const body = await res.text();
          console.error(`[google-calendar] error ${res.status}: ${body}`);
          return {
            citas: [],
            error: `No se pudieron leer las citas (${res.status}).`,
          };
        }

        const json = (await res.json()) as { items?: GoogleCalendarEvent[] };
        const zona = data.zonaHoraria;

        const citas: CitaCalendario[] = (json.items ?? []).map((evento) => {
          const inicio = evento.start?.dateTime ?? evento.start?.date ?? "";
          const fin = evento.end?.dateTime ?? evento.end?.date ?? "";
          return {
            id: evento.id,
            titulo: evento.summary || "(Sin título)",
            horaInicio: formatearHora(inicio, zona),
            horaFin: formatearHora(fin, zona),
            ubicacion: evento.location,
            descripcion: evento.description,
            enlace: evento.htmlLink || "",
          };
        });

        return { citas, error: undefined };
      } catch (err) {
        console.error("[google-calendar] excepción:", err);
        return { citas: [], error: "Error al conectar con el calendario." };
      }
    },
  );

function formatearHora(fechaIso: string, zonaHoraria?: string): string {
  if (!fechaIso) return "";
  const fecha = new Date(fechaIso);
  if (isNaN(fecha.getTime())) return fechaIso;
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: zonaHoraria,
  });
}
