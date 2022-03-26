import * as React from "react";
import { useLocation } from "remix";
import * as analytics from "~/utils/analytics.client";
import * as constants from "~/constants";

export default function GoogleAnalytics() {
  const location = useLocation();

  React.useEffect(() => {
    analytics.pageview(location.pathname);
  }, [location]);

  if (process.env.NODE_ENV === "development") {
    return null;
  }
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${constants.GA_TRACKING_ID}`}
      />
      <script
        async
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${constants.GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
        }}
      />
    </>
  );
}
