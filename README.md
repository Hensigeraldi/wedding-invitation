# Adrian & Clara — Wedding Invitation

Website undangan pernikahan premium: Next.js (App Router) + TypeScript +
Tailwind CSS + React Three Fiber (kupu-kupu 3D) + Framer Motion + Lenis
(smooth scroll). Tema: Luxury Romantic — Burgundy/Maroon + Gold.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Build production

```bash
npm run build
npm run start
```

## Mengganti data pasangan, tanggal, venue, dll.

Semua data ada di **satu file**: `config/wedding.ts`. Tidak perlu menyentuh
komponen apapun — cukup edit nilai di sana:

- `groom` / `bride` — nama, deskripsi, foto, instagram
- `date` / `dateDisplay` / `dateLong` — tanggal pernikahan (dipakai untuk countdown)
- `ceremony` / `reception` — venue, jam, link Google Maps
- `story` — timeline "Our Story"
- `gallery` — foto-foto prewedding
- `music` — path file musik
- `rsvpEndpoint` — kosongkan untuk dummy submit, isi URL API untuk mengaktifkan submit sungguhan (lihat `lib/rsvp.ts`)

## Mengganti aset (foto, musik, model 3D)

Taruh file di folder `public/`:

```
public/
├── images/
│   ├── couple/     (hero-couple.jpg, groom.jpg, bride.jpg)
│   ├── story/      (foto timeline)
│   └── gallery/    (foto prewedding gallery)
├── models/
│   └── butterfly.glb   (opsional — jika tidak ada, kupu-kupu 3D
│                         prosedural otomatis dipakai sebagai fallback)
├── audio/
│   └── wedding.mp3
└── fonts/          (font premium sudah disertakan, self-hosted)
```

Saat ini semua foto masih **placeholder** (di-generate otomatis) —
ganti dengan foto asli di path yang sama, ukuran/rasio mengikuti
placeholder yang ada agar layout tidak berubah.

### Menambahkan kupu-kupu 3D asli

Cukup taruh file `.glb` di `public/models/butterfly.glb`. Komponen
`components/3d/Butterfly.tsx` otomatis mendeteksi dan memuatnya —
tidak perlu mengubah kode apapun. Jika file tidak ada, akan otomatis
fallback ke kupu-kupu prosedural (geometri sayap sederhana yang tetap
beranimasi mengepak).

## Deploy ke VPS sendiri

1. Push project ini ke Git repository (GitHub/GitLab/dll), atau upload langsung via `scp`/`rsync`.
2. Di VPS, pastikan Node.js 20+ terpasang.
3. Install dependencies & build:
   ```bash
   npm install
   npm run build
   ```
4. Jalankan dengan process manager (disarankan **pm2**):
   ```bash
   npm install -g pm2
   pm2 start npm --name wedding -- start
   pm2 save
   pm2 startup
   ```
   Secara default `next start` berjalan di port 3000. Ubah dengan
   `pm2 start npm --name wedding -- start -- -p 4000` bila perlu port lain.
5. Pasang reverse proxy (Nginx) + SSL (Certbot/Let's Encrypt) di depan
   aplikasi Next.js supaya bisa diakses via domain dengan HTTPS.

Contoh konfigurasi Nginx dasar:

```nginx
server {
    listen 80;
    server_name undangan.namadomainmu.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Lalu jalankan `certbot --nginx -d undangan.namadomainmu.com` untuk SSL.

## Struktur project

```
app/                    # App Router: layout, page, global styles
components/
  layout/                Navbar, Preloader (enter screen), MusicPlayer
  sections/               Hero, Story, Couple, Gallery, Event, Countdown, RSVP, Footer
  3d/                     Butterfly, ButterflyScene (R3F), FloatingParticles
  animations/             Reveal (scroll-reveal), Parallax, SmoothScrollProvider (Lenis)
config/wedding.ts        Semua data yang bisa dikustomisasi
lib/rsvp.ts              Logic submit RSVP (dummy → mudah dihubungkan ke API)
public/                   images, models (.glb), audio, fonts
```

## Performance notes

- Semua komponen Three.js dimuat lewat `next/dynamic` dengan `ssr: false`.
- Jumlah kupu-kupu & partikel otomatis dikurangi di layar mobile (`ButterflyScene.tsx`).
- Animasi dihormati `prefers-reduced-motion` (smooth scroll otomatis nonaktif).
- Font di-self-host (`next/font/local`) sehingga tidak bergantung koneksi ke Google Fonts saat build.

---

## RSVP Backend Setup

Backend RSVP menggunakan **Next.js Route Handler + Prisma ORM + SQLite**.
Tidak perlu service database terpisah — database cukup satu file `.db`.

### 1. Buat file `.env`

```bash
cp .env.example .env
```

Lalu edit `.env`:

```env
# Path ke SQLite database
DATABASE_URL="file:./prisma/dev.db"

# Secret token untuk akses admin (GANTI dengan nilai acak yang kuat!)
ADMIN_SECRET="isi-dengan-token-acak-yang-panjang"
```

### 2. Generate `ADMIN_SECRET` yang aman

Pilih salah satu cara:

```bash
# Linux / Mac
openssl rand -base64 32

# Node.js (cross-platform)
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"

# PowerShell (Windows)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Salin hasilnya ke `.env` sebagai nilai `ADMIN_SECRET`.

### 3. Setup database (development)

```bash
# Buat database & tabel, lalu generate Prisma client
npx prisma migrate dev --name init_rsvp

# Atau gunakan script yang sudah tersedia:
npm run db:migrate
```

### 4. Jalankan secara lokal

```bash
npm run dev
```

Setelah itu:
- Form RSVP di halaman utama → submit → tersimpan ke SQLite.
- Admin panel → `http://localhost:3000/admin/rsvp`

### 5. Struktur file backend

```
prisma/
  schema.prisma       Model RSVP + konfigurasi datasource
  migrations/         Migration history (commit ke Git)
  dev.db              File database SQLite (jangan commit!)
lib/
  prisma.ts           Singleton Prisma client
  rsvp-schema.ts      Zod validation schema
app/
  api/rsvp/
    route.ts          POST /api/rsvp + GET /api/rsvp (admin)
  admin/rsvp/
    page.tsx          Halaman admin visual
```

---

## Deploy RSVP Backend ke VPS

### 1. Siapkan `.env` di VPS

Di server production, buat file `.env` dengan nilai yang benar:

```env
DATABASE_URL="file:/var/data/wedding-rsvp.db"
ADMIN_SECRET="token-acak-yang-sudah-kamu-generate"
NODE_ENV="production"
```

> **Tips:** Simpan database di luar folder project agar tidak tertimpa saat redeploy.
> Contoh: `/var/data/wedding-rsvp.db`

### 2. Deploy & jalankan migration production

```bash
# Di VPS, setelah git pull / scp file baru:
npm install          # otomatis menjalankan prisma generate (via postinstall)
npm run db:deploy    # = prisma migrate deploy (aman untuk production, tidak reset data)
npm run build
pm2 restart wedding  # atau pm2 start npm --name wedding -- start
```

> **Perbedaan `migrate dev` vs `migrate deploy`:**
> - `migrate dev` — untuk development, bisa reset & re-create database.
> - `migrate deploy` — untuk production, hanya apply migration baru, **tidak menghapus data**.

### 3. Backup database SQLite

SQLite = satu file. Backup semudah meng-copy file-nya:

```bash
# Backup manual
cp /var/data/wedding-rsvp.db /var/backups/wedding-rsvp-$(date +%F).db

# Backup otomatis via cron (setiap hari jam 02:00 dini hari)
# Tambahkan ke crontab (crontab -e):
0 2 * * * cp /var/data/wedding-rsvp.db /var/backups/wedding-rsvp-$(date +\%F).db
```

---

## Akses Admin Panel

Buka: `https://domainmu.com/admin/rsvp`

1. Masukkan `ADMIN_SECRET` yang ada di `.env` server.
2. Token disimpan di `sessionStorage` browser — tidak perlu login ulang selama tab terbuka.
3. Klik **Export CSV** untuk mengunduh daftar tamu (format spreadsheet, siap dibuka di Excel/Google Sheets).

---

## API Endpoints

### `POST /api/rsvp` — Submit konfirmasi tamu

```bash
curl -X POST https://domainmu.com/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi","attendance":"yes","guests":2,"message":"Selamat!"}'

# Response sukses:
# {"ok":true,"id":"clxxxxxx..."}
```

Rate limit: maks **5 request per menit** per IP.

### `GET /api/rsvp` — Daftar tamu (admin only)

```bash
curl https://domainmu.com/api/rsvp \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"

# Response:
# {"total":42,"attending":35,"notAttending":7,"totalGuests":68,"entries":[...]}
```

---

## Testing End-to-End

1. **Submit RSVP** — Buka halaman utama, isi form RSVP, klik konfirmasi.
2. **Cek di database** langsung:
   ```bash
   npx prisma studio   # atau npm run db:studio
   # Buka browser → http://localhost:5555
   ```
3. **Cek via admin panel** — Buka `/admin/rsvp`, masukkan token, lihat entri baru muncul.
4. **Export** — Klik "Export CSV", buka di Excel/Google Sheets.

### Test rate limiter

```bash
# Kirim 6 request berturut-turut — request ke-6 harus dapat 429
for i in {1..6}; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/rsvp \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","attendance":"yes","guests":1}'
done
```

### Test auth admin

```bash
# Token salah → 401
curl http://localhost:3000/api/rsvp -H "Authorization: Bearer token-salah"

# Token benar → 200 + data
curl http://localhost:3000/api/rsvp -H "Authorization: Bearer $(grep ADMIN_SECRET .env | cut -d= -f2 | tr -d '\"')"
```

---

## Migrasi ke PostgreSQL (opsional, masa depan)

Jika traffic RSVP membesar dan SQLite tidak cukup, pindah ke PostgreSQL cukup dengan:

1. Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"   // ganti dari "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` di `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/wedding_rsvp"
   ```
3. Jalankan migration baru:
   ```bash
   npx prisma migrate dev --name switch_to_postgres
   ```

Schema model `RSVP` tidak perlu diubah — sudah dirancang kompatibel.
