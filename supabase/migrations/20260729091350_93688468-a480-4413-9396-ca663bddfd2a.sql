CREATE TABLE public.colecciones (
  clave TEXT PRIMARY KEY,
  datos JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.colecciones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.colecciones TO authenticated;
GRANT ALL ON public.colecciones TO service_role;

ALTER TABLE public.colecciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede leer las colecciones"
  ON public.colecciones FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede crear colecciones"
  ON public.colecciones FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede actualizar las colecciones"
  ON public.colecciones FOR UPDATE
  USING (true) WITH CHECK (true);