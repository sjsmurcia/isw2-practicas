# Tarea entre sesiones · Módulo 4 — Testing y TDD

**Estudiante:** Jessel Murcia
**Curso:** Ingeniería de Software II

---

## 1. Casos borde de `aplicarDescuento(total, porcentaje)`

| # | Nombre del test | Entrada | Esperado |
|---|---|---|---|
| 1 | `aplicarDescuento_con0Porciento_devuelveTotalIntacto` | `(100, 0)` | `100` |
| 2 | `aplicarDescuento_con100Porciento_devuelveCero` | `(100, 100)` | `0` |
| 3 | `aplicarDescuento_conPorcentajeNegativo_lanzaError` | `(100, -10)` | Error (no debe convertirse en recargo) |
| 4 | `aplicarDescuento_conPorcentajeMayorA100_lanzaError` | `(100, 150)` | Error (evita total negativo) |
| 5 | `aplicarDescuento_conTotalCeroONegativo` | `(0, 20)` / `(-50, 20)` | `0` sin error / Error claro |
| 6 | `aplicarDescuento_conEntradaNoNumerica_lanzaError` | `('abc', 10)` / `(100, null)` | Error claro, nunca `NaN` |

**Caso adicional a definir con el negocio:** redondeo. `(99.99, 33.33)` → `66.66` (2 decimales).

### Ejemplo en AAA

```js
test('aplica 100% de descuento → total 0', () => {
  // Arrange
  const total = 100;
  const porcentaje = 100;
  // Act
  const resultado = aplicarDescuento(total, porcentaje);
  // Assert
  assertEqual(resultado, 0);
});

test('porcentaje negativo → error', () => {
  let lanzo = false;
  try {
    aplicarDescuento(100, -10);
  } catch {
    lanzo = true;
  }
  assertEqual(lanzo, true);
});
```

---

## 2. Teoría: ¿qué falló en Knight Capital (1 de agosto de 2012)?

**Teoría:** no falló una sola cosa; faltó la red de seguridad completa. Cuatro fallas encadenadas:

1. **Código muerto:** la función "Power Peg" (2003) llevaba 9 años sin uso y nunca se borró.
2. **Bandera reciclada:** el código nuevo (RLP) reutilizó la misma bandera. En un servidor con código viejo, esa bandera reactivaba Power Peg. Ningún test verificaba el comportamiento de la bandera.
3. **Deploy manual:** el código se copió a mano a 8 servidores y uno quedó sin actualizar. No hubo verificación de versiones.
4. **Respuesta a ciegas:** sin monitoreo no se sabía qué servidor fallaba. Se revirtieron los 7 servidores correctos, dejando los 8 con el código viejo y multiplicando el daño.

**Resultado:** ~4 millones de órdenes erróneas, $460M perdidos en 45 minutos y quiebra de una empresa de 17 años. Sin hackers: puro proceso ausente.

**Falla más evitable:** reutilizar la bandera sin tests. Un test del comportamiento viejo habría fallado antes del deploy.

---

## 3. Relación entre criterios de aceptación y asserts

- El **criterio de aceptación** es la regla en lenguaje del cliente.
  Ej.: *"Si el porcentaje es mayor a 100, el sistema rechaza el descuento con un mensaje claro."*
- El **assert** es esa misma regla convertida en código ejecutable.

| Criterio (Gherkin) | Test (AAA) |
|---|---|
| **Dado** un total de 100 | Arrange |
| **Cuando** aplico 150% de descuento | Act |
| **Entonces** el sistema rechaza la operación | Assert |

**Conclusión:** cada criterio de aceptación es un test esperando a ser escrito. Si un criterio no puede convertirse en un assert, está mal definido (ej.: "¿vence hoy aplica mora?" debe decidirlo el negocio). En TDD, los criterios de la historia son los primeros tests en rojo.