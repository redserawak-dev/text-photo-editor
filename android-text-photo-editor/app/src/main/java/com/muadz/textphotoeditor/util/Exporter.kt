package com.muadz.textphotoeditor.util

import android.content.ContentValues
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Shader
import android.graphics.Typeface
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import com.muadz.textphotoeditor.model.BlurMode
import com.muadz.textphotoeditor.model.GradientDirection
import com.muadz.textphotoeditor.model.TextBlock
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.OutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.roundToInt

const val EXPORT_WIDTH = 1080
const val EXPORT_HEIGHT = 1920

/**
 * Render komposisi (gambar + efek + semua blok teks) ke Bitmap 1080x1920.
 *
 * Skala font: ukuran di layar (sp) dikali 3f agar proporsinya sama dengan
 * preview ~360dp -> ekspor 1080px. Ini perkiraan yang konsisten antara
 * preview Compose dan ekspor Canvas.
 *
 * Radial blur: implementasi sederhana. Di preview, blur memakai RenderEffect.
 * Di ekspor, kita memakai versi blur seragam (downscale/upscale) sebagai
 * pendekatan. TODO: masking radial asli (tepi blur / tengah blur) bisa
 * ditingkatkan dengan mask bitmap bila diperlukan — perilaku saat ini tetap
 * menghasilkan gambar yang diburamkan, bukan gagal build.
 */
fun createCompositionBitmap(
    imageBitmap: Bitmap?,
    backgroundColor: Int,
    blocks: List<TextBlock>,
    darkenPercent: Float,
    gradientStrength: Float,
    gradientDirection: GradientDirection,
    blurEnabled: Boolean,
    blurStrength: Float,
    blurMode: BlurMode
): Bitmap {
    val out = Bitmap.createBitmap(EXPORT_WIDTH, EXPORT_HEIGHT, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(out)

    // Latar: gambar cover-fit atau warna solid.
    if (imageBitmap != null) {
        drawCoverFit(canvas, imageBitmap, EXPORT_WIDTH, EXPORT_HEIGHT)
        if (blurEnabled && blurStrength > 0f) {
            // Pendekatan sederhana: gambar latar yang sudah diburamkan ditimpa di atas.
            // blurMode disimpan untuk pengembangan masking radial berikutnya.
            @Suppress("UNUSED_VARIABLE")
            val mode = blurMode
            val blurred = blurBitmapSimple(imageBitmap, blurStrength)
            drawCoverFit(canvas, blurred, EXPORT_WIDTH, EXPORT_HEIGHT)
            if (blurred != imageBitmap) {
                blurred.recycle()
            }
        }
    } else {
        canvas.drawColor(backgroundColor)
    }

    // Gelapkan: overlay hitam 0-85%.
    val darken = darkenPercent.coerceIn(0f, 85f)
    if (darken > 0f) {
        val alpha = (darken / 100f * 255f).roundToInt().coerceIn(0, 255)
        canvas.drawColor(Color.argb(alpha, 0, 0, 0))
    }

    // Gradasi hitam transparan dari bawah / atas.
    val grad = gradientStrength.coerceIn(0f, 100f)
    if (grad > 0f && gradientDirection != GradientDirection.NONE) {
        val alpha = (grad / 100f * 255f).roundToInt().coerceIn(0, 255)
        val shader: Shader = if (gradientDirection == GradientDirection.BOTTOM) {
            LinearGradient(
                0f, EXPORT_HEIGHT * 0.45f,
                0f, EXPORT_HEIGHT.toFloat(),
                Color.argb(0, 0, 0, 0),
                Color.argb(alpha, 0, 0, 0),
                Shader.TileMode.CLAMP
            )
        } else {
            LinearGradient(
                0f, EXPORT_HEIGHT * 0.55f,
                0f, 0f,
                Color.argb(0, 0, 0, 0),
                Color.argb(alpha, 0, 0, 0),
                Shader.TileMode.CLAMP
            )
        }
        val paint = Paint().apply { this.shader = shader }
        canvas.drawRect(0f, 0f, EXPORT_WIDTH.toFloat(), EXPORT_HEIGHT.toFloat(), paint)
    }

    // Semua blok teks, dengan posisi / jarak / font masing-masing.
    for (block in blocks) {
        drawTextBlock(canvas, block)
    }

    return out
}

private fun drawCoverFit(canvas: Canvas, src: Bitmap, dstW: Int, dstH: Int) {
    val srcW = src.width.toFloat()
    val srcH = src.height.toFloat()
    if (srcW <= 0f || srcH <= 0f) return
    val scale = maxOf(dstW / srcW, dstH / srcH)
    val scaledW = srcW * scale
    val scaledH = srcH * scale
    val left = (dstW - scaledW) / 2f
    val top = (dstH - scaledH) / 2f
    val dst = android.graphics.RectF(left, top, left + scaledW, top + scaledH)
    val paint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG)
    canvas.drawBitmap(src, null, dst, paint)
}

private fun drawTextBlock(canvas: Canvas, block: TextBlock) {
    if (block.text.isEmpty()) return
    val scale = 3f
    val fontSizePx = (block.fontSizeSp * scale).coerceIn(12f * scale, 170f * scale)

    val base: Typeface = when (block.fontIndex) {
        4 -> Typeface.SERIF
        else -> Typeface.SANS_SERIF
    }
    val style: Int = when {
        block.isBold && block.isItalic -> Typeface.BOLD_ITALIC
        block.isBold -> Typeface.BOLD
        block.isItalic -> Typeface.ITALIC
        else -> Typeface.NORMAL
    }
    val typeface = Typeface.create(base, style)

    // letterSpacing di Paint memakai satuan em. Konversi px -> em.
    val letterSpacingEm = if (block.fontSizeSp > 0f) {
        (block.letterSpacingPx / block.fontSizeSp).coerceIn(-0.9f, 2f)
    } else {
        0f
    }

    val textPaint = TextPaint(Paint.ANTI_ALIAS_FLAG).apply {
        this.typeface = typeface
        this.textSize = fontSizePx
        this.color = block.colorArgb
        this.letterSpacing = letterSpacingEm
    }

    val maxWidth = (EXPORT_WIDTH * 0.88f).roundToInt().coerceAtLeast(100)
    val alignment: Layout.Alignment = when (block.textAlign) {
        androidx.compose.ui.text.style.TextAlign.Left -> Layout.Alignment.ALIGN_NORMAL
        androidx.compose.ui.text.style.TextAlign.Right -> Layout.Alignment.ALIGN_OPPOSITE
        else -> Layout.Alignment.ALIGN_CENTER
    }

    val lineSpacingMultiplier = (block.lineHeightPercent / 100f).coerceIn(0.7f, 2.2f)

    val layout = StaticLayout.Builder.obtain(block.text, 0, block.text.length, textPaint, maxWidth)
        .setAlignment(alignment)
        .setLineSpacing(0f, lineSpacingMultiplier)
        .setIncludePad(false)
        .build()

    val cx = block.posX.coerceIn(0f, 1f) * EXPORT_WIDTH
    val cy = block.posY.coerceIn(0f, 1f) * EXPORT_HEIGHT
    val left = cx - layout.width / 2f
    val top = cy - layout.height / 2f

    canvas.save()
    canvas.translate(left, top)
    layout.draw(canvas)
    canvas.restore()
}

/** Blur sederhana via downscale/upscale. Cukup untuk efek lembut tanpa library tambahan. */
private fun blurBitmapSimple(src: Bitmap, strength: Float): Bitmap {
    val factor = when {
        strength <= 20f -> 8
        strength <= 50f -> 12
        else -> 16
    }
    val smallW = (src.width / factor).coerceAtLeast(1)
    val smallH = (src.height / factor).coerceAtLeast(1)
    val small = Bitmap.createScaledBitmap(src, smallW, smallH, true)
    val out = Bitmap.createScaledBitmap(small, src.width, src.height, true)
    small.recycle()
    return out
}

/**
 * Simpan bitmap ke galeri via MediaStore (kompatibel Android 10+).
 * Mengembalikan Uri hasil simpan, atau null kalau gagal.
 */
fun saveBitmapToGallery(context: Context, bitmap: Bitmap, fileName: String): Uri? {
    val resolver = context.contentResolver
    val values = ContentValues().apply {
        put(MediaStore.Images.Media.DISPLAY_NAME, fileName)
        put(MediaStore.Images.Media.MIME_TYPE, "image/png")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/TextPhotoEditor")
            put(MediaStore.Images.Media.IS_PENDING, 1)
        }
    }
    val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values) ?: return null
    var stream: OutputStream? = null
    try {
        stream = resolver.openOutputStream(uri)
        if (stream == null) return null
        val ok = bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
        if (!ok) return null
    } catch (_: Exception) {
        return null
    } finally {
        try { stream?.close() } catch (_: Exception) { }
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        val update = ContentValues().apply {
            put(MediaStore.Images.Media.IS_PENDING, 0)
        }
        resolver.update(uri, update, null, null)
    }
    return uri
}

fun newExportFileName(): String {
    val stamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
    return "textphoto_$stamp.png"
}

suspend fun exportComposition(
    context: Context,
    imageBitmap: Bitmap?,
    backgroundColor: Int,
    blocks: List<TextBlock>,
    darkenPercent: Float,
    gradientStrength: Float,
    gradientDirection: GradientDirection,
    blurEnabled: Boolean,
    blurStrength: Float,
    blurMode: BlurMode
): Uri? = withContext(Dispatchers.IO) {
    try {
        val bitmap = createCompositionBitmap(
            imageBitmap = imageBitmap,
            backgroundColor = backgroundColor,
            blocks = blocks,
            darkenPercent = darkenPercent,
            gradientStrength = gradientStrength,
            gradientDirection = gradientDirection,
            blurEnabled = blurEnabled,
            blurStrength = blurStrength,
            blurMode = blurMode
        )
        val uri = saveBitmapToGallery(context, bitmap, newExportFileName())
        // Bitmap hasil ekspor bisa dilepas setelah disimpan.
        bitmap.recycle()
        uri
    } catch (_: Exception) {
        null
    }
}

fun decodeBitmapFromUri(context: Context, uri: Uri): Bitmap? {
    return try {
        context.contentResolver.openInputStream(uri)?.use { stream ->
            BitmapFactory.decodeStream(stream)
        }
    } catch (_: Exception) {
        null
    }
}
