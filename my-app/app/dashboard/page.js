// app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Your JWT Token:</p>
      <pre>{token}</pre>
    </div>
  );
}
