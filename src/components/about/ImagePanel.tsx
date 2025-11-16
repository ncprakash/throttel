export default function ImagePanel({
  title,
  subtitle,
  src,
}: {
  title: string;
  subtitle: string;
  src: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden glass-panel bg-white/10 border border-white/8">
      <div className="relative h-48">
        <img src={src} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <h4 className="font-semibold">{title}</h4>
        <p className="mt-2 text-white/70 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
