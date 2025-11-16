import Feature from "./Feature";

export default function Philosophy() {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold">Our philosophy</h3>
      <p className="text-white/70 max-w-3xl">
        We build accessories that focus on core rider needs: reliability,
        unobtrusive form, and honest value. Our team iterates quickly, tests in
        the field, and ships improvements — not promises.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Feature
          label="Durability"
          description="Materials selected for longevity and low maintenance."
        />
        <Feature
          label="Simplicity"
          description="No unnecessary bells — only the features that matter."
        />
        <Feature
          label="Transparency"
          description="Clear specs and repair guidance for every product."
        />
      </div>
    </div>
  );
}
