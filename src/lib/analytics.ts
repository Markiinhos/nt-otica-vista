export type ConsentChoice = "accepted" | "rejected";

export type TrafficAttribution = {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
  campaign_id?: string;
};

type AnalyticsEventParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[][];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window["fbq"];
  }
}

const CONSENT_KEY = "nt_oticas_analytics_consent";
const ATTRIBUTION_KEY = "nt_oticas_session_attribution";
const GA4_MEASUREMENT_ID = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY"];
const META_PIXEL_ID = import.meta.env["VITE_META_PIXEL_ID"];
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"] as const;

let initialized = false;
let memoryAttribution: TrafficAttribution | null = null;

function hasConfiguredValue(value: string | undefined) {
  return Boolean(value && !value.includes("INSERIR_") && value.trim().length > 0);
}

function inferAttribution(): TrafficAttribution {
  const search = new URLSearchParams(window.location.search);
  const source = search.get("utm_source")?.trim().toLowerCase();
  const medium = search.get("utm_medium")?.trim().toLowerCase();
  const campaign = search.get("utm_campaign")?.trim();
  const hasAdClickId = ["gclid", "gbraid", "wbraid", "fbclid", "ttclid"].some((key) => search.has(key));

  if (source || medium || campaign) {
    const attribution: TrafficAttribution = {
      source: source || "unknown",
      medium: medium || (hasAdClickId ? "paid" : "unknown"),
      campaign: campaign || "(not set)",
    };
    const content = search.get("utm_content");
    const term = search.get("utm_term");
    const campaignId = search.get("utm_id");
    if (content) attribution.content = content;
    if (term) attribution.term = term;
    if (campaignId) attribution.campaign_id = campaignId;
    return attribution;
  }

  if (hasAdClickId) {
    return {
      source: search.has("fbclid") ? "facebook" : search.has("ttclid") ? "tiktok" : "google",
      medium: "paid",
      campaign: "(not set)",
    };
  }

  if (!document.referrer) {
    return { source: "direct", medium: "none", campaign: "(direct)" };
  }

  try {
    const referrerHost = new URL(document.referrer).hostname.toLowerCase();
    const currentHost = window.location.hostname.toLowerCase();
    if (referrerHost === currentHost) {
      return { source: "direct", medium: "none", campaign: "(direct)" };
    }

    const channels: Array<[RegExp, string, string]> = [
      [/google\./, "google", "organic"],
      [/instagram\./, "instagram", "social"],
      [/facebook\.|fb\.com$/, "facebook", "social"],
      [/whatsapp\.|wa\.me$/, "whatsapp", "referral"],
      [/tiktok\./, "tiktok", "social"],
      [/youtube\.|youtu\.be$/, "youtube", "social"],
    ];
    const match = channels.find(([pattern]) => pattern.test(referrerHost));
    return match
      ? { source: match[1], medium: match[2], campaign: "(referral)" }
      : { source: referrerHost, medium: "referral", campaign: "(referral)" };
  } catch {
    return { source: "direct", medium: "none", campaign: "(direct)" };
  }
}

function readStoredAttribution(): TrafficAttribution | null {
  try {
    const value = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    return value ? (JSON.parse(value) as TrafficAttribution) : null;
  } catch {
    return null;
  }
}

export function getAttribution(): TrafficAttribution {
  if (memoryAttribution) return memoryAttribution;
  memoryAttribution = readStoredAttribution() || inferAttribution();
  return memoryAttribution;
}

function persistAttribution() {
  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(getAttribution()));
  } catch {
    // Analytics still works when storage is unavailable.
  }
}

function appendUtmParameters(parameters: AnalyticsEventParameters) {
  const attribution = getAttribution();
  return {
    ...parameters,
    source: attribution.source,
    medium: attribution.medium,
    campaign: attribution.campaign,
    utm_content: attribution.content,
    utm_term: attribution.term,
    utm_id: attribution.campaign_id,
    page_location: window.location.href,
  };
}

function loadGoogleAnalytics() {
  if (!hasConfiguredValue(GA4_MEASUREMENT_ID) || document.querySelector("script[data-nt-ga4]")) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`;
  script.dataset["ntGa4"] = "true";
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
  window.gtag("config", GA4_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
  });
}

function loadMetaPixel() {
  if (!hasConfiguredValue(META_PIXEL_ID) || window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  } as NonNullable<Window["fbq"]>;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.dataset["ntMetaPixel"] = "true";
  document.head.appendChild(script);
  fbq("init", META_PIXEL_ID);
}

export function getConsentChoice(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function setConsentChoice(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // The choice remains valid for the current page if storage is unavailable.
  }
  if (choice === "accepted") initializeAnalytics();
}

export function initializeAnalytics() {
  if (initialized || getConsentChoice() !== "accepted") return;
  initialized = true;
  persistAttribution();
  loadGoogleAnalytics();
  loadMetaPixel();

  const pageParameters = appendUtmParameters({
    page_title: document.title,
    page_path: `${window.location.pathname}${window.location.search}`,
  });
  window.gtag?.("event", "page_view", pageParameters);
  window.fbq?.("track", "PageView");
  window.fbq?.("track", "ViewContent", { content_name: "NT Óticas Landing Page" });
}

export function trackEvent(eventName: string, parameters: AnalyticsEventParameters = {}) {
  if (getConsentChoice() !== "accepted") return;
  const eventParameters = appendUtmParameters(parameters);
  window.gtag?.("event", eventName, {
    ...eventParameters,
    transport_type: "beacon",
  });
}

export function trackContact(parameters: AnalyticsEventParameters) {
  trackEvent("whatsapp_click", parameters);
  if (getConsentChoice() === "accepted") {
    window.fbq?.("track", "Contact", appendUtmParameters(parameters));
  }
}

export function captureLandingAttribution() {
  if (typeof window === "undefined") return;
  const search = new URLSearchParams(window.location.search);
  if (UTM_KEYS.some((key) => search.has(key)) || !memoryAttribution) {
    memoryAttribution = readStoredAttribution() || inferAttribution();
  }
}
