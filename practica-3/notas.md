# Notas de la práctica 3

## Problema identificado

La clase original concentraba demasiadas responsabilidades:
- Ventas
- Inventario
- Reportes
- Notificaciones

Esto dificultaba el mantenimiento y aumentaba el acoplamiento.

## Principios aplicados

### SRP (Single Responsibility Principle)
Se dividió la clase original en varias clases más pequeñas.
Cada una tiene una única responsabilidad y una sola razón para cambiar.

### OCP (Open/Closed Principle)
El diseño permite agregar nuevas funcionalidades creando nuevas clases o componentes sin modificar las existentes.

### KISS
Se eligió una solución simple y fácil de entender.
No se agregaron patrones ni capas innecesarias.

### YAGNI
Solo se implementó lo necesario para el caso actual.
No se añadieron características pensadas para futuros escenarios hipotéticos.

## Conclusión

La versión refactorizada tiene menor acoplamiento, mayor cohesión y resulta más fácil de mantener y extender.
