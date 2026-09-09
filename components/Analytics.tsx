import Script from "next/script";
import { analytics } from "@/lib/analytics";

// Renders the configured provider's tag, or nothing at all. A server component:
// the env vars are read at build time, so an unconfigured site ships no script
// tag, no global, and no request — not a disabled one.
//
// strategy="afterInteractive" on purpose. Analytics must not compete with the
// hero for the main thread: the LCP here is a 2400px render, and a measurement
// script that delays it makes the number it is measuring worse. "lazyOnload"
// was rejected because it drops the pageview for anyone who leaves quickly,
// which is exactly the visitor a bounce metric needs to count.
export default function Analytics() {
  return (
    <>
      {analytics.plausible ? (
        <Script
          defer
          strategy="afterInteractive"
          data-domain={analytics.plausible}
          src="https://plausible.io/js/script.js"
        />
      ) : null}

      {analytics.umami ? (
        <Script
          defer
          strategy="afterInteractive"
          data-website-id={analytics.umami}
          src={analytics.umamiSrc}
        />
      ) : null}

      {analytics.ga ? (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics.ga}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
// GA4 with the identifiers it does not need for a brochure site switched off:
// no ad signals, no cross-site personalisation, IP anonymisation on.
gtag('config','${analytics.ga}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
        </>
      ) : null}
    </>
  );
}
