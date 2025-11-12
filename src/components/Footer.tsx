// components/Footer.tsx
export default function Footer() {
  const links = {
    shop: ['Exhaust Systems', 'Air Intakes', 'ECU Tuners', 'Brakes', 'Suspension', 'All Products'],
    support: ['Contact Us', 'Shipping Info', 'Returns', 'Warranty', 'Track Order', 'FAQs'],
    company: ['About Us', 'Our Story', 'Careers', 'Press', 'Blog', 'Partners'],
    legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
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
              <span className="block text-white/30 text-xl font-light">FORGED CUSTOMS</span>
            </h2>
            <p className="text-white/60 text-sm font-light leading-relaxed mb-6 max-w-sm">
              Premium performance parts for riders who demand excellence. Precision-engineered components trusted by professionals worldwide.
            </p>
            <div className="flex space-x-4">
              {['instagram', 'facebook', 'twitter', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center group"
                >
                  <span className="text-white/60 group-hover:text-white transition-colors text-xs uppercase">
                    {social[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              {links.shop.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/60 hover:text-white text-sm font-light transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/60 hover:text-white text-sm font-light transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/60 hover:text-white text-sm font-light transition-colors">
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
              {links.legal.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-white/40 hover:text-white text-sm font-light transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
