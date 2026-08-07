import { createFileRoute } from "@tanstack/react-router";

import { obtenerCitasDelDia } from "@/lib/google-calendar.server";

export const Route = createFileRoute("/api/calendar/events")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const fecha = url.searchParams.get("date") ?? "";
        const calendarId = url.searchParams.get("calendarId") ?? undefined;
        const zonaHoraria = url.searchParams.get("tz") ?? undefined;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          return Response.json(
            { citas: [], error: "Fecha no válida (formato esperado YYYY-MM-DD)." },
            { status: 400 },
          );
        }

        const resultado = await obtenerCitasDelDia({ fecha, calendarId, zonaHoraria });
        return Response.json(resultado, {
          headers: { "cache-control": "no-store" },
        });
      },
    },
  },
});
