import TeamCard from "./TeamCard";

export default function TeamGrid() {
  const people = [
    {
      name: "Asha Rao",
      title: "Founder & Product",
      bio: "Design-led engineer, rides every weekend.",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Dev Patel",
      title: "Head of Engineering",
      bio: "Keeps products light and strong.",
      img: "https://images.unsplash.com/photo-1545996124-1b4a8b54f1b6?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Maya Singh",
      title: "Operations",
      bio: "Logistics and customer care.",
      img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop",
    },
    {
      name: "Leo Park",
      title: "Design Lead",
      bio: "Crafts minimal, durable details.",
      img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <div
      id="team"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {people.map((p) => (
        <TeamCard key={p.name} {...p} />
      ))}
    </div>
  );
}
