import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24 text-5xl">
      <b>Homepage</b>
      {/* {user ? <b>Hello, {user.firstName}!</b> : ''} */}
    </main>
  );
}
