# Abrir Encuéntralo en Android Studio (guía para Gabriel)

La app Android es la misma web empaquetada con **Capacitor**; la carpeta `android/` ya está en el repo.

## Una sola vez
1. Instala **Android Studio** (https://developer.android.com/studio) con el SDK que propone el asistente.
2. Instala **Node.js 22** y clona el repo:
   ```powershell
   git clone https://github.com/wither63z/Encuentralo.git
   cd Encuentralo
   npm install
   ```

## Cada vez que cambie el código
```powershell
npm run apk:preparar
npx cap open android
```
`apk:preparar` compila la web (`dist/`) y la copia a `android/`. `cap open android` abre el proyecto en Android Studio.

## Dentro de Android Studio
1. Espera a que termine **Gradle Sync** (barra inferior).
2. Elige un emulador (Device Manager → *Create device*, p. ej. Pixel 7) o conecta tu celular con **Depuración USB**.
3. Pulsa **Run ▶**. La app se instala y abre.
4. Para generar la APK: *Build → Build App Bundle(s) / APK(s) → Build APK(s)*. Queda en
   `android/app/build/outputs/apk/debug/app-debug.apk`.

## Cambios en vivo (más rápido para la presentación)
Con el celular o emulador conectado: `npm run apk:vivo` (recarga al guardar, usa el servidor de Vite en el puerto 5173).

## Notas
- La APK y el .exe usan `.env.production` (Supabase real, sin login). La web publicada usa `.env.web` (login de Clerk primero).
- Si Gradle pide otra versión de Java, usa la que trae Android Studio (*Settings → Build Tools → Gradle → Gradle JDK*).
- GitHub Actions (flujo **Empaquetar**) compila la APK y el .exe en cada push a `main`; no hace falta Android Studio para descargarlos.
