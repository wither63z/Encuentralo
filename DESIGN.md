# DESIGN — Encuéntralo

- Marca: Azul Salesiano `marca`; acento amarillo (`alerta`) en la lupa del logo.
- Tokens (definidos en `src/index.css` con `@theme`): marca, marca-suave, fondo, superficie, borde, texto, texto-suave, error, exito, alerta.
- Estados: Disponible = marca-suave + texto marca · Reclamado = alerta + texto oscuro · Entregado = exito + texto oscuro (pendiente confirmar). Siempre color + ícono + texto.
- Tipografía: `font-display` para títulos (provisional Trebuchet MS; Mister puede cambiarla en `index.css`), `font-sans` para el cuerpo.
- Accesibilidad: táctiles ≥ 44px (`min-h-11`), foco visible, contraste AA, blanco solo sobre azul.
- Logo: lupa amarilla con lápiz sobre cuadrado azul + "Encuéntralo" + lema. Guardar en `public/` cuando esté.
