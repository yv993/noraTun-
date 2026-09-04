import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${site.name} does and does not collect on this site.`,
  alternates: { canonical: "/privacy" },
};

// True of THIS build. If analytics or a CRM arrive, this page changes in the
// same commit.
export default function PrivacyPage() {
  return (
    <article className="n-legal">
      <h1>What we collect</h1>
      <p>
        Short version: nothing, until you ask us to call you. This site sets no cookies and runs no
        analytics or advertising scripts — which is why nothing asked for your consent when you
        arrived.
      </p>

      <h2>The call-back form</h2>
      <p>
        If you request a call we receive the name, phone number, email and message you type, plus the
        date and your browser&rsquo;s user-agent string. We use it to call you back about homes and
        for nothing else. It is not sold and it does not join a mailing list — there is no mailing
        list.
      </p>
      <p>We keep enquiry correspondence while a conversation is live and delete it within two years of the last reply.</p>

      <h2>Photographs and fonts</h2>
      <p>
        Fonts and photography are served from this site itself. No third-party host sees your visit
        through us.
      </p>

      <h2>Your requests</h2>
      <p>
        Write to <a href={`mailto:${brand.email}`}>{brand.email}</a> and we will send, correct or
        delete anything we hold about you within a working week.
      </p>

      <div className="foot">
        <span>
          {brand.full} · {brand.year}
        </span>
        <a href="/">Back to the site</a>
      </div>
    </article>
  );
}
