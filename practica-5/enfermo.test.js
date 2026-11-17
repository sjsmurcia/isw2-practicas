const enfermo = require('./enfermo.js');
const sano = require('./sano.js');

function assertEqual(actual, esperado) {
    if (actual !== esperado) {
        throw new Error(`esperado: ${esperado}, obtuve: ${actual}`);
    }
}

function assertThrows(fn, mensajeEsperado) {
    try {
        fn();
    } catch (error) {
        assertEqual(error.message, mensajeEsperado);
        return;
    }
    throw new Error('esperaba que la función lanzara un error');
}

let pasados = 0, fallidos = 0;

function test(nombre, fn) {
    try {
        fn();
        console.log(`✅ ${nombre}`);
        pasados++;
    } catch (error) {
        console.log(`❌ ${nombre} -> ${error.message}`);
        fallidos++;
    }
}

// La función imprime el ticket con console.log: se captura para poder verificarlo
function capturarTicket(fn) {
    const original = console.log;
    const ticket = [];
    console.log = (linea) => ticket.push(linea);
    try {
        return { total: fn(), ticket };
    } finally {
        console.log = original;
    }
}

const clienteContado = () => ({ nombre: 'Olga', fiado: false, deuda: 0 });
const clienteFiado = (deuda) => ({ nombre: 'Juan', fiado: true, deuda });
const cienLempiras = () => [{ precio: 50, cant: 2 }];

function correrSuite(nombreSuite, registrarVenta) {
    const vender = (cliente, items, tipoCliente) =>
        capturarTicket(() => registrarVenta(cliente, items, tipoCliente));

    console.log(`\n${nombreSuite}`);

    test('cliente normal: 100 + 15% ISV -> 115', () => {
        const cliente = clienteContado();
        const items = cienLempiras();

        const { total } = vender(cliente, items, 'normal');

        assertEqual(total, 115);
    });

    test('cliente frecuente: 5% de descuento antes del ISV -> 109.25', () => {
        const cliente = clienteContado();
        const items = cienLempiras();

        const { total } = vender(cliente, items, 'frecuente');

        assertEqual(total, 109.25);
    });

    test('cliente mayorista: 10% de descuento antes del ISV -> 103.5', () => {
        const cliente = clienteContado();
        const items = cienLempiras();

        const { total } = vender(cliente, items, 'mayorista');

        assertEqual(total, 103.5);
    });

    test('tipo de cliente desconocido: sin descuento -> 115', () => {
        const cliente = clienteContado();
        const items = cienLempiras();

        const { total } = vender(cliente, items, 'vip');

        assertEqual(total, 115);
    });

    test("tipo 'constructor' (nombre heredado de Object): sin descuento -> 115", () => {
        const cliente = clienteContado();
        const items = cienLempiras();

        const { total } = vender(cliente, items, 'constructor');

        assertEqual(total, 115);
    });

    test('varios items: suma precio por cantidad -> 97.75', () => {
        const cliente = clienteContado();
        const items = [{ precio: 30, cant: 2 }, { precio: 25, cant: 1 }];

        const { total } = vender(cliente, items, 'normal');

        assertEqual(total, 97.75);
    });

    test('el total devuelto no se redondea: 9.99 -> 11.4885', () => {
        const cliente = clienteContado();
        const items = [{ precio: 9.99, cant: 1 }];

        const { total } = vender(cliente, items, 'normal');

        assertEqual(total, 11.4885);
    });

    test('imprime una linea de ticket con cliente y total a 2 decimales', () => {
        const cliente = clienteContado();
        const items = [{ precio: 9.99, cant: 1 }];

        const { ticket } = vender(cliente, items, 'normal');

        assertEqual(ticket.length, 1);
        assertEqual(ticket[0], 'Cliente: Olga | Total: L 11.49');
    });

    test('sin cliente -> error', () => {
        const items = cienLempiras();

        assertThrows(() => vender(null, items, 'normal'), 'falta el cliente');
    });

    test('sin cliente y sin items: primero reclama el cliente', () => {
        assertThrows(() => vender(null, [], 'normal'), 'falta el cliente');
    });

    test('lista de items vacia -> error', () => {
        const cliente = clienteContado();

        assertThrows(() => vender(cliente, [], 'normal'), 'no hay items en la venta');
    });

    test('sin lista de items -> error', () => {
        const cliente = clienteContado();

        assertThrows(() => vender(cliente, null, 'normal'), 'no hay items en la venta');
    });

    test('cliente de contado: la deuda no cambia', () => {
        const cliente = clienteContado();
        const items = cienLempiras();

        vender(cliente, items, 'normal');

        assertEqual(cliente.deuda, 0);
    });

    test('fiado dentro del limite: la deuda sube el total', () => {
        const cliente = clienteFiado(100);
        const items = cienLempiras();

        vender(cliente, items, 'normal');

        assertEqual(cliente.deuda, 215);
    });

    test('fiado que llega justo a 500: se permite', () => {
        const cliente = clienteFiado(385);
        const items = cienLempiras();

        vender(cliente, items, 'normal');

        assertEqual(cliente.deuda, 500);
    });

    test('fiado que pasa de 500 -> error', () => {
        const cliente = clienteFiado(386);
        const items = cienLempiras();

        assertThrows(() => vender(cliente, items, 'normal'), 'limite de fiado superado');
    });

    test('fiado rechazado: no cambia la deuda ni imprime ticket', () => {
        const cliente = clienteFiado(386);
        const items = cienLempiras();

        const { ticket } = capturarTicket(() => {
            try {
                registrarVenta(cliente, items, 'normal');
            } catch (error) {
                // el error ya lo verifica el test anterior
            }
        });

        assertEqual(cliente.deuda, 386);
        assertEqual(ticket.length, 0);
    });
}

correrSuite('enfermo.js', enfermo.proc);
correrSuite('sano.js', sano.registrarVenta);

console.log(`\n${pasados} pasaron, ${fallidos} fallaron`);
if (fallidos > 0) {
    process.exitCode = 1;
}
