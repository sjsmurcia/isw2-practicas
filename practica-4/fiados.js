function calcularMora(monto, diasVencidos) {
    if (monto < 0) {
        throw new Error('el monto no puede ser negativo');
    }
    if(typeof diasVencidos !== 'numnber'){
        throw new Error('los dias vencidos deben ser un numero');
    }
    return 0;

}


module.exports = { calcularMora };   
