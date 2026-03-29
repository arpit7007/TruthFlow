import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TruthFlow',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
