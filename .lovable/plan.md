# Mejoras de usabilidad y funciones nuevas

Enfoque: que el día a día se resuelva en menos toques y que lo importante esté visible sin abrir nada. Se mantiene el estilo actual (azul-verde, Manrope) y todas las secciones tal como están.

## 1. La pantalla "Hoy" como centro de mando

- **Barra de estado del día**: "X de Y tareas hechas", hora actual y la próxima tarea pendiente destacada ("Ahora: Aspiración de secreciones — 11:00").
- **Franja actual resaltada**: mañana / mediodía / tarde / noche; la franja en curso aparece abierta y las pasadas se pliegan.
- **Marcar sin abrir**: casilla grande a la izquierda de cada tarea para completarla de un toque, con deshacer inmediato. Abrir la ficha sigue siendo un toque en el texto.
- **Tareas atrasadas**: las de horas ya pasadas sin completar se marcan en rojo suave con la etiqueta "Pendiente".

## 2. Búsqueda global

Buscador en la cabecera que filtra por título en todas las secciones (medicación, cuidados, ejercicios, logopedia, teléfonos, información) y abre la ficha directamente. Útil cuando un cuidador nuevo no sabe en qué sección está algo.

## 3. Notas del turno

Bloque en "Hoy" para escribir observaciones del día (guardadas en la nube, visibles en todos los dispositivos), con fecha y acceso a las de días anteriores. Es lo que ahora se resuelve en papel o por WhatsApp.

## 4. Legibilidad y toques más cómodos

- Botón de **texto grande** que aumenta la tipografía de fichas y tareas, recordado por dispositivo.
- Áreas de pulsación mínimas de 44px; iconos de editar/eliminar algo más separados.
- Cabecera de navegación con scroll horizontal en móvil en vez de comprimir 9 iconos.

## 5. Acceso rápido de emergencia

Botón fijo abajo a la derecha con los teléfonos marcados como urgentes (llamada directa), disponible desde cualquier página.

## 6. Hoja del día imprimible

Botón para generar una hoja del día con tareas, horarios y medicación con dosis. Sirve para dejarla en la nevera o para el relevo de cuidador.

## Detalles técnicos

- Nueva tabla `notas_turno` (fecha, texto, autor opcional) con RLS y GRANT, siguiendo el patrón de las colecciones actuales.
- "Texto grande" y franjas plegadas se guardan en el navegador; el resto sincronizado en la nube.
- La búsqueda se construye sobre `src/lib/secciones.ts` (ya normaliza todas las fichas) más teléfonos e información.
- Barra de "Hoy" y franjas dentro de `src/routes/index.tsx` y `TareaItem.tsx`; sin cambios en el modelo de tareas.
- Vista imprimible con CSS `@media print` en una ruta `/hoy/imprimir`.

## Orden sugerido

1. Pantalla "Hoy" (barra de estado, franjas, marcar de un toque, atrasadas)
2. Búsqueda global + acceso rápido de emergencia
3. Notas del turno
4. Legibilidad, navegación móvil e impresión