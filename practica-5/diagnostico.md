# Diagnóstico · Práctica 5 — Clínica de código

**Estudiante:** Jessel Murcia
**Paciente:** `proc(c, items, t)` en [enfermo.js](./enfermo.js): registra una venta de pulpería (subtotal, descuento por tipo de cliente, ISV, fiado y ticket).
**Resultado:** `registrarVenta(cliente, items, tipoCliente)` en [sano.js](./sano.js).

Los principios se citan por su número en el decálogo del curso (M1).

## Problemas encontrados y refactor aplicado

| # | Problema en `enfermo.js` | Principio violado | Refactor aplicado en `sano.js` |
|---|---|---|---|
| 1 | Nombres crípticos: `proc`, `c`, `t`, `x`, `tot` | **1** · el código se escribe para humanos | Renombrar a `registrarVenta`, `cliente`, `tipoCliente`, `subtotal`, `total` |
| 2 | Números mágicos: `0.15`, `0.05`, `0.1`, `500` | **1** y **4** · el número no dice qué es y está repetido | Constantes con nombre: `TASA_ISV`, `LIMITE_FIADO`, `DESCUENTO_POR_TIPO` |
| 3 | Código muerto comentado ("no borrar por si acaso") | **1** · confunde al lector; la historia ya la guarda Git | Borrado |
| 4 | Anidamiento de 4 niveles de `if` | **1** · el camino feliz queda enterrado | Early returns: primero los casos inválidos |
| 5 | La fórmula del ISV escrita tres veces | **4** · DRY: una regla de negocio en un solo lugar | `calcularTotal` aplica el ISV una sola vez |
| 6 | Comentario que miente: dice 10 % y el código aplica 5 % | **3** · comentá el porqué, no el qué | Comentario eliminado; el valor vive en `DESCUENTO_POR_TIPO` |
| 7 | Función dios: valida, suma, descuenta, cobra ISV, lleva el fiado e imprime | **2** · una función, una responsabilidad (SRP) | `calcularSubtotal`, `calcularTotal`, `cargarAFiado`, `formatearTicket` |
| 8 | `if/else` que crece con cada tipo de cliente (viola OCP) | **9** · diseñá para el cambio | Tabla `DESCUENTO_POR_TIPO`: un tipo nuevo es una fila nueva |
| 9 | `console.log` soldado dentro del cálculo (viola DIP) | **9** · el negocio no conoce los detalles | La impresión se inyecta: `registrarVenta(..., imprimir = console.log)` |

`DESCUENTO_POR_TIPO` es un `Map` y no un objeto literal porque un objeto devolvería propiedades heredadas: un tipo de cliente llamado `constructor` recibiría un "descuento" que no existe. Hay un test para ese caso.

## Principios aplicados en el proceso

| Principio | Cómo se aplicó |
|---|---|
| **6** · sin red de seguridad no hay cambio | [enfermo.test.js](./enfermo.test.js) se escribió y se commiteó antes de tocar el código |
| **7** · pasos pequeños | Un commit por paso, con la suite en verde antes de cada commit |
| **5** · KISS y YAGNI | Funciones y una tabla; sin clases, estrategias ni capas que nadie pidió |
| **8** · todo cambio entra por revisión | El trabajo entra a `main` por pull request |

## Historia del refactor

| Paso | Commit |
|---|---|
| Paciente | `feat(practica-5): agregar enfermo.js con problemas sembrados` |
| Red de tests | `test(practica-5): red de tests del comportamiento actual` |
| Punto de partida | `chore(practica-5): copiar enfermo.js a sano.js como punto de partida` |
| Problema 1 | `refactor(practica-5): renombrar proc y variables a nombres del dominio` |
| Problema 2 | `refactor(practica-5): extraer numeros magicos a constantes con nombre` |
| Problema 3 | `refactor(practica-5): borrar codigo muerto del recargo viejo` |
| Problema 4 | `refactor(practica-5): aplanar anidamiento con early returns` |
| Problema 7 (subtotal) | `refactor(practica-5): extraer calcularSubtotal` |
| Problemas 5 a 9 | `refactor(practica-5): separar calculo, fiado y ticket en funciones propias` |
| Test de la inyección | `test(practica-5): cubrir la impresion inyectada del ticket` |

Los problemas 5 a 9 quedaron en un solo commit. Lo correcto habría sido un commit por cada uno.

## Tests antes y después

Se corren con `node practica-5/enfermo.test.js`.

- **Antes:** 17 tests sobre `enfermo.js`, en verde antes de empezar el refactor.
- **Después:** los mismos 17 tests corren sobre `enfermo.js` y sobre `sano.js`, más un test de la impresión inyectada: 35 en verde.

Los tests fijan el comportamiento, no lo que "debería" hacer: por ejemplo, el total devuelto no se redondea (`9.99` da `11.4885`) y así se dejó, porque cambiarlo sería corregir una regla y no refactorizar.

## Diferencia conocida

Con una lista de items, que es el uso real, las dos versiones dan lo mismo en los 17 tests.

El paso de early returns cambió la guarda de `items` sin querer: `enfermo.js` rechaza con "no hay items en la venta" cualquier valor cuya longitud no sea mayor que 0, y `sano.js` solo rechaza una lista ausente o vacía. Si `items` no es una lista (por ejemplo un objeto), `enfermo.js` da ese error y `sano.js` falla con un `TypeError` al sumar. Ningún test cubre ese caso, por eso el paso quedó en verde: la red solo protege lo que prueba.
