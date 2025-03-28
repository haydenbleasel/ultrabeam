import { createMetadata } from '@/lib/seo/metadata';
// import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const title = 'Welcome back';
const description = 'Enter your details to sign in.';

export const metadata: Metadata = createMetadata({ title, description });

// const SignInPage = () => <SignIn />;

const SignInPage = () => notFound();

export default SignInPage;
