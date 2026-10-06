# DOKUMENTASI TEKNIS & PENGOPERASIAN — PT. INDO JAYA GRAM (WSPEND)
*Terakhir diperbarui: 6 Oktober 2026*

Dokumen ini merangkum seluruh file, arsitektur, dan riwayat pekerjaan yang telah dibuat untuk PT. Indo Jaya Gram dan website `https://wspend.vercel.app`. Dokumen ini menjadi referensi utama bagi seluruh agen (Satoru, Nagato, Itachi, Sasori, Kisame, Deidara, Konan) agar tidak terjadi kebingungan operasional.

---

## 1. STRUKTUR DIREKTORI & FILE UTAMA
- **Repository Lokal**: `/root/pt-rizki-ai-website`
- **Remote Git**: `git@github.com:aihome30/Repo-company.git` (Branch: `master` → `origin/main` prod)
- **File Halaman Utama & Fitur**:
  - `src/app/office/page.tsx` : Virtual AI Office HQ 3D Isometrik (Strategy-game style, 11 zona, 12 workstation, 7 agen, OrbitControls, Top/Iso View, Night-Watch Shift Rotator).
  - `src/app/support/page.tsx` : Portal Support & Tiket Pelanggan (terhubung dengan localStorage dan Maya).
  - `src/app/order/page.tsx` : Halaman Order / Layanan (Xendit diblokir/nonaktif sementara).
  - `src/app/contact/page.tsx` : Form Kontak glassmorphic Stripe/Linear.
  - `src/app/api/chat-agent/route.ts` : Backend API untuk Maya (Agen AI CS otonom dengan DLP guardrails).

- **Dokumen Operasional & HRD**:
  - `/root/jadwal-kerja-agent.md` : Jadwal kerja agen reguler (08.00-19.00 WIB) & jadwal rotasi shift jaga malam server (19.00-08.00 WIB).
  - `/root/PERATURAN-PERUSAHAAN-JAM-KERJA.md` : Peraturan resmi No. PK-IJG-2026-001 (5 hari kerja, kepatuhan UU ketenagakerjaan).
  - `/root/LAPORAN-EVALUASI-HRD.md` : Evaluasi kepatuhan HRD.
  - `/root/LAPORAN-EVALUASI-IT-2026.md` : Laporan Disipliner IT (No. EV-IT-IJG-2026-004).
  - `/root/LAPORAN_FINAL_HRD_IT.txt` : Salinan laporan resmi untuk CEO (`r.boeran@gmail.com`).
  - `/root/send_report.py` : Script otomatisasi pengiriman email via SMTP Gmail (App Password).

---

## 2. ARSITEKTUR & ATURAN UTAMA
1. **Zero Data Leak (DLP)**: Tidak boleh ada IP internal (`10.10.3.x`), secret key, atau credential database yang bocor ke frontend Vercel publik.
2. **Virtual Office 3D**: Menggunakan Three.js / React Three Fiber dengan kamera elevated isometric, 11 zona fisik (Lobby, Open Office, IT, HR, Manager, Meeting Rooms, Command Center, Pantry, Lounge, Server Room).
3. **Kepatuhan Shift Jaga Server**: 
   - Jam Operasional Reguler: 08.00 - 19.00 WIB (Agen bekerja di workstation masing-masing).
   - Jam Malam / Jaga Server: 19.00 - 08.00 WIB (Rotasi shift malam bergantian di Command Center, agen lain di Lounge).
4. **Email Report Integration**: Pengiriman email otomatis ke `r.boeran@gmail.com` menggunakan SMTP Gmail dengan App Password yang terverifikasi.

---

## 3. CARA BUILD & DEPLOY
```bash
cd /root/pt-rizki-ai-website
npm run build
git add .
git commit -m "pesan commit"
git push origin master:main -f
```
*(Pastikan selalu tes `npm run build` sebelum push agar menghasilkan Exit 0 dan zero-failure build di Vercel).*
