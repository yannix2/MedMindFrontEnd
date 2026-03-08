'use client'; // /app/reset-password/page.tsx
import SignIn from './SignIn';
import { Suspense } from 'react';
export default function SignInPage() {
  return <Suspense>
    <SignIn />
  </Suspense>;
}