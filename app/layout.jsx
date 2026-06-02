import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";
import "../components/ipod.css";
import MusicDrawer from "../components/MusicDrawer";
import BackgroundCanvas from "../components/BackgroundCanvas";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Mvrk - Portate Bien!',
  description: 'Web Mvrk Gira y Merch',
  icons: ['/lettering/logo.webp'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundCanvas />
        {children}

        {/* iPod global en todas las páginas */}
        <div id="ipod-layer">
          <div className="ipod">
            <MusicDrawer />
          </div>
        </div>
      </body>
    </html>
  );
}
