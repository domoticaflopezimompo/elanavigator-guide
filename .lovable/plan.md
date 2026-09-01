# Hoy: pestañas Paciente y Cuidador

La pantalla **Hoy** se divide en dos agendas independientes con el mismo diseño y funcionamiento.

## Paciente
Exactamente lo que hay hoy: barra de estado del día, franjas, tareas ligadas a fichas de las secciones generales, citas del calendario de Google (badge naranja), marcar/deshacer, reordenar, editar y eliminar.

## Cuidador
Misma interfaz y mismas opciones, pero con su propia lista de tareas:
- Se crean igual que en Paciente: elegir sección general → ficha existente, y luego franja, hora, duración, repetición y días.
- Lista, orden y contenido totalmente separados de la agenda del paciente.
- Sin citas del calendario (esas siguen solo en Paciente).
- Progreso del día, "Ahora", tareas atrasadas y popup de ficha funcionan igual.

## Navegación
Dos pestañas encima del contenido ("Paciente" / "Cuidador"), con el mismo estilo de pestañas que ya usan Ejercicios, Logopedia e Información. El calendario de fechas y la cabecera del día permanecen visibles para ambas.

## Detalles técnicos
- Nueva colección `tareas_cuidador` en la tabla `colecciones` (mismo hook `useColeccion`), inicialmente vacía. La colección actual `tareas` sigue siendo la del paciente.
- `src/routes/index.tsx` se refactoriza: el bloque de agenda (estado del día, franjas, editor, diálogo de ficha) pasa a un componente reutilizable `AgendaDia` con props `clave`, `items`, handlers CRUD y `citas` opcionales. La ruta renderiza las pestañas y una instancia por agenda.
- Las tareas completadas se guardan por día y por agenda: se amplía `useCompletadas` para aceptar un sufijo (`paciente` / `cuidador`) y no mezclar los checks.
- Sin cambios en el resto de secciones ni en la integración de Google Calendar.
