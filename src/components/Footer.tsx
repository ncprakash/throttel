"use client";

import { useRef } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const brandRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = brandRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--gx", `${x}%`);
    el.style.setProperty("--gy", `${y}%`);
  };

  const handleMouseLeave = () => {
    const el = brandRef.current;
    if (!el) return;
    // Move spotlight off-screen to the left so text returns to dim state
    el.style.setProperty("--gx", "-40%");
    el.style.setProperty("--gy", "50%");
  };

  const links = {
    shop: [
      "Exhaust Systems",
      "Air Intakes",
      "ECU Tuners",
      "Brakes",
      "Suspension",
      "All Products",
    ],
    support: [
      "Contact Us",
      "Shipping Info",
      "Returns",
      "Return Policy",
      "Warranty",
      "Track Order",
      "FAQs",
    ],
    company: ["About Us", "Our Story", "Blog"],
    legal: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "Accessibility",
    ],
  };

  const socials = [
    {
      href: "https://www.instagram.com/throttleforgedcustoms?igsh=Z20weG54a2thNW85",
      icon: <FaInstagram />,
      label: "Instagram",
    },
    {
      href: "https://www.facebook.com/share/1ChYDgBod4/?mibextid=wwXIfr",
      icon: <FaFacebookF />,
      label: "Facebook",
    },
    {
      href: "https://youtube.com/@tfcustoms?si=fKFQ7A8Cwz77-o4J",
      icon: <FaYoutube />,
      label: "YouTube",
    },
    {
      href: "mailto:Tforgedcustoms@gmail.com",
      icon: <FaEnvelope />,
      label: "Email",
    },
  ];

  return (
    <footer className="bg-black border-t border-white/10">

      {/* Full-width brand display — cursor spotlight via background-clip: text */}
      <div
        ref={brandRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="overflow-hidden py-10 border-b border-white/[0.04] cursor-crosshair"
        style={{ "--gx": "-40%", "--gy": "50%" } as React.CSSProperties}
      >
        <p
          className="text-[10vw] font-black leading-none tracking-tighter whitespace-nowrap pl-6 select-none"
          style={{
            background:
              "radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.28) 22%, rgba(255,255,255,0.04) 52%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          THROTTLE FORGED CUSTOMS
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">

        {/* 4-column nav with top-border headers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-16">

          {/* Shop */}
          <div>
            <div className="border-t border-white/15 pt-6 mb-5" />
            <h3 className="text-white/40 font-light text-[10px] uppercase tracking-[0.35em] mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {links.shop.map((link) => (
                <li key={link}>
                  <a
                    href="/shop"
                    className="text-white/35 hover:text-white text-sm font-light transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="border-t border-white/15 pt-6 mb-5" />
            <h3 className="text-white/40 font-light text-[10px] uppercase tracking-[0.35em] mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link}>
                  <a
                    href={link === "Return Policy" ? "/return-policy" : "/support"}
                    className="text-white/35 hover:text-white text-sm font-light transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Legal */}
          <div>
            <div className="border-t border-white/15 pt-6 mb-5" />
            <h3 className="text-white/40 font-light text-[10px] uppercase tracking-[0.35em] mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link}>
                  <a
                    href="/about"
                    className="text-white/35 hover:text-white text-sm font-light transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <div className="w-8 h-px bg-white/10 mb-3" />
              </li>
              {links.legal.map((link) => (
                <li key={link}>
                  <a
                    href="/terms"
                    className="text-white/25 hover:text-white/70 text-sm font-light transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="border-t border-white/15 pt-6 mb-5" />
            <h3 className="text-white/40 font-light text-[10px] uppercase tracking-[0.35em] mb-5">
              Connect
            </h3>
            <ul className="space-y-4">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    className="flex items-center gap-3 text-white/35 hover:text-white text-sm font-light transition-colors duration-200"
                  >
                    <span className="text-base shrink-0">{s.icon}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/8 pt-7">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <p className="text-white/20 text-xs font-light">
              © 2025 Throttle Forged Customs. All rights reserved.
            </p>

            <p className="text-white/20 text-xs font-light tracking-widest uppercase">
              Made in India &middot; Bangalore
            </p>

            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  aria-label={s.label}
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/35 hover:text-white hover:border-white/30 transition-all duration-300"
                >
                  <span className="text-sm">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
