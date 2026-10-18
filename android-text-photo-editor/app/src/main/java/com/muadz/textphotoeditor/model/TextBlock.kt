package com.muadz.textphotoeditor.model

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import java.util.UUID

/**
 * Satu blok teks di atas foto.
 * posX / posY: posisi tengah blok, 0f..1f relatif ke kartu preview (0.5f = tengah).
 * fontSizeSp: 12f..170f
 * letterSpacingPx: -100f..40f (dalam px desain, dikonversi ke em saat render)
 * lineHeightPercent: 70f..220f
 * colorArgb: warna teks sebagai ARGB Int (0xAARRGGBB, sama seperti android.graphics.Color).
 * Dipakai langsung untuk Paint di ekspor dan Color(Int) di Compose.
 */
data class TextBlock(
    val id: String = UUID.randomUUID().toString(),
    val text: String = "Tulis di sini",
    val fontIndex: Int = 4,
    val colorArgb: Int = 0xFF111111.toInt(),
    val fontSizeSp: Float = 48f,
    val isBold: Boolean = false,
    val isItalic: Boolean = false,
    val letterSpacingPx: Float = 0f,
    val lineHeightPercent: Float = 120f,
    val posX: Float = 0.5f,
    val posY: Float = 0.5f,
    val textAlign: TextAlign = TextAlign.Center
) {
    val color: Color
        get() = Color(colorArgb)

    fun copyWithCentered(): TextBlock = copy(posX = 0.5f, posY = 0.5f)

    companion object {
        fun default(): TextBlock = TextBlock()

        fun defaultSmall(): TextBlock = TextBlock(
            text = "Teks baru",
            fontSizeSp = 14f,
            posY = 0.62f
        )
    }
}

enum class GradientDirection {
    BOTTOM, TOP, NONE
}

enum class BlurMode {
    EDGE, CENTER
}
