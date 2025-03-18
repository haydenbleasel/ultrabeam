import { env } from '@/env';
import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
    {children}
    <p className="max-w-sm px-8 text-center text-muted-foreground text-sm">
      By clicking continue, you agree to our{' '}
      <Link
        href={new URL('/legal/terms', env.NEXT_PUBLIC_WEB_URL).toString()}
        className="underline underline-offset-4 hover:text-primary"
      >
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link
        href={new URL('/legal/privacy', env.NEXT_PUBLIC_WEB_URL).toString()}
        className="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </Link>
      .
    </p>
  </div>
);

export default AuthLayout;
