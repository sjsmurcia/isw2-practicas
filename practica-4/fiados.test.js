const { calcularMora } = require('./fiados.js');
function assertEqual(actual, esperado) {
    if (actual !== esperado) {
        throw new Error(`esperado: ${esperado}, obtuve: ${actual}`);
    }
    return actual;
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

test('prueba que pasa', () => {
    assertEqual(2 + 2, 4);

});
test('prueba que falla', () => {
    assertEqual(2 + 2, 5);

});

console.log(`\n${pasados} pasaron, ${fallidos} fallaron`);  

