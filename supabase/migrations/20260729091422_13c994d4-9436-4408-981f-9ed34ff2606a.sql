ALTER TABLE public.colecciones REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.colecciones;