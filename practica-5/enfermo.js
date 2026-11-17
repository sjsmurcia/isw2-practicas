function proc(c, items, t) {
    let x = 0;
    let tot = 0;
    if (c) {
        if (items && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                x = x + items[i].precio * items[i].cant;
            }
            // aplica el descuento del 10% a clientes frecuentes
            if (t === 'frecuente') {
                tot = (x - x * 0.05) + (x - x * 0.05) * 0.15;
            } else if (t === 'mayorista') {
                tot = (x - x * 0.1) + (x - x * 0.1) * 0.15;
            } else {
                tot = x + x * 0.15;
            }
            // tot = tot * 1.02; // recargo viejo, no borrar por si acaso
            if (c.fiado) {
                if (c.deuda + tot > 500) {
                    throw new Error('limite de fiado superado');
                } else {
                    c.deuda = c.deuda + tot;
                }
            }
            console.log('Cliente: ' + c.nombre + ' | Total: L ' + tot.toFixed(2));
            return tot;
        } else {
            throw new Error('no hay items en la venta');
        }
    } else {
        throw new Error('falta el cliente');
    }
}

module.exports = { proc };
