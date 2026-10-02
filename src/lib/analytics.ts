type AnalyticsEventLike = {
  url: string;
};

function isPrivateStudioPath(pathname: string) {
  return pathname === "/studio" || pathname.startsWith("/studio/");
}

/**
 * Deployment note: this module is intentionally runtime-safe and side-effect free.
 * Portfolio analytics policy:
 * - never report private Studio/admin navigation;
 * - remove query strings and fragments before public page views are sent.
 */
export function sanitizePortfolioAnalyticsEvent<T extends AnalyticsEventLike>(event: T): T | null {
  const isAbsolute = /^https?:\/\//i.test(event.url);

  try {
    const url = new URL(event.url, "https://portfolio.invalid");

    if (isPrivateStudioPath(url.pathname)) return null;

    url.search = "";
    url.hash = "";

    return {
      ...event,
      url: isAbsolute ? url.toString() : url.pathname,
    };
  } catch {
    // Analytics must never be allowed to break page rendering.
    return event;
  }
}
