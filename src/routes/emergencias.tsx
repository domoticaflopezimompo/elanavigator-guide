import { createFileRoute } from "@tanstack/react-router";
import { Phone, ShieldAlert } from "lucide-react";
import { Pagina } from "@/components/Pagina";
import { contactos, protocolos } from "@/data/contactos";

const TITULO = "Teléfonos de emergencia — Cuidados ELA";
const DESCRIPCION =
  "Teléfonos de emergencia del equipo de cuidados y protocolo de actuación ante atragantamiento, disnea o fallo del ventilador.";

export const Route = createFileRoute("/emergencias")({
  head: () => ({
    meta: [
      { title: TITULO },
      { name: "description", content: DESCRIPCION },
      { property: "og:title", content: TITULO },
      { property: "og:description", content: DESCRIPCION },
    ],
  }),
  component: EmergenciasPage,
});

function EmergenciasPage() {
  return (
    <Pagina
      titulo="Emergencias"
      descripcion="Pulsa un número para llamar directamente. Mantén la calma y ve por orden."
    >
      <section className="mb-8 grid gap-3 sm:grid-cols-2">
        {contactos.map((contacto) => (
          <a
            key={contacto.id}
            href={`tel:${contacto.telefono.replace(/\s/g, "")}`}
            className={[
              "flex items-center gap-4 rounded-2xl border p-5 transition",
              contacto.urgente
                ? "border-destructive/40 bg-destructive/5 hover:bg-destructive/10"
                : "border-border bg-card hover:border-primary/40 hover:shadow-sm",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                contacto.urgente
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary/10 text-primary",
              ].join(" ")}
            >
              <Phone className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-semibold">{contacto.nombre}</span>
              <span className="block text-sm text-muted-foreground">{contacto.rol}</span>
              <span
                className={[
                  "mt-1 block text-xl font-bold tracking-tight",
                  contacto.urgente ? "text-destructive" : "text-primary",
                ].join(" ")}
              >
                {contacto.telefono}
              </span>
              {contacto.nota ? (
                <span className="mt-1 block text-sm text-muted-foreground">{contacto.nota}</span>
              ) : null}
            </span>
          </a>
        ))}
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          Qué hacer si…
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {protocolos.map((protocolo) => (
            <article key={protocolo.id} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-lg font-semibold">{protocolo.situacion}</h3>
              <ol className="mt-3 space-y-2">
                {protocolo.pasos.map((paso, indice) => (
                  <li key={paso} className="flex gap-3 text-base leading-relaxed">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-sm font-semibold text-destructive">
                      {indice + 1}
                    </span>
                    <span>{paso}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </Pagina>
  );
}