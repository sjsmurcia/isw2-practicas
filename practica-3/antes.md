# Antes

## Problema

La clase tiene demasiadas responsabilidades.

```js
class GestorTienda {
    registrarVenta(items) {}
    calcularISV(total) {}
    imprimirTicket(venta) {}
    enviarWhatsApp(cliente) {}
    actualizarInventario(items) {}
    generarReporteMensual() {}
    respaldarBaseDeDatos() {}
}
```

Esta clase viola SRP porque tiene múltiples razones para cambiar.