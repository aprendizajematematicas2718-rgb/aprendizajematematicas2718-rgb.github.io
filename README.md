# Fundamento Matemático — Landing Page (v2, editorial)

Landing page de una sola página inspirada en la sensación editorial de
[grounded2026.com](https://www.grounded2026.com/): fondo blanco, tipografía
enorme, capas con profundidad al bajar, reloj en vivo, contadores animados,
proceso numerado y una sección de trayectoria al estilo "reconocimientos".

Todo el texto está en español y respeta la paleta de marca definida en el
brief (azul `#2563EB`, violeta `#7C3AED`, verde `#16A34A`, naranja `#F97316`,
rojo `#EF4444`) sobre fondo blanco / `slate-50`.

## Qué incluye

- **Precarga** con contador de 0 a 100 % antes de revelar la página.
- **Barra de progreso de lectura** fija en la parte superior.
- **Reloj en vivo de Bogotá** en el header y en el footer (hora real,
  actualizada cada segundo, con indicador "en vivo").
- **Hero** con titular enorme en Fraunces y un cúmulo de figuras
  geométricas en capas, cada una con su propia velocidad de scroll
  (parallax) para dar sensación de profundidad.
- **Manifiesto** con revelado de texto línea por línea al bajar.
- **Cifras animadas** (3 competencias, 25 preguntas, 4 niveles) que
  cuentan hacia arriba cuando entran en pantalla.
- **Proceso numerado** (01 / 02 / 03) con números en contorno, al estilo
  del sitio de referencia.
- **Laboratorio visual interactivo**: tangram arrastrable, graficador de
  f(x) = ax² + bx + c en vivo, y mapa conceptual clicable — las tres demos
  funcionan de verdad, no son solo ilustrativas.
- **Trayectoria**: en vez de premios inventados (el sitio de referencia es
  un concepto ficticio y lo dice explícitamente — "all awards fictional"),
  esta sección usa la trayectoria real que compartiste: Rector y docente
  de Matemáticas en Liceo Campo David, y Jefe del Departamento de
  Matemáticas / Coordinador Académico en Gimnasio Campestre Marie Curie.
- **Contacto**: formulario listo para conectar a Formspree (ver abajo).

## Sobre la verificación

Validé el código de forma rigurosa dentro de este entorno: sintaxis JS,
balance de etiquetas HTML, balance de llaves CSS, tipografía fluida con
`clamp()` para que nada se desborde en móvil, `overflow-x: hidden` +
`overflow: hidden` por sección para contener las capas de parallax, y dos
redes de seguridad:

1. Si JavaScript falla a mitad de la inicialización, todo el contenido se
   vuelve visible igualmente (nunca queda oculto).
2. Si JavaScript está desactivado del todo, la precarga y las animaciones
   de aparición se desactivan por completo vía `<noscript>` y no afectan
   la visibilidad del contenido.

También respeta `prefers-reduced-motion`: si el sistema del visitante pide
menos movimiento, se desactivan el parallax y las animaciones de entrada.

**Lo que no pude hacer**: este entorno no tiene un navegador con
interfaz gráfica disponible (lo intenté vía `apt` y no hay paquete
funcional), así que no pude tomarle capturas de pantalla reales ni
verificar visualmente las animaciones en movimiento. Lo que te entrego
es código cuidadosamente revisado a nivel estructural, no una captura
verificada. Ábrelo y cuéntame qué ajustar — con tu feedback (o capturas
tuyas) puedo iterar directamente.

## Cómo verlo localmente

```bash
python3 -m http.server 8000
# visita http://localhost:8000
```

## Publicar en GitHub Pages

1. Sube este contenido a la raíz del repositorio (o a `docs/`).
2. **Settings → Pages → Source**, elige la rama/carpeta.
3. Quedará en `https://<usuario>.github.io/<repo>/`.

## Conectar el formulario de contacto

El formulario apunta a `https://formspree.io/f/TU_ID_DE_FORMSPREE` — es un
marcador de posición. Crea una cuenta gratuita en
[formspree.io](https://formspree.io), crea un formulario que envíe a
`aprendizajematematicas2718@gmail.com`, y reemplaza `TU_ID_DE_FORMSPREE`
en `index.html` por el ID real que te den.

## Nota técnica sobre Tailwind

Esta versión ya no usa Tailwind: al pasar a un sistema tipográfico y de
capas tan específico, fue más simple y ligero escribir CSS a medida
(con variables) que pelear contra las utilidades. Si más adelante quieres
retomar Tailwind para nuevas secciones, se puede reintroducir sin
conflicto.

## Próximos pasos sugeridos

Quedan pendientes del brief original: paquetes de diagnóstico Icfes
(tarjetas de precios), herramientas complementarias, y testimonios reales
de estudiantes/acudientes (no incluí testimonios inventados a propósito —
mejor esperar a tener citas reales de tus estudiantes). Puedo construir
cualquiera de estas secciones siguiendo el mismo sistema de diseño.
