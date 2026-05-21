# Contribuir a Martina

¡Gracias por tu interés en contribuir! Martina es un proyecto personal de cuentos de ajedrez para mi hija, pero las contribuciones que mejoren el sitio son bienvenidas.

## Antes de empezar

- **Cuentos nuevos**: si quieres escribir un cuento, abre un [issue de sugerencia](https://github.com/raestrada/martina/issues/new?template=feature_request.md) primero para conversarlo.
- **Correcciones**: erratas, bugs, mejoras de CSS/JS son bienvenidas directamente como PR.
- **Respeta la licencia**: el contenido (cuentos, imágenes, personajes) está bajo CC BY-NC 4.0. El código es MIT.

## Flujo de contribución

1. Haz fork del repositorio
2. Crea una rama: `git checkout -b mi-mejora`
3. Haz tus cambios siguiendo las guías de [AGENTS.md](AGENTS.md)
4. Prueba localmente: `python3 -m http.server`
5. Commitea con mensajes claros
6. Abre un Pull Request

## Guías de estilo

- HTML estático, CSS vanilla, JS sin frameworks
- Tipografía: Nunito (títulos), Quicksand (cuerpo)
- Colores: ver `css/style.css` (`:root` variables)
- Cuentos: seguir estructura de `AGENTS.md`
- Móvil primero, probar en vista responsive
- Imágenes en `assets/img/`, nombrarlas descriptivamente

## Código de conducta

Todos los participantes deben seguir nuestro [Código de Conducta](CODE_OF_CONDUCT.md).

## ¿Tienes dudas?

Abre un [issue](https://github.com/raestrada/martina/issues) y conversemos.
