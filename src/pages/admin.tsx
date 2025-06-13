import React from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: users, isLoading } = trpc.users.useQuery(undefined, {
    enabled: session?.user && (session.user as any).role === 'ADMIN',
  });

  if (status === 'loading') return <p>Loading session...</p>;

  if (!session) {
    router.push('/');
    return null;
  }

  if ((session.user as any).role !== 'ADMIN') {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Admin Dashboard</h1>
        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          <table border={1} cellPadding={6}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
} 