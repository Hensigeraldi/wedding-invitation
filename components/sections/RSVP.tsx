"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/animations/Reveal";
import TwinkleDust from "@/components/animations/TwinkleDust";
import { submitRSVP, type RSVPFormData } from "@/lib/rsvp";

const inputClasses =
  "w-full bg-transparent border-0 border-b border-wine/20 focus:border-gold-deep outline-none py-3 text-burgundy-black placeholder:text-deep-burgundy/40 text-sm transition-colors duration-300";

type Reply = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type Message = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  replies?: Reply[];
};

export default function RSVP() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyStatus, setReplyStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/rsvp/messages?t=${Date.now()}`);
      if (res.ok) {
        const resData = await res.json();
        setMessages(resData);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  async function handleReplySubmit(e: FormEvent<HTMLFormElement>, rsvpId: string) {
    e.preventDefault();
    setReplyStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      message: String(formData.get("message") ?? ""),
    };

    try {
      const res = await fetch(`/api/rsvp/${rsvpId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to reply");

      setReplyStatus("success");
      fetchMessages(); // refresh the messages
      setTimeout(() => {
        setReplyingTo(null);
        setReplyStatus("idle");
      }, 1000);
    } catch {
      setReplyStatus("error");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data: RSVPFormData = {
      name: String(formData.get("name") ?? ""),
      attendance: String(formData.get("attendance") ?? "yes") as "yes" | "no",
      guests: Number(formData.get("guests") ?? 1),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const form = e.currentTarget; // simpan referensi sebelum async
      await submitRSVP(data);
      form.reset();               // reset sebelum state update
      setStatus("success");
      fetchMessages();            // update messages after submit
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="rsvp" className="relative bg-[linear-gradient(180deg,#f7f1e3_0%,#ecd9a8_50%,#f7f1e3_100%)] py-28 md:py-36 overflow-hidden">
      <div className="relative z-10 max-w-lg mx-auto px-6">
        <Reveal className="text-center mb-14">
          <p className="section-label text-gold-deep mb-4">Kindly Reply</p>
          <h2 className="font-heading-alt italic text-4xl md:text-6xl text-burgundy-black mb-4">
            RSVP
          </h2>
          <p className="text-sm text-deep-burgundy/80">
            Mohon konfirmasi kehadiran Anda sebelum {weddingConfig.dateLong}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          {status === "success" ? (
            <div className="text-center border border-wine/20 py-14 px-6 bg-cream/30 mb-12">
              <p className="font-heading-alt italic text-2xl text-gold-deep mb-2">
                Terima Kasih
              </p>
              <p className="text-sm text-deep-burgundy/80">
                Konfirmasi kehadiran dan ucapan Anda telah kami terima.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-7 mb-12">
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-deep-burgundy/80 mb-1 block">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-deep-burgundy/80 mb-1 block">
                  Attendance
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className={`${inputClasses} cursor-pointer flex justify-between items-center`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>{attendance === "yes" ? "Hadir dengan sukacita" : "Mohon maaf, berhalangan"}</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#fdfaf2] border border-wine/30 shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-50 overflow-hidden rounded-sm"
                      >
                        <div
                          className="px-4 py-3 cursor-pointer text-wine hover:bg-wine hover:text-champagne transition-colors duration-300 text-sm font-medium"
                          onClick={() => { setAttendance("yes"); setIsDropdownOpen(false); }}
                        >
                          Hadir dengan sukacita
                        </div>
                        <div
                          className="px-4 py-3 cursor-pointer text-wine hover:bg-wine hover:text-champagne transition-colors duration-300 text-sm font-medium"
                          onClick={() => { setAttendance("no"); setIsDropdownOpen(false); }}
                        >
                          Mohon maaf, berhalangan
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <input type="hidden" name="attendance" value={attendance} />
                </div>
              </div>



              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-deep-burgundy/80 mb-1 block">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Doa dan ucapan untuk kedua mempelai"
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-3 border border-wine/50 text-wine hover:bg-wine hover:text-cream px-8 py-3 uppercase tracking-[0.2em] text-xs transition-colors mt-4 disabled:opacity-50"
              >
                {status === "submitting" ? "Sending..." : "Confirm Attendance"}
              </motion.button>

              {status === "error" && (
                <p className="text-xs text-center text-wine">
                  Terjadi kesalahan, silakan coba lagi.
                </p>
              )}
            </form>
          )}
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12">
            <h3 className="font-heading-alt italic text-2xl text-burgundy-black mb-6 text-center">Doa & Ucapan</h3>
            
            <div className="w-full overflow-y-auto overflow-x-hidden p-3 md:p-5 bg-white/30 border border-wine/20 rounded-md shadow-inner light-scrollbar" style={{ height: '450px' }}>
              {loadingMessages && messages.length === 0 ? (
                <p className="text-center text-sm text-wine/70">Memuat pesan...</p>
              ) : messages.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col gap-2">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/60 p-3 md:p-4 border border-wine/10 rounded-sm shadow-sm break-words"
                      >
                        <p className="font-medium text-sm text-wine mb-2">{msg.name}</p>
                        <p className="text-sm text-deep-burgundy/80 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <p className="text-[10px] text-wine/50 uppercase tracking-wider">
                            {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <button 
                            onClick={() => { setReplyingTo(replyingTo === msg.id ? null : msg.id); setReplyStatus("idle"); }}
                            className="text-[10px] text-wine uppercase tracking-wider font-semibold hover:underline"
                          >
                            Balas
                          </button>
                        </div>
                      </motion.div>

                      {/* Reply Form */}
                      <AnimatePresence>
                        {replyingTo === msg.id && (
                          <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-3 md:ml-8 overflow-hidden"
                        >
                          <form onSubmit={(e) => handleReplySubmit(e, msg.id)} className="flex gap-2 items-center mt-1">
                            <input required name="message" type="text" placeholder="Tambahkan balasan..." className="flex-1 min-w-0 bg-transparent border-0 border-b border-wine/30 focus:border-wine outline-none py-1.5 text-burgundy-black placeholder:text-deep-burgundy/50 text-xs transition-colors" />
                            <button type="submit" disabled={replyStatus === "submitting"} className="text-[10px] font-semibold text-wine uppercase tracking-wider hover:text-gold-deep disabled:opacity-50 px-2 shrink-0">
                                {replyStatus === "submitting" ? "..." : replyStatus === "success" ? "Terkirim" : "Kirim"}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Replies List */}
                    {msg.replies && msg.replies.length > 0 && (
                      <div className="flex flex-col gap-3 ml-3 md:ml-8 mt-1 border-l-2 border-wine/10 pl-3 md:pl-4 py-1 break-words">
                        {msg.replies.map(reply => (
                          <div key={reply.id} className="py-1">
                            <p className="font-medium text-xs text-wine mb-0.5">{reply.name}</p>
                            <p className="text-xs text-deep-burgundy/80 whitespace-pre-wrap">{reply.message}</p>
                              <p className="text-[9px] text-wine/40 mt-1 uppercase">
                                {new Date(reply.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric", month: "long", year: "numeric",
                                })}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-wine/70 pb-8">Belum ada ucapan yang dibagikan.</p>
              )}
            </div>
            {messages.length > 0 && (
              <p className="text-center text-[10px] text-wine/60 mt-3 md:hidden flex items-center justify-center gap-1 animate-pulse">
                <span>Geser ke dalam kotak untuk melihat lebih banyak</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
