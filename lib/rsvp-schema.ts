import { z } from "zod";

/**
 * Zod schema untuk validasi input RSVP di server.
 * Harus sinkron dengan tipe RSVPFormData di lib/rsvp.ts (yang digunakan
 * oleh frontend). Validasi dilakukan di sisi server — jangan percaya
 * input dari client begitu saja.
 */
export const rsvpSchema = z.object({
  /** Nama lengkap tamu. Wajib, 2–100 karakter. */
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .trim(),

  /** Konfirmasi kehadiran. Wajib, hanya "yes" atau "no". */
  attendance: z.enum(["yes", "no"]),

  /** Jumlah tamu yang dibawa. Default 1, maks 10. */
  guests: z
    .coerce // coerce string → number (HTML form selalu kirim string)
    .number()
    .int("guests harus bilangan bulat")
    .min(1, "Minimal 1 tamu")
    .max(10, "Maksimal 10 tamu")
    .default(1),

  /** Pesan / ucapan dari tamu. Opsional, maksimal 500 karakter. */
  message: z
    .string()
    .max(500, "Pesan maksimal 500 karakter")
    .trim()
    .optional(),
});

export type RSVPInput = z.infer<typeof rsvpSchema>;
