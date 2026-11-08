const { calcularMora } = require('./fiados.js');
function assertEqual(actual, esperado) {
    if (actual !== esperado) {
        throw new Error(`esperado: ${esperado}, obtuve: ${actual}`);
    }
    return actual;
}

function assertThrows(fn) {
    try {
        fn();
    } catch (error) {
        return;
    }
    throw new Error(`esperaba que la función lanzara un error`);
}
let pasados = 0, fallidos = 0;

function test(nombre, fn) {
    try {
        fn();
        console.log(`✅ ${nombre}`);
        pasados++;
    } catch (error) {
        console.log(`❌ ${nombre}-> ${error.message}`);
        fallidos++;
    }
}

test('monto negativo', () => {
    const monto = 1000;
    const dias = 1;

    assertThrows(() => calcularMora(-monto, dias));
});

console.log(`\n${pasados} pasaron, ${fallidos} fallaron`);

