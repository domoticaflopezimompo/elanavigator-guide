export function VideoYoutube({ id, titulo }: { id: string; titulo: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted">
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
          title={titulo}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}