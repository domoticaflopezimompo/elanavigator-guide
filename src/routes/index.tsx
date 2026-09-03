import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, ClipboardPlus, Pencil, Settings } from "lucide-react";
import { Calendario } from "@/components/Calendario";
import { AgendaDia } from "@/components/AgendaDia";
import { EditorDialogo, type Campo, type Valores } from "@/components/EditorDialogo";
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

/** Ficha propia del cuidador: plantilla reutilizable para sus tareas. */
interface FichaCuidador {
  id: string;
  titulo: string;
  resumen: string;
  pasos: string[];
  avisos: string[];
  duracion?: string;
  videoYoutube?: string;
}

const SECCION_CUIDADOR = [{ clave: "cuidador", etiqueta: "Cuidador", categoria: "higiene" as const }];

const CAMPOS_FICHA_CUIDADOR: Campo[] = [
  { nombre: "titulo", etiqueta: "Título", tipo: "texto", marcador: "Ej.: Revisar el buzón" },
  { nombre: "resumen", etiqueta: "Resumen", tipo: "area", marcador: "Descripción breve de la tarea" },
  { nombre: "pasos", etiqueta: "Pasos", tipo: "lista", ayuda: "Un paso por línea." },
  { nombre: "avisos", etiqueta: "Avisos", tipo: "lista", ayuda: "Un aviso por línea (opcional)." },
  { nombre: "duracion", etiqueta: "Duración", tipo: "texto", marcador: "15 min" },
  {
    nombre: "videoYoutube",
    etiqueta: "Vídeo de YouTube (ID)",
    tipo: "texto",
    marcador: "Solo el ID, no la URL completa",
  },
];

function Index() {
  const hoy = useMemo(() => new Date(), []);
  const [seleccionada, setSeleccionada] = useState<Date>(hoy);
  const [mes, setMes] = useState<Date>(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const [ahora, setAhora] = useState<Date | null>(null);
  const [citas, setCitas] = useState<CitaCalendario[]>([]);
  const [citasError, setCitasError] = useState<string | null>(null);
  const [configAbierta, setConfigAbierta] = useState(false);
  const [creandoFichaCuidador, setCreandoFichaCuidador] = useState(false);
  const [eligiendoFicha, setEligiendoFicha] = useState(false);
  const [editandoFicha, setEditandoFicha] = useState<FichaCuidador | null>(null);
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

  // Fichas propias del cuidador: solo ellas aparecen en el desplegable de su agenda.
  const colFichasCuidador = useColeccion<FichaCuidador>("fichas_cuidador", []);
  const fichasCuidador: Record<string, FichaSeccion[]> = useMemo(
    () => ({
      cuidador: colFichasCuidador.items.map((ficha) => ({ ...ficha, categoria: "higiene" as const })),
    }),
    [colFichasCuidador.items],
  );

  const datosFichaCuidador = (valores: Valores) => {
    const limpiar = (lista: string[]) => lista.map((linea) => linea.trim()).filter(Boolean);
    return {
      titulo: (valores.titulo as string).trim(),
      resumen: (valores.resumen as string).trim(),
      pasos: limpiar((valores.pasos as string[]) ?? []),
      avisos: limpiar((valores.avisos as string[]) ?? []),
      duracion: (valores.duracion as string).trim() || undefined,
      videoYoutube: (valores.videoYoutube as string).trim() || undefined,
    };
  };

  const guardarFichaCuidador = (valores: Valores) => {
    const datos = datosFichaCuidador(valores);
    if (!datos.titulo) return;
    colFichasCuidador.crear(datos);
  };

  const guardarEdicionFichaCuidador = (valores: Valores) => {
    if (!editandoFicha) return;
    const datos = datosFichaCuidador(valores);
    if (!datos.titulo) return;
    colFichasCuidador.actualizar({ ...editandoFicha, ...datos });
    setEditandoFicha(null);
  };

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
              fichas={fichasCuidador}
              secciones={SECCION_CUIDADOR}
              etiquetaTareas={{ texto: "Cuidador", clase: "bg-primary/10 text-primary" }}
              accionCrear={
                <>
                  <Button variant="outline" onClick={() => setCreandoFichaCuidador(true)}>
                    <ClipboardPlus className="h-4 w-4" />
                    Crear tarea
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEligiendoFicha(true)}
                    disabled={colFichasCuidador.items.length === 0}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar tarea
                  </Button>
                </>
              }
              seleccionada={seleccionada}
              hoy={hoy}
              ahora={ahora}
            />
          </TabsContent>
        </Tabs>
      </div>

      <EditorDialogo
        abierto={creandoFichaCuidador}
        onOpenChange={setCreandoFichaCuidador}
        titulo="Crear tarea del cuidador"
        descripcion="Crea una tarea propia del cuidador. Después podrás programarla con «Añadir tarea»."
        campos={CAMPOS_FICHA_CUIDADOR}
        valores={{ titulo: "", resumen: "", pasos: [], avisos: [], duracion: "", videoYoutube: "" }}
        onGuardar={guardarFichaCuidador}
      />

      <Dialog open={eligiendoFicha} onOpenChange={setEligiendoFicha}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar tarea del cuidador</DialogTitle>
            <DialogDescription>Elige la tarea que quieres editar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {colFichasCuidador.items.map((ficha) => (
              <button
                key={ficha.id}
                type="button"
                onClick={() => {
                  setEligiendoFicha(false);
                  setEditandoFicha(ficha);
                }}
                className="border-border hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-ring w-full rounded-xl border px-4 py-3 text-left focus-visible:ring-2 focus-visible:outline-none"
              >
                <p className="font-semibold">{ficha.titulo}</p>
                {ficha.resumen ? (
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">
                    {ficha.resumen}
                  </p>
                ) : null}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <EditorDialogo
        abierto={editandoFicha !== null}
        onOpenChange={(valor) => !valor && setEditandoFicha(null)}
        titulo="Editar tarea del cuidador"
        descripcion="Modifica la tarea y guarda los cambios."
        campos={CAMPOS_FICHA_CUIDADOR}
        valores={
          editandoFicha
            ? {
                titulo: editandoFicha.titulo,
                resumen: editandoFicha.resumen,
                pasos: editandoFicha.pasos,
                avisos: editandoFicha.avisos,
                duracion: editandoFicha.duracion ?? "",
                videoYoutube: editandoFicha.videoYoutube ?? "",
              }
            : { titulo: "", resumen: "", pasos: [], avisos: [], duracion: "", videoYoutube: "" }
        }
        onGuardar={guardarEdicionFichaCuidador}
      />

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
