'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/page.module.css';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (password.length === 0) {
      alert('Please enter your password');
      return;
    }

    console.log('Sending data:', { email, password });

    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      localStorage.setItem('token', data.token); // JWT 토큰 저장
      router.push('/dashboard'); // 로그인 후 리디렉션할 페이지
    } else {
      alert(data.message || 'Something went wrong!');
    }
  };

  return (
    <div className={styles.formContainer} id="login-form">
      <h2>로그인</h2>
      <form onSubmit={submitHandler}>
        <label htmlFor="login-email">이메일</label>
        <input
          type="email"
          id="login-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="login-password">비밀번호</label>
        <input
          type="password"
          id="login-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
      <div className={styles.switch}>
        <p>회원이 아니신가요? <Link href="/signup">회원 가입</Link></p>
      </div>
    </div>
  );
}
