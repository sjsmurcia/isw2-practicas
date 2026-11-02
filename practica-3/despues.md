# Después

## Refactor

```js
class VentaService {
    registrarVenta(items) {}
    calcularISV(total) {}
}

class TicketService {
    imprimirTicket(venta) {}
}

class NotificacionService {
    enviarWhatsApp(cliente) {}
}

class InventarioService {
    actualizarInventario(items) {}
}

class ReporteService {
    generarReporteMensual() {}
}
```

Cada clase tiene una responsabilidad específica.