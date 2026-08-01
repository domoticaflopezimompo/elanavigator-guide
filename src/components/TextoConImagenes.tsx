/** Muestra texto respetando saltos de línea y convierte las URL de imagen en imágenes. */
const ES_IMAGEN = /^(https?:\/\/\S+\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?\S*)?|data:image\/\S+)$/i;

export function TextoConImagenes({ texto, className }: { texto: string; className?: string }) {
  const lineas = (texto ?? "").split("\n");

  return (
    <div className={className}>
      {lineas.map((linea, indice) => {
        const valor = linea.trim();
        if (!valor) return <div key={indice} className="h-2" />;
        if (ES_IMAGEN.test(valor)) {
          return (
            <img
              key={indice}
              src={valor}
              alt=""
              loading="lazy"
              className="border-border my-2 max-h-72 w-full rounded-xl border object-contain"
            />
          );
        }
        return (
          <p key={indice} className="leading-relaxed">
            {valor}
          </p>
        );
      })}
    </div>
  );
}