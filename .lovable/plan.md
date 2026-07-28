## Objetivo

Una web sencilla, práctica y moderna para el equipo de cuidadores: qué hay que hacer hoy, cómo hacerlo (vídeo o instrucciones), qué medicación toca y a quién llamar en una urgencia.

Sin login y sin base de datos: todo el contenido vive en archivos de datos dentro del proyecto, así puedes exportar el código y desplegarlo en tu propia infraestructura como una web estática/Node.

## Páginas

1. **Inicio / Hoy** (`/`) — la pantalla principal
   - Cabecera con la fecha y el resumen del día ("6 de 9 tareas hechas").
   - **Calendario mensual** compacto: al pulsar un día se muestran las tareas de ese día.
   - **Lista de tareas del día** agrupada por franja (mañana / mediodía / tarde / noche), con icono de categoría (medicación, ejercicio, logopedia, higiene, comida).
   - Al pulsar una tarea → **popup** con: descripción paso a paso, avisos importantes, y vídeo de YouTube incrustado si la tarea lo tiene.
   - Checkbox para marcar como hecha; se guarda en el navegador (por día) para que el turno siguiente vea el estado. Sin backend esto es local a cada dispositivo — lo indicaré con un aviso discreto.

2. **Medicación** (`/medicacion`) — tabla clara por horario: fármaco, dosis, vía, con/sin comida, notas y qué hacer si se olvida una toma.

3. **Ejercicios** (`/ejercicios`) — fichas de movilidad/respiración con series, frecuencia, precauciones y vídeo en popup.

4. **Logopedia** (`/logopedia`) — ejercicios de voz, deglución y pautas de alimentación segura (espesantes, postura), con vídeo en popup.

5. **Emergencias** (`/emergencias`) — teléfonos grandes y pulsables (`tel:`): 112, neumología/UCRI, enfermera de referencia, médico de cabecera, familia. Bloque de "qué hacer si…" (atragantamiento, disnea, fallo del ventilador/aspirador) siempre visible arriba.

Navegación fija: en móvil barra inferior con 5 iconos, en escritorio cabecera superior. Botón rojo de emergencias siempre accesible.

## Diseño

Moderno pero calmado y legible: fondo claro, tipografía grande (pensado para leer con prisa), tarjetas con esquinas suaves, color de acento azul-verde y rojo reservado solo para emergencias. Todo con tokens del sistema de diseño, responsive y con buen contraste.

## Contenido

Rellenaré todo con contenido realista de ejemplo para ELA (medicación tipo riluzol, ejercicios de movilidad pasiva y respiratorios, pautas de deglución, teléfonos de plantilla). Después me pasas los datos reales y los sustituyo, o los editas tú en un único archivo.

## Detalles técnicos

- TanStack Start + React + Tailwind, una ruta por sección con su propio `head()` para SEO.
- Todo el contenido en `src/data/` (`tareas.ts`, `medicacion.ts`, `ejercicios.ts`, `logopedia.ts`, `contactos.ts`) — un solo sitio donde editar.
- Las tareas se definen con recurrencia (diaria, días concretos de la semana, o fecha puntual) y el calendario las expande por día.
- Popup con el componente Dialog de shadcn; los vídeos de YouTube se incrustan con `youtube-nocookie` y carga diferida. Cada tarea puede llevar vídeo, texto, o ambos.
- Estado de "tarea completada" en `localStorage` por fecha, sin datos personales.
- Sin Lovable Cloud: el resultado es un proyecto que puedes construir y alojar tú (por ejemplo con `bun run build` y servirlo desde tu servidor).

## Aviso

Añadiré una nota al pie: la web es una ayuda organizativa, no sustituye las indicaciones del equipo médico.
