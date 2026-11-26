# Publicar el sitio en Cloudflare (Workers con static assets)

El sitio es estático: la landing de descargas en `/` y la app compilada en `/app/`. Se publica como un
**Worker solo de assets** (sin código de Worker). Configuración en `wrangler.jsonc`:

```jsonc
{
  "name": "encuentralo",
  "compatibility_date": "2026-11-26",
  "assets": { "directory": "./sitio" }
}
```

## Pasos (los hace una persona, no la IA)
1. **Iniciar sesión una vez** (abre el navegador para autorizar tu cuenta de Cloudflare):
   ```bash
   npx --yes wrangler@4 login
   ```
2. **Armar y publicar:**
   ```bash
   npm run publicar:cloudflare
   ```
   Equivale a `npm run sitio` (compila la app y arma `sitio/` = `landing/` + `dist/` en `sitio/app/`) y luego
   `npx --yes wrangler@4 deploy`, que sube `sitio/` como static assets.
3. **URL resultante:** `https://encuentralo.<tu-subdominio>.workers.dev`
   (el `name` del Worker + el subdominio `workers.dev` de tu cuenta; se ve o cambia en el panel de Cloudflare →
   Workers & Pages → *Your subdomain*).

Para revisar sin publicar: `npm run sitio` y abrir `sitio/index.html`, o `npx --yes wrangler@4 deploy --dry-run`.

## Notas
- `wrangler` no es dependencia del proyecto: se usa con `npx --yes wrangler@4` (versión mayor fijada).
- `sitio/` y `.wrangler/` están en `.gitignore`: se regeneran en cada publicación.
- Sin secretos: un sitio solo de assets no necesita variables ni claves. La app sigue en modo demo
  (`VITE_USE_MOCK=true`, datos 100% ficticios).
- Los botones de descarga de la landing apuntan al último GitHub Release (`Encuentralo.apk` y `Encuentralo.exe`),
  que crea el flujo `.github/workflows/publicar.yml` al subir un tag `v*`. El mismo flujo deja el artifact `sitio`.

## Fuentes (documentación oficial consultada el 2026-11-26)
- Static assets: https://developers.cloudflare.com/workers/static-assets/
- Configuración `assets` («The `main` key is optional for assets-only Workers»): https://developers.cloudflare.com/workers/wrangler/configuration/#assets
- Despliegue (`npx wrangler deploy`): https://developers.cloudflare.com/workers/static-assets/get-started/
- URL `workers.dev` (`<YOUR_WORKER_NAME>.<YOUR_SUBDOMAIN>.workers.dev`): https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
