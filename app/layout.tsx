import { AuthProvider } from '@/providers/auth';
import './styles.css';
import { Toaster } from '@/ui/sonner';
import { TooltipProvider } from '@/ui/tooltip';
import { AnalyticsProvider } from '@/lib/analytics';
import { fonts } from '@/lib/fonts';
import { ThemeProvider } from '@/providers/theme';
import type { ReactNode } from 'react';
import { currentUser } from '@clerk/nextjs/server';

type RootLayoutProperties = {
  readonly authenticated: ReactNode;
  readonly unauthenticated: ReactNode;
};

const RootLayout = async ({
  authenticated,
  unauthenticated,
}: RootLayoutProperties) => {
  const user = await currentUser();
  const children = user ? authenticated : unauthenticated;

  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <body className="bg-secondary">
        <AuthProvider>
        <ThemeProvider>
          <AnalyticsProvider>
            <TooltipProvider>
              <main className="container mx-auto max-w-3xl!">
                {children}
              </main>
            </TooltipProvider>
            <Toaster />
          </AnalyticsProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
