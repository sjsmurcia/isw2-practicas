function calcularMora(monto, diasVencidos) {
    if (monto < 0) {
        throw new Error('el monto no puede ser negativo');
    }
    if(typeof diasVencidos !== 'number' || Number.isNaN(diasVencidos)){
        throw new Error('los dias vencidos deben ser un numero');
    }
    if(diasVencidos >0)
    {
        return monto * 0.05;
    }else{
        return 0;
    }

}


module.exports = { calcularMora };   
