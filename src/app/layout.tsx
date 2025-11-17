// app/layout.tsx
import "./globals.css";

import { Providers } from "./provider";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNavbar";
import GlobalBackground from "@/components/GlobalBackground";
import AppToaster from "@/components/ui/Toaster";

export const metadata = {
  title: "Throttel",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Keep the body background black but allow transparency on sections */}
      <body className="relative min-h-screen bg-black text-white antialiased">
        <Providers>
          {/* Background rendered first at z-0 */}
          <GlobalBackground />

          {/* App content on a higher stacking layer */}
          <div className="min-h-screen flex flex-col relative z-10">
            <AppToaster />

            <main className="flex-1">{children}</main>

            <Footer />
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
