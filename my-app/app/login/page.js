// app/login/page.js
import LoginForm from '../../components/LoginForm';
import styles from '../../styles/page.module.css';

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <LoginForm />
    </main>
  );
}
