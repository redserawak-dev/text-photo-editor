@rem Minimal Gradle wrapper launcher for Windows.
@echo off
set APP_HOME=%~dp0

if exist "%APP_HOME%gradle\wrapper\gradle-wrapper.jar" (
  java -classpath "%APP_HOME%gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*
  exit /b %ERRORLEVEL%
)

where gradle >nul 2>nul
if %ERRORLEVEL% equ 0 (
  echo gradle-wrapper.jar belum ada, memakai gradle sistem...
  gradle %*
  exit /b %ERRORLEVEL%
)

echo gradle-wrapper.jar belum ada dan gradle sistem tidak ditemukan.
echo Buka project ini di Android Studio, atau jalankan: gradle wrapper --gradle-version 8.2
exit /b 1
