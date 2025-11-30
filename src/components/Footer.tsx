import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
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

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        {/* Main Footer */}
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
              THROTTLE
              <span className="block text-white/30 text-xl font-light">
                FORGED CUSTOMS
              </span>
            </h2>

            <p className="text-white/60 text-sm font-light leading-relaxed mb-6 max-w-sm">
              Premium performance parts for riders who demand excellence.
              Precision-engineered components trusted by professionals
              worldwide.
            </p>

            {/* FINAL Social Icons */}
            <div className="flex items-center space-x-4 mt-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/throttleforgedcustoms?igsh=Z20weG54a2thNW85"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <FaInstagram className="text-white/70 text-lg" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1ChYDgBod4/?mibextid=wwXIfr"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <FaFacebookF className="text-white/70 text-lg" />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@tfcustoms?si=fKFQ7A8Cwz77-o4J"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <FaYoutube className="text-white/70 text-lg" />
              </a>

              {/* Mail */}
              <a
                href="mailto:Tforgedcustoms@gmail.com"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <FaEnvelope className="text-white/70 text-lg" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-3">
              {links.shop.map((link) => (
                <li key={link}>
                  <a
                    href={`/shop`}
                    className="text-white/60 hover:text-white text-sm font-light transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link}>
                  <a
                    href={`/support`}
                    className="text-white/60 hover:text-white text-sm font-light transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link}>
                  <a
                    href={`/about`}
                    className="text-white/60 hover:text-white text-sm font-light transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/40 text-sm font-light">
              © 2025 Throttle Forged Customs. All rights reserved.
            </p>

            <div className="flex space-x-6">
              <a
                href="/terms"
                className="text-white/40 hover:text-white text-sm font-light transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-white/40 hover:text-white text-sm font-light transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/terms"
                className="text-white/40 hover:text-white text-sm font-light transition-colors"
              >
                Cookie Policy
              </a>
              <a
                href="/accessibility"
                className="text-white/40 hover:text-white text-sm font-light transition-colors"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
