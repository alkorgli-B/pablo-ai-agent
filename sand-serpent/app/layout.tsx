import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sand Serpent - A Desert Snake Adventure',
  description: 'A premium, world-class Snake game set in the desert. Built with Next.js. Eat, grow, survive!',
  keywords: ['snake game', 'sand serpent', 'browser game', 'arcade', 'desert'],
  openGraph: {
    title: 'Sand Serpent - A Desert Snake Adventure',
    description: 'A premium Snake game set in the desert. Can you become the Sand God?',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sand Serpent',
    description: 'A premium Snake game set in the desert.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#06060e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
