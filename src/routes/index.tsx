import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Calendario } from "@/components/Calendario";
import { TareaItem } from "@/components/TareaItem";
import { FichaDialogo } from "@/components/FichaDialogo";
import { EditorDialogo, type Campo, type Valores } from "@/components/EditorDialogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCompletadas } from "@/hooks/use-completadas";
import { useColeccion } from "@/hooks/use-coleccion";
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
  formatoLargo,
  tareasDelDia,
} from "@/lib/agenda";
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

  const { items, crear, actualizar, eliminar, intercambiar } = useColeccion<Tarea>(
    "tareas",
    tareasIniciales,
  );
  const clave = claveFecha(seleccionada);
  const { completadas, alternar } = useCompletadas(clave);
  const delDia = useMemo(() => tareasDelDia(seleccionada, items), [seleccionada, items]);
  const hechas = delDia.filter((tarea) => completadas.includes(tarea.id)).length;

  const guardar = (valores: Valores) => {
    const tipo = valores.recurrenciaTipo as "diaria" | "semanal" | "fecha";
    const base = {
      titulo: (valores.titulo as string).trim() || "Sin título",
      resumen: valores.resumen as string,
      categoria: valores.categoria as Categoria,
      franja: valores.franja as Franja,
      hora: (valores.hora as string).trim() || undefined,
      duracion: (valores.duracion as string).trim() || undefined,
      pasos: limpiar(valores.pasos as string[]),
      avisos: limpiar(valores.avisos as string[]),
      videoYoutube: (valores.videoYoutube as string).trim() || undefined,
      recurrencia:
        tipo === "semanal"
          ? { tipo: "semanal" as const, dias: valores.recurrenciaDias as number[] }
          : tipo === "fecha"
            ? { tipo: "fecha" as const, fechas: limpiar(valores.recurrenciaFechas as string[]) }
            : { tipo: "diaria" as const },
    };
    if (editando) actualizar({ ...editando, ...base });
    else crear(base);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pt-6 pb-28 md:px-6 md:pb-16">
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
              {delDia.length > 0 && hechas === delDia.length ? (
                <span className="text-primary font-medium">¡Día completo!</span>
              ) : null}
            </div>
            <Progress value={delDia.length ? (hechas / delDia.length) * 100 : 0} />
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

            return (
              <section key={franja.id}>
                <h2 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
                  {franja.etiqueta}
                </h2>
                <div className="space-y-3">
                  {tareasFranja.map((tarea, indice) => (
                    <TareaItem
                      key={tarea.id}
                      tarea={tarea}
                      hecha={completadas.includes(tarea.id)}
                      onAbrir={() => setAbierta(tarea)}
                      onAlternar={() => alternar(tarea.id)}
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
              <Badge variant="secondary" className="font-normal">
                {CATEGORIAS[abierta.categoria].etiqueta}
              </Badge>
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
        titulo={editando ? "Editar tarea" : "Nueva tarea"}
        campos={CAMPOS}
        valores={editando ? aValores(editando) : valoresVacios(seleccionada)}
        onGuardar={guardar}
      />

      <p className="border-border text-muted-foreground mt-12 border-t pt-6 text-sm">
        Esta web es una ayuda organizativa para el equipo de cuidados. No sustituye las
        indicaciones del equipo médico.
      </p>
    </main>
  );
}
