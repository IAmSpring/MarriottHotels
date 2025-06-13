import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Next Auth Admin Demo</title>
      </Head>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Welcome {session ? session.user?.name : 'Guest'}</h1>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : session ? (
          <>
            <p>You are logged in as {session.user?.email} ({(session.user as any).role})</p>
            {(session.user as any).role === 'ADMIN' && (
              <p>
                <Link href="/admin">Go to Admin Dashboard</Link>
              </p>
            )}
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </main>
    </>
  );
} 