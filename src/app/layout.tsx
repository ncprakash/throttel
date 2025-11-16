// app/layout.tsx
import "./globals.css";

import { Providers } from "./provider";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNavbar";
import GlobalBackground from "@/components/GlobalBackground";

export const metadata = {
  title: "Throttel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* make body a stacking context and ensure min-h-screen so background covers */}
      <body className="relative min-h-screen bg-black text-white antialiased">
        {/* Background first so it's visually behind everything */}
        <GlobalBackground />

        {/* App providers and main content */}
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>

            {/* Keep footer & bottom nav inside Providers (if they rely on context) */}
            <Footer />
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
