// app/signup/page.js
import SignupForm from '../../components/SignupForm';
import styles from '../../styles/page.module.css';

export default function SignupPage() {
  return (
    <main className={styles.main}>
      <SignupForm />
    </main>
  );
}
