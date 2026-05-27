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
    <section id={id} className="mb-8 scroll-mt-24">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen((s) => !s)}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen((s) => !s);
        }}
      >
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <div className="text-sm text-[rgba(255,255,255,0.6)] select-none">
          {open ? "Collapse" : "Expand"}
        </div>
      </div>

      <div
        className={`mt-4 overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0"
        }`}
      >
        <div className="backdrop-blur-xl bg-white/4 border border-white/8 rounded-2xl p-6 text-[rgba(255,255,255,0.92)] leading-relaxed">
          {children}
        </div>
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
    { id: "contact", label: "Contact" },
  ];

  return (
    <main className="min-h-screen pb-32 bg-black text-white antialiased">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 grid lg:grid-cols-4 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold">Terms & Policies</h1>
            <p className="text-sm text-[rgba(255,255,255,0.7)] mt-2">
              The following documents explain how Throttel (the “Site”) works,
              what we collect, and how we take care of your orders. Read the
              sections below for details. If you need help, jump to Contact.
            </p>
          </div>

          <Section id="terms" title="Terms & Conditions">
            <div className="space-y-5 text-sm">
              <p>
                By purchasing any product from Throttle Forged Customs (TFC), the customer agrees to all
                terms and conditions mentioned below. All products sold by TFC are aftermarket/custom
                performance products intended for enthusiast and off-road/custom-use applications.
              </p>

              <h3 className="font-semibold text-white mt-2">Product Usage Responsibility</h3>
              <p>All TFC products are installed and used entirely at the customer&apos;s own responsibility. By purchasing and installing any TFC product, the customer understands and accepts that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Vehicle behaviour may vary after modification</li>
                <li>Performance characteristics may change</li>
                <li>Sound levels, airflow, throttle response, mileage, and riding feel may differ from stock setup</li>
                <li>Improper installation or misuse may lead to issues</li>
              </ul>
              <p>TFC shall not be held responsible for: vehicle damage, engine damage, water ingestion, warranty rejection, service centre disputes, mileage changes, ECU-related behaviour, fines or legal issues, installation errors by customer/mechanic, or negligence in maintenance.</p>

              <h3 className="font-semibold text-white mt-2">Air Filter Cap Disclaimer</h3>
              <p>TFC Stage 2 Air Filter Caps are designed to improve airflow and throttle response compared to stock setups. Customers acknowledge that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Free-flow setups may expose the filter to slightly higher dust intake compared to fully closed stock systems</li>
                <li>Regular cleaning and maintenance of the air filter is recommended</li>
                <li>Direct pressure washing near the airbox area should be avoided</li>
                <li>Deep water crossings or improper washing methods may allow water exposure</li>
                <li>Usage during extreme conditions is at customer discretion</li>
              </ul>
              <p>Normal rain riding and regular riding conditions generally do not cause issues when maintained properly.</p>

              <h3 className="font-semibold text-white mt-2">Installation</h3>
              <p>Customers are advised to install products using experienced mechanics, ensure all bolts/fittings are tightened correctly, periodically inspect products after installation, and follow regular maintenance schedules. TFC is not responsible for damages caused by incorrect installation, improper fitment, modification by third parties, or accidents/misuse.</p>

              <h3 className="font-semibold text-white mt-2">Product Finish &amp; Handmade Nature</h3>
              <p>Certain products may contain minor machining marks, surface texture variations, hand-finished imperfections, or slight engraving variations. These are normal characteristics of custom-manufactured aftermarket products and are <strong>not considered defects</strong>.</p>

              <h3 className="font-semibold text-white mt-2">Legal Disclaimer</h3>
              <p>Certain aftermarket modifications may not comply with local regulations in some regions. Customers are solely responsible for understanding local laws, vehicle compliance, noise regulations, and insurance implications. TFC does not guarantee road legality in every jurisdiction.</p>

              <h3 className="font-semibold text-white mt-2">Acceptance of Terms</h3>
              <p>By placing an order with TFC, the customer confirms that they have read and understood all terms, accept all risks associated with aftermarket modifications, and agree to use products responsibly and maintain them properly.</p>
            </div>
          </Section>

          <Section id="privacy" title="Privacy Policy">
            <div className="space-y-4 text-sm">
              <p>
                We respect your privacy. This section summarises what we collect
                and how we use it. For any privacy inquiries, contact us at the
                address at the bottom of this page.
              </p>

              <h3 className="font-medium mt-2">Data We Collect</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Account info:</strong> name, email, shipping address,
                  phone.
                </li>
                <li>
                  <strong>Order data:</strong> items ordered, prices, shipping
                  history.
                </li>
                <li>
                  <strong>Device & usage:</strong> IP, browser, pages visited
                  for analytics and anti-fraud.
                </li>
                <li>
                  <strong>Cookies:</strong> We use cookies and similar
                  technologies to remember preferences and analyze traffic.
                </li>
              </ul>

              <h3 className="font-medium mt-2">How We Use Data</h3>
              <p>
                We use data to process orders, communicate with you, improve the
                site, personalize your experience, and detect fraud. We may
                share data with service providers (payment processors, shipping
                partners) under strict contracts.
              </p>

              <h3 className="font-medium mt-2">Your Choices</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access and update your account details in your profile.</li>
                <li>
                  Unsubscribe from marketing emails using the link in the email.
                </li>
                <li>
                  Disable cookies via your browser (note: may affect site
                  behavior).
                </li>
              </ul>

              <h3 className="font-medium mt-2">Security</h3>
              <p>
                We follow standard security practices (HTTPS, encrypted storage
                for sensitive data). However, no system is 100% secure — if you
                suspect an issue, contact us immediately.
              </p>
            </div>
          </Section>

          <Section id="shipping" title="Shipping Policy">
            <div className="space-y-4 text-sm">
              <p>
                We aim to dispatch orders quickly. Shipping timelines are estimated and may vary.
              </p>

              <h3 className="font-medium mt-2">Processing Time</h3>
              <p>
                Orders are typically processed within 1–3 business days. Custom or pre-order items
                may require additional time, which will be displayed on the product page.
              </p>

              <h3 className="font-medium mt-2">Delivery Estimates</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Pan India:</strong> 3–7 business days once dispatched (carrier dependent).</li>
              </ul>

              <h3 className="font-medium mt-2">Delays</h3>
              <p>Shipping timelines may vary due to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Courier delays</li>
                <li>Weather conditions</li>
                <li>Remote locations</li>
                <li>Public holidays</li>
              </ul>
              <p>TFC is not responsible for courier delays after dispatch.</p>
            </div>
          </Section>

          <Section id="returns" title="Return & Refund Policy">
            <div className="space-y-4 text-sm">
              <h3 className="font-medium mt-2">No Returns / No Refunds</h3>
              <p>We do <strong>not</strong> provide returns or refunds for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Change of mind</li>
                <li>Personal preference</li>
                <li>Dissatisfaction with performance expectations</li>
                <li>Compatibility misunderstandings after order confirmation</li>
                <li>Custom-made or engraved products</li>
              </ul>

              <h3 className="font-medium mt-2">When We Do Help</h3>
              <p>Returns/replacements are only applicable if:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Wrong product was delivered</li>
                <li>Product arrived physically damaged during shipping</li>
              </ul>
              <p>
                Customers must report such issues <strong>within 48 hours of delivery</strong> with
                proper unboxing video proof. Once verified, a replacement will be processed accordingly.
              </p>

              <h3 className="font-medium mt-2">Warranty</h3>
              <p>Warranty applies only to manufacturing defects where explicitly mentioned. Warranty does <strong>not</strong> cover:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Wear and tear</li>
                <li>Rust due to improper maintenance</li>
                <li>Damage from crashes or misuse</li>
                <li>Damage due to water exposure or improper washing</li>
                <li>Damage caused during installation/removal</li>
                <li>Consumable parts</li>
              </ul>
            </div>
          </Section>

          <Section id="contact" title="Contact & Notice">
            <div className="space-y-4 text-sm">
              <p>
                For questions about these policies, returns, or help with an order, reach out to us:
              </p>

              <ul className="list-none pl-0 mt-2 space-y-2">
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    className="text-white/90 underline"
                    href="mailto:Tforgedcustoms@gmail.com"
                  >
                    Tforgedcustoms@gmail.com
                  </a>
                </li>
                <li>
                  <strong>Instagram:</strong>{" "}
                  <a
                    className="text-white/90 underline"
                    href="https://www.instagram.com/throttleforgedcustoms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @throttleforgedcustoms
                  </a>
                </li>
              </ul>

              <p className="text-xs text-[rgba(255,255,255,0.6)] mt-3">
                — Throttle Forged Customs (TFC). These policies were last updated on{" "}
                <strong>May 2026</strong>.
              </p>
            </div>
          </Section>
        </div>

        {/* Right column: in-page navigation */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 self-start">
          <div className="backdrop-blur-md bg-white/3 border border-white/8 rounded-2xl p-4">
            <nav aria-label="Terms navigation" className="space-y-2 text-sm">
              <p className="font-medium text-white mb-2">Quick links</p>
              {navItems.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="block px-3 py-2 rounded hover:bg-white/6 transition-colors text-[rgba(255,255,255,0.9)]"
                >
                  {n.label}
                </a>
              ))}
              <div className="mt-3 border-t border-white/6 pt-3">
                <Link
                  href="/shop"
                  className="text-sm text-[rgba(255,255,255,0.9)]"
                >
                  Back to shop
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
