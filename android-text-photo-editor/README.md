# Text Photo Editor — Android (Kotlin + Jetpack Compose)

Text Photo Editor minimalis: pilih foto, tambah banyak blok teks, geser teks pakai jari, atur font / warna / ukuran / jarak, kasih efek gambar, lalu ekspor PNG 1080×1920 ke galeri.

Desain mengikuti referensi minimalis: background putih bersih, banyak ruang kosong, satu kartu foto 9:16 di tengah dengan sudut melengkung besar (24dp) + bayangan halus, tipografi bersih, tombol minimal. Panel bawah gaya bottom sheet dengan bar pintasan — satu layar, tanpa scroll panjang.

## Fitur

1. **Pilih gambar** dari galeri sebagai latar (GetContent), tampil sebagai kartu 9:16 di tengah layar putih. Tombol hapus gambar.
2. **Tambah teks**: banyak blok teks, tiap blok punya teks, font, warna, ukuran, bold/italic, letter spacing, line height, posisi sendiri. Pilih blok via daftar chip atau tap langsung di preview, hapus blok.
3. **Font dropdown**: Inter, Poppins, DM Sans, Open Sauce, Playfair Display. Lihat catatan font di bawah.
4. **Bold / Italic** toggle per blok.
5. **Slider**: ukuran huruf 12–170 sp, jarak antar huruf −100 sampai +40, jarak antar baris 70%–220%.
6. **Warna teks** (9 preset minimalis) + **warna latar** jika tanpa gambar (6 preset).
7. **Efek gambar**: gelapkan 0–85%, gradasi hitam transparan dari bawah/atas + kekuatan, blur radial (tepi / tengah + kekuatan).
8. **Teks bisa diseret** pakai jari (detectDragGestures, clamp di dalam frame). **Snap ke tengah** kalau dekat tengah. **Garis panduan putus-putus oranye** saat teks aktif persis di tengah (vertikal/horizontal), hanya di preview, tidak ikut ke bitmap ekspor.
9. Tombol **Posisi teks ke tengah** untuk reset posisi blok aktif.
10. **Ekspor PNG 1080×1920**: render komposisi (gambar + efek + semua blok teks) ke Bitmap via Canvas, simpan ke galeri via MediaStore (Pictures/TextPhotoEditor) + toast “PNG tersimpan”. Kompatibel Android 10+.
11. **UI minimalis** ala IG editor tapi lebih lega: preview kartu di atas, panel bawah gaya bottom sheet dengan bar pintasan (Teks, Gambar, Font, Gaya, Warna, Ukuran, Jarak). Target sentuh besar, nyaman di HP.

## Struktur project

```
settings.gradle.kts
build.gradle.kts (root)
gradle.properties
gradlew / gradlew.bat
gradle/wrapper/gradle-wrapper.properties
local.properties.example -> salin jadi local.properties
app/
  build.gradle.kts
  src/main/
    AndroidManifest.xml
    java/com/muadz/textphotoeditor/
      MainActivity.kt
      model/TextBlock.kt
      ui/FontFamilies.kt
      ui/EditorScreen.kt
      util/Exporter.kt
    res/
      values/themes.xml, colors.xml, strings.xml
      font/ (kosong — lihat cara tambah font)
```

- `MainActivity.kt` — single Activity, `setContent { EditorScreen() }`.
- `model/TextBlock.kt` — data class blok teks + enum arah gradasi / mode blur.
- `ui/FontFamilies.kt` — daftar 5 font + fallback.
- `ui/EditorScreen.kt` — seluruh UI editor (preview + panel bawah + panel per tab).
- `util/Exporter.kt` — render 1080×1920 + simpan via MediaStore + helper decode bitmap.

## Cara buka di Android Studio

1. Buka Android Studio (Hedgehog / Iguana / yang mendukung AGP 8.2.2, JDK 17).
2. **File → Open** → pilih folder `android-text-photo-editor` ini.
3. Tunggu Gradle sync selesai (butuh internet untuk unduh dependencies pertama kali).
4. Jika muncul peringatan SDK: salin `local.properties.example` jadi `local.properties` dan sesuaikan `sdk.dir` ke lokasi Android SDK kamu. Android Studio biasanya membuat file ini otomatis.
5. Pilih device: emulator (Pixel, API 34) atau HP Android asli (aktifkan USB debugging / Wireless debugging).
6. **Run ▶** (Shift+F10).

## Cara tambah file font ke res/font

Project ini sengaja **tidak membundel file .ttf** agar tetap bisa build tanpa file font berlisensi. Semua font saat ini memakai fallback sistem (SansSerif / Serif) yang tetap jalan.

Kalau kamu punya file font aslinya:

1. Taruh file di `app/src/main/res/font/`, nama file harus huruf kecil + underscore, misal:
   - `inter_regular.ttf`, `inter_bold.ttf`, `inter_italic.ttf`
   - `poppins_regular.ttf`, `poppins_bold.ttf`
   - `dm_sans_regular.ttf`
   - `opensauce_regular.ttf` (kalau punya file Open Sauce)
   - `playfairdisplay_regular.ttf`, `playfairdisplay_bold.ttf`, `playfairdisplay_italic.ttf`
2. Buka `ui/FontFamilies.kt`, ganti entri yang bersangkutan, contoh:
   ```kotlin
   EditorFont(
       "Inter",
       FontFamily(
           Font(R.font.inter_regular, FontWeight.Normal),
           Font(R.font.inter_bold, FontWeight.Bold),
           Font(R.font.inter_italic, FontWeight.Normal, FontStyle.Italic)
       )
   )
   ```
   Tambahkan import:
   ```kotlin
   import androidx.compose.ui.text.font.Font
   import androidx.compose.ui.text.font.FontStyle
   import com.muadz.textphotoeditor.R
   ```
3. Untuk ekspor PNG di `util/Exporter.kt`, `Typeface` saat ini memakai `SANS_SERIF` / `SERIF` sistem. Kalau mau ekspor memakai font custom yang sama, ganti pemetaan `base` di `drawTextBlock()` dengan `Typeface.createFromAsset()` / `ResourcesCompat.getFont()` sesuai file font yang kamu tambahkan.
4. Sync Gradle lagi, lalu Run.

**Catatan Open Sauce:** Open Sauce tidak tersedia di Google Fonts. Sampai file `opensauce_*.ttf` ditambahkan manual, entri “Open Sauce” memakai fallback SansSerif (secara visual mirip Open Sans). Jangan klaim Open Sauce asli sudah terpasang sebelum file-nya ditambahkan.

## Cara build APK tanpa Android Studio (GitHub Actions, buat laptop kentang)

Tidak perlu install Android Studio. GitHub yang ngompile di cloud, gratis.

1. Buat repo baru di github.com/new, nama misal `text-photo-editor`, pilih Public atau Private, jangan centang Add README.
2. Upload project ini ke repo itu. Paling gampang lewat Terminal di Mac:
   ```bash
   cd ~/workspace/android-text-photo-editor
   git init
   git add .
   git commit -m "text photo editor v1"
   git branch -M main
   git remote add origin https://github.com/USERNAME/text-photo-editor.git
   git push -u origin main
   ```
   Ganti USERNAME dengan username GitHub kamu. Kalau belum login, GitHub akan minta login di browser.
   Alternatif tanpa Terminal: di halaman repo klik Add file -> Upload files, lalu drag semua file dan folder project ini (termasuk folder `.github` yang isinya workflow). Pastikan file `.github/workflows/build-apk.yml` ikut terupload.
3. Buka tab **Actions** di repo, klik workflow **Build APK** yang sedang jalan, tunggu sampai hijau (biasanya 2-5 menit pertama kali).
4. Kalau sudah hijau, scroll ke bawah ke bagian **Artifacts**, unduh `app-debug`.
5. Di HP Android: buka file APK-nya, izinkan Install dari sumber tidak dikenal kalau diminta, lalu Install. File ini debug APK buat tes, bukan buat publish Play Store.

Workflow-nya ada di `.github/workflows/build-apk.yml`: pakai JDK 17 + Android SDK + Gradle 8.2, jalankan `gradle assembleDebug` (pakai `gradle` langsung, bukan `./gradlew`, karena `gradle-wrapper.jar` belum dibundel), lalu upload `app/build/outputs/apk/debug/app-debug.apk` sebagai artifact. Workflow jalan otomatis tiap push ke `main`/`master`, atau manual via Actions -> Run workflow.

## Cara build APK

- **Debug APK (buat tes di HP):** Android Studio → **Build → Build App Bundle(s) / APK(s) → Build APK(s)** → klik **locate** untuk membuka folder hasil build (`app/build/outputs/apk/debug/app-debug.apk`).
- **Dari terminal:**
  ```bash
  cd android-text-photo-editor
  ./gradlew assembleDebug
  # hasil: app/build/outputs/apk/debug/app-debug.apk
  ```
- **Release APK / App Bundle:** pakai **Build → Generate Signed App Bundle / APK** (butuh keystore sendiri). Jangan pakai debug APK untuk publish Play Store.

## Cara tes di HP

1. Di HP Android: aktifkan **Opsi Pengembang → USB debugging**, colok USB (atau pakai Wireless debugging).
2. Di Android Studio pilih HP kamu sebagai device, klik **Run**.
3. Tes alur:
   - Pilih gambar → muncul di kartu 9:16.
   - + Tambah teks → blok kedua muncul, bisa dipilih via chip.
   - Seret teks pakai jari → harus bergerak, nempel (snap) pas lewat tengah, garis oranye putus-putus muncul pas persis tengah.
   - Ubah font di dropdown, bold/miring, ukuran 12, jarak huruf −100, jarak baris 70% → preview berubah.
   - Gelapkan, gradasi, blur → preview berubah.
   - Export PNG → toast “PNG tersimpan”, cek di Galeri → Album Pictures/TextPhotoEditor, ukuran 1080×1920.

## Keterbatasan yang diketahui

- **Font belum dibundel:** semua font memakai fallback sistem sampai file .ttf ditambahkan (lihat di atas). Build tidak akan gagal karena `res/font` kosong — tidak ada referensi `R.font.*` di code sampai kamu menambahkannya sendiri.
- **Open Sauce fallback:** memakai SansSerif / Open Sans sampai file Open Sauce ditambahkan manual.
- **Radial blur di ekspor disederhanakan:** di preview memakai `RenderEffect` (API 31+). Di ekspor, blur memakai pendekatan downscale/upscale seragam (bukan masking radial tepi/tengah yang presisi). Perilaku blurMode (Tepi / Tengah) disimpan untuk pengembangan masking radial berikutnya. Di HP Android < 12 (API < 31), blur preview tidak aktif karena `RenderEffect` butuh API 31.
- **Tap untuk pilih blok:** tap di preview memakai `clickable` + `pointerInput` drag di modifier yang sama. Di sebagian device, tap mungkin perlu ketukan yang bersih (tanpa geser). Kalau tap terasa kurang responsif, pilih blok via chip di tab Teks — itu jalur yang paling andal.
- **Izin:** `GetContent` tidak butuh izin baca manual. Simpan via MediaStore tidak butuh `WRITE_EXTERNAL_STORAGE` di Android 10+. Di Android 12 ke bawah, manifest tetap mendeklarasikan `READ_EXTERNAL_STORAGE` (maxSdk 32) dan `READ_MEDIA_IMAGES` untuk Android 13+.
- **APK belum di-build di sini:** project ini dibuat dan dicek sintaksnya secara manual (tidak ada JDK / Android SDK di mesin ini, jadi APK tidak di-build). Build pertama dilakukan di Android Studio / mesin dengan JDK 17 + Android SDK.

## Catatan wrapper

- `gradle/wrapper/gradle-wrapper.properties` menunjuk ke Gradle 8.2.
- `gradlew` / `gradlew.bat` di sini adalah launcher minimal: kalau `gradle/wrapper/gradle-wrapper.jar` ada, dipakai; kalau belum ada, memakai `gradle` sistem; kalau keduanya tidak ada, buka project di Android Studio (Studio akan generate / unduh wrapper) atau jalankan `gradle wrapper --gradle-version 8.2` di mesin yang sudah punya Gradle.
- Jangan commit `local.properties` (file lokal berisi path SDK). Pakai `local.properties.example` sebagai contoh.

## Stack

- Kotlin 1.9.22, AGP 8.2.2, Gradle 8.2
- Jetpack Compose (BOM 2024.02.00) + Material3, single Activity
- Target SDK 34, min SDK 24, compile SDK 34, JVM 17
- Dependencies seminimal mungkin, gratis, tanpa library berbayar: `core-ktx`, `lifecycle-runtime-ktx`, `activity-compose`, `compose ui / ui-graphics / material3 / ui-tooling-preview`
- Package: `com.muadz.textphotoeditor`
