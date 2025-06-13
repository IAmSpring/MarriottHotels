import { getCsrfToken, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

export default function SignIn({ csrfToken }: { csrfToken: string }) {
  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('password123');
  return (
    <form method="post" action="/api/auth/callback/credentials" style={{ maxWidth: 400, margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Email
        <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit" onClick={() => signIn('credentials')}>Sign in</button>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}; 