export const CALENDLY_URL = "https://calendly.com/g1pz91/30min";

export function openCalendly() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).Calendly?.initPopupWidget({ url: CALENDLY_URL });
}
