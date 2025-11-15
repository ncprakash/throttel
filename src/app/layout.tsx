import "./globals.css";

import { Providers } from "./provider";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <Providers>{children}</Providers>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
