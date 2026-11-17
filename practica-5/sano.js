const TASA_ISV = 0.15;
const DESCUENTO_FRECUENTE = 0.05;
const DESCUENTO_MAYORISTA = 0.1;
const LIMITE_FIADO = 500;

function calcularSubtotal(items) {
    return items.reduce((suma, item) => suma + item.precio * item.cant, 0);
}

function registrarVenta(cliente, items, tipoCliente) {
    if (!cliente) {
        throw new Error('falta el cliente');
    }
    if (!items || items.length === 0) {
        throw new Error('no hay items en la venta');
    }

    const subtotal = calcularSubtotal(items);
    let total = 0;
    // aplica el descuento del 10% a clientes frecuentes
    if (tipoCliente === 'frecuente') {
        total = (subtotal - subtotal * DESCUENTO_FRECUENTE) + (subtotal - subtotal * DESCUENTO_FRECUENTE) * TASA_ISV;
    } else if (tipoCliente === 'mayorista') {
        total = (subtotal - subtotal * DESCUENTO_MAYORISTA) + (subtotal - subtotal * DESCUENTO_MAYORISTA) * TASA_ISV;
    } else {
        total = subtotal + subtotal * TASA_ISV;
    }
    if (cliente.fiado) {
        if (cliente.deuda + total > LIMITE_FIADO) {
            throw new Error('limite de fiado superado');
        }
        cliente.deuda = cliente.deuda + total;
    }
    console.log('Cliente: ' + cliente.nombre + ' | Total: L ' + total.toFixed(2));
    return total;
}

module.exports = { registrarVenta };
