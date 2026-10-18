package com.muadz.textphotoeditor

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.muadz.textphotoeditor.ui.EditorScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TextPhotoEditorTheme {
                EditorScreen()
            }
        }
    }
}

@Composable
fun TextPhotoEditorTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = Color(0xFF111111),
            onPrimary = Color.White,
            surface = Color.White,
            onSurface = Color(0xFF111111),
            background = Color.White,
            onBackground = Color(0xFF111111)
        ),
        content = content
    )
}
