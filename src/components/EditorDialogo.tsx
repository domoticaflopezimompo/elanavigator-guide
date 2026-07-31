import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type Campo = {
  nombre: string;
  etiqueta: string;
  tipo: "texto" | "area" | "lista" | "select" | "dias";
  marcador?: string;
  ayuda?: string;
  opciones?: { valor: string; etiqueta: string }[];
};

export type Valores = Record<string, string | string[] | number[]>;

const DIAS = [
  { valor: 1, etiqueta: "L" },
  { valor: 2, etiqueta: "M" },
  { valor: 3, etiqueta: "X" },
  { valor: 4, etiqueta: "J" },
  { valor: 5, etiqueta: "V" },
  { valor: 6, etiqueta: "S" },
  { valor: 0, etiqueta: "D" },
];

interface Props {
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  titulo: string;
  descripcion?: string;
  /** Lista de campos, o una función que los calcula según los valores actuales. */
  campos: Campo[] | ((estado: Valores) => Campo[]);
  valores: Valores;
  onGuardar: (valores: Valores) => void;
}

export function EditorDialogo({
  abierto,
  onOpenChange,
  titulo,
  descripcion,
  campos,
  valores,
  onGuardar,
}: Props) {
  const [estado, setEstado] = useState<Valores>(valores);

  useEffect(() => {
    if (abierto) setEstado(valores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  const cambiar = (nombre: string, valor: string | string[] | number[]) =>
    setEstado((previo) => ({ ...previo, [nombre]: valor }));

  const listaCampos = typeof campos === "function" ? campos(estado) : campos;

  // Si un desplegable depende de otro y su valor ya no existe, cae a la primera opción.
  useEffect(() => {
    if (!abierto) return;
    const ajustes: Valores = {};
    for (const campo of listaCampos) {
      if (campo.tipo !== "select" || !campo.opciones?.length) continue;
      const actual = estado[campo.nombre] as string | undefined;
      if (!campo.opciones.some((opcion) => opcion.valor === actual)) {
        ajustes[campo.nombre] = campo.opciones[0].valor;
      }
    }
    if (Object.keys(ajustes).length > 0) setEstado((previo) => ({ ...previo, ...ajustes }));
  });

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          {descripcion ? <DialogDescription>{descripcion}</DialogDescription> : null}
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(evento) => {
            evento.preventDefault();
            onGuardar(estado);
            onOpenChange(false);
          }}
        >
          {listaCampos.map((campo) => {
            const id = `campo-${campo.nombre}`;
            const valor = estado[campo.nombre];

            return (
              <div key={campo.nombre} className="space-y-1.5">
                <Label htmlFor={id}>{campo.etiqueta}</Label>

                {campo.tipo === "texto" ? (
                  <Input
                    id={id}
                    value={(valor as string) ?? ""}
                    placeholder={campo.marcador}
                    onChange={(evento) => cambiar(campo.nombre, evento.target.value)}
                  />
                ) : null}

                {campo.tipo === "area" ? (
                  <Textarea
                    id={id}
                    rows={3}
                    value={(valor as string) ?? ""}
                    placeholder={campo.marcador}
                    onChange={(evento) => cambiar(campo.nombre, evento.target.value)}
                  />
                ) : null}

                {campo.tipo === "lista" ? (
                  <Textarea
                    id={id}
                    rows={5}
                    value={((valor as string[]) ?? []).join("\n")}
                    placeholder={campo.marcador}
                    onChange={(evento) =>
                      cambiar(
                        campo.nombre,
                        evento.target.value.split("\n").map((linea) => linea.trimStart()),
                      )
                    }
                  />
                ) : null}

                {campo.tipo === "select" ? (
                  <select
                    id={id}
                    value={(valor as string) ?? ""}
                    onChange={(evento) => cambiar(campo.nombre, evento.target.value)}
                    className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-base focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {(campo.opciones ?? []).map((opcion) => (
                      <option key={opcion.valor} value={opcion.valor}>
                        {opcion.etiqueta}
                      </option>
                    ))}
                  </select>
                ) : null}

                {campo.tipo === "dias" ? (
                  <div className="flex flex-wrap gap-2">
                    {DIAS.map((dia) => {
                      const seleccionados = (valor as number[]) ?? [];
                      const activo = seleccionados.includes(dia.valor);
                      return (
                        <button
                          key={dia.valor}
                          type="button"
                          aria-pressed={activo}
                          onClick={() =>
                            cambiar(
                              campo.nombre,
                              activo
                                ? seleccionados.filter((valorDia) => valorDia !== dia.valor)
                                : [...seleccionados, dia.valor],
                            )
                          }
                          className={[
                            "h-10 w-10 rounded-full border text-sm font-semibold transition",
                            activo
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:bg-muted",
                          ].join(" ")}
                        >
                          {dia.etiqueta}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {campo.ayuda ? (
                  <p className="text-muted-foreground text-xs">{campo.ayuda}</p>
                ) : null}
              </div>
            );
          })}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}