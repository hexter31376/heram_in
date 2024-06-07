'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/page.module.css';
import Link from 'next/link';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('Sending data:', { email, password, username });

    const response = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      router.push('/login');
    } else {
      const data = await response.json();
      alert(data.message || 'Something went wrong!');
    }
  };

  return (
    <div className={styles.formContainer} id="signup-form">
      <h2>회원 가입</h2>
      <form onSubmit={submitHandler}>
        <label htmlFor="signup-username">아이디</label>
        <input
          type="text"
          id="signup-username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="signup-password">비밀번호</label>
        <input
          type="password"
          id="signup-password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="signup-confirm-password">비밀번호 확인</label>
        <input
          type="password"
          id="signup-confirm-password"
          name="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <label htmlFor="signup-email">이메일</label>
        <input
          type="email"
          id="signup-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">회원 가입</button>
      </form>
      <div className={styles.switch}>
        <p>이미 회원이신가요? <Link href="/login">로그인</Link></p>
      </div>
    </div>
  );
}
