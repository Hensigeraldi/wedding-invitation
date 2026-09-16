import { weddingConfig } from "@/config/wedding";

export type RSVPFormData = {
  name: string;
  attendance: "yes" | "no";
  guests: number;
  message: string;
};

/**
 * Submits an RSVP. If `weddingConfig.rsvpEndpoint` is empty, this simulates
 * a network call (dummy handler) so the UI can be built and tested end to
 * end. Once you have a backend/API/database, set `rsvpEndpoint` in
 * config/wedding.ts and this automatically switches to a real POST request —
 * no changes needed in the RSVP component.
 */
export async function submitRSVP(data: RSVPFormData): Promise<{ ok: true }> {
  if (!weddingConfig.rsvpEndpoint) {
    // Dummy submit — replace by setting config.rsvpEndpoint
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.info("[RSVP dummy submit]", data);
    return { ok: true };
  }

  const res = await fetch(weddingConfig.rsvpEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`RSVP submit failed with status ${res.status}`);
  }

  return { ok: true };
}
