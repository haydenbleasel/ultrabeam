import { AuthProvider } from '@/providers/auth';
import './styles.css';
import { Toaster } from '@/ui/sonner';
import { TooltipProvider } from '@/ui/tooltip';
import { AnalyticsProvider } from '@/lib/analytics';
import { fonts } from '@/lib/fonts';
import { ThemeProvider } from '@/providers/theme';
import type { ReactNode } from 'react';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body className="bg-secondary">
      <AuthProvider>
        <ThemeProvider>
          <AnalyticsProvider>
            <TooltipProvider>
              <main className="container mx-auto max-w-3xl!">{children}</main>
            </TooltipProvider>
            <Toaster />
          </AnalyticsProvider>
        </ThemeProvider>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
