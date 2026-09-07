import type { Metadata } from "next";
import { listings } from "@/lib/content";
import { planKeys } from "@/lib/imageRegistry";
import { adminConfigured, isSignedIn } from "@/lib/adminAuth";
import { loadStore } from "@/lib/adminStore";
import AdminUI from "./AdminUI";
import LoginForm from "./LoginForm";
import "./admin.css";

// Never indexed and never static. `noindex, nofollow` in the head, excluded
// from the sitemap, and force-dynamic so a signed-in render can never be
// cached and served to someone who is not.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <main className="ad ad-gate">
        <h1>The admin is closed</h1>
        <p>
          No <code>ADMIN_PASSWORD</code> is set, so there is no password that would open it. Set one in
          the environment — locally in <code>.env.local</code>, in production under the project&rsquo;s
          environment variables — and restart.
        </p>
        <p className="ad-quiet-note">
          Unset means closed on purpose: a missing variable must not leave an editor for the whole
          catalogue standing open.
        </p>
      </main>
    );
  }

  if (!(await isSignedIn())) return <LoginForm />;

  const store = await loadStore();
  const addedIds = store.added.map((h) => h.id);
  const writeMode =
    process.env.NODE_ENV !== "production"
      ? "Development — saves write data/homes.json and appear immediately."
      : process.env.GITHUB_TOKEN && process.env.GITHUB_REPO
        ? `Production — saves commit data/homes.json to ${process.env.GITHUB_REPO} and the site rebuilds.`
        : "Production, but GITHUB_TOKEN and GITHUB_REPO are not set — saves will be refused rather than silently lost.";

  return (
    <main>
      <AdminUI
        homes={listings}
        addedIds={addedIds}
        hidden={store.removed}
        planKeys={planKeys}
        writeMode={writeMode}
      />
    </main>
  );
}
