export default function Feature({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="p-4 rounded-lg border border-white/6 glass-panel bg-white/10">
      <div className="font-medium">{label}</div>
      <p className="text-white/70 text-sm mt-1">{description}</p>
    </div>
  );
}
