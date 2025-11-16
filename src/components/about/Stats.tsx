export default function Stats() {
  const stats = [
    { label: "Years", value: "8+" },
    { label: "Products", value: "120+" },
    { label: "Cities", value: "25" },
  ];
  return (
    <dl className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="glass-panel bg-white/10 p-4 rounded-lg border border-white/8"
        >
          <dt className="text-xs text-white/60">{s.label}</dt>
          <dd className="mt-1 text-2xl font-semibold">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
