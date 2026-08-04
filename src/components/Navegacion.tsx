import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  Pill,
  HeartPulse,
  Dumbbell,
  MessageCircle,
  Phone,
  ShieldAlert,
  Home,
  UtensilsCrossed,
  Loader2,
} from "lucide-react";

const ENLACES = [
  { to: "/", etiqueta: "Hoy", Icono: CalendarDays },
  { to: "/medicacion", etiqueta: "Medicación", Icono: Pill },
  { to: "/cuidados", etiqueta: "Cuidados", Icono: HeartPulse },
  { to: "/ejercicios", etiqueta: "Ejercicios", Icono: Dumbbell },
  { to: "/logopedia", etiqueta: "Logopedia", Icono: MessageCircle },
  { to: "/emergencias", etiqueta: "Emergencias", Icono: ShieldAlert },
  { to: "/telefonos", etiqueta: "Teléfonos", Icono: Phone },
  { to: "/informacion", etiqueta: "Información", Icono: Home },
] as const;

const URL_COMIDAS = "http://192.168.1.15:8123/8c37d706_mealie_planner";

function useAbrirComidas() {
  const [abriendo, setAbriendo] = useState(false);
  const abrir = () => {
    setAbriendo(true);
    window.open(URL_COMIDAS, "_blank", "noopener,noreferrer");
    setTimeout(() => setAbriendo(false), 2500);
  };
  return { abriendo, abrir };
}

export function CabeceraEscritorio() {
  const { abriendo, abrir } = useAbrirComidas();
  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-background/85 backdrop-blur md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            EC
          </span>
          <span className="text-base font-semibold">Equipo de cuidados</span>
        </Link>
        <nav className="flex items-center gap-1">
          {ENLACES.map(({ to, etiqueta, Icono }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className={
                to === "/emergencias"
                  ? "flex items-center gap-2 rounded-lg bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground transition hover:opacity-90"
                  : "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              }
              activeProps={
                to === "/emergencias" ? undefined : { className: "bg-muted text-foreground" }
              }
            >
              <Icono className="h-4 w-4" />
              {etiqueta}
            </Link>
          ))}
          <button
            type="button"
            onClick={abrir}
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
          >
            {abriendo ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
            )}
            {abriendo ? "Abriendo…" : "Comidas"}
          </button>
        </nav>
      </div>
    </header>
  );
}

export function BarraMovil() {
  const { abriendo, abrir } = useAbrirComidas();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-9">
        {ENLACES.map(({ to, etiqueta, Icono }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className={
              to === "/emergencias"
                ? "flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-destructive"
                : "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
            }
            activeProps={to === "/emergencias" ? undefined : { className: "text-primary" }}
          >
            <Icono className="h-5 w-5" />
            {etiqueta}
          </Link>
        ))}
        <button
          type="button"
          onClick={abrir}
          className="text-muted-foreground flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
        >
          {abriendo ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
          )}
          {abriendo ? "Abriendo…" : "Comidas"}
        </button>
      </div>
    </nav>
  );
}