/** Convierte un archivo de imagen en una URL de datos redimensionada (para guardarla en la base). */
export async function archivoAImagen(archivo: File, maximo = 1200): Promise<string> {
  const dataUrl = await new Promise<string>((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver(String(lector.result));
    lector.onerror = () => rechazar(lector.error);
    lector.readAsDataURL(archivo);
  });

  try {
    const imagen = await new Promise<HTMLImageElement>((resolver, rechazar) => {
      const elemento = new Image();
      elemento.onload = () => resolver(elemento);
      elemento.onerror = rechazar;
      elemento.src = dataUrl;
    });

    const escala = Math.min(1, maximo / Math.max(imagen.width, imagen.height));
    if (escala === 1 && dataUrl.length < 400_000) return dataUrl;

    const lienzo = document.createElement("canvas");
    lienzo.width = Math.round(imagen.width * escala);
    lienzo.height = Math.round(imagen.height * escala);
    const contexto = lienzo.getContext("2d");
    if (!contexto) return dataUrl;
    contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
    return lienzo.toDataURL("image/jpeg", 0.8);
  } catch {
    return dataUrl;
  }
}
