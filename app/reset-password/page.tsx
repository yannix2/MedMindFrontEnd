'use client'; // /app/reset-password/page.tsx
import ResetPasswordClient from './ResetPasswordClient';
import { Suspense } from 'react';
export default function ResetPasswordPage() {
  return <Suspense>
    <ResetPasswordClient />
  </Suspense>;
}