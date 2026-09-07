import fs from "node:fs/promises";
import path from "node:path";
import type { Store } from "@/lib/overlay";
import { emptyStore } from "@/lib/overlay";

// WHERE A SAVE GOES.
//
// Two paths, and the admin says which one it took rather than implying a save
// that did not happen — the same rule the contact endpoint follows.
//
//   local disk   dev only. Writes data/homes.json; Next's watcher rebuilds
//                and the change is on the site immediately.
//   GitHub API   production. Commits data/homes.json to the repo, Vercel
//                redeploys, the change is live in a minute or two.
//
// A serverless filesystem is read-only where it matters and reset on every
// deploy, so writing the file in production would appear to work and vanish.
// That is the failure this split exists to prevent.

const FILE = "data/homes.json";
const local = () => path.join(process.cwd(), FILE);

export type SaveResult =
  | { ok: true; via: "disk" | "github"; detail: string }
  | { ok: false; via: "none"; detail: string };

const gh = () => {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPO?.trim(); // "owner/name"
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";
  return token && repo ? { token, repo, branch } : null;
};

export async function loadStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(local(), "utf8");
    return { ...emptyStore, ...JSON.parse(raw) };
  } catch {
    return emptyStore;
  }
}

export async function saveStore(next: Store): Promise<SaveResult> {
  const body = JSON.stringify(next, null, 2) + "\n";

  if (process.env.NODE_ENV !== "production") {
    try {
      await fs.writeFile(local(), body, "utf8");
      return { ok: true, via: "disk", detail: `${FILE} written; the dev server rebuilds on its own.` };
    } catch (e) {
      return { ok: false, via: "none", detail: `could not write ${FILE}: ${String(e)}` };
    }
  }

  const cfg = gh();
  if (!cfg) {
    return {
      ok: false,
      via: "none",
      detail:
        "Nothing was saved. In production this admin commits to GitHub, and " +
        "GITHUB_TOKEN and GITHUB_REPO are not set — a serverless filesystem " +
        "would have accepted the write and lost it on the next deploy.",
    };
  }

  const url = `https://api.github.com/repos/${cfg.repo}/contents/${FILE}`;
  const head = {
    Authorization: `Bearer ${cfg.token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "noratun-admin",
  };
  try {
    // the current blob sha, so the commit replaces rather than conflicts
    const cur = await fetch(`${url}?ref=${encodeURIComponent(cfg.branch)}`, { headers: head, cache: "no-store" });
    const sha = cur.ok ? ((await cur.json()) as { sha?: string }).sha : undefined;

    const put = await fetch(url, {
      method: "PUT",
      headers: { ...head, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Homes updated from /admin",
        content: Buffer.from(body, "utf8").toString("base64"),
        branch: cfg.branch,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!put.ok) {
      const t = await put.text();
      return { ok: false, via: "none", detail: `GitHub refused the commit (${put.status}): ${t.slice(0, 200)}` };
    }
    return {
      ok: true,
      via: "github",
      detail: `Committed to ${cfg.repo}@${cfg.branch}. The site rebuilds and the change is live in a minute or two.`,
    };
  } catch (e) {
    return { ok: false, via: "none", detail: `GitHub request failed: ${String(e)}` };
  }
}
