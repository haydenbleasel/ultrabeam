import { createMetadata } from '@/lib/seo/metadata';
import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

const title = 'Create an account';
const description = 'Enter your details to get started.';

export const metadata: Metadata = createMetadata({ title, description });

const SignUpPage = () => <SignUp />;

export default SignUpPage;
