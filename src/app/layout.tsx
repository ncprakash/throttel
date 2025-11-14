
import "./globals.css";

import {Providers} from "./provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}
