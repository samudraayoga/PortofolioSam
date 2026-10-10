# Portofolio Samudra

Portofolio web statis bilingual (English/Indonesia) dengan suasana petualangan fantasi yang terinspirasi Genshin Impact.

## Membuka portofolio

Buka `index.html` langsung di browser. Tidak perlu instalasi atau koneksi internet; font menggunakan font yang tersedia di perangkat. Jika menerima berkas ZIP, ekstrak seluruh isinya terlebih dahulu.

Pertahankan struktur folder repo: HTML di root, stylesheet di `assets/css`, JavaScript di `assets/js`, serta gambar dan CV di `assets`. Halaman detail chatbot (`chatbot.html`) dan ERP (`erp.html`) berbagi `assets/css/main.css`, `assets/css/chatbot.css`, dan interaksi galeri `assets/js/chatbot.js`. Halaman ERP juga memakai `assets/css/erp.css` untuk tema landscape. Jangan memindahkan atau mengganti nama aset tanpa memperbarui rujukannya.

## Fitur

- Tata letak responsif untuk layar desktop dan ponsel.
- Background landscape yang menyambung dari hero hingga footer, dengan kartu transparan dan warna teks yang disesuaikan.
- Rotasi otomatis tiga potret (formal, casual, dan sweater) serta suasana siang atau malam.
- Pergantian bahasa English/Indonesia yang tersimpan antarkunjungan dan tetap mencakup konten dinamis.
- Landscape hidup dengan awan, kabut lembut, sorot cahaya, dan daun yang melintas sesekali. Animasi berhenti ketika hero tidak terlihat atau tab tidak aktif.
- Panel profil sinematik: foto berkembang ke panel karakter, diikuti ornamen dan biodata. Foto mengikuti pilihan formal atau santai.
- Transisi gambar dan judul dari kartu proyek ke studi kasus, termasuk saat kembali. Browser pendukung memakai View Transitions; file lokal dan browser lain memakai transisi sederhana.
- Animasi menyesuaikan layar ponsel dan preferensi reduced motion.
- Celestial Archive menampilkan Monoceros Caeli dari referensi pengguna, tiga bintang talent utama, kamera pan-and-zoom, serta jalur satelit yang berubah ketika pengguna memilih Full-Stack, AI, atau Systems.
- Living Teyvat Interface menambahkan Hydro Vision awakening, elemental cursor, world camera, domain entrance, Ley Line Journey, chapter signatures, reactive navigation, dan Wish finale.
- Character Selection Scene membuat portrait dapat difokuskan, menampilkan element profile dan traits, memberi transisi Formal/Casual berbasis Hydro ripple, serta menghubungkan karakter ke konstelasi skill.
- Talent card kini memicu Talent Unlock pada konstelasi, detail AI terbuka melalui segel Domain Record, dan timeline perjalanan memiliki waypoint serta Ley Line progress.
- Pergantian siang–malam mengubah posisi matahari dan bulan, warna landscape, horizon, dan bintang dengan transisi menyebar dari tombol tema.
- Hembusan angin menghubungkan pergantian bab, membawa garis dan partikel cahaya sebelum menyalakan judul tujuan.
- Tab keahlian, detail sorotan pekerjaan, dan perluasan linimasa pengalaman.
- Halaman studi kasus chatbot WhatsApp dengan peran, fitur, arsitektur, teknologi, dan galeri dokumentasi aplikasi.
- Halaman studi kasus ERP Raho Premier dengan peran, teknologi, cakupan modul, dan galeri inventori, logistik, manajemen sistem, serta ringkasan proyek.
- Halaman studi kasus MLBB Heroes Matchup dengan galeri aplikasi iOS, informasi proyek, dan penjelasan rekomendasi counter berbasis aturan.
- Tautan kontak dan unduhan CV.

Tautan kontak eksternal memerlukan koneksi internet dan dapat membuka aplikasi terkait. Deployment situs ke https://samudrayoga.my.id memakai GitHub Actions yang sudah tersedia pada branch `main`; lihat `DEPLOYMENT.md`.

## Mengubah isi

- Sunting `index.html` untuk memperbarui teks, riwayat, dan tautan.
- Sunting `assets/css/main.css` untuk mengubah warna, tipografi, dan tata letak.
- Sunting `assets/css/scenery.css` untuk background landscape, transisi hero, dan warna bagian bawah halaman utama.
- Sunting `assets/js/script.js` untuk menyesuaikan interaksi.
- `assets/css/landscape-motion.css` dan `assets/js/landscape-motion.js` mengatur atmosfer hero; `character-reveal.css` / `.js` mengatur panel profil; `project-portal.css` / `.js` mengatur transisi proyek dan visual pembuka studi kasus, masing-masing di direktori CSS / JavaScript yang sama.
- `constellation-awakening.css` / `.js` mengatur jalur skill, sedangkan `celestial-theme.css` / `.js` mengatur transformasi siang–malam.
- `chapter-wind.css` / `.js` mengatur transisi angin antarbagian dan tanda cahaya pada judul.
- Sunting `chatbot.html` untuk isi studi kasus chatbot, `assets/css/chatbot.css` untuk tampilannya, dan `assets/js/chatbot.js` untuk interaksi galerinya.
- Sunting `erp.html` untuk isi studi kasus ERP dan `assets/css/erp.css` untuk tampilannya. Galeri memakai `assets/js/chatbot.js` dengan folder gambar dari atribut `data-gallery-base`.
- Sunting `mlbb.html` untuk isi studi kasus MLBB Heroes Matchup dan `assets/css/mlbb.css` untuk tampilannya. Halaman ini memakai fondasi `assets/css/main.css` dan `assets/css/chatbot.css`, dengan screenshot di `assets/mlbb`.
- Simpan foto dan berkas pendukung di folder `assets`, lalu sesuaikan nama berkas pada rujukannya bila diperlukan.

Keterangan aset tersedia di `assets/ASSET-NOTES.md`.

## Sumber konten

Identitas, kontak, pendidikan, keahlian, dan pengalaman bersumber dari CV yang diberikan pengguna. Sorotan AI Agent untuk KPI ERP mengikuti penjelasan pengguna tentang endpoint ERP, integrasi API OpenClaw, dan arahan SOUL untuk merangkum kinerja staf. Diagram SVG merupakan ilustrasi konseptual, bukan screenshot aplikasi atau data KPI nyata.

Studi kasus AI-Powered WhatsApp Chatbot menggunakan dokumentasi dan screenshot yang diberikan pengguna pada 2 Oktober 2026. Peran Fullstack Developer & System Designer, fitur, dan daftar teknologi mengikuti materi tersebut. Screenshot disalin tanpa perubahan; informasi yang sudah diburamkan pada gambar sumber tetap diburamkan. Halaman ini tidak mengklaim metrik hasil, menyediakan demo langsung, atau menautkan repository yang belum diberikan.

Tanggal pengalaman mengikuti CV. Entri Raho Premier tetap menggunakan Juni 2026 tanpa mengklaim pekerjaan masih berlangsung. Berkas foto sumber pengguna tidak diubah.

Studi kasus ERP Raho Premier menggunakan screenshot yang diberikan pengguna pada 3 Oktober 2026. Nama proyek, peran Fullstack Developer, kontribusi frontend/backend, dan stack mengikuti materi tersebut. Cakupan modul menjelaskan antarmuka yang terlihat, termasuk menu navigasi; tidak mengklaim metrik hasil atau implementasi backend setiap menu. Empat screenshot disalin tanpa perubahan, termasuk pemburaman data sumber. Screenshot kartu proyek digunakan sebagai referensi konten.

Studi kasus MLBB Heroes Matchup Decision Support System menggunakan dua screenshot aplikasi dan satu referensi informasi proyek yang diberikan pengguna pada 3 Oktober 2026. Kategori iOS App, Design; lingkup Front End; tanggal proyek 10 Oktober 2025; serta penjelasan Swift, SwiftUI, JSON, dan sistem penilaian berbasis aturan mengikuti materi tersebut. Kedua screenshot aplikasi disalin tanpa perubahan. Paragraf sumber yang terpotong tidak dilanjutkan dengan asumsi.

## Kompatibilitas deployment

CSS dan JavaScript berada di `assets/css/` dan `assets/js/` agar ikut dikirim oleh workflow cPanel yang sudah ada. CSS utama tetap memakai `assets/css/main.css`, sesuai mekanisme versi cache workflow. URL halaman lama dialihkan ke halaman atau bagian portofolio yang sesuai.
