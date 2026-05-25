import Link from "next/link";
import Footer from "@/components/Footer";

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-[rgba(255,255,255,0.7)] uppercase tracking-[0.16em]">
              Return Policy
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold">Return, Replacement & Refund Policy</h1>
            <p className="text-base text-[rgba(255,255,255,0.75)] max-w-3xl leading-8">
              At Throttle Forged Customs, every product is carefully manufactured,
              inspected, and packed before dispatch. We prioritize quality,
              fitment, and customer satisfaction.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Replacement Policy</h2>
            <p className="text-sm text-[rgba(255,255,255,0.75)] leading-7">
              We provide replacements only under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[rgba(255,255,255,0.8)]">
              <li>Wrong product delivered</li>
              <li>Product damaged during shipping</li>
              <li>Manufacturing defect affecting usability or fitment</li>
            </ul>

            <p className="text-sm text-[rgba(255,255,255,0.75)] leading-7">
              To claim a replacement:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[rgba(255,255,255,0.8)]">
              <li>Customer must contact us within 48 hours of delivery</li>
              <li>Clear unboxing video and product images are mandatory</li>
              <li>Product should remain unused and in original condition</li>
            </ul>
            <p className="text-sm text-[rgba(255,255,255,0.75)] leading-7">
              Once verified by our team, a replacement will be processed accordingly.
            </p>
          </section>

          <div className="border-t border-white/10 pt-8" />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">No Return / No Refund Policy</h2>
            <p className="text-sm text-[rgba(255,255,255,0.75)] leading-7">
              We do not provide returns or refunds for:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[rgba(255,255,255,0.8)]">
              <li>Change of mind after purchase</li>
              <li>Design or finish preferences</li>
              <li>Minor handcrafted/raw finish variations</li>
              <li>Installation issues caused by improper fitting</li>
              <li>Dissatisfaction due to personal expectations</li>
              <li>Used or modified products</li>
            </ul>
            <p className="text-sm text-[rgba(255,255,255,0.75)] leading-7">
              Many of our products are handcrafted, custom-finished, or
              performance-oriented, and slight visual variations may naturally
              occur.
            </p>
          </section>

          <div className="border-t border-white/10 pt-8" />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Installation Responsibility</h2>
            <p className="text-sm text-[rgba(255,255,255,0.75)] leading-7">
              Customers are advised to install products through experienced
              mechanics or professionals. Throttle Forged Customs will not be
              responsible for damages caused due to improper installation or
              handling.
            </p>
          </section>

          <div className="border-t border-white/10 pt-8" />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Performance Products Disclaimer</h2>
            <p className="text-sm text-[rgba(255,255,255,0.75)] leading-7">
              Performance-related products such as air filter caps, exhaust
              components, and tuning accessories may alter airflow, sound,
              throttle response, or riding characteristics. Proper maintenance
              and responsible usage are recommended.
            </p>
          </section>

          <div className="border-t border-white/10 pt-8" />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Shipping Policy</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[rgba(255,255,255,0.8)]">
              <li>Shipping charges are non-refundable</li>
              <li>
                Return shipping (if applicable) must be borne by the customer
                unless the issue is verified from our side
              </li>
              <li>
                Delivery timelines may vary depending on location and courier
                availability
              </li>
            </ul>
          </section>

          <div className="pt-8 text-sm text-[rgba(255,255,255,0.6)]">
            <p>
              If you need assistance or clarification, reach out to our support
              team via the contact page or email provided on the site.
            </p>
            <p className="mt-4">
              <Link
                href="/support"
                className="text-white/80 hover:text-white underline"
              >
                Visit Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
