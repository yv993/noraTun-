"use server";

import { revalidatePath } from "next/cache";
import { isSignedIn, signIn, signOut } from "@/lib/adminAuth";
import { loadStore, saveStore } from "@/lib/adminStore";
import type { StoredHome } from "@/lib/overlay";
import { listings } from "@/lib/content";
import { TYPOLOGIES } from "@/lib/content";

// EVERY ACTION RE-CHECKS THE SESSION. A server action is a public HTTP
// endpoint with a generated name — it is reachable whether or not the page
// that renders its button was, so the page's own guard protects nothing here.

export type ActionState = { ok: boolean; message: string } | null;

const guard = async () => {
  if (!(await isSignedIn())) throw new Error("Not signed in.");
};

export async function loginAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  const pw = String(form.get("password") ?? "");
  if (!pw) return { ok: false, message: "Enter the password." };
  const ok = await signIn(pw);
  // The same message either way. "No password is configured" and "that
  // password is wrong" are different facts, and telling them apart is free
  // reconnaissance for anyone probing the form.
  return ok ? { ok: true, message: "Signed in." } : { ok: false, message: "That did not work." };
}

export async function logoutAction() {
  await signOut();
  revalidatePath("/admin");
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const num = (f: FormData, k: string): number | null => {
  const v = str(f, k);
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** The fields the admin may change. Everything else on a home — the plans,
 *  the sheet it was read off, the room hotspots — stays authored, because it
 *  came off a drawing and a text box is the wrong instrument for it. */
function readEditable(form: FormData) {
  const bedrooms = num(form, "bedrooms");
  const area = num(form, "area");
  const terrace = num(form, "terrace");
  const parking = num(form, "parking");
  const benefits = str(form, "benefits")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    name: str(form, "name"),
    code: str(form, "code"),
    place: str(form, "place"),
    kind: str(form, "kind"),
    typology: str(form, "typology"),
    block: str(form, "block"),
    floor: str(form, "floor"),
    completion: str(form, "completion"),
    level: str(form, "level"),
    status: str(form, "status") === "reserved" ? "reserved" : "available",
    note: str(form, "note"),
    description: str(form, "description"),
    bedrooms,
    area,
    terrace: terrace ?? 0,
    parking,
    benefits,
  };
}

function validate(v: ReturnType<typeof readEditable>): string | null {
  if (!v.name) return "A home needs a name.";
  if (!v.code) return "A home needs a code — the № on its card.";
  if (!["Yerevan", "Dilijan", "Sevan"].includes(v.place))
    return "Place must be Yerevan, Dilijan or Sevan — those are the three the site filters by.";
  if (!(TYPOLOGIES as readonly string[]).includes(v.typology))
    return `Typology must be one of: ${TYPOLOGIES.join(", ")}.`;
  if (v.bedrooms !== null && (v.bedrooms < 0 || v.bedrooms > 12))
    return "Bedrooms looks wrong. Leave it empty if the sheet draws no bed.";
  if (v.area !== null && (v.area <= 0 || v.area > 2000)) return "Area in m² looks wrong.";
  if (!v.description) return "The description is what the page reads under Info — it cannot be empty.";
  return null;
}

export async function saveHomeAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await guard();
  const id = str(form, "id");
  if (!id) return { ok: false, message: "No home id." };
  const v = readEditable(form);
  const bad = validate(v);
  if (bad) return { ok: false, message: bad };

  const store = await loadStore();
  const isAdded = store.added.some((h) => h.id === id);
  if (isAdded) {
    store.added = store.added.map((h) => (h.id === id ? ({ ...h, ...v } as StoredHome) : h));
  } else {
    store.edits[id] = { ...(store.edits[id] ?? {}), ...v } as Partial<StoredHome>;
  }
  const res = await saveStore(store);
  revalidatePath("/admin");
  revalidatePath("/homes");
  revalidatePath(`/homes/${id}`);
  return { ok: res.ok, message: res.ok ? `Saved. ${res.detail}` : res.detail };
}

/** Undo every admin change to one authored home, so a bad edit is one click
 *  back to the drawing rather than a hunt through JSON. */
export async function resetHomeAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await guard();
  const id = str(form, "id");
  const store = await loadStore();
  delete store.edits[id];
  store.removed = store.removed.filter((r) => r !== id);
  const res = await saveStore(store);
  revalidatePath("/admin");
  revalidatePath("/homes");
  return { ok: res.ok, message: res.ok ? `Back to how it was authored. ${res.detail}` : res.detail };
}

export async function setHiddenAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await guard();
  const id = str(form, "id");
  const hide = str(form, "hide") === "1";
  const store = await loadStore();
  if (hide) {
    if (!store.removed.includes(id)) store.removed.push(id);
  } else {
    store.removed = store.removed.filter((r) => r !== id);
  }
  const res = await saveStore(store);
  revalidatePath("/admin");
  revalidatePath("/homes");
  return {
    ok: res.ok,
    message: res.ok ? `${hide ? "Withheld from the site" : "Back on the site"}. ${res.detail}` : res.detail,
  };
}

export async function addHomeAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await guard();
  const id = str(form, "id").toUpperCase();
  if (!/^[A-Z0-9-]{2,12}$/.test(id))
    return { ok: false, message: "The id is the URL: letters, digits and hyphens, 2–12 characters." };
  if (listings.some((l) => l.id === id))
    return { ok: false, message: `${id} already exists — ids are the home's address on this site.` };

  const v = readEditable(form);
  const bad = validate(v);
  if (bad) return { ok: false, message: bad };

  const sheet = str(form, "sheet");
  const ground = str(form, "planGround");
  const lower = str(form, "planLower");
  if (!ground) return { ok: false, message: "Pick at least the ground-floor drawing." };

  const home: StoredHome = {
    id,
    ...v,
    place: v.place as StoredHome["place"],
    typology: v.typology as StoredHome["typology"],
    status: v.status as StoredHome["status"],
    sheet: sheet || ground.replace(/-.*$/, ""),
    levels: [
      { caption: "Ground floor", img: ground, alt: `${v.name}: ground floor plan.` },
      ...(lower ? [{ caption: "Basement", img: lower, alt: `${v.name}: basement plan.` }] : []),
    ],
  } as StoredHome;

  const store = await loadStore();
  store.added.push(home);
  const res = await saveStore(store);
  revalidatePath("/admin");
  revalidatePath("/homes");
  return { ok: res.ok, message: res.ok ? `${id} added. ${res.detail}` : res.detail };
}

export async function deleteAddedAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await guard();
  const id = str(form, "id");
  const store = await loadStore();
  const before = store.added.length;
  store.added = store.added.filter((h) => h.id !== id);
  if (store.added.length === before)
    return { ok: false, message: `${id} was authored in the code, not added here — hide it instead.` };
  const res = await saveStore(store);
  revalidatePath("/admin");
  revalidatePath("/homes");
  return { ok: res.ok, message: res.ok ? `${id} deleted. ${res.detail}` : res.detail };
}
