package com.muadz.frameliquidglass

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.provider.MediaStore
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import org.json.JSONObject
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import java.io.File
import java.io.FileOutputStream
import java.io.OutputStream

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private lateinit var filePickerLauncher: ActivityResultLauncher<Intent>

    inner class FrameBridge {
        @JavascriptInterface
        fun saveImage(base64: String, fileName: String, mimeType: String) {
            val safeName = sanitizeFileName(fileName, "frame-export.png")
            // Backup .frame / .json diarahkan ke Downloads/FRAME, bukan Galeri.
            if (safeName.endsWith(".frame", ignoreCase = true) || safeName.endsWith(".json", ignoreCase = true)) {
                saveBackup(base64, safeName)
                return
            }
            val mime = if (mimeType.isBlank()) guessMime(safeName) else mimeType
            val bytes = decodeBase64(base64) ?: run {
                toastOnMain("Gagal menyimpan gambar")
                return
            }
            var uri: Uri? = null
            try {
                val resolver = contentResolver
                val values = ContentValues().apply {
                    put(MediaStore.Images.Media.DISPLAY_NAME, safeName)
                    put(MediaStore.Images.Media.MIME_TYPE, mime)
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/FRAME")
                        put(MediaStore.Images.Media.IS_PENDING, 1)
                    }
                }
                uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
                if (uri == null) {
                    toastOnMain("Gagal menyimpan gambar")
                    return
                }
                var stream: OutputStream? = null
                try {
                    stream = resolver.openOutputStream(uri)
                    if (stream == null) {
                        toastOnMain("Gagal menyimpan gambar")
                        return
                    }
                    stream.write(bytes)
                    stream.flush()
                } finally {
                    try { stream?.close() } catch (_: Exception) { }
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val update = ContentValues().apply {
                        put(MediaStore.Images.Media.IS_PENDING, 0)
                    }
                    resolver.update(uri, update, null, null)
                }
                toastOnMain("Gambar tersimpan di Galeri > FRAME")
            } catch (_: Exception) {
                // Bersihkan entri setengah jadi kalau ada.
                try { if (uri != null) contentResolver.delete(uri, null, null) } catch (_: Exception) { }
                toastOnMain("Gagal menyimpan gambar")
            }
        }

        @JavascriptInterface
        fun saveBackup(base64: String, fileName: String) {
            val safeName = sanitizeFileName(fileName, "frame-backup.frame")
            val bytes = decodeBase64(base64) ?: run {
                toastOnMain("Gagal menyimpan backup")
                return
            }
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val resolver = contentResolver
                    val values = ContentValues().apply {
                        put(MediaStore.Downloads.DISPLAY_NAME, safeName)
                        put(MediaStore.Downloads.MIME_TYPE, "application/json")
                        put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/FRAME")
                        put(MediaStore.Downloads.IS_PENDING, 1)
                    }
                    val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                    if (uri == null) {
                        toastOnMain("Gagal menyimpan backup")
                        return
                    }
                    var stream: OutputStream? = null
                    try {
                        stream = resolver.openOutputStream(uri)
                        if (stream == null) {
                            toastOnMain("Gagal menyimpan backup")
                            return
                        }
                        stream.write(bytes)
                        stream.flush()
                    } finally {
                        try { stream?.close() } catch (_: Exception) { }
                    }
                    val update = ContentValues().apply {
                        put(MediaStore.Downloads.IS_PENDING, 0)
                    }
                    resolver.update(uri, update, null, null)
                    toastOnMain("Backup tersimpan di Downloads > FRAME")
                } else {
                    @Suppress("DEPRECATION")
                    val dir = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "FRAME")
                    if (!dir.exists()) dir.mkdirs()
                    val out = File(dir, safeName)
                    FileOutputStream(out).use { it.write(bytes) }
                    toastOnMain("Backup tersimpan di Downloads > FRAME")
                }
            } catch (_: Exception) {
                toastOnMain("Gagal menyimpan backup")
            }
        }

        private fun decodeBase64(input: String): ByteArray? {
            return try {
                val clean = if (input.contains(",")) input.substringAfter(",", input) else input
                Base64.decode(clean, Base64.DEFAULT)
            } catch (_: Exception) {
                null
            }
        }

        private fun sanitizeFileName(name: String, fallback: String): String {
            var n = name.trim().ifEmpty { fallback }
            // Buang path traversal dan karakter ilegal.
            n = n.substringAfterLast("/").substringAfterLast("\\")
            n = n.replace(Regex("[\\\\/:*?\"<>|]"), "_")
            if (n.isBlank()) return fallback
            return n
        }

        private fun guessMime(name: String): String {
            return when {
                name.endsWith(".png", ignoreCase = true) -> "image/png"
                name.endsWith(".jpg", ignoreCase = true) || name.endsWith(".jpeg", ignoreCase = true) -> "image/jpeg"
                name.endsWith(".webp", ignoreCase = true) -> "image/webp"
                name.endsWith(".frame", ignoreCase = true) || name.endsWith(".json", ignoreCase = true) -> "application/json"
                else -> "image/png"
            }
        }

        private fun toastOnMain(msg: String) {
            Handler(Looper.getMainLooper()).post {
                Toast.makeText(this@MainActivity, msg, Toast.LENGTH_LONG).show()
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        filePickerLauncher = registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            val callback = fileChooserCallback
            fileChooserCallback = null
            if (callback == null) return@registerForActivityResult
            if (result.resultCode != Activity.RESULT_OK) {
                callback.onReceiveValue(null)
                return@registerForActivityResult
            }
            val data: Intent? = result.data
            val uris = mutableListOf<Uri>()
            val clipData = data?.clipData
            if (clipData != null) {
                for (i in 0 until clipData.itemCount) {
                    clipData.getItemAt(i).uri?.let { uris.add(it) }
                }
            } else {
                data?.data?.let { uris.add(it) }
            }
            callback.onReceiveValue(if (uris.isEmpty()) null else uris.toTypedArray())
        }

        webView = WebView(this)
        setContentView(webView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        settings.mediaPlaybackRequiresUserGesture = false
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.builtInZoomControls = false
        settings.displayZoomControls = false

        webView.addJavascriptInterface(FrameBridge(), "AndroidFrame")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                // Stay inside the app for local + http(s) links.
                return false
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                injectDownloadBridge(view)
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileChooserCallback?.onReceiveValue(null)
                fileChooserCallback = filePathCallback
                val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                    putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                    putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("image/*", "application/zip", "application/json"))
                }
                val chooser = Intent.createChooser(intent, "Pilih file")
                return try {
                    filePickerLauncher.launch(chooser)
                    true
                } catch (_: Exception) {
                    fileChooserCallback = null
                    false
                }
            }
        }

        webView.setDownloadListener { url, _, _, mimeType, _ ->
            // Click interceptor di JS sudah menangani blob:/data: agar tidak double-save.
            // Di sini hanya handle http/https eksternal.
            if (url.startsWith("http://") || url.startsWith("https://")) {
                try {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                } catch (_: Exception) {
                    // Ignore: stay in app.
                }
            } else if (url.startsWith("blob:") || url.startsWith("data:")) {
                // Fallback kalau click interceptor tidak sempat jalan (misal download dipicu
                // langsung oleh WebView). Guard double-save: interceptor menandai href yang
                // sudah diproses dalam 2 detik terakhir, jadi ini jarang kepanggil.
                handleDownloadUrlFallback(url, mimeType)
            }
        }

        if (savedInstanceState == null) {
            webView.loadUrl("file:///android_asset/FRAME/index.html")
        }
    }

    private fun injectDownloadBridge(view: WebView?) {
        if (view == null) return
        val js = """
            (function() {
              if (window.__frameBridgeInstalled) return;
              window.__frameBridgeInstalled = true;
              window.__frameLastSave = '';
              function sendToAndroid(href, name, mime) {
                try {
                  var key = href + '|' + name;
                  var now = Date.now();
                  if (window.__frameLastSave === key && (now - (window.__frameLastSaveAt || 0)) < 2000) return;
                  window.__frameLastSave = key;
                  window.__frameLastSaveAt = now;
                  if (href.indexOf('data:') === 0) {
                    var comma = href.indexOf(',');
                    var meta = href.substring(5, comma);
                    var b64 = href.substring(comma + 1);
                    var m = meta.split(';')[0] || mime || 'image/png';
                    if (name.toLowerCase().endsWith('.frame') || name.toLowerCase().endsWith('.json')) {
                      AndroidFrame.saveBackup(b64, name);
                    } else {
                      AndroidFrame.saveImage(b64, name, m);
                    }
                    return;
                  }
                  fetch(href).then(function(r) { return r.blob(); }).then(function(blob) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                      try {
                        var dataUrl = reader.result || '';
                        var c = dataUrl.indexOf(',');
                        var b64 = c >= 0 ? dataUrl.substring(c + 1) : dataUrl;
                        var m = blob.type || mime || 'image/png';
                        if (name.toLowerCase().endsWith('.frame') || name.toLowerCase().endsWith('.json')) {
                          AndroidFrame.saveBackup(b64, name);
                        } else {
                          AndroidFrame.saveImage(b64, name, m);
                        }
                      } catch (e) {}
                    };
                    reader.readAsDataURL(blob);
                  }).catch(function() {});
                } catch (e) {}
              }
              document.addEventListener('click', function(ev) {
                try {
                  var t = ev.target && ev.target.closest ? ev.target.closest('a[download]') : null;
                  if (!t) return;
                  var href = t.getAttribute('href') || '';
                  if (href.indexOf('blob:') !== 0 && href.indexOf('data:') !== 0) return;
                  ev.preventDefault();
                  ev.stopPropagation();
                  var name = t.getAttribute('download') || 'frame-export.png';
                  var mime = t.getAttribute('type') || '';
                  sendToAndroid(href, name, mime);
                } catch (e) {}
              }, true);
            })();
        """.trimIndent()
        try {
            view.evaluateJavascript(js, null)
        } catch (_: Exception) {
        }
    }

    private fun handleDownloadUrlFallback(url: String, mimeType: String?) {
        val js = """
            (function() {
              try {
                var href = ${JSONObject.quote(url)};
                var mime = ${JSONObject.quote(mimeType ?: "")};
                var name = 'frame-export.png';
                if (href.indexOf('data:') === 0) {
                  var comma = href.indexOf(',');
                  var meta = href.substring(5, comma);
                  var b64 = href.substring(comma + 1);
                  var m = meta.split(';')[0] || mime || 'image/png';
                  AndroidFrame.saveImage(b64, name, m);
                  return;
                }
                fetch(href).then(function(r) { return r.blob(); }).then(function(blob) {
                  var reader = new FileReader();
                  reader.onloadend = function() {
                    try {
                      var dataUrl = reader.result || '';
                      var c = dataUrl.indexOf(',');
                      var b64 = c >= 0 ? dataUrl.substring(c + 1) : dataUrl;
                      AndroidFrame.saveImage(b64, name, blob.type || mime || 'image/png');
                    } catch (e) {}
                  };
                  reader.readAsDataURL(blob);
                });
              } catch (e) {}
            })();
        """.trimIndent()
        try {
            webView.evaluateJavascript(js, null)
        } catch (_: Exception) {
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        if (::webView.isInitialized) {
            webView.saveState(outState)
        }
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        if (::webView.isInitialized) {
            webView.restoreState(savedInstanceState)
        }
    }
}
