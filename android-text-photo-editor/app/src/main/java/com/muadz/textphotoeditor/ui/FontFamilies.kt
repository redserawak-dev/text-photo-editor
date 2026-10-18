package com.muadz.textphotoeditor.ui

import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight

/**
 * Daftar font editor.
 *
 * PENTING: File .ttf belum dibundel di repo ini (agar project tetap jalan tanpa
 * file font berlisensi). Semua entri di bawah memakai fallback sistem yang aman:
 * SansSerif / Serif / Default. Build TIDAK akan gagal walau res/font kosong.
 *
 * Cara menambahkan font asli (lihat README.md):
 *  1. Taruh file .ttf di app/src/main/res/font/, misal inter_regular.ttf,
 *     inter_bold.ttf, inter_italic.ttf, dst.
 *  2. Ganti entri di bawah dengan FontFamily(Font(R.font.inter_regular, FontWeight.Normal), ...)
 *     dan tambahkan import androidx.compose.ui.text.font.Font + com.muadz.textphotoeditor.R.
 *  3. Untuk Open Sauce: font ini tidak tersedia di Google Fonts. Kalau kamu punya
 *     file Open Sauce, taruh sebagai opensauce_regular.ttf dan petakan ke sini.
 *     Sampai saat itu, Open Sauce memakai fallback SansSerif (= Open Sans secara visual).
 */
data class EditorFont(
    val name: String,
    val family: FontFamily,
    val note: String = ""
)

val editorFonts: List<EditorFont> = listOf(
    EditorFont("Inter", FontFamily.SansSerif),
    EditorFont("Poppins", FontFamily.SansSerif),
    EditorFont("DM Sans", FontFamily.SansSerif),
    EditorFont(
        "Open Sauce",
        FontFamily.SansSerif,
        note = "Fallback ke Open Sans (SansSerif) karena Open Sauce tidak ada di Google Fonts"
    ),
    EditorFont("Playfair Display", FontFamily.Serif)
)

fun fontFamilyFor(index: Int): FontFamily {
    return editorFonts.getOrNull(index)?.family ?: FontFamily.Default
}

fun fontNameFor(index: Int): String {
    return editorFonts.getOrNull(index)?.name ?: "Inter"
}

/** Bobot untuk Compose Text: Bold -> Bold, selain itu Normal. */
fun fontWeightFor(isBold: Boolean): FontWeight {
    return if (isBold) FontWeight.Bold else FontWeight.Normal
}
