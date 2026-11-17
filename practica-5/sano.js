const TASA_ISV = 0.15;
const LIMITE_FIADO = 500;
const DESCUENTO_POR_TIPO = new Map([
    ['frecuente', 0.05],
    ['mayorista', 0.1],
]);

function calcularSubtotal(items) {
    return items.reduce((suma, item) => suma + item.precio * item.cant, 0);
}

function calcularTotal(subtotal, tipoCliente) {
    const descuento = DESCUENTO_POR_TIPO.get(tipoCliente) ?? 0;
    const base = subtotal - subtotal * descuento;
    return base + base * TASA_ISV;
}

function cargarAFiado(cliente, total) {
    if (cliente.deuda + total > LIMITE_FIADO) {
        throw new Error('limite de fiado superado');
    }
    cliente.deuda = cliente.deuda + total;
}

function formatearTicket(cliente, total) {
    return 'Cliente: ' + cliente.nombre + ' | Total: L ' + total.toFixed(2);
}

function registrarVenta(cliente, items, tipoCliente, imprimir = console.log) {
    if (!cliente) {
        throw new Error('falta el cliente');
    }
    if (!items || items.length === 0) {
        throw new Error('no hay items en la venta');
    }

    const subtotal = calcularSubtotal(items);
    const total = calcularTotal(subtotal, tipoCliente);
    if (cliente.fiado) {
        cargarAFiado(cliente, total);
    }
    imprimir(formatearTicket(cliente, total));
    return total;
}

module.exports = { registrarVenta };
