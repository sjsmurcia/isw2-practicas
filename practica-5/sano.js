const TASA_ISV = 0.15;
const DESCUENTO_FRECUENTE = 0.05;
const DESCUENTO_MAYORISTA = 0.1;
const LIMITE_FIADO = 500;

function registrarVenta(cliente, items, tipoCliente) {
    let subtotal = 0;
    let total = 0;
    if (cliente) {
        if (items && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                subtotal = subtotal + items[i].precio * items[i].cant;
            }
            // aplica el descuento del 10% a clientes frecuentes
            if (tipoCliente === 'frecuente') {
                total = (subtotal - subtotal * DESCUENTO_FRECUENTE) + (subtotal - subtotal * DESCUENTO_FRECUENTE) * TASA_ISV;
            } else if (tipoCliente === 'mayorista') {
                total = (subtotal - subtotal * DESCUENTO_MAYORISTA) + (subtotal - subtotal * DESCUENTO_MAYORISTA) * TASA_ISV;
            } else {
                total = subtotal + subtotal * TASA_ISV;
            }
            // total = total * 1.02; // recargo viejo, no borrar por si acaso
            if (cliente.fiado) {
                if (cliente.deuda + total > 500) {
                    throw new Error('limite de fiado superado');
                } else {
                    cliente.deuda = cliente.deuda + total;
                }
            }
            console.log('Cliente: ' + cliente.nombre + ' | Total: L ' + total.toFixed(2));
            return total;
        } else {
            throw new Error('no hay items en la venta');
        }
    } else {
        throw new Error('falta el cliente');
    }
}

module.exports = { registrarVenta };
