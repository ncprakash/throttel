export default function TeamCard({
  name,
  title,
  bio,
  img,
}: {
  name: string;
  title: string;
  bio: string;
  img: string;
}) {
  return (
    <article className="glass-panel bg-white/10 p-5 rounded-xl border border-white/8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-white/4">
          <img src={img} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-white/60 text-sm">{title}</div>
        </div>
      </div>
      <p className="mt-3 text-white/70 text-sm">{bio}</p>
    </article>
  );
}
