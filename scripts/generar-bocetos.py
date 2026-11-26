# Entrada: nada · Proceso: dibuja wireframes simples (360x640) de las vistas principales
# Salida: docs/bocetos/*.svg (bocetos de baja fidelidad para la entrega del reto).
import os

SALIDA = os.path.join(os.path.dirname(__file__), '..', 'docs', 'bocetos')
os.makedirs(SALIDA, exist_ok=True)
GRIS, OSCURO, MARCA = '#cbd5e1', '#334155', '#1d4ed8'


def caja(x, y, w, h, relleno='none', borde=GRIS, r=8):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{relleno}" stroke="{borde}" stroke-width="2"/>'


def texto(x, y, t, tam=14, peso=400, color=OSCURO, ancla='start'):
    return f'<text x="{x}" y="{y}" font-family="Segoe UI, sans-serif" font-size="{tam}" font-weight="{peso}" fill="{color}" text-anchor="{ancla}">{t}</text>'


def linea(x, y, w):
    return f'<rect x="{x}" y="{y}" width="{w}" height="8" rx="4" fill="#e2e8f0"/>'


def boton(x, y, w, t, primario=True):
    fondo, color = (MARCA, '#ffffff') if primario else ('#ffffff', MARCA)
    return caja(x, y, w, 40, fondo, MARCA, 20) + texto(x + w / 2, y + 25, t, 14, 700, color, 'middle')


def barra(titulo):
    return caja(0, 0, 360, 56, '#f8fafc', GRIS, 0) + caja(16, 12, 32, 32, '#dbeafe', MARCA) + texto(58, 34, 'Encuéntralo', 16, 700, MARCA) + texto(344, 34, titulo, 12, 400, OSCURO, 'end')


def tarjeta(y, nombre, estado):
    return (caja(16, y, 328, 72) + caja(28, y + 12, 48, 48, '#dbeafe') + texto(90, y + 28, nombre, 14, 700)
            + texto(90, y + 46, 'Categoría · fecha', 12) + caja(250, y + 40, 82, 22, '#f1f5f9', GRIS, 11) + texto(291, y + 56, estado, 11, 600, OSCURO, 'middle'))


def guardar(nombre, titulo, cuerpo, nota):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 700" width="360" height="700">'
           f'<rect width="360" height="700" fill="#ffffff"/>{cuerpo}'
           f'<rect x="0" y="650" width="360" height="50" fill="#f1f5f9"/>{texto(180, 672, titulo, 13, 700, OSCURO, "middle")}'
           f'{texto(180, 690, nota, 10, 400, "#64748b", "middle")}</svg>')
    with open(os.path.join(SALIDA, nombre), 'w', encoding='utf-8') as f:
        f.write(svg)


guardar('0-login.svg', 'Login', caja(132, 90, 96, 96, '#dbeafe', MARCA, 24) + texto(180, 220, 'Encuéntralo', 24, 800, MARCA, 'middle')
        + texto(180, 246, 'Objetos perdidos · Técnico Salesiano', 12, 400, OSCURO, 'middle') + caja(40, 280, 280, 260)
        + boton(64, 300, 232, 'Continuar con Google', False) + texto(180, 368, 'o', 12, 400, OSCURO, 'middle')
        + caja(64, 384, 232, 36) + texto(76, 407, 'Correo electrónico', 12) + boton(64, 436, 232, 'Continuar')
        + texto(180, 520, '¿No tienes cuenta? Regístrate aquí', 12, 700, MARCA, 'middle'),
        'Correo verificado con código o Google')

guardar('1-inicio.svg', 'Inicio', barra('Inicio · Objetos') + caja(140, 80, 80, 80, '#dbeafe', MARCA, 20)
        + texto(180, 192, 'Encuéntralo', 26, 800, MARCA, 'middle') + texto(180, 216, 'Explicación breve del sistema', 13, 400, OSCURO, 'middle')
        + boton(40, 236, 280, 'Ver objetos') + boton(40, 286, 135, '¿Qué perdiste?', False) + boton(185, 286, 135, 'Reportar', False)
        + texto(180, 354, 'Estados: Disponible · Reclamado · Entregado', 12, 600, OSCURO, 'middle')
        + ''.join(caja(16, 376 + i * 86, 328, 74) + caja(28, 390 + i * 86, 40, 40, '#dbeafe') + texto(80, 404 + i * 86, f'{i + 1}. {p}', 14, 700) + linea(80, 414 + i * 86, 200)
                  for i, p in enumerate(['Busca', 'Revisa', 'Reclama'])),
        'Identidad, explicación, menú y accesos')

guardar('2-listado.svg', 'Listado de objetos', barra('Inicio · Objetos') + texto(16, 92, 'Objetos encontrados', 20, 800) + texto(344, 92, '25 objetos', 12, 600, OSCURO, 'end')
        + caja(16, 108, 328, 40) + texto(28, 133, '🔍 Buscar (Ej. chompa, balón)', 13) + caja(16, 156, 160, 36) + texto(28, 179, 'Categoría ▾', 13)
        + caja(184, 156, 160, 36) + texto(196, 179, 'Estado ▾', 13)
        + tarjeta(206, 'Chompa azul con capucha', 'Disponible') + tarjeta(288, 'Cartuchera roja', 'Disponible')
        + tarjeta(370, 'Calculadora científica', 'Reclamado') + tarjeta(452, 'Balón de fútbol', 'Entregado')
        + caja(196, 580, 148, 44, MARCA, MARCA, 22) + texto(270, 607, '+ Reportar objeto', 13, 700, '#ffffff', 'middle'),
        'Tarjetas: nombre, fecha, categoría y estado + búsqueda')

guardar('3-detalle.svg', 'Detalle', barra('') + texto(16, 88, '← Volver al listado', 13, 600, MARCA)
        + caja(16, 104, 120, 120, '#dbeafe', MARCA, 16) + texto(76, 170, 'Foto o ícono', 11, 400, OSCURO, 'middle')
        + texto(150, 130, 'Chompa azul con capucha', 15, 800) + caja(150, 142, 90, 22, '#f1f5f9', GRIS, 11) + texto(195, 158, 'Disponible', 11, 600, OSCURO, 'middle')
        + ''.join(texto(16, 260 + i * 34, f'{c}:', 13, 700) + linea(120, 252 + i * 34, 200) for i, c in enumerate(['Categoría', 'Lugar', 'Fecha', 'Descripción']))
        + boton(16, 420, 328, 'Reclamar') + texto(180, 482, 'Si no está Disponible: botón desactivado y la razón', 11, 400, '#64748b', 'middle'),
        'Información completa, imagen o ícono y «Reclamar»')

guardar('4-formulario.svg', 'Formulario de reclamo', barra('') + texto(16, 92, 'Reclamar: Chompa azul', 20, 800)
        + ''.join(texto(16, 130 + i * 92, c, 13, 700) + caja(16, 140 + i * 92, 328, 40) + texto(16, 198 + i * 92, e, 11, 400, '#e11d48')
                  for i, (c, e) in enumerate([('Nombre *', 'Escribe tu nombre.'), ('Curso *', 'Escribe tu curso.'), ('Seña particular * (mín. 10)', 'Faltan 4 caracteres (6 / 10).')]))
        + boton(16, 420, 160, 'Enviar reclamo') + boton(184, 420, 160, 'Cancelar', False),
        'Campos obligatorios con mensajes claros')

guardar('5-confirmacion.svg', 'Confirmación', barra('') + f'<circle cx="180" cy="200" r="48" fill="#d1fae5" stroke="#10b981" stroke-width="3"/>'
        + texto(180, 214, '✓', 40, 800, '#065f46', 'middle') + texto(180, 290, '¡Reclamo registrado!', 20, 800, OSCURO, 'middle')
        + texto(180, 316, 'El objeto ahora está Reclamado.', 13, 400, OSCURO, 'middle') + boton(60, 350, 240, 'Volver al listado')
        + texto(180, 430, 'Si falla: mensaje de error y la misma opción', 11, 400, '#64748b', 'middle'),
        'Éxito o error y opción para volver')

guardar('6-inspector.svg', 'Modo inspector + Radar (profesores)', barra('') + texto(16, 92, 'Modo inspector', 20, 800)
        + ''.join(caja(16 + i * 112, 108, 104, 64, f, GRIS) + texto(28 + i * 112, 138, n, 20, 800) + texto(28 + i * 112, 158, e, 11)
                  for i, (n, e, f) in enumerate([('19', 'Disponible', '#dbeafe'), ('3', 'Reclamado', '#fef3c7'), ('4', 'Entregado', '#d1fae5')]))
        + tarjeta(188, 'Calculadora científica', 'Reclamado') + boton(184, 268, 160, 'Marcar entregado')
        + texto(16, 342, 'Radar de inspección', 16, 800) + caja(16, 354, 328, 56, '#fffbeb', '#f59e0b') + texto(28, 378, '2 objetos estancados (> 5 días)', 13, 700)
        + ''.join(texto(16, 444 + i * 34, l, 12) + f'<rect x="130" y="434" width="{w}" height="12" rx="6" fill="{MARCA}" transform="translate(0 {i * 34})"/>'
                  for i, (l, w) in enumerate([('Patio central', 200), ('Cancha', 140), ('Laboratorio 2', 100)])),
        'Conteo, entregar y Radar')
print('Bocetos generados en docs/bocetos/')
