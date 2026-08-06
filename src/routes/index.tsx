import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Clock3, Plus, Settings, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Calendario } from "@/components/Calendario";
import { TareaItem } from "@/components/TareaItem";
import { CitaCalendarioItem } from "@/components/CitaCalendarioItem";
import { FichaDialogo } from "@/components/FichaDialogo";
import { EditorDialogo, type Campo, type Valores } from "@/components/EditorDialogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useCompletadas } from "@/hooks/use-completadas";
import { useColeccion } from "@/hooks/use-coleccion";
import { useConfiguracion } from "@/hooks/use-configuracion";
import { tareas as tareasIniciales } from "@/data/tareas";
import {
  INICIALES,
  SECCIONES,
  normalizar,
  type FichaSeccion,
} from "@/lib/secciones";
import {
  CATEGORIAS,
  FRANJAS,
  claveFecha,
  esMismoDia,
  franjaDeHora,
  franjaDeMinutos,
  formatoLargo,
  horaCorta,
  indiceFranja,
  minutosDeFecha,
  minutosDeHora,
  tareasDelDia,
} from "@/lib/agenda";
import { listarCitasDelDia, type CitaCalendario } from "@/lib/calendar.functions";
import type { Franja, Tarea } from "@/data/tipos";

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

function campos(fichas: Record<string, FichaSeccion[]>, legado: boolean) {
  return (estado: Valores): Campo[] => {
    const seccion = (estado.seccion as string) ?? SECCIONES[0].clave;
    const opcionesSeccion = [
      ...(legado ? [{ valor: "manual", etiqueta: "Contenido actual (sin ficha)" }] : []),
      ...SECCIONES.map((item) => ({ valor: item.clave, etiqueta: item.etiqueta })),
    ];
    const lista: Campo[] = [
      {
        nombre: "seccion",
        etiqueta: "Sección",
        tipo: "select",
        opciones: opcionesSeccion,
      },
    ];
    if (seccion !== "manual") {
      lista.push({
        nombre: "fichaId",
        etiqueta: "Ficha",
        tipo: "select",
        opciones: (fichas[seccion] ?? []).map((ficha) => ({
          valor: ficha.id,
          etiqueta: ficha.titulo,
        })),
        ayuda: "Solo se pueden programar fichas que ya existen en esa sección.",
      });
    }
    return [
      ...lista,
      {
        nombre: "franja",
        etiqueta: "Franja del día",
        tipo: "select",
        opciones: FRANJAS.map((franja) => ({ valor: franja.id, etiqueta: franja.etiqueta })),
      },
      { nombre: "hora", etiqueta: "Hora", tipo: "texto", marcador: "08:00" },
      { nombre: "duracion", etiqueta: "Duración", tipo: "texto", marcador: "15 min" },
      {
        nombre: "recurrenciaTipo",
        etiqueta: "Se repite",
        tipo: "select",
        opciones: [
          { valor: "diaria", etiqueta: "Todos los días" },
          { valor: "semanal", etiqueta: "Días concretos de la semana" },
          { valor: "fecha", etiqueta: "Fechas sueltas" },
        ],
      },
      ...((estado.recurrenciaTipo as string) === "semanal"
        ? ([{ nombre: "recurrenciaDias", etiqueta: "Días de la semana", tipo: "dias" }] as Campo[])
        : []),
      ...((estado.recurrenciaTipo as string) === "fecha"
        ? ([
            {
              nombre: "recurrenciaFechas",
              etiqueta: "Fechas",
              tipo: "lista",
              ayuda: "Una fecha por línea en formato AAAA-MM-DD.",
            },
          ] as Campo[])
        : []),
    ];
  };
}

function valoresVacios(fecha: Date, primeraFicha?: string): Valores {
  return {
    seccion: SECCIONES[0].clave,
    fichaId: primeraFicha ?? "",
    franja: "manana",
    hora: "",
    duracion: "",
    recurrenciaTipo: "diaria",
    recurrenciaDias: [],
    recurrenciaFechas: [claveFecha(fecha)],
  };
}

function aValores(tarea: Tarea): Valores {
  return {
    seccion: tarea.origen?.seccion ?? "manual",
    fichaId: tarea.origen?.fichaId ?? "",
    franja: tarea.franja,
    hora: tarea.hora ?? "",
    duracion: tarea.duracion ?? "",
    recurrenciaTipo: tarea.recurrencia.tipo,
    recurrenciaDias: tarea.recurrencia.tipo === "semanal" ? tarea.recurrencia.dias : [],
    recurrenciaFechas: tarea.recurrencia.tipo === "fecha" ? tarea.recurrencia.fechas : [],
  };
}

function limpiar(lista: string[]) {
  return lista.map((linea) => linea.trim()).filter(Boolean);
}

function Index() {
  const hoy = useMemo(() => new Date(), []);
  const [seleccionada, setSeleccionada] = useState<Date>(hoy);
  const [mes, setMes] = useState<Date>(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const [abierta, setAbierta] = useState<Tarea | null>(null);
  const [editando, setEditando] = useState<Tarea | null>(null);
  const [creando, setCreando] = useState(false);
  const [ahora, setAhora] = useState<Date | null>(null);
  const [plegadas, setPlegadas] = useState<Record<string, boolean>>({});
  const [citas, setCitas] = useState<CitaCalendario[]>([]);
  const [citasCargando, setCitasCargando] = useState(false);
  const [citasError, setCitasError] = useState<string | null>(null);
  const [configAbierta, setConfigAbierta] = useState(false);
  const { config, cargado: configCargado, guardar: guardarConfig } = useConfiguracion();

  // Reloj solo en cliente para no romper la hidratación.
  useEffect(() => {
    setAhora(new Date());
    const id = setInterval(() => setAhora(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const { items, crear, actualizar, eliminar, intercambiar } = useColeccion<Tarea>(
    "tareas",
    tareasIniciales,
  );
  const colMedicacion = useColeccion<{ id: string }>("medicacion", INICIALES.medicacion as { id: string }[]);
  const colCuidados = useColeccion<{ id: string }>("cuidados", INICIALES.cuidados as { id: string }[]);
  const colEjercicios = useColeccion<{ id: string }>("ejercicios", INICIALES.ejercicios as { id: string }[]);
  const colLogopedia = useColeccion<{ id: string }>("logopedia", INICIALES.logopedia as { id: string }[]);

  const fichas: Record<string, FichaSeccion[]> = useMemo(
    () => ({
      medicacion: normalizar("medicacion", colMedicacion.items),
      cuidados: normalizar("cuidados", colCuidados.items),
      ejercicios: normalizar("ejercicios", colEjercicios.items),
      logopedia: normalizar("logopedia", colLogopedia.items),
    }),
    [colMedicacion.items, colCuidados.items, colEjercicios.items, colLogopedia.items],
  );

  /** Mantiene la tarea sincronizada con la ficha de su sección. */
  const sincronizar = (tarea: Tarea): Tarea => {
    if (!tarea.origen) return tarea;
    const ficha = fichas[tarea.origen.seccion]?.find((item) => item.id === tarea.origen!.fichaId);
    if (!ficha) return tarea;
    return {
      ...tarea,
      titulo: ficha.titulo,
      resumen: ficha.resumen,
      categoria: ficha.categoria,
      pasos: ficha.pasos,
      avisos: ficha.avisos,
      videoYoutube: ficha.videoYoutube,
      duracion: tarea.duracion ?? ficha.duracion,
    };
  };

  const clave = claveFecha(seleccionada);
  const { completadas, alternar } = useCompletadas(clave);
  const delDia = useMemo(
    () => tareasDelDia(seleccionada, items).map(sincronizar),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seleccionada, items, fichas],
  );
  const hechas = delDia.filter((tarea) => completadas.includes(tarea.id)).length;

  const esHoy = esMismoDia(seleccionada, hoy);
  const minutosAhora = ahora ? minutosDeFecha(ahora) : null;
  const franjaActual = minutosAhora !== null ? franjaDeMinutos(minutosAhora) : null;
  const diaPasado = claveFecha(seleccionada) < claveFecha(hoy);

  const estaAtrasada = (tarea: Tarea) => {
    if (completadas.includes(tarea.id)) return false;
    if (diaPasado) return true;
    if (!esHoy || minutosAhora === null) return false;
    const minutos = minutosDeHora(tarea.hora);
    if (minutos !== null) return minutos < minutosAhora;
    return indiceFranja(tarea.franja) < indiceFranja(franjaActual!);
  };

  const pendientes = delDia.filter((tarea) => !completadas.includes(tarea.id));
  const proxima = useMemo(() => {
    if (pendientes.length === 0) return null;
    const ordenadas = [...pendientes].sort((a, b) => {
      const fa = indiceFranja(a.franja) - indiceFranja(b.franja);
      if (fa !== 0) return fa;
      return (minutosDeHora(a.hora) ?? 24 * 60) - (minutosDeHora(b.hora) ?? 24 * 60);
    });
    if (!esHoy || minutosAhora === null) return ordenadas[0];
    const futura = ordenadas.find((tarea) => {
      const minutos = minutosDeHora(tarea.hora);
      return minutos === null ? true : minutos >= minutosAhora;
    });
    return futura ?? ordenadas[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delDia, completadas, esHoy, minutosAhora]);

  const alternarConAviso = (tarea: Tarea) => {
    const estaba = completadas.includes(tarea.id);
    alternar(tarea.id);
    toast(estaba ? `"${tarea.titulo}" vuelve a estar pendiente` : `"${tarea.titulo}" hecha`, {
      action: { label: "Deshacer", onClick: () => alternar(tarea.id) },
      duration: 5000,
    });
  };

  const estaPlegada = (franja: Franja, tareasFranja: Tarea[]) => {
    const manual = plegadas[franja];
    if (manual !== undefined) return manual;
    if (diaPasado) return false;
    if (!esHoy || franjaActual === null) return false;
    const pasada = indiceFranja(franja) < indiceFranja(franjaActual);
    const todasHechas = tareasFranja.every((tarea) => completadas.includes(tarea.id));
    return pasada && todasHechas;
  };

  const guardar = (valores: Valores) => {
    const tipo = valores.recurrenciaTipo as "diaria" | "semanal" | "fecha";
    const recurrencia =
      tipo === "semanal"
        ? { tipo: "semanal" as const, dias: valores.recurrenciaDias as number[] }
        : tipo === "fecha"
          ? { tipo: "fecha" as const, fechas: limpiar(valores.recurrenciaFechas as string[]) }
          : { tipo: "diaria" as const };

    const comun = {
      franja: valores.franja as Franja,
      hora: (valores.hora as string).trim() || undefined,
      duracion: (valores.duracion as string).trim() || undefined,
      recurrencia,
    };

    const seccion = valores.seccion as string;
    if (seccion === "manual" && editando) {
      actualizar({ ...editando, ...comun });
      return;
    }

    const ficha = fichas[seccion]?.find((item) => item.id === (valores.fichaId as string));
    if (!ficha) return;

    const base = {
      ...comun,
      titulo: ficha.titulo,
      resumen: ficha.resumen,
      categoria: ficha.categoria,
      pasos: ficha.pasos,
      avisos: ficha.avisos,
      videoYoutube: ficha.videoYoutube,
      duracion: comun.duracion ?? ficha.duracion,
      origen: { seccion, fichaId: ficha.id },
    };

    if (editando) actualizar({ ...editando, ...base });
    else crear(base);
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
          <div className="mt-4 max-w-md">
            <div className="text-muted-foreground mb-2 flex items-center justify-between text-sm">
              <span>
                {hechas} de {delDia.length} tareas hechas
              </span>
              {ahora && esHoy ? (
                <span className="flex items-center gap-1 font-medium">
                  <Clock3 className="h-3.5 w-3.5" />
                  {horaCorta(ahora)}
                </span>
              ) : null}
              {delDia.length > 0 && hechas === delDia.length ? (
                <span className="text-primary font-medium">¡Día completo!</span>
              ) : null}
            </div>
            <Progress value={delDia.length ? (hechas / delDia.length) * 100 : 0} />
            {proxima ? (
              <button
                type="button"
                onClick={() => setAbierta(proxima)}
                className="border-primary/40 bg-primary/5 hover:bg-primary/10 focus-visible:ring-ring mt-3 flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="text-primary font-semibold">
                  {esHoy ? "Ahora:" : "Siguiente:"}
                </span>
                <span className="min-w-0 flex-1 truncate">{proxima.titulo}</span>
                {proxima.hora ? (
                  <span className="text-muted-foreground shrink-0">{proxima.hora}</span>
                ) : null}
              </button>
            ) : null}
          </div>
        </div>
        <Button
          onClick={() => {
            setEditando(null);
            setCreando(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Añadir tarea
        </Button>
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

        <div className="space-y-6">
          {FRANJAS.map((franja) => {
            const tareasFranja = delDia.filter((tarea) => tarea.franja === franja.id);
            if (tareasFranja.length === 0) return null;
            const plegada = estaPlegada(franja.id, tareasFranja);
            const hechasFranja = tareasFranja.filter((tarea) =>
              completadas.includes(tarea.id),
            ).length;
            const enCurso = esHoy && franjaActual === franja.id;

            return (
              <section
                key={franja.id}
                className={
                  enCurso ? "border-primary/40 bg-primary/5 rounded-2xl border p-3 md:p-4" : ""
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    setPlegadas((previo) => ({ ...previo, [franja.id]: !plegada }))
                  }
                  aria-expanded={!plegada}
                  className="focus-visible:ring-ring mb-3 flex w-full items-center gap-2 text-left focus-visible:ring-2 focus-visible:outline-none"
                >
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${plegada ? "-rotate-90" : ""}`}
                  />
                  <h2
                    className={`text-sm font-semibold tracking-wide uppercase ${enCurso ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {franja.etiqueta}
                  </h2>
                  {enCurso ? (
                    <span className="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                      En curso
                    </span>
                  ) : null}
                  <span className="text-muted-foreground ml-auto text-xs">
                    {hechasFranja}/{tareasFranja.length}
                  </span>
                </button>
                <div className={`space-y-3 ${plegada ? "hidden" : ""}`}>
                  {tareasFranja.map((tarea, indice) => (
                    <TareaItem
                      key={tarea.id}
                      tarea={tarea}
                      hecha={completadas.includes(tarea.id)}
                      atrasada={estaAtrasada(tarea)}
                      proxima={proxima?.id === tarea.id}
                      onAbrir={() => setAbierta(tarea)}
                      onAlternar={() => alternarConAviso(tarea)}
                      puedeSubir={indice > 0}
                      puedeBajar={indice < tareasFranja.length - 1}
                      onSubir={() =>
                        indice > 0 && intercambiar(tarea.id, tareasFranja[indice - 1].id)
                      }
                      onBajar={() =>
                        indice < tareasFranja.length - 1 &&
                        intercambiar(tarea.id, tareasFranja[indice + 1].id)
                      }
                      onEditar={() => {
                        setCreando(false);
                        setEditando(tarea);
                      }}
                      onEliminar={() => eliminar(tarea.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {delDia.length === 0 ? (
            <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center">
              No hay tareas programadas para este día.
            </p>
          ) : null}
        </div>
      </div>

      {abierta ? (
        <FichaDialogo
          abierto
          onOpenChange={(valor) => !valor && setAbierta(null)}
          titulo={abierta.titulo}
          resumen={abierta.resumen}
          pasos={abierta.pasos}
          avisos={abierta.avisos}
          videoYoutube={abierta.videoYoutube}
          meta={
            <>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORIAS[abierta.categoria].clase}`}
              >
                {SECCIONES.find((item) => item.clave === abierta.origen?.seccion)?.etiqueta ??
                  CATEGORIAS[abierta.categoria].etiqueta}
              </span>
              {abierta.hora ? (
                <Badge variant="secondary" className="font-normal">
                  {abierta.hora}
                </Badge>
              ) : null}
              {abierta.duracion ? (
                <Badge variant="secondary" className="font-normal">
                  {abierta.duracion}
                </Badge>
              ) : null}
            </>
          }
        />
      ) : null}

      <EditorDialogo
        abierto={creando || editando !== null}
        onOpenChange={(valor) => {
          if (!valor) {
            setCreando(false);
            setEditando(null);
          }
        }}
        titulo={editando ? "Editar tarea" : "Programar tarea"}
        descripcion="Elige una ficha ya creada en una sección y programa cuándo hay que hacerla."
        campos={campos(fichas, editando !== null && !editando.origen)}
        valores={
          editando
            ? aValores(editando)
            : valoresVacios(seleccionada, fichas[SECCIONES[0].clave]?.[0]?.id)
        }
        onGuardar={guardar}
      />

      <p className="border-border text-muted-foreground mt-12 border-t pt-6 text-sm">
        Esta web es una ayuda organizativa para el equipo de cuidados. No sustituye las
        indicaciones del equipo médico.
      </p>
    </main>
  );
}
