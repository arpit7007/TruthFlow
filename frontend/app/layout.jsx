import { Plus_Jakarta_Sans, Syne } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './providers';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata = {
  title: 'TruthFlow',
  description: 'Ready to build something new.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${syne.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
