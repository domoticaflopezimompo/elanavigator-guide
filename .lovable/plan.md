# Plan: Dependencia googleapis — verificación sin añadir dependencias

## Decisión

**Se mantiene `fetch`, NO se añade `googleapis`.**

El código real de `src/lib/google-calendar.server.ts` no usa la biblioteca `googleapis` en ningún punto:
- `obtenerAccessToken()` hace un `POST` con `fetch` a `https://oauth2.googleapis.com/token` (client_id, client_secret, refresh_token).
- `obtenerCitasDelDia()` hace un `GET` con `fetch` a `https://www.googleapis.com/calendar/v3/calendars/{id}/events` con el access token en la cabecera `Authorization`.

Por tanto, `npm list googleapis` devolviendo vacío y su ausencia en `package.json` es **correcto y esperado**, no un error. Añadir la dependencia sería código muerto, justo lo que el requisito 4 prohíbe.

## Trabajo a realizar (sin cambios de código)

1. **Verificación de ausencia de importaciones** — confirmar con búsqueda que ningún archivo del proyecto importa `googleapis` ni `google-auth-library`.
2. **Verificación del endpoint local** — confirmar que `src/routes/api/calendar/events.ts` sigue siendo el endpoint `GET /api/calendar/events` y solo llama a `obtenerCitasDelDia` del módulo servidor.
3. **Verificación de secretos solo en servidor**:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` y `TZ` solo se leen vía `process.env` dentro de `src/lib/google-calendar.server.ts` (módulo `*.server.ts`, nunca importado por el frontend).
   - El frontend (`src/lib/calendar.ts`) solo llama a `/api/calendar/events` y no contiene credenciales.
   - `.env.example` documenta las variables sin valores reales.
4. **Comprobaciones de build**:
   - `npm install` (o `bun install` según el gestor del repo)
   - typecheck
   - `npm run build`
5. **Informe final** indicando:
   - Decisión: fetch mantenido, sin `googleapis`.
   - Archivos modificados: ninguno (salvo que una comprobación revele un problema real).
   - Resultados de install / typecheck / build.
   - Comandos para Ubuntu: ninguno nuevo; basta `git pull && ./deploy.sh` (o `npm install && npm run build && pm2 restart`).

## Notas

- No se hace commit ni push.
- Si alguna comprobación revela un fallo real, se corrige y se informa.
