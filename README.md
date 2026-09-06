# Message-Fixer — GitHub-ready Android project

This repository contains the real Android Message-Fixer keyboard plus a GitHub Pages web demo.

## What to upload
Upload **everything in this folder** to your GitHub `message-fixer` repository.

## Build and download flow
1. Push the project to the `main` branch.
2. GitHub Actions runs `Build and Release Message-Fixer APK`.
3. The workflow builds `message-fixer.apk`.
4. It creates a GitHub Release containing the APK.
5. The website's **Download Message-Fixer APK** button points to the latest release APK.

## Android app
The Android project is a real `InputMethodService` keyboard. Saved Voice Emojis are stored locally in the Android app and shown in the Message-Fixer keyboard.

## Important limitation
The keyboard can insert text/emoji into apps and play the saved voice. It cannot force another app such as WhatsApp or Instagram to accept a custom combined "emoji + audio" message type through normal keyboard input APIs.
