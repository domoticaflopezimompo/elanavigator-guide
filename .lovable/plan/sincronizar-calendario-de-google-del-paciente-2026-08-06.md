# Sincronizar calendario de Google del paciente

## Objetivo
Leer las citas del calendario de Google del paciente y mostrarlas en la sección **Hoy** junto al resto de tareas, con un color/badge propio de "Cita".

## Requisitos previos
- Conectar el conector **Google Calendar** al proyecto desde Lovable (cuenta del paciente). Esto genera las variables de entorno necesarias para llamar a la API desde el backend.

## Pasos de implementación

### 1. Conexión con Google Calendar
- Usar el conector `google_calendar` (ya disponible en el workspace).
- Enlazar la cuenta de Google del paciente al proyecto para obtener las credenciales de gateway.
- Guardar el `calendarId` objetivo (por defecto `primary`) en una nueva fila de configuración en Supabase, editable desde ajustes.

### 2. Backend: leer eventos del día
- Crear una `createServerFn` protegida o pública según el nivel de privacidad deseado que:
  - Llame al gateway de Lovable: `https://connector-gateway.lovable.dev/google_calendar/calendar/v3/calendars/{calendarId}/events`.
  - Pase el rango de tiempo del día actual (`timeMin`/`timeMax` en formato ISO).
  - Devuelva solo los campos necesarios: título, hora de inicio, hora de fin, ubicación, descripción y enlace a Google Calendar.
- Manejar errores de conexión (credenciales caducadas, calendario no accesible) devolviendo un mensaje claro al frontend.

### 3. Modelo de datos
- Añadir una tabla `configuracion` (o reutilizar `colecciones` con clave `config`) para guardar:
  - `google_calendar_id`: ID del calendario (por defecto `primary`).
  - `google_calendar_enabled`: booleano para activar/desactivar la sincronización.
- Añadir GRANTs y políticas RLS adecuadas si la tabla es nueva.

### 4. Sección Hoy: mostrar citas mezcladas con tareas
- En `src/routes/index.tsx`, al cargar el día actual, combinar:
  - Las tareas propias de la app (ya existentes).
  - Las citas de Google Calendar obtenidas vía server fn.
- Ordenar todas juntas por hora.
- Renderizar las citas con:
  - Badge "Cita" con color distintivo (por ejemplo, naranja o violeta).
  - Hora de inicio y fin.
  - Título de la cita.
  - Ubicación si existe.
  - Enlace directo a Google Calendar para abrir el evento.
- Las citas no se marcan como completables; son informativas.

### 5. Pantalla de ajustes / configuración del calendario
- Crear una ruta o sección dentro de ajustes (`/ajustes` o similar) con:
  - Toggle para activar/desactivar Google Calendar.
  - Campo de texto para indicar el `calendarId` (por defecto `primary`).
  - Botón "Probar conexión" que llame a la server fn y muestre las próximas citas.
  - Mensaje de estado si la conexión falla.

### 6. Manejo de errores y estados
- Mostrar un aviso amable en Hoy si:
  - El calendario no está configurado.
  - La conexión con Google falla.
  - No hay citas para hoy.
- No bloquear el resto de la agenda si Google Calendar no responde.

## Notas técnicas
- Las llamadas a Google Calendar se harán **desde el servidor** a través del gateway de Lovable; nunca desde el navegador.
- No se almacenarán las citas en base de datos de forma permanente; se leerán bajo demanda para el día actual.
- El conector es de tipo App connector (cuenta compartida del proyecto), no App User Connector, porque se trata del calendario único del paciente visible para todos los cuidadores.
