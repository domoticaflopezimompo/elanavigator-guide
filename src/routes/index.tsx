import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Settings } from "lucide-react";
import { Calendario } from "@/components/Calendario";
import { AgendaDia } from "@/components/AgendaDia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useColeccion } from "@/hooks/use-coleccion";
import { useConfiguracion } from "@/hooks/use-configuracion";
import { tareas as tareasIniciales } from "@/data/tareas";
import { INICIALES, normalizar, type FichaSeccion } from "@/lib/secciones";
import { claveFecha, esMismoDia, formatoLargo } from "@/lib/agenda";
import { listarCitasDelDia, type CitaCalendario } from "@/lib/calendar";
import type { Tarea } from "@/data/tipos";

const TITULO = "Tareas del día — Cuidados ELA";
const DESCRIPCION =
  "Calendario y tareas diarias del equipo de cuidadores: medicación, ejercicios, logopedia e instrucciones paso a paso con vídeo.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: Index,
});

const tareasCuidadorIniciales: Tarea[] = [];

function Index() {
  const hoy = useMemo(() => new Date(), []);
  const [seleccionada, setSeleccionada] = useState<Date>(hoy);
  const [mes, setMes] = useState<Date>(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const [ahora, setAhora] = useState<Date | null>(null);
  const [citas, setCitas] = useState<CitaCalendario[]>([]);
  const [citasError, setCitasError] = useState<string | null>(null);
  const [configAbierta, setConfigAbierta] = useState(false);
  const { config, cargado: configCargado, guardar: guardarConfig } = useConfiguracion();

  // Reloj solo en cliente para no romper la hidratación.
  useEffect(() => {
    setAhora(new Date());
    const id = setInterval(() => setAhora(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Cargar citas del calendario de Google cuando esté activado (solo Paciente).
  useEffect(() => {
    if (!configCargado || !config.googleCalendarEnabled) {
      setCitas([]);
      setCitasError(null);
      return;
    }

    let activo = true;
    setCitasError(null);

    const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;
    void listarCitasDelDia({
      data: {
        fecha: claveFecha(seleccionada),
        calendarId: config.googleCalendarId || "primary",
        zonaHoraria,
      },
    }).then(({ citas, error }) => {
      if (!activo) return;
      if (error) {
        setCitasError(error);
        setCitas([]);
      } else {
        setCitas(citas);
      }
    });

    return () => {
      activo = false;
    };
  }, [seleccionada, config.googleCalendarEnabled, config.googleCalendarId, configCargado]);

  const colMedicacion = useColeccion<{ id: string }>(
    "medicacion",
    INICIALES.medicacion as { id: string }[],
  );
  const colCuidados = useColeccion<{ id: string }>(
    "cuidados",
    INICIALES.cuidados as { id: string }[],
  );
  const colEjercicios = useColeccion<{ id: string }>(
    "ejercicios",
    INICIALES.ejercicios as { id: string }[],
  );
  const colLogopedia = useColeccion<{ id: string }>(
    "logopedia",
    INICIALES.logopedia as { id: string }[],
  );

  const fichas: Record<string, FichaSeccion[]> = useMemo(
    () => ({
      medicacion: normalizar("medicacion", colMedicacion.items),
      cuidados: normalizar("cuidados", colCuidados.items),
      ejercicios: normalizar("ejercicios", colEjercicios.items),
      logopedia: normalizar("logopedia", colLogopedia.items),
    }),
    [colMedicacion.items, colCuidados.items, colEjercicios.items, colLogopedia.items],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 pt-6 pb-28 md:px-6 md:pb-16">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-medium">
            {esMismoDia(seleccionada, hoy) ? "Hoy" : "Día seleccionado"}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight capitalize md:text-4xl">
            {formatoLargo(seleccionada)}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setConfigAbierta(true)}
            aria-label="Configurar calendario"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Calendario</span>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[320px_1fr] md:items-start">
        <div className="space-y-3 md:sticky md:top-20">
          <Calendario
            mes={mes}
            hoy={hoy}
            seleccionada={seleccionada}
            onCambiarMes={setMes}
            onSeleccionar={(fecha) => {
              setSeleccionada(fecha);
              setMes(new Date(fecha.getFullYear(), fecha.getMonth(), 1));
            }}
          />
          <p className="text-muted-foreground px-1 text-xs">
            Las tareas marcadas y los cambios que hagas se guardan en este dispositivo.
          </p>
        </div>

        <Tabs defaultValue="paciente">
          <TabsList>
            <TabsTrigger value="paciente">Paciente</TabsTrigger>
            <TabsTrigger value="cuidador">Cuidador</TabsTrigger>
          </TabsList>
          <TabsContent value="paciente" className="mt-6">
            <AgendaDia
              coleccion="tareas"
              iniciales={tareasIniciales}
              sufijoCompletadas="paciente"
              fichas={fichas}
              seleccionada={seleccionada}
              hoy={hoy}
              ahora={ahora}
              citas={citas}
            />
          </TabsContent>
          <TabsContent value="cuidador" className="mt-6">
            <AgendaDia
              coleccion="tareas_cuidador"
              iniciales={tareasCuidadorIniciales}
              sufijoCompletadas="cuidador"
              fichas={fichas}
              seleccionada={seleccionada}
              hoy={hoy}
              ahora={ahora}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={configAbierta} onOpenChange={setConfigAbierta}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="text-primary h-5 w-5" />
              Calendario de Google
            </DialogTitle>
            <DialogDescription>
              Activa la sincronización para ver las citas del paciente en la sección Hoy.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="calendar-enabled" className="flex flex-col gap-1">
                <span>Sincronizar citas</span>
                <span className="text-muted-foreground text-xs font-normal">
                  Muestra las citas del calendario junto a las tareas.
                </span>
              </Label>
              <Switch
                id="calendar-enabled"
                checked={config.googleCalendarEnabled ?? false}
                onCheckedChange={(checked) =>
                  guardarConfig({ ...config, googleCalendarEnabled: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calendar-id">ID del calendario</Label>
              <Input
                id="calendar-id"
                value={config.googleCalendarId ?? "primary"}
                onChange={(e) =>
                  guardarConfig({ ...config, googleCalendarId: e.target.value || "primary" })
                }
                placeholder="primary"
              />
              <p className="text-muted-foreground text-xs">
                Usa "primary" para el calendario principal de la cuenta conectada.
              </p>
            </div>

            {citasError ? (
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                {citasError}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <p className="border-border text-muted-foreground mt-12 border-t pt-6 text-sm">
        Esta web es una ayuda organizativa para el equipo de cuidados. No sustituye las
        indicaciones del equipo médico.
      </p>
    </main>
  );
}
