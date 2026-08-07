import type { CitaCalendario } from "./calendar";

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  location?: string;
  description?: string;
  htmlLink?: string;
}

/** Desplazamiento UTC ("+02:00") de una zona horaria en una fecha concreta. */
function offsetDeZona(fechaIso: string, zona: string): string {
  const referencia = new Date(`${fechaIso}T12:00:00Z`);
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: zona,
    timeZoneName: "longOffset",
  }).formatToParts(referencia);
  const nombre = partes.find((p) => p.type === "timeZoneName")?.value ?? "GMT+00:00";
  const encontrado = /GMT([+-]\d{2}:\d{2})/.exec(nombre);
  return encontrado ? encontrado[1]! : "+00:00";
}

function formatearHora(fechaIso: string, zona: string): string {
  if (!fechaIso) return "";
  // Evento de día completo (solo fecha): no tiene hora.
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaIso)) return "";
  const fecha = new Date(fechaIso);
  if (isNaN(fecha.getTime())) return "";
  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: zona,
  });
}

/** Obtiene un access token nuevo a partir del refresh token (solo servidor). */
async function obtenerAccessToken(): Promise<string> {
  const clientId = process.env["GOOGLE_CLIENT_ID"];
  const clientSecret = process.env["GOOGLE_CLIENT_SECRET"];
  const refreshToken = process.env["GOOGLE_REFRESH_TOKEN"];

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("CONFIG");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    // No se registra el cuerpo: puede contener datos sensibles.
    console.error(`[google-calendar] fallo al renovar el token (${res.status})`);
    throw new Error("AUTH");
  }

  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("AUTH");
  return json.access_token;
}

export async function obtenerCitasDelDia(opciones: {
  fecha: string;
  calendarId?: string;
  zonaHoraria?: string;
}): Promise<{ citas: CitaCalendario[]; error?: string }> {
  const zona =
    opciones.zonaHoraria || process.env["TZ"] || process.env["GOOGLE_CALENDAR_TZ"] || "Europe/Madrid";
  const calendarId =
    opciones.calendarId || process.env["GOOGLE_CALENDAR_ID"] || "primary";

  let accessToken: string;
  try {
    accessToken = await obtenerAccessToken();
  } catch (err) {
    const motivo = err instanceof Error ? err.message : "";
    return {
      citas: [],
      error:
        motivo === "CONFIG"
          ? "El calendario no está configurado en el servidor."
          : "No se pudo autenticar con Google Calendar.",
    };
  }

  const offset = offsetDeZona(opciones.fecha, zona);
  const timeMin = `${opciones.fecha}T00:00:00${offset}`;
  const timeMax = `${opciones.fecha}T23:59:59${offset}`;

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
  );
  url.searchParams.set("timeMin", timeMin);
  url.searchParams.set("timeMax", timeMax);
  url.searchParams.set("timeZone", zona);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "50");

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      console.error(`[google-calendar] error ${res.status} al leer eventos`);
      return { citas: [], error: `No se pudieron leer las citas (${res.status}).` };
    }

    const json = (await res.json()) as { items?: GoogleCalendarEvent[] };
    const citas: CitaCalendario[] = (json.items ?? []).map((evento) => ({
      id: evento.id,
      titulo: evento.summary || "(Sin título)",
      horaInicio: formatearHora(evento.start?.dateTime ?? evento.start?.date ?? "", zona),
      horaFin: formatearHora(evento.end?.dateTime ?? evento.end?.date ?? "", zona),
      ubicacion: evento.location,
      descripcion: evento.description,
      enlace: evento.htmlLink || "",
    }));

    return { citas };
  } catch (err) {
    console.error("[google-calendar] excepción al leer eventos:", err);
    return { citas: [], error: "Error al conectar con el calendario." };
  }
}
