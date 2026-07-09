KEYWORDS = {
    'Hardware': [
        'pantalla', 'teclado', 'mouse', 'cpu', 'monitor', 'impresora',
        'disco', 'ram', 'laptop', 'pc', 'equipo', 'cable', 'cargador',
        'bateria', 'falla física', 'hardware', 'periferico', 'quemado',
        'no enciende', 'ruido', 'sobrecalienta', 'usb', 'hdmi',
    ],
    'Software': [
        'sistema', 'programa', 'aplicacion', 'app', 'windows', 'office',
        'excel', 'word', 'correo', 'outlook', 'navegador', 'driver',
        'actualizacion', 'instalacion', 'licencia', 'error', 'bug',
        'software', 'pantalla azul', 'logueo', 'inicio de sesion',
        'acceso', 'actualizar', 'instalar', 'configurar', 'slow',
        'congelado', 'no abre', 'no responde', 'crash',
    ],
    'Redes': [
        'internet', 'red', 'wifi', 'vpn', 'conexion', 'cable de red',
        'router', 'switch', 'dns', 'ip', 'intranet', 'acceso remoto',
        'lento', 'caida', 'desconectado', 'redes', 'conectividad',
        'ping', 'latencia', 'inalambrico', 'ethernet', 'firewall',
        'puerto', 'enlace', 'navegacion',
    ],
}

CATEGORIA_DEFAULT = 'Software'


def categorizar(titulo, descripcion=''):
    texto = f"{titulo} {descripcion}".lower()
    for categoria, palabras in KEYWORDS.items():
        for palabra in palabras:
            if palabra.lower() in texto:
                return categoria
    return CATEGORIA_DEFAULT
