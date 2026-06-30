// app/terms/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section id={id} className="border-b border-white/5 scroll-mt-24">
      <button
        className="w-full flex items-center justify-between py-6 text-left group"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        <h2 className="text-lg font-bold text-white group-hover:text-white/80 transition-colors">
          {title}
        </h2>
        <div
          className={`w-5 h-5 flex-shrink-0 border border-white/20 rounded-md flex items-center justify-center transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          <svg
            className="w-3 h-3 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m-8-8h16"
            />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[3000px] opacity-100 pb-8" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-white/70 leading-relaxed text-sm">{children}</div>
      </div>
    </section>
  );
}

export default function TermsPage() {
  const navItems = [
    { id: "terms", label: "Terms & Conditions" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "shipping", label: "Shipping Policy" },
    { id: "returns", label: "Return & Refund Policy" },
    { id: "collaboration", label: "Creator Collaboration Policy" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <main className="min-h-screen pb-32 bg-black text-white antialiased">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-[10px] tracking-[0.5em] text-white/30 uppercase mb-4">
            Legal
          </p>
          <h1 className="text-5xl sm:text-7xl font-black tracking-[-0.04em] leading-none uppercase">
            Terms &amp;
            <br />
            Policies
          </h1>
          <p className="text-sm text-white/40 mt-6 max-w-lg leading-relaxed">
            The following documents explain how Throttle Forged Customs works,
            what we collect, and how we take care of your orders.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-4 gap-12">
        {/* Main Column */}
        <div className="lg:col-span-3">
          <Section id="terms" title="Terms & Conditions">
            <div className="space-y-4">
              <p>
                By purchasing any product from Throttle Forged Customs (TFC),
                the customer agrees to all terms and conditions mentioned below.
                All products sold by TFC are aftermarket/custom performance
                products intended for enthusiast and off-road/custom-use
                applications.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Product Usage Responsibility
              </h3>
              <p>
                All TFC products are installed and used entirely at the
                customer&apos;s own responsibility. By purchasing and installing
                any TFC product, the customer understands and accepts that:
              </p>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Vehicle behaviour may vary after modification",
                  "Performance characteristics may change",
                  "Sound levels, airflow, throttle response, mileage, and riding feel may differ from stock setup",
                  "Improper installation or misuse may lead to issues",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                TFC shall not be held responsible for: vehicle damage, engine
                damage, water ingestion, warranty rejection, service centre
                disputes, mileage changes, ECU-related behaviour, fines or
                legal issues, installation errors by customer/mechanic, or
                negligence in maintenance.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Air Filter Cap Disclaimer
              </h3>
              <p>
                TFC Stage 2 Air Filter Caps are designed to improve airflow and
                throttle response compared to stock setups. Customers
                acknowledge that:
              </p>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Free-flow setups may expose the filter to slightly higher dust intake compared to fully closed stock systems",
                  "Regular cleaning and maintenance of the air filter is recommended",
                  "Direct pressure washing near the airbox area should be avoided",
                  "Deep water crossings or improper washing methods may allow water exposure",
                  "Usage during extreme conditions is at customer discretion",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                Normal rain riding and regular riding conditions generally do
                not cause issues when maintained properly.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Installation
              </h3>
              <p>
                Customers are advised to install products using experienced
                mechanics, ensure all bolts/fittings are tightened correctly,
                periodically inspect products after installation, and follow
                regular maintenance schedules. TFC is not responsible for
                damages caused by incorrect installation, improper fitment,
                modification by third parties, or accidents/misuse.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Product Finish &amp; Handmade Nature
              </h3>
              <p>
                Certain products may contain minor machining marks, surface
                texture variations, hand-finished imperfections, or slight
                engraving variations. These are normal characteristics of
                custom-manufactured aftermarket products and are{" "}
                <strong className="text-white/90">not considered defects</strong>.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Legal Disclaimer
              </h3>
              <p>
                Certain aftermarket modifications may not comply with local
                regulations in some regions. Customers are solely responsible
                for understanding local laws, vehicle compliance, noise
                regulations, and insurance implications. TFC does not guarantee
                road legality in every jurisdiction.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Acceptance of Terms
              </h3>
              <p>
                By placing an order with TFC, the customer confirms that they
                have read and understood all terms, accept all risks associated
                with aftermarket modifications, and agree to use products
                responsibly and maintain them properly.
              </p>
            </div>
          </Section>

          <Section id="privacy" title="Privacy Policy">
            <div className="space-y-4">
              <p>
                We respect your privacy. This section summarises what we
                collect and how we use it. For any privacy inquiries, contact
                us at the address at the bottom of this page.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Data We Collect
              </h3>
              <ul className="space-y-2 pl-4">
                {[
                  {
                    label: "Account info:",
                    desc: "name, email, shipping address, phone.",
                  },
                  {
                    label: "Order data:",
                    desc: "items ordered, prices, shipping history.",
                  },
                  {
                    label: "Device & usage:",
                    desc: "IP, browser, pages visited for analytics and anti-fraud.",
                  },
                  {
                    label: "Cookies:",
                    desc: "We use cookies and similar technologies to remember preferences and analyze traffic.",
                  },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    <span>
                      <strong className="text-white/80">{item.label}</strong>{" "}
                      {item.desc}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-white/90 mt-4">
                How We Use Data
              </h3>
              <p>
                We use data to process orders, communicate with you, improve
                the site, personalize your experience, and detect fraud. We may
                share data with service providers (payment processors, shipping
                partners) under strict contracts.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Your Choices
              </h3>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Access and update your account details in your profile.",
                  "Unsubscribe from marketing emails using the link in the email.",
                  "Disable cookies via your browser (note: may affect site behavior).",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-white/90 mt-4">Security</h3>
              <p>
                We follow standard security practices (HTTPS, encrypted storage
                for sensitive data). However, no system is 100% secure — if you
                suspect an issue, contact us immediately.
              </p>
            </div>
          </Section>

          <Section id="shipping" title="Shipping Policy">
            <div className="space-y-4">
              <p>
                We aim to dispatch orders quickly. Shipping timelines are
                estimated and may vary.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Processing Time
              </h3>
              <p>
                Orders are typically processed within 1–3 business days. Custom
                or pre-order items may require additional time, which will be
                displayed on the product page.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                Delivery Estimates
              </h3>
              <ul className="pl-4 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-white/80">Pan India:</strong> 3–7
                    business days once dispatched (carrier dependent).
                  </span>
                </li>
              </ul>

              <h3 className="font-semibold text-white/90 mt-4">Delays</h3>
              <p>Shipping timelines may vary due to:</p>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Courier delays",
                  "Weather conditions",
                  "Remote locations",
                  "Public holidays",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>TFC is not responsible for courier delays after dispatch.</p>
            </div>
          </Section>

          <Section id="returns" title="Return & Refund Policy">
            <div className="space-y-4">
              <h3 className="font-semibold text-white/90">
                No Returns / No Refunds
              </h3>
              <p>
                We do{" "}
                <strong className="text-white/90">not</strong> provide returns
                or refunds for:
              </p>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Change of mind",
                  "Personal preference",
                  "Dissatisfaction with performance expectations",
                  "Compatibility misunderstandings after order confirmation",
                  "Custom-made or engraved products",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-white/90 mt-4">
                When We Do Help
              </h3>
              <p>Returns/replacements are only applicable if:</p>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Wrong product was delivered",
                  "Product arrived physically damaged during shipping",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                Customers must report such issues{" "}
                <strong className="text-white/90">
                  within 48 hours of delivery
                </strong>{" "}
                with proper unboxing video proof. Once verified, a replacement
                will be processed accordingly.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">Warranty</h3>
              <p>
                Warranty applies only to manufacturing defects where explicitly
                mentioned. Warranty does{" "}
                <strong className="text-white/90">not</strong> cover:
              </p>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Wear and tear",
                  "Rust due to improper maintenance",
                  "Damage from crashes or misuse",
                  "Damage due to water exposure or improper washing",
                  "Damage caused during installation/removal",
                  "Consumable parts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section id="collaboration" title="Content Creator Collaboration Policy">
            <div className="space-y-4">
              <p>
                By accepting a product from Throttle Forged Customs (TFC) under a
                collaboration, the creator acknowledges and agrees to the following
                terms and conditions.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                1. Acceptance of Collaboration
              </h3>
              <p>
                Acceptance of a product confirms that the creator has agreed to the
                collaboration terms, deliverables, and timeline discussed before
                dispatch.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">2. Deliverables</h3>
              <p>
                The creator must complete and publish the agreed deliverables, which
                may include:
              </p>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Instagram Reels",
                  "Collaborative Posts",
                  "Product Reviews",
                  "Installation Videos",
                  "Stories",
                  "Any additional content mutually agreed upon before dispatch",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-white/90 mt-4">3. Timeline</h3>
              <p>
                All agreed deliverables must be completed within{" "}
                <strong className="text-white/90">20 calendar days</strong> from the
                date the product is marked as delivered, unless a different timeline
                has been agreed to in writing by TFC.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">4. Communication</h3>
              <p>
                If additional time is genuinely required, the creator must inform TFC
                before the agreed deadline. Any extension is granted solely at
                TFC&apos;s discretion.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">
                5. Failure to Complete Deliverables
              </h3>
              <p>
                If the agreed deliverables are not completed within the agreed
                timeline and no written extension has been approved, TFC reserves the
                right to cancel the collaboration.
              </p>
              <p>
                In such cases, the creator must, within{" "}
                <strong className="text-white/90">7 days</strong> of receiving notice
                from TFC:
              </p>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Return the product in its original condition, or",
                  "Pay the full retail value of the product.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-white/90 mt-4">
                6. Product Ownership
              </h3>
              <p>
                Products provided for collaboration remain part of the agreed
                promotional arrangement until all collaboration obligations have been
                fulfilled. Failure to complete the agreed obligations does not entitle
                the creator to retain the product without fulfilling the agreed terms
                or resolving the matter with TFC.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">7. Non-Compliance</h3>
              <p>If the creator fails to:</p>
              <ul className="space-y-1.5 pl-4">
                {[
                  "Complete the agreed deliverables,",
                  "Return the product when requested, or",
                  "Refund the product value within the specified period,",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-white/30 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                TFC reserves the right to pursue appropriate remedies, which may
                include recovery of the product value and, where appropriate,
                reporting the matter to relevant platforms or authorities, and taking
                any other lawful action available.
              </p>

              <h3 className="font-semibold text-white/90 mt-4">8. Mutual Respect</h3>
              <p>
                TFC values honest reviews and authentic opinions. We never require
                creators to provide positive reviews. Our only expectation is that the
                agreed content is created and delivered within the mutually agreed
                timeline.
              </p>
            </div>
          </Section>

          <Section id="contact" title="Contact & Notice">
            <div className="space-y-4">
              <p>
                For questions about these policies, returns, or help with an
                order, reach out to us:
              </p>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-white/40 font-medium w-24">Email</span>
                  <a
                    className="text-white/80 hover:text-white underline underline-offset-4 transition-colors"
                    href="mailto:Tforgedcustoms@gmail.com"
                  >
                    Tforgedcustoms@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/40 font-medium w-24">
                    Instagram
                  </span>
                  <a
                    className="text-white/80 hover:text-white underline underline-offset-4 transition-colors"
                    href="https://www.instagram.com/throttleforgedcustoms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @throttleforgedcustoms
                  </a>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Right column: sticky sidebar nav */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-8 self-start">
          <div className="border border-white/8 rounded-2xl p-5 bg-white/[0.02]">
            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-4">
              On this page
            </p>
            <nav aria-label="Terms navigation" className="space-y-1">
              {navItems.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="block px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  {n.label}
                </a>
              ))}
              <div className="mt-4 pt-4 border-t border-white/5">
                <Link
                  href="/shop"
                  className="block px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  ← Back to shop
                </Link>
              </div>
            </nav>
          </div>
        </aside>
      </div>

      <Footer />
    </main>
  );
}
