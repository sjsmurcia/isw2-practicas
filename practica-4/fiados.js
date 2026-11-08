function calcularMora(monto, diasVencidos) {
    if (monto < 0) {
        throw new Error('el monto no puede ser negativo');
    }
    return 0;
}


module.exports = { calcularMora };   
