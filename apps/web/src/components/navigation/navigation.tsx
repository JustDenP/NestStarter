import Link from 'next/link';
import React from 'react';

const Navigation = () => (
  <div className="navigation w-full">
    <div className="flex justify-center p-4 mb-12 space-x-4 text-md text-black font-medium">
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/auth/sign-in">Login</Link>
      <Link href="/me">ME CSR</Link>
      <Link href="/me-ssr">ME SSR</Link>
    </div>
  </div>
);

export default Navigation;
