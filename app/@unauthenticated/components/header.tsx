import { Logo } from '@/components/logo';
import { Button } from '@/ui/button';
import Link from 'next/link';

export const Header = () => (
  <header className="sticky top-0 z-50 flex items-center justify-between py-4">
    <Link href="/" className="flex items-center gap-2">
      <Logo />
      <p className="font-bold text-lg tracking-tight">Ultrabeam</p>
    </Link>
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  </header>
);
