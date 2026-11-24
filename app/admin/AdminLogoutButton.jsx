"use client";

import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import styles from "./admin.module.css";

export default function AdminLogoutButton({ className = styles.logoutButton }) {
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); }
    finally { window.location.assign("/login"); }
  }
  return <button type="button" className={className} onClick={logout} disabled={loading}><FaSignOutAlt /> <span>{loading ? "Signing out..." : "Log out"}</span></button>;
}
