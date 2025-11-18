// app/terms/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

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
            <div className="space-y-4 text-sm">
              <p>
                By using this site and/or placing an order, you agree to be
                bound by these Terms & Conditions. Please read them carefully.
                If you do not agree, do not use the site.
              </p>

              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Eligibility:</strong> You must be at least 18 years
                  old or have parental consent to make purchases.
                </li>
                <li>
                  <strong>Account & Security:</strong> You are responsible for
                  maintaining the confidentiality of your account credentials
                  and for all activity that occurs under your account.
                </li>
                <li>
                  <strong>Product Information:</strong> We try to display
                  product details accurately, but specifications and
                  availability may change.
                </li>
                <li>
                  <strong>Pricing & Payments:</strong> All prices are shown in
                  the site’s currency and may change without notice. Payment is
                  processed via the payment provider you choose at checkout.
                </li>
                <li>
                  <strong>Limitation of Liability:</strong> To the maximum
                  extent permitted by law, we will not be liable for indirect or
                  consequential losses arising from use of the site.
                </li>
                <li>
                  <strong>Governing Law:</strong> These Terms are governed by
                  the laws applicable where our business is incorporated (check
                  our contact details).
                </li>
              </ul>
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
                We aim to dispatch orders quickly. Shipping terms vary by
                product and destination — the summary below covers common cases.
              </p>

              <h3 className="font-medium mt-2">Processing Time</h3>
              <p>
                Orders are typically processed within 1–3 business days. Some
                items (preorders, custom parts) may require longer; this will be
                displayed on the product.
              </p>

              <h3 className="font-medium mt-2">Delivery Estimates</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Domestic:</strong> 3–7 business days once dispatched
                  (carrier dependent).
                </li>
                <li>
                  <strong>International:</strong> 7–21 business days
                  (customs/duties may add time).
                </li>
              </ul>

              <h3 className="font-medium mt-2">Shipping Costs</h3>
              <p>
                Shipping costs depend on weight, destination and chosen carrier.
                Free shipping promotions (if any) are clearly displayed at
                checkout.
              </p>

              <h3 className="font-medium mt-2">Lost or Damaged Packages</h3>
              <p>
                If your package is lost or damaged in transit, contact support
                with your order number. We will coordinate with the carrier and
                either reship or refund per the investigation outcome.
              </p>
            </div>
          </Section>

          <Section id="returns" title="Return & Refund Policy">
            <div className="space-y-4 text-sm">
              <p>
                We accept returns for eligible products within a specified
                window. The rules below are general — some products (e.g.,
                custom items) may be final-sale.
              </p>

              <h3 className="font-medium mt-2">Eligibility</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Returns accepted within 14 days of delivery for most items.
                </li>
                <li>
                  Item must be unused, in original condition and packaging.
                </li>
                <li>
                  Products marked as final-sale or non-returnable cannot be
                  returned.
                </li>
              </ul>

              <h3 className="font-medium mt-2">How to Return</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Open a support ticket or email support with your order number.
                </li>
                <li>
                  We will provide a return authorization and instructions.
                </li>
                <li>
                  Ship the item to the provided return address — keep tracking
                  info.
                </li>
                <li>
                  Once we receive and inspect the item, we will issue a refund
                  or exchange.
                </li>
              </ol>

              <h3 className="font-medium mt-2">Refund Timing</h3>
              <p>
                Refunds are processed within 7–14 business days after we receive
                the returned item. The original shipping charges are not
                refundable unless the return is due to our error.
              </p>
            </div>
          </Section>

          <Section id="contact" title="Contact & Notice">
            <div className="space-y-4 text-sm">
              <p>
                For questions about these policies or to request data access,
                returns, or help with an order, contact:
              </p>

              <ul className="list-none pl-0 mt-2 space-y-2">
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    className="text-white/90 underline"
                    href="mailto:support@throttel.example"
                  >
                    support@throttel.example
                  </a>
                </li>
                <li>
                  <strong>Support Hours:</strong> Mon–Fri, 09:00–18:00 (local
                  time)
                </li>
                <li>
                  <strong>Address:</strong> 123 Example Street, City, Country
                  (if needed)
                </li>
              </ul>

              <p className="text-xs text-[rgba(255,255,255,0.6)] mt-3">
                These policies were last updated on{" "}
                <strong>Nov 18, 2025</strong>. We may update them from time to
                time; material changes will be posted on this page.
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
    </main>
  );
}
