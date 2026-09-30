# Deploy samudrayoga.my.id

Push ke `main` menjalankan `.github/workflows/deploy-cpanel.yml` setelah setup diaktifkan.

## Setup sekali

- Buat akun FTP `github-deploy@samudrayoga.my.id` di cPanel.
- Batasi Directory ke `/home/awupqqkm/samudrayoga.my.id` (kolom setelah prefix home diisi `samudrayoga.my.id`).
- Simpan password akun tersebut di repository GitHub > Settings > Secrets and variables > Actions > Secrets dengan nama `CPANEL_FTP_PASSWORD`.
- Tambahkan repository variable `CPANEL_DEPLOY_ENABLED` bernilai `true` setelah akun dan secret siap.
- Jalankan Actions > Deploy to cPanel > Run workflow pada branch `main` untuk tes pertama.

Host FTPS: `yuuka.kawaiihost.net`, port `21`, explicit TLS dengan verifikasi sertifikat.
Path tujuan FTP `/` adalah root akun khusus tadi, bukan root hosting.

Server FTPS tidak mengirim rantai intermediate lengkap. Workflow melengkapi YR2 dan
Root YR cross-sign dari [Let's Encrypt](https://letsencrypt.org/certificates/),
memverifikasinya terhadap CA sistem sebelum digunakan. Verifikasi sertifikat tetap aktif.
Salinan sertifikat publik berada di `.github/certs/` dan tidak diunggah ke website.

## Perilaku

Hanya file HTML tingkat atas serta file Git di `assets/` dan `forms/` yang diunggah.
File tersembunyi, symlink, konfigurasi Git, dan workflow tidak diunggah.
File dengan nama sama akan diperbarui; file tambahan di server tidak dihapus.
Penghapusan atau rename file di Git perlu dibersihkan terpisah di server.
Konfigurasi form yang hanya diubah di server bisa tertimpa: simpan perubahan kode di Git dan kredensial di luar file yang dideploy.

Deploy tidak atomik untuk seluruh website. Selama upload, sebagian file dapat berasal dari versi sebelumnya.
Untuk rollback, revert commit lalu push kembali; file tambahan dari versi sebelumnya tidak otomatis dihapus.
Jika deploy gagal, lihat log GitHub Actions dan jalankan ulang setelah penyebab diperbaiki.

Workflow awalnya nonaktif sampai `CPANEL_DEPLOY_ENABLED=true`.
