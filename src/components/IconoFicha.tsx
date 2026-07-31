/** Muestra el icono de una ficha: emoji, texto corto o imagen (URL). */
export function IconoFicha({
  icono,
  className = "",
}: {
  icono?: string;
  className?: string;
}) {
  const valor = icono?.trim();
  if (!valor) return null;

  const esImagen = /^(https?:\/\/|\/|data:image)/.test(valor);

  return (
    <span
      aria-hidden
      className={`bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-xl leading-none ${className}`}
    >
      {esImagen ? (
        <img src={valor} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        valor
      )}
    </span>
  );
}