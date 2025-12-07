import TeamCard from "./TeamCard";

export default function TeamGrid() {
  const people = [
    {
      name: "Aditya J",
      title: "",
      bio: "Co-Founder & Director of Finance & Operations",
      img: "team/Aditya.jpg",
    },
    {
      name: "M Gourav",
      title: "",
      bio: "Co-Founder & Director of Marketing & Product Development",
      img: "team/Gourav.jpeg",
    },
    {
      name: "Kushal",
      title: "",
      bio: "Head of Content & Media Production",
      img: "team/Kushal.jpeg",
    },
  ];

  return (
    <div
      id="team"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {people.map((p) => (
        <TeamCard key={p.name} {...p} />
      ))}
    </div>
  );
}
