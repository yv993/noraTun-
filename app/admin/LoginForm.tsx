"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <main className="ad ad-gate">
      <h1>NORATUN admin</h1>
      <form action={action}>
        <label className="ad-f">
          <span>Password</span>
          {/* current-password, so a manager offers the saved one rather than
              offering to save a new one */}
          <input type="password" name="password" autoComplete="current-password" autoFocus required />
        </label>
        <button type="submit" disabled={pending}>
          {pending ? "…" : "Sign in"}
        </button>
      </form>
      {state && !state.ok ? (
        <p className="ad-note bad" role="status">
          {state.message}
        </p>
      ) : null}
    </main>
  );
}
