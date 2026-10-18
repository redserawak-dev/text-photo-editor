package com.muadz.textphotoeditor.ui

import android.graphics.RenderEffect
import android.graphics.Shader
import android.net.Uri
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.asComposeRenderEffect
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.muadz.textphotoeditor.model.BlurMode
import com.muadz.textphotoeditor.model.GradientDirection
import com.muadz.textphotoeditor.model.TextBlock
import com.muadz.textphotoeditor.util.decodeBitmapFromUri
import com.muadz.textphotoeditor.util.exportComposition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlin.math.roundToInt

private val tabTitles = listOf("Teks", "Gambar", "Font", "Gaya", "Warna", "Ukuran", "Jarak")

private val textColorPresets = listOf(
    Color(0xFF111111),
    Color.White,
    Color(0xFFFF3B30),
    Color(0xFFFF8A00),
    Color(0xFFFFCC00),
    Color(0xFF34C759),
    Color(0xFF007AFF),
    Color(0xFFFF2D55),
    Color(0xFF8E8E93)
)

private val bgColorPresets = listOf(
    Color.White,
    Color(0xFFF5F5F5),
    Color(0xFF111111),
    Color(0xFFFFF3E0),
    Color(0xFFE3F2FD),
    Color(0xFFE8F5E9)
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditorScreen() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var imageUri by remember { mutableStateOf<Uri?>(null) }
    var imageBitmap by remember { mutableStateOf<android.graphics.Bitmap?>(null) }
    var backgroundColor by remember { mutableStateOf(Color(0xFFF5F5F5)) }

    var blocks by remember { mutableStateOf(listOf(TextBlock.default())) }
    var selectedBlockId by remember { mutableStateOf<String?>(blocks.firstOrNull()?.id) }
    var selectedTab by remember { mutableStateOf(0) }

    var darkenPercent by remember { mutableFloatStateOf(0f) }
    var gradientStrength by remember { mutableFloatStateOf(0f) }
    var gradientDirection by remember { mutableStateOf(GradientDirection.NONE) }
    var blurEnabled by remember { mutableStateOf(false) }
    var blurStrength by remember { mutableFloatStateOf(0f) }
    var blurMode by remember { mutableStateOf(BlurMode.EDGE) }

    var isExporting by remember { mutableStateOf(false) }
    var fontMenuExpanded by remember { mutableStateOf(false) }

    val selectedBlock = blocks.firstOrNull { it.id == selectedBlockId } ?: blocks.firstOrNull()

    fun updateSelected(transform: (TextBlock) -> TextBlock) {
        val id = selectedBlockId ?: return
        blocks = blocks.map { if (it.id == id) transform(it) else it }
    }

    val pickImageLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            imageUri = uri
        }
    }

    // Decode gambar di background thread saat URI berubah.
    LaunchedEffect(imageUri) {
        val uri = imageUri
        if (uri == null) {
            imageBitmap = null
        } else {
            val decoded = withContext(Dispatchers.IO) {
                decodeBitmapFromUri(context, uri)
            }
            imageBitmap = decoded
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        // Header minimal: judul + tombol ekspor.
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Text Photo",
                    style = MaterialTheme.typography.titleLarge,
                    color = Color(0xFF111111)
                )
                Text(
                    text = "Editor minimal",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF8E8E93)
                )
            }
            Button(
                onClick = {
                    if (isExporting) return@Button
                    isExporting = true
                    scope.launch {
                        val uri = exportComposition(
                            context = context,
                            imageBitmap = imageBitmap,
                            backgroundColor = backgroundColor.toArgb(),
                            blocks = blocks,
                            darkenPercent = darkenPercent,
                            gradientStrength = gradientStrength,
                            gradientDirection = gradientDirection,
                            blurEnabled = blurEnabled,
                            blurStrength = blurStrength,
                            blurMode = blurMode
                        )
                        isExporting = false
                        if (uri != null) {
                            Toast.makeText(context, "PNG tersimpan", Toast.LENGTH_LONG).show()
                        } else {
                            Toast.makeText(context, "Gagal menyimpan PNG", Toast.LENGTH_LONG).show()
                        }
                    }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF111111),
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(999.dp)
            ) {
                Text(if (isExporting) "Menyimpan…" else "Export PNG")
            }
        }

        // Preview: kartu 9:16 di tengah layar putih.
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .background(Color.White),
            contentAlignment = Alignment.Center
        ) {
            BoxWithConstraints(
                modifier = Modifier
                    .fillMaxHeight(0.94f)
                    .aspectRatio(9f / 16f)
                    .shadow(16.dp, RoundedCornerShape(24.dp))
                    .clip(RoundedCornerShape(24.dp))
                    .background(backgroundColor)
            ) {
                val density = LocalDensity.current
                val previewWidthPx = with(density) { maxWidth.toPx() }
                val previewHeightPx = with(density) { maxHeight.toPx() }

                // Gambar latar (cover) + efek blur sederhana di preview.
                val bitmap = imageBitmap
                if (bitmap != null) {
                    val blurModifier = if (blurEnabled && blurStrength > 0f && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        Modifier.graphicsLayer {
                            renderEffect = RenderEffect.createBlurEffect(
                                blurStrength,
                                blurStrength,
                                Shader.TileMode.CLAMP
                            ).asComposeRenderEffect()
                        }
                    } else {
                        Modifier
                    }
                    androidx.compose.foundation.Image(
                        bitmap = bitmap.asImageBitmap(),
                        contentDescription = "Gambar latar",
                        modifier = Modifier
                            .fillMaxSize()
                            .then(blurModifier),
                        contentScale = androidx.compose.ui.layout.ContentScale.Crop
                    )
                }

                // Gelapkan.
                if (darkenPercent > 0f) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color.Black.copy(alpha = (darkenPercent / 100f).coerceIn(0f, 0.85f)))
                    )
                }

                // Gradasi hitam transparan.
                if (gradientStrength > 0f && gradientDirection != GradientDirection.NONE) {
                    val alpha = (gradientStrength / 100f).coerceIn(0f, 1f)
                    val brush = if (gradientDirection == GradientDirection.BOTTOM) {
                        Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color.Black.copy(alpha = alpha)),
                            startY = previewHeightPx * 0.45f,
                            endY = previewHeightPx
                        )
                    } else {
                        Brush.verticalGradient(
                            colors = listOf(Color.Black.copy(alpha = alpha), Color.Transparent),
                            startY = 0f,
                            endY = previewHeightPx * 0.55f
                        )
                    }
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(brush)
                    )
                }

                // Garis panduan putus-putus oranye saat blok aktif persis di tengah.
                val active = selectedBlock
                if (active != null) {
                    val isCenterX = kotlin.math.abs(active.posX - 0.5f) < 0.001f
                    val isCenterY = kotlin.math.abs(active.posY - 0.5f) < 0.001f
                    if (isCenterX || isCenterY) {
                        Canvas(modifier = Modifier.fillMaxSize()) {
                            val dash = PathEffect.dashPathEffect(floatArrayOf(14f, 12f), 0f)
                            val orange = Color(0xFFFF8A00)
                            if (isCenterX) {
                                drawLine(
                                    color = orange,
                                    start = Offset(size.width / 2f, 0f),
                                    end = Offset(size.width / 2f, size.height),
                                    strokeWidth = 2f,
                                    pathEffect = dash
                                )
                            }
                            if (isCenterY) {
                                drawLine(
                                    color = orange,
                                    start = Offset(0f, size.height / 2f),
                                    end = Offset(size.width, size.height / 2f),
                                    strokeWidth = 2f,
                                    pathEffect = dash
                                )
                            }
                        }
                    }
                }

                // Blok teks: dipusatkan, lalu di-offset dari tengah sesuai posX/posY.
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    for (block in blocks) {
                        val isSelected = block.id == selectedBlockId
                        val offsetX = ((block.posX - 0.5f) * previewWidthPx).roundToInt()
                        val offsetY = ((block.posY - 0.5f) * previewHeightPx).roundToInt()
                        Text(
                            text = block.text,
                            modifier = Modifier
                                .offset { IntOffset(offsetX, offsetY) }
                                .clickable { selectedBlockId = block.id }
                                .pointerInput(block.id, previewWidthPx, previewHeightPx) {
                                    detectDragGestures { change, dragAmount ->
                                        change.consume()
                                        val current = blocks.firstOrNull { it.id == block.id } ?: return@detectDragGestures
                                        var nx = (current.posX + dragAmount.x / previewWidthPx).coerceIn(0.05f, 0.95f)
                                        var ny = (current.posY + dragAmount.y / previewHeightPx).coerceIn(0.05f, 0.95f)
                                        // Snap ke tengah.
                                        if (kotlin.math.abs(nx - 0.5f) < 0.02f) nx = 0.5f
                                        if (kotlin.math.abs(ny - 0.5f) < 0.035f) ny = 0.5f
                                        blocks = blocks.map {
                                            if (it.id == block.id) it.copy(posX = nx, posY = ny) else it
                                        }
                                        selectedBlockId = block.id
                                    }
                                }
                                .border(
                                    width = if (isSelected) 1.dp else 0.dp,
                                    color = if (isSelected) Color(0xFFFF8A00) else Color.Transparent,
                                    shape = RoundedCornerShape(6.dp)
                                )
                                .padding(4.dp),
                            color = block.color,
                            fontSize = block.fontSizeSp.sp,
                            fontFamily = fontFamilyFor(block.fontIndex),
                            fontWeight = if (block.isBold) androidx.compose.ui.text.font.FontWeight.Bold else androidx.compose.ui.text.font.FontWeight.Normal,
                            fontStyle = if (block.isItalic) FontStyle.Italic else FontStyle.Normal,
                            style = TextStyle(
                                letterSpacing = block.letterSpacingPx.sp,
                                lineHeight = (block.fontSizeSp * block.lineHeightPercent / 100f).sp,
                                textAlign = block.textAlign
                            ),
                            textAlign = block.textAlign
                        )
                    }
                }
            }
        }

        // Panel bawah gaya bottom sheet: pintasan + konten.
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
        ) {
            // Gagang sheet.
            Box(
                modifier = Modifier
                    .padding(top = 8.dp)
                    .size(width = 36.dp, height = 4.dp)
                    .clip(RoundedCornerShape(999.dp))
                    .background(Color(0xFFE0E0E0))
                    .align(Alignment.CenterHorizontally)
            )

            // Bar pintasan.
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(tabTitles.indices.toList()) { index ->
                    val selected = selectedTab == index
                    FilterChip(
                        selected = selected,
                        onClick = { selectedTab = index },
                        label = { Text(tabTitles[index]) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Color(0xFF111111),
                            selectedLabelColor = Color.White,
                            containerColor = Color(0xFFF5F5F5),
                            labelColor = Color(0xFF111111)
                        ),
                        shape = RoundedCornerShape(999.dp)
                    )
                }
            }

            // Konten panel (scroll internal, bukan scroll halaman panjang).
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp, vertical = 4.dp)
            ) {
                when (selectedTab) {
                    0 -> TeksPanel(
                        blocks = blocks,
                        selectedBlock = selectedBlock,
                        onSelectBlock = { selectedBlockId = it },
                        onAddBlock = {
                            val created = TextBlock.defaultSmall()
                            blocks = blocks + created
                            selectedBlockId = created.id
                        },
                        onDeleteBlock = {
                            val id = selectedBlockId ?: return@TeksPanel
                            if (blocks.size <= 1) return@TeksPanel
                            blocks = blocks.filter { it.id != id }
                            selectedBlockId = blocks.firstOrNull()?.id
                        },
                        onCenterBlock = {
                            updateSelected { it.copyWithCentered() }
                        },
                        onTextValueChange = { value ->
                            updateSelected { it.copy(text = value) }
                        }
                    )
                    1 -> GambarPanel(
                        hasImage = imageBitmap != null,
                        onPickImage = { pickImageLauncher.launch("image/*") },
                        onRemoveImage = {
                            imageUri = null
                            imageBitmap = null
                        },
                        darkenPercent = darkenPercent,
                        onDarkenChange = { darkenPercent = it },
                        gradientStrength = gradientStrength,
                        onGradientStrengthChange = { gradientStrength = it },
                        gradientDirection = gradientDirection,
                        onGradientDirectionChange = { gradientDirection = it },
                        blurEnabled = blurEnabled,
                        onBlurEnabledChange = { blurEnabled = it },
                        blurStrength = blurStrength,
                        onBlurStrengthChange = { blurStrength = it },
                        blurMode = blurMode,
                        onBlurModeChange = { blurMode = it }
                    )
                    2 -> FontPanel(
                        selectedFontIndex = selectedBlock?.fontIndex ?: 4,
                        onFontChange = { index -> updateSelected { it.copy(fontIndex = index) } },
                        expanded = fontMenuExpanded,
                        onExpandedChange = { fontMenuExpanded = it }
                    )
                    3 -> GayaPanel(
                        isBold = selectedBlock?.isBold ?: false,
                        isItalic = selectedBlock?.isItalic ?: false,
                        onBoldToggle = { updateSelected { block -> block.copy(isBold = !block.isBold) } },
                        onItalicToggle = { updateSelected { block -> block.copy(isItalic = !block.isItalic) } }
                    )
                    4 -> WarnaPanel(
                        selectedTextColor = selectedBlock?.color ?: Color(0xFF111111),
                        onTextColorChange = { c -> updateSelected { block -> block.copy(colorArgb = c.toArgb()) } },
                        selectedBgColor = backgroundColor,
                        onBgColorChange = { backgroundColor = it }
                    )
                    5 -> UkuranPanel(
                        fontSize = selectedBlock?.fontSizeSp ?: 48f,
                        onFontSizeChange = { newSize -> updateSelected { block -> block.copy(fontSizeSp = newSize) } }
                    )
                    6 -> JarakPanel(
                        letterSpacing = selectedBlock?.letterSpacingPx ?: 0f,
                        onLetterSpacingChange = { newSpacing -> updateSelected { block -> block.copy(letterSpacingPx = newSpacing) } },
                        lineHeight = selectedBlock?.lineHeightPercent ?: 120f,
                        onLineHeightChange = { newHeight -> updateSelected { block -> block.copy(lineHeightPercent = newHeight) } }
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}

@Composable
private fun TeksPanel(
    blocks: List<TextBlock>,
    selectedBlock: TextBlock?,
    onSelectBlock: (String) -> Unit,
    onAddBlock: () -> Unit,
    onDeleteBlock: () -> Unit,
    onCenterBlock: () -> Unit,
    onTextValueChange: (String) -> Unit
) {
    Text("Teks", style = MaterialTheme.typography.titleSmall)
    Spacer(modifier = Modifier.height(8.dp))

    // Daftar chip blok.
    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items(blocks) { block ->
            val selected = block.id == selectedBlock?.id
            FilterChip(
                selected = selected,
                onClick = { onSelectBlock(block.id) },
                label = { Text(block.text.take(14).ifEmpty { "Teks" }) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Color(0xFF111111),
                    selectedLabelColor = Color.White
                ),
                shape = RoundedCornerShape(999.dp)
            )
        }
    }
    Spacer(modifier = Modifier.height(10.dp))

    OutlinedTextField(
        value = selectedBlock?.text ?: "",
        onValueChange = { onTextValueChange(it) },
        label = { Text("Isi teks") },
        modifier = Modifier.fillMaxWidth(),
        minLines = 1,
        maxLines = 3
    )
    Spacer(modifier = Modifier.height(10.dp))

    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Button(
            onClick = onAddBlock,
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF111111)),
            shape = RoundedCornerShape(999.dp)
        ) { Text("+ Tambah teks") }
        OutlinedButton(
            onClick = onCenterBlock,
            shape = RoundedCornerShape(999.dp)
        ) { Text("Ke tengah") }
        OutlinedButton(
            onClick = onDeleteBlock,
            shape = RoundedCornerShape(999.dp)
        ) { Text("Hapus") }
    }
}

@Composable
private fun GambarPanel(
    hasImage: Boolean,
    onPickImage: () -> Unit,
    onRemoveImage: () -> Unit,
    darkenPercent: Float,
    onDarkenChange: (Float) -> Unit,
    gradientStrength: Float,
    onGradientStrengthChange: (Float) -> Unit,
    gradientDirection: GradientDirection,
    onGradientDirectionChange: (GradientDirection) -> Unit,
    blurEnabled: Boolean,
    onBlurEnabledChange: (Boolean) -> Unit,
    blurStrength: Float,
    onBlurStrengthChange: (Float) -> Unit,
    blurMode: BlurMode,
    onBlurModeChange: (BlurMode) -> Unit
) {
    Text("Gambar latar", style = MaterialTheme.typography.titleSmall)
    Spacer(modifier = Modifier.height(8.dp))
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Button(
            onClick = onPickImage,
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF111111)),
            shape = RoundedCornerShape(999.dp)
        ) { Text("Pilih gambar") }
        if (hasImage) {
            OutlinedButton(onClick = onRemoveImage, shape = RoundedCornerShape(999.dp)) {
                Text("Hapus gambar")
            }
        }
    }
    Spacer(modifier = Modifier.height(14.dp))

    Text("Gelapkan gambar: ${darkenPercent.roundToInt()}%")
    Slider(value = darkenPercent, onValueChange = onDarkenChange, valueRange = 0f..85f)

    Text("Gradasi hitam: ${gradientStrength.roundToInt()}%")
    Slider(value = gradientStrength, onValueChange = onGradientStrengthChange, valueRange = 0f..100f)

    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        listOf(
            GradientDirection.BOTTOM to "Dari bawah",
            GradientDirection.TOP to "Dari atas",
            GradientDirection.NONE to "Mati"
        ).forEach { (dir, label) ->
            FilterChip(
                selected = gradientDirection == dir,
                onClick = { onGradientDirectionChange(dir) },
                label = { Text(label) },
                shape = RoundedCornerShape(999.dp)
            )
        }
    }
    Spacer(modifier = Modifier.height(12.dp))

    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text("Blur radial")
        Switch(checked = blurEnabled, onCheckedChange = onBlurEnabledChange)
    }
    if (blurEnabled) {
        Text("Kekuatan blur: ${blurStrength.roundToInt()}")
        Slider(value = blurStrength, onValueChange = onBlurStrengthChange, valueRange = 0f..100f)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(
                selected = blurMode == BlurMode.EDGE,
                onClick = { onBlurModeChange(BlurMode.EDGE) },
                label = { Text("Tepi blur") },
                shape = RoundedCornerShape(999.dp)
            )
            FilterChip(
                selected = blurMode == BlurMode.CENTER,
                onClick = { onBlurModeChange(BlurMode.CENTER) },
                label = { Text("Tengah blur") },
                shape = RoundedCornerShape(999.dp)
            )
        }
        Text(
            "Catatan: blur radial di ekspor disederhanakan jadi blur seragam.",
            style = MaterialTheme.typography.bodySmall,
            color = Color(0xFF8E8E93)
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun FontPanel(
    selectedFontIndex: Int,
    onFontChange: (Int) -> Unit,
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit
) {
    Text("Font", style = MaterialTheme.typography.titleSmall)
    Spacer(modifier = Modifier.height(8.dp))
    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { onExpandedChange(it) }
    ) {
        TextField(
            value = fontNameFor(selectedFontIndex),
            onValueChange = {},
            readOnly = true,
            label = { Text("Pilih font") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor(),
            textStyle = TextStyle(fontFamily = fontFamilyFor(selectedFontIndex))
        )
        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { onExpandedChange(false) }
        ) {
            editorFonts.forEachIndexed { index, font ->
                DropdownMenuItem(
                    text = {
                        Column {
                            Text(font.name, fontFamily = font.family)
                            if (font.note.isNotEmpty()) {
                                Text(
                                    font.note,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = Color(0xFF8E8E93)
                                )
                            }
                        }
                    },
                    onClick = {
                        onFontChange(index)
                        onExpandedChange(false)
                    }
                )
            }
        }
    }
}

@Composable
private fun GayaPanel(
    isBold: Boolean,
    isItalic: Boolean,
    onBoldToggle: () -> Unit,
    onItalicToggle: () -> Unit
) {
    Text("Gaya teks", style = MaterialTheme.typography.titleSmall)
    Spacer(modifier = Modifier.height(8.dp))
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        FilterChip(
            selected = isBold,
            onClick = { onBoldToggle() },
            label = { Text("B Tebal") },
            shape = RoundedCornerShape(999.dp)
        )
        FilterChip(
            selected = isItalic,
            onClick = { onItalicToggle() },
            label = { Text("I Miring") },
            shape = RoundedCornerShape(999.dp)
        )
    }
    Text(
        "Berlaku per blok teks.",
        style = MaterialTheme.typography.bodySmall,
        color = Color(0xFF8E8E93)
    )
}

@Composable
private fun WarnaPanel(
    selectedTextColor: Color,
    onTextColorChange: (Color) -> Unit,
    selectedBgColor: Color,
    onBgColorChange: (Color) -> Unit
) {
    Text("Warna teks", style = MaterialTheme.typography.titleSmall)
    Spacer(modifier = Modifier.height(8.dp))
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        textColorPresets.forEach { c ->
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(c)
                    .border(
                        width = if (c == selectedTextColor) 2.dp else 1.dp,
                        color = if (c == selectedTextColor) Color(0xFF111111) else Color(0xFFE0E0E0),
                        shape = CircleShape
                    )
                    .clickable { onTextColorChange(c) }
            )
        }
    }
    Spacer(modifier = Modifier.height(14.dp))
    Text("Warna latar (jika tanpa gambar)", style = MaterialTheme.typography.titleSmall)
    Spacer(modifier = Modifier.height(8.dp))
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        bgColorPresets.forEach { c ->
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(c)
                    .border(
                        width = if (c == selectedBgColor) 2.dp else 1.dp,
                        color = if (c == selectedBgColor) Color(0xFF111111) else Color(0xFFE0E0E0),
                        shape = CircleShape
                    )
                    .clickable { onBgColorChange(c) }
            )
        }
    }
}

@Composable
private fun UkuranPanel(
    fontSize: Float,
    onFontSizeChange: (Float) -> Unit
) {
    Text("Ukuran huruf: ${fontSize.roundToInt()} sp", style = MaterialTheme.typography.titleSmall)
    Spacer(modifier = Modifier.height(8.dp))
    Slider(value = fontSize, onValueChange = onFontSizeChange, valueRange = 12f..170f)
    Text("12 – 170 sp", style = MaterialTheme.typography.bodySmall, color = Color(0xFF8E8E93))
}

@Composable
private fun JarakPanel(
    letterSpacing: Float,
    onLetterSpacingChange: (Float) -> Unit,
    lineHeight: Float,
    onLineHeightChange: (Float) -> Unit
) {
    Text(
        "Jarak antar huruf: ${letterSpacing.roundToInt()}",
        style = MaterialTheme.typography.titleSmall
    )
    Slider(value = letterSpacing, onValueChange = onLetterSpacingChange, valueRange = -100f..40f)
    Text("-100 sampai +40", style = MaterialTheme.typography.bodySmall, color = Color(0xFF8E8E93))
    Spacer(modifier = Modifier.height(12.dp))
    Text(
        "Jarak antar baris: ${lineHeight.roundToInt()}%",
        style = MaterialTheme.typography.titleSmall
    )
    Slider(value = lineHeight, onValueChange = onLineHeightChange, valueRange = 70f..220f)
    Text("70% – 220%", style = MaterialTheme.typography.bodySmall, color = Color(0xFF8E8E93))
}
