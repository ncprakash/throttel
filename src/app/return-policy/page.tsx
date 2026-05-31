import Link from "next/link";
import Footer from "@/components/Footer";

export default function ReturnPolicyPage() {
  const sections = [
    {
      num: "01",
      title: "Replacement Policy",
      content: (
        <>
          <p className="text-sm text-white/60 leading-7 mb-4">
            We provide replacements only under the following conditions:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Wrong product delivered",
              "Product damaged during shipping",
              "Manufacturing defect affecting usability or fitment",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                <span className="w-1 h-1 bg-white/40 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-white/60 leading-7 mb-4">
            To claim a replacement:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Customer must contact us within 48 hours of delivery",
              "Clear unboxing video and product images are mandatory",
              "Product should remain unused and in original condition",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                <span className="w-1 h-1 bg-white/40 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-white/60 leading-7">
            Once verified by our team, a replacement will be processed accordingly.
          </p>
        </>
      ),
    },
    {
      num: "02",
      title: "No Return / No Refund Policy",
      content: (
        <>
          <p className="text-sm text-white/60 leading-7 mb-4">
            We do not provide returns or refunds for:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Change of mind after purchase",
              "Design or finish preferences",
              "Minor handcrafted/raw finish variations",
              "Installation issues caused by improper fitting",
              "Dissatisfaction due to personal expectations",
              "Used or modified products",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                <span className="w-1 h-1 bg-white/40 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-white/60 leading-7">
            Many of our products are handcrafted, custom-finished, or
            performance-oriented, and slight visual variations may naturally
            occur.
          </p>
        </>
      ),
    },
    {
      num: "03",
      title: "Installation Responsibility",
      content: (
        <p className="text-sm text-white/60 leading-7">
          Customers are advised to install products through experienced
          mechanics or professionals. Throttle Forged Customs will not be
          responsible for damages caused due to improper installation or
          handling.
        </p>
      ),
    },
    {
      num: "04",
      title: "Performance Products Disclaimer",
      content: (
        <p className="text-sm text-white/60 leading-7">
          Performance-related products such as air filter caps, exhaust
          components, and tuning accessories may alter airflow, sound, throttle
          response, or riding characteristics. Proper maintenance and
          responsible usage are recommended.
        </p>
      ),
    },
    {
      num: "05",
      title: "Shipping Policy",
      content: (
        <ul className="space-y-2">
          {[
            "Shipping charges are non-refundable",
            "Return shipping (if applicable) must be borne by the customer unless the issue is verified from our side",
            "Delivery timelines may vary depending on location and courier availability",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-white/70">
              <span className="w-1 h-1 bg-white/40 rounded-full mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white antialiased">
      {/* Hero header */}
      <div className="border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none flex items-end justify-end pr-8 pb-4">
          <span className="text-[clamp(5rem,14vw,14rem)] font-black text-white/[0.03] tracking-[-0.05em] leading-none">
            POLICY
          </span>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-20 relative">
          <p className="text-[10px] tracking-[0.5em] text-white/30 uppercase mb-6">
            Throttle Forged Customs
          </p>
          <h1 className="text-5xl sm:text-7xl font-black tracking-[-0.04em] leading-none uppercase">
            Return,
            <br />
            <span className="text-white/30">Replacement</span>
            <br />& Refund
          </h1>
          <p className="mt-8 max-w-lg text-sm text-white/50 leading-relaxed">
            At Throttle Forged Customs, every product is carefully manufactured,
            inspected, and packed before dispatch. We prioritize quality,
            fitment, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Numbered sections */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {sections.map((section, i) => (
          <div
            key={section.num}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 py-14 ${
              i < sections.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <div className="lg:col-span-3">
              <span className="text-[5rem] sm:text-[7rem] font-black text-white/5 leading-none select-none block">
                {section.num}
              </span>
              <h2 className="text-lg font-bold mt-2 text-white leading-tight">
                {section.title}
              </h2>
            </div>
            <div className="lg:col-span-9 lg:pt-4">{section.content}</div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/5 max-w-6xl mx-auto px-6 py-12">
        <p className="text-sm text-white/50 mb-6">
          If you need assistance or clarification, reach out to our support
          team via the contact page or email provided on the site.
        </p>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors"
        >
          Visit Support
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
