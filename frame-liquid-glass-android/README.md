# FRAME Liquid Glass — Android WebView wrapper

WebView wrapper untuk FRAME (editor foto + tipografi) versi Liquid Glass Apple (iOS 26 style).

- Package: `com.muadz.frameliquidglass`
- Min SDK 24, target SDK 34, compile SDK 34
- Single Activity + WebView, load `file:///android_asset/FRAME/index.html`
- File chooser via WebChromeClient (foto / font ZIP / backup project)
- Fitur web tidak diubah: semua logika di `app/src/main/assets/FRAME/` (salinan FRAME + styles Liquid Glass). CSS lama disimpan sebagai `styles-paper.css`.

Build via GitHub Actions: workflow `.github/workflows/build-frame-apk.yml` di repo (working-directory `frame-liquid-glass-android`), artifact `app-debug-frame`.
