"use client";

import { FormEvent, useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      window.location.assign("/admin");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
      setLoading(false);
    }
  }

  return <main className={styles.page}><form className={styles.card} onSubmit={signIn}>
    <div className={styles.brand}><span>R</span><strong>Rashidverse</strong></div>
    <p className={styles.eyebrow}>SECURE ADMIN</p><h1>Sign in to dashboard</h1>
    <p className={styles.copy}>Use your private administrator email and password to manage website content.</p>
    <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="username" required /></label>
    <label>Password
      <span className={styles.passwordField}>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type={passwordVisible ? "text" : "password"} autoComplete="current-password" required />
        <button className={styles.passwordToggle} type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? "Hide password" : "Show password"} title={passwordVisible ? "Hide password" : "Show password"}>
          {passwordVisible ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.9 10.9 0 0 1 12 4c5.2 0 8.6 4.2 9.6 6.1a2 2 0 0 1 0 1.8 17.5 17.5 0 0 1-3.1 3.9M6.6 6.6A17.6 17.6 0 0 0 2.4 10a2 2 0 0 0 0 2C3.4 13.8 6.8 18 12 18c.9 0 1.8-.1 2.6-.4" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.4 10.1a2 2 0 0 0 0 1.8C3.4 13.8 6.8 18 12 18s8.6-4.2 9.6-6.1a2 2 0 0 0 0-1.8C20.6 8.2 17.2 4 12 4S3.4 8.2 2.4 10.1Z" /><circle cx="12" cy="11" r="3" /></svg>}
        </button>
      </span>
    </label>
    {message && <p className={styles.error} role="alert">{message}</p>}
    <button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
  </form></main>;
}
