import { cn } from '@/lib/utils';
import { Geist, Geist_Mono } from 'next/font/google';

const sans = Geist({
  display: 'swap',
  preload: true,
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = Geist_Mono({
  display: 'swap',
  preload: true,
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
});

export const fonts = cn(
  sans.variable,
  mono.variable,
  'touch-manipulation font-sans antialiased'
);
