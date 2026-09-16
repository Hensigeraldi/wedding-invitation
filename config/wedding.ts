// ============================================================================
// WEDDING CONFIG
// Ganti semua nilai di bawah ini untuk mengustomisasi undangan tanpa perlu
// menyentuh komponen apapun.
// ============================================================================

export type StoryItem = {
  year: string;
  title: string;
  description: string;
  image: string;
};

export type GalleryItem = {
  image: string;
  caption?: string;
  span?: "tall" | "wide" | "normal";
};

export const weddingConfig = {
  groom: {
    fullName: "Apt. Christian Rondonuwu, S.Farm",
    displayName: "Tian",
    parents: "Putra dari keluarga Rondonuwu - Sandag",
    photo: "/images/couple/groom.png",
  },
  bride: {
    fullName: "Rodela Agnesia Irot, S.KM, M.Kes",
    displayName: "Dela",
    parents: "Putri dari keluarga Irot - Pai",
    photo: "/images/couple/bride.png",
  },

  coupleImage: "/images/couple/hero-couple.jpg",

  date: "2026-10-10T10:00:00+08:00",
  dateDisplay: "10 . 10 . 2026",
  dateLong: "Sabtu, 10 Oktober 2026",

  ceremony: {
    title: "Pemberkatan",
    date: "10 Oktober 2026",
    time: "11:00 WITA",
    venueName: "GMIM Nafiri Tempang Langowan Utara",
    mapsUrl: "https://maps.app.goo.gl/rvYQi9wz2auuDXyMA",
  },
  reception: {
    title: "Resepsi",
    date: "10 Oktober 2026",
    time: "15:00 WITA",
    venueName: "Jaga III, Desa Tempang 3 Kecamatan Langowan Utara",
    mapsUrl: "https://maps.app.goo.gl/vinR8sW3dtyeaxth8",
  },

  story: [
    {
      year: "Mr. Tian",
      title: "The Groom",
      description:
        "Di hadapan Tuhan, aku memilihmu untuk menjadi teman hidupku. Aku berjanji untuk mengasihi, menjaga, dan setia berjalan bersamamu dalam setiap musim kehidupan. Sebab apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.",
      image: "/images/story/tian.png",
    },
    {
      year: "Mrs. Dela",
      title: "The Bride",
      description:
        "Di hadapan Tuhan, aku menerima tanganmu dan memilihmu sebagai teman dalam perjalanan hidupku. Aku berjanji untuk tetap mengasihi, mendampingi, dan bertumbuh bersamamu, sebab kasih yang berasal dari Tuhan tidak berkesudahan",
      image: "/images/story/dela.png",
    },
  ] satisfies StoryItem[],

  gallery: [
    { image: "/images/gallery/2.jpeg", span: "tall" },
    { image: "/images/gallery/7.png", span: "tall" },
    { image: "/images/gallery/3.jpeg", span: "wide" },
    { image: "/images/gallery/4.jpeg", span: "tall" },
    { image: "/images/gallery/5.jpeg", span: "tall" },
    { image: "/images/gallery/6.jpeg", span: "tall" },
    { image: "/images/gallery/1.jpeg", span: "tall" },
    { image: "/images/gallery/8.jpeg", span: "tall" },
    { image: "/images/gallery/9.jpeg", span: "tall" },
  ] satisfies GalleryItem[],

  music: {
    src: "/audio/the-way-you-look-at-me.mp3",
    title: "The Way You Look At Me - Nyoman Paul & Andi Rianto",
  },

  hashtag: "#AdrianClaraForever",

  rsvpEndpoint: "/api/rsvp", // Next.js Route Handler — data RSVP disimpan ke SQLite via Prisma
};

export type WeddingConfig = typeof weddingConfig;
