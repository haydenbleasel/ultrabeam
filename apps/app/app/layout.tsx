import './styles.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import type { ReactNode } from 'react';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body className="bg-secondary">
      <DesignSystemProvider>
        <main className="container mx-auto max-w-3xl!">{children}</main>
      </DesignSystemProvider>
    </body>
  </html>
);

export default RootLayout;
