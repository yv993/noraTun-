"use client";

import { useActionState, useState } from "react";
import type { Listing } from "@/lib/content";
import { TYPOLOGIES } from "@/lib/content";
import {
  addHomeAction,
  deleteAddedAction,
  logoutAction,
  resetHomeAction,
  saveHomeAction,
  setHiddenAction,
  type ActionState,
} from "./actions";

// The admin's own surface. Deliberately unstyled by the site's stylesheet:
// this is a tool, not a page of the brochure, and borrowing the wine-and-cream
// chrome would make it easy to mistake one for the other while editing.

function Note({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p className={`ad-note ${state.ok ? "ok" : "bad"}`} role="status">
      {state.message}
    </p>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="ad-f">
      <span>
        {label}
        {hint ? <em>{hint}</em> : null}
      </span>
      <input type={type} name={name} defaultValue={defaultValue ?? ""} />
    </label>
  );
}

function HomeFields({ l }: { l?: Listing }) {
  return (
    <>
      <div className="ad-grid">
        <Field label="Name" name="name" defaultValue={l?.name} />
        <Field label="Code" name="code" defaultValue={l?.code} hint="the № on the card" />
        <label className="ad-f">
          <span>Place</span>
          <select name="place" defaultValue={l?.place ?? "Yerevan"}>
            {["Yerevan", "Dilijan", "Sevan"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <Field label="Kind" name="kind" defaultValue={l?.kind ?? "House"} />
        <label className="ad-f">
          <span>Typology</span>
          <select name="typology" defaultValue={l?.typology ?? TYPOLOGIES[0]}>
            {TYPOLOGIES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <Field label="Block" name="block" defaultValue={l?.block} />
        <Field label="Floor" name="floor" defaultValue={l?.floor} />
        <Field label="Level" name="level" defaultValue={l?.level} />
        <Field label="Completion" name="completion" defaultValue={l?.completion} hint="e.g. 2Q 2027" />
        <Field label="Bedrooms" name="bedrooms" type="number" defaultValue={l?.bedrooms} hint="empty if no bed is drawn" />
        <Field label="Area m²" name="area" type="number" defaultValue={l?.area} hint="empty if unnumbered" />
        <Field label="Terrace m²" name="terrace" type="number" defaultValue={l?.terrace ?? 0} />
        <Field label="Parking" name="parking" type="number" defaultValue={l?.parking} hint="bays drawn" />
        <label className="ad-f">
          <span>Status</span>
          <select name="status" defaultValue={l?.status ?? "available"}>
            <option value="available">available</option>
            <option value="reserved">reserved</option>
          </select>
        </label>
      </div>
      <Field label="Note" name="note" defaultValue={l?.note} hint="the line under the name" />
      <label className="ad-f">
        <span>
          Description<em>what the Info tab reads</em>
        </span>
        <textarea name="description" rows={3} defaultValue={l?.description ?? ""} />
      </label>
      <label className="ad-f">
        <span>
          Benefits<em>one per line</em>
        </span>
        <textarea name="benefits" rows={6} defaultValue={(l?.benefits ?? []).join("\n")} />
      </label>
    </>
  );
}

function Row({ l, added }: { l: Listing; added: boolean }) {
  const [open, setOpen] = useState(false);
  const [save, saveA, savePending] = useActionState(saveHomeAction, null);
  const [reset, resetA] = useActionState(resetHomeAction, null);
  const [hide, hideA] = useActionState(setHiddenAction, null);
  const [del, delA] = useActionState(deleteAddedAction, null);

  return (
    <li className="ad-row">
      <button type="button" className="ad-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <b>
          {l.code} · {l.name}
        </b>
        <span>
          {l.place} · {l.typology} · {l.status}
          {added ? " · added here" : ""}
        </span>
        <i aria-hidden>{open ? "−" : "+"}</i>
      </button>

      {open ? (
        <div className="ad-body">
          <form action={saveA}>
            <input type="hidden" name="id" value={l.id} />
            <HomeFields l={l} />
            <div className="ad-actions">
              <button type="submit" disabled={savePending}>
                {savePending ? "Saving…" : "Save"}
              </button>
              <a href={`/homes/${l.id}`} target="_blank" rel="noreferrer">
                View the page ↗
              </a>
            </div>
            <Note state={save} />
          </form>

          <div className="ad-side">
            <form action={hideA}>
              <input type="hidden" name="id" value={l.id} />
              <input type="hidden" name="hide" value="1" />
              <button type="submit" className="ad-quiet">
                Withhold from the site
              </button>
            </form>
            {added ? (
              <form action={delA}>
                <input type="hidden" name="id" value={l.id} />
                <button type="submit" className="ad-danger">
                  Delete
                </button>
              </form>
            ) : (
              <form action={resetA}>
                <input type="hidden" name="id" value={l.id} />
                <button type="submit" className="ad-quiet">
                  Reset to authored
                </button>
              </form>
            )}
            <Note state={hide} />
            <Note state={reset} />
            <Note state={del} />
          </div>
        </div>
      ) : null}
    </li>
  );
}

export default function AdminUI({
  homes,
  addedIds,
  hidden,
  planKeys,
  writeMode,
}: {
  homes: Listing[];
  addedIds: string[];
  hidden: string[];
  planKeys: string[];
  writeMode: string;
}) {
  const [add, addA, addPending] = useActionState(addHomeAction, null);
  const [unhide, unhideA] = useActionState(setHiddenAction, null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="ad">
      <header className="ad-top">
        <div>
          <h1>NORATUN — homes</h1>
          <p className="ad-mode">{writeMode}</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="ad-quiet">
            Sign out
          </button>
        </form>
      </header>

      <p className="ad-lead">
        {homes.length} on the site. Editing here writes <code>data/homes.json</code> — the drawings, the
        room hotspots and the photography stay in the code, because they come off a sheet or a build
        step rather than a text box.
      </p>

      <button type="button" className="ad-add" onClick={() => setShowAdd((v) => !v)} aria-expanded={showAdd}>
        {showAdd ? "− Cancel" : "+ Add a home"}
      </button>

      {showAdd ? (
        <form action={addA} className="ad-new">
          <div className="ad-grid">
            <Field label="Id" name="id" hint="the URL: /homes/…" />
            <Field label="Sheet" name="sheet" hint="e.g. v05" />
            <label className="ad-f">
              <span>
                Ground plan<em>required</em>
              </span>
              <select name="planGround" defaultValue="">
                <option value="">—</option>
                {planKeys.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
            <label className="ad-f">
              <span>
                Lower plan<em>optional</em>
              </span>
              <select name="planLower" defaultValue="">
                <option value="">—</option>
                {planKeys.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
          </div>
          <HomeFields />
          <div className="ad-actions">
            <button type="submit" disabled={addPending}>
              {addPending ? "Adding…" : "Add"}
            </button>
          </div>
          <Note state={add} />
        </form>
      ) : null}

      {hidden.length ? (
        <div className="ad-hidden">
          <h2>Withheld from the site</h2>
          <ul>
            {hidden.map((id) => (
              <li key={id}>
                <span>{id}</span>
                <form action={unhideA}>
                  <input type="hidden" name="id" value={id} />
                  <input type="hidden" name="hide" value="0" />
                  <button type="submit" className="ad-quiet">
                    Put back
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <Note state={unhide} />
        </div>
      ) : null}

      <ul className="ad-list">
        {homes.map((l) => (
          <Row key={l.id} l={l} added={addedIds.includes(l.id)} />
        ))}
      </ul>
    </div>
  );
}
