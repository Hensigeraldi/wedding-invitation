"use client";

import Reveal from "@/components/animations/Reveal";

export default function Gift() {
  return (
    <section id="gift" className="relative bg-[linear-gradient(180deg,#f7f1e3_0%,#ecd9a8_50%,#f7f1e3_100%)] pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <Reveal>
          <p className="section-label text-gold-deep mb-4">Wedding Gift</p>
          <div className="w-24 mx-auto mb-8 border-t border-gold-deep/60" />

          <p className="text-sm md:text-base text-deep-burgundy/80 leading-relaxed mb-12 italic">
            &quot;Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Bapak/Ibu/Saudara/i dapat memberikan kado atau cashless melalui detail berikut:&quot;
          </p>

          <div className="flex flex-col gap-6 w-full">
            {/* Box Mandiri */}
            <div className="border border-gold/30 shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center gap-4 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0e0407 0%, #2a070d 25%, #4a0e18 50%, #2a070d 75%, #0e0407 100%)" }}>
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #e6b826 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              <div className="bg-white/90 p-3 rounded-lg mb-2 relative z-10">
                <img 
                  src="/images/mandiri.png" 
                  alt="Bank Mandiri" 
                  className="h-8 object-contain" 
                />
              </div>
              <p className="text-xl tracking-widest text-champagne font-medium relative z-10">1500013369804</p>
              <p className="text-sm text-ivory/70 uppercase tracking-widest relative z-10">a.n. Christian Rondonuwu</p>
              
              <button
                className="mt-4 px-6 py-2 border border-champagne/50 text-xs tracking-[0.2em] uppercase text-champagne hover:bg-champagne hover:text-wine transition-colors relative z-10"
                onClick={() => {
                  navigator.clipboard.writeText("1500013369804");
                  alert("Nomor rekening disalin!");
                }}
              >
                Salin Rekening
              </button>
            </div>

            {/* Box Alamat */}
            <div className="border border-gold/30 shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center gap-4 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0e0407 0%, #2a070d 25%, #4a0e18 50%, #2a070d 75%, #0e0407 100%)" }}>
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #e6b826 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              <p className="text-xs tracking-[0.2em] uppercase text-gold-deep mb-1 relative z-10">
                Alamat Pengiriman Kado
              </p>
              <div className="w-16 border-t border-gold/40 relative z-10 mb-2" />
              
              <p className="font-heading-alt text-2xl text-ivory relative z-10">Tian &amp; Dela</p>
              <p className="text-sm text-ivory/80 leading-relaxed max-w-sm relative z-10">
                Jaga III, Desa Tempang 3<br />
                Kecamatan Langowan Utara
              </p>
              
              <button
                className="mt-4 px-6 py-2 border border-champagne/50 text-xs tracking-[0.2em] uppercase text-champagne hover:bg-champagne hover:text-wine transition-colors relative z-10"
                onClick={() => {
                  navigator.clipboard.writeText("Tian & Dela\nJaga III, Desa Tempang 3 Kecamatan Langowan Utara");
                  alert("Alamat disalin!");
                }}
              >
                Salin Alamat
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
