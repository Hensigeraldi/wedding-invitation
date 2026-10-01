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
    parents: "Putra kedua dari keluarga Rondonuwu - Sandag",
    parentsAlternate: "Putra kedua dari\nRanny J. Rondonuwu, S.Pd dan Conny M. Sandag",
    photo: "/images/couple/groom.png",
  },
  bride: {
    fullName: "Rodela Agnesia Irot, SKM., M.Kes",
    displayName: "Dela",
    parents: "Putri pertama dari keluarga Irot - Pai",
    parentsAlternate: "Putri pertama dari\nRobby W. Irot, S.Pd., S.PdK., MM dan Dra. Olha J. Pai",
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
    venueName: "GMIM Nafiri Tempang\nLangowan Utara",
    mapsUrl: "https://maps.app.goo.gl/rvYQi9wz2auuDXyMA",
  },
  reception: {
    title: "Resepsi",
    date: "10 Oktober 2026",
    time: "15:00 WITA",
    venueName: "Kel. Irot - Pai Robby,\nJaga III, Desa Tempang 3 , Kecamatan Langowan Utara",
    mapsUrl: "https://maps.app.goo.gl/vinR8sW3dtyeaxth8",
  },

  turutMengundang: {
    left: [
      "Carey Wesley Irot, A.Md.Tra., ANT III",
    ],
    right: [
      "Kel. Rondonuwu Lossu\n(dr. Hermanus & drg. Fara)",
      "Kel. Lintong Rondonuwu\n(Jhendry & Fiany)",
      "Ega Crismania Gracia Rondonuwu",
      "Kel. Rondonuwu Manoppo"
    ]
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
      year: "Ms. Dela",
      title: "The Bride",
      description:
        "Di hadapan Tuhan, aku menerima tanganmu dan memilihmu sebagai teman dalam perjalanan hidupku. Aku berjanji untuk tetap mengasihi, mendampingi, dan bertumbuh bersamamu, sebab kasih yang berasal dari Tuhan tidak berkesudahan.",
      image: "/images/story/dela.png",
    },
  ] satisfies StoryItem[],

  gallery: [
    { image: "/images/gallery/2-new.jpeg", span: "tall" },
    { image: "/images/gallery/7-new.jpeg", span: "tall" },
    { image: "/images/gallery/3-new.jpeg", span: "wide" },
    { image: "/images/gallery/4-new.jpeg", span: "tall" },
    { image: "/images/gallery/5-new.jpeg", span: "tall" },
    { image: "/images/gallery/6-new.jpeg", span: "tall" },
    { image: "/images/gallery/1-new.jpeg", span: "tall" },
    { image: "/images/gallery/8-new.jpeg", span: "tall" },
    { image: "/images/gallery/9-new.jpeg", span: "tall" },
  ] satisfies GalleryItem[],

  music: {
    src: "/audio/the-way-you-look-at-me.mp3",
    title: "The Way You Look At Me - Nyoman Paul & Andi Rianto",
  },

  hashtag: "#AdrianClaraForever",

  rsvpEndpoint: "/api/rsvp", // Next.js Route Handler — data RSVP disimpan ke SQLite via Prisma
};

export type WeddingConfig = typeof weddingConfig;
