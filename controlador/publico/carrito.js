// Declaraciones de constantes para los elementos del DOM
const DIV_CARRITO = document.getElementById('carritoDeCompras'); // Contenedor del carrito de compras
const DIV_METODO_COMPRA = document.getElementById('compraDatos'); // Contenedor de los datos del método de compra
const TEXT_CANTIDAD_ZAPATO = document.getElementById('cantidadZapato'); // Elemento para mostrar la cantidad de zapatos
const TEXT_PRECIO_TOTAL = document.getElementById('totalPedido'); // Elemento para mostrar el precio total del pedido
const CANT_INPUT = document.getElementById('cant'); // Input para la cantidad

const TABLE_BODY = document.getElementById('tableBody'); // Cuerpo de la tabla del carrito de compras

// Obtener elementos del DOM utilizando los IDs declarados
const NOMBRE_INPUT = document.getElementById('nombreInput'); // Input para el nombre del cliente
const APELLIDOS_INPUT = document.getElementById('apellidosInput'); // Input para los apellidos del cliente
const DIRECCION = document.getElementById('direccion'); // Input para la dirección del cliente
const CORREO_INPUT = document.getElementById('correoInput'); // Input para el correo electrónico del cliente
const TELEFONO_INPUT = document.getElementById('telefonoInput'); // Input para el teléfono del cliente
const TOTAL_PAGAR = document.getElementById('totalPagar'); // Elemento para mostrar el total a pagar

const CLIENTES_API = 'services/publica/cliente.php'; // URL de la API de clientes
const ZAPATOS_API = 'services/publica/zapatos.php'; // URL de la API de zapatos
const PEDIDOS_API = 'services/publica/pedidos.php'; // URL de la API de pedidos

// Declaración de constantes para el modal, el título del modal y el formulario de comentario.
const DATA_MODAL = new bootstrap.Modal('#dataModal'), // Instancia del modal de Bootstrap
    MODAL_TITLE = document.getElementById('modalTitle'); // Título del modal

// Evento que se dispara cuando el documento HTML ha cargado completamente
document.addEventListener('DOMContentLoaded', async () => {
    // Llama a una función para cargar el encabezado y el pie de página del documento
    loadTemplate();
    // Visualización inicial del contenido: muestra el carrito de compras y oculta los detalles de compra
    DIV_CARRITO.classList.remove('d-none');
    DIV_METODO_COMPRA.classList.add('d-none');
    // Llama a la función para llenar la tabla con los datos del carrito
    fillTable();
});

let total = 0; // Variable para almacenar el total del pedido

// Función para llenar la tabla con los datos del carrito
const fillTable = async () => {
    // Se inicializa el contenido de la tabla.
    TABLE_BODY.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CARRITO_API, 'readAll');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        let cant = 0;
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <tr class="table-row">
                <td>
                    <img src="${SERVER_URL}helpers/images/zapatos/${row.foto_detalle_zapato}" alt="${row.nombre_zapato}"
                        height="50">
                </td>
                <td>${row.nombre_zapato}</td>
                <td>${row.num_talla}</td>
                <td>${row.nombre_color}</td>
                <td>${row.precio_unitario_zapato}</td>
                <td>${row.cantidad_pedido}</td>
                <td>${row.precio_total}</td>
                <td>
                    <button onclick="actualizar(${row.id_detalles_pedido}, ${row.cantidad_pedido}, ${row.id_detalle_zapato})">
                        <img src="../../recursos/imagenes/icons/notebook.svg"
                            alt="Icono de actualizar" class="imgBasura">
                    </button>
                </td>
                <td>
                    <button onclick="eliminar(${row.id_detalles_pedido}, ${row.cantidad_pedido})">
                        <img src="../../recursos/imagenes/basura.svg" alt="Icono de basura"
                            class="imgBasura">
                    </button>
                </td>
            </tr>
            `;
            total += parseFloat(row.precio_total); // Suma el precio total del pedido
            cant += 1; // Incrementa la cantidad de zapatos

            idPedidoCliente = row.id_pedido_cliente; // Asigna el ID del pedido del cliente
        });

        // Muestra el precio total y la cantidad de zapatos en el carrito
        TEXT_PRECIO_TOTAL.innerHTML = `<b>Total:</b> $${total}`;
        TEXT_CANTIDAD_ZAPATO.innerHTML = `Tienes ${cant} zapatos en tu carrito`;

        // Se muestra un mensaje de acuerdo con el resultado.
        if (DATA.dataset == 0) {
            await sweetAlert(1, DATA.message, true);
        }
    } else {
        const DATA0 = await fetchData(CARRITO_API, 'readAllCarrito');

        if (DATA0.status) {
            TEXT_PRECIO_TOTAL.innerHTML = `<b>Total:</b> $${0}`;
            TEXT_CANTIDAD_ZAPATO.innerHTML = `Tienes ${0} zapatos en tu carrito`;
        }
        else {
            const FORM1 = new FormData();
            FORM1.append('estado_pedido', 4);
            const DATA2 = await fetchData(CARRITO_API, 'createRow', FORM1);

            if (DATA2.status) {
                TEXT_PRECIO_TOTAL.innerHTML = `<b>Total:</b> $${0}`;
            } else {
                sweetAlert(4, DATA.error, true);
                TEXT_PRECIO_TOTAL.innerHTML = `<b>Total:</b> $${0}`;
                TEXT_CANTIDAD_ZAPATO.innerHTML = `Debes de iniciar sesión para visualizar los productos del carrito`;
            }

            if (DATA2 === 'Acceso denegado') {
                await sweetAlert(4, 'Debe de iniciar sesión', true);
                location.href = 'index.html';
            }
        }
    }
}

let idDetalle; // Variable para almacenar el ID del detalle del pedido
let idShoes; // Variable para almacenar el ID del zapato
let cantdad;

// Función para actualizar la cantidad de un producto en el carrito
const actualizar = async (id, cantidad, idZapato) => {
    idDetalle = id;
    idShoes = idZapato;
    cantdad = cantidad;
    document.getElementById('cantidadNew').value = cantidad; // Asigna la cantidad al input
    const FORM2 = new FormData();
    FORM2.append('id_detalle_zapato', idShoes);
    FORM2.append('cantidadOld', cantidadOld);
    // Petición para guardar los datos del formulario.

    const DATA2 = await fetchData(ZAPATOS_API, 'validationCantidad', FORM2);
    if (DATA2.status) {
        const ROW2 = DATA2.dataset;
        let cantidadStock = ROW2.cantidad_zapato;
        CANT_INPUT.max = cantidadStock;
        // Muestra el modal y resetea el formulario de comentario.
        makeFieldsReadOnly(true);
        DATA_MODAL.show();
    }
    else {
        sweetAlert(4, DATA2.error, true);
    }
}

// Función para realizar la compra
const comprar = async () => {
    if (total === 0) {
        sweetAlert(3, 'No hay productos en el carrito', false);
    }
    else {
        const DATA0 = await fetchData(CARRITO_API, 'leerRepartidor');
        if (DATA0.status) {
            const ROW0 = DATA0.dataset;
            const idRepartidor = ROW0.id_trabajador;
            // 1. Obtener la fecha actual
            const today = new Date();

            // 2. Formatear la fecha en 'YYYY-MM-DD'
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0, por eso se suma 1
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            // 3. Crear el objeto FormData y agregar la fecha
            const FORM1 = new FormData();
            FORM1.append('fecha_de_inicio', formattedDate);
            FORM1.append('id_costo_de_envio_por_departamento', idPrecio);
            FORM1.append('estado_pedido', 1);
            FORM1.append('id_pedido_cliente', idPedidoCliente);
            FORM1.append('id_repartidor', idRepartidor);
            FORM1.append('precio_total', total);

            // 4. Realizar la petición para update
            const DATA = await fetchData(CARRITO_API, 'update', FORM1);

            if (DATA.status) {
                await paga(); // Muestra la notificación de éxito
                fillTable(); // Vuelve a cargar la tabla
                generarReporte(); // Genera el reporte de la compra
            } else {
                if (DATA === 'Acceso denegado') {
                    await sweetAlert(3, 'Debes de iniciar sesión', false);
                    location.href = 'index.html';
                }
                else {
                    sweetAlert(3, DATA.error, false);

                }
            }
        }
        else {
            if (DATA0 === 'Acceso denegado') {
                await sweetAlert(3, 'Debes de iniciar sesión', false);
                location.href = 'index.html';
            }
            else {
                sweetAlert(3, DATA0.error, false);

            }
        }
    }
}

const generarReporte = async () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/public/factura.php`);

    // Realiza la llamada para generar y guardar el PDF
    const response = await fetch(PATH.href);
    const result = await response.json();

    if (result.status) {
        // Si el PDF se generó y guardó correctamente, abrir el PDF en una nueva ventana
        window.open(result.rutaPDF);

        // Enviar el correo con la ruta del PDF
        await mandarCorreo(result.rutaPDF);
    } else {
        sweetAlert(3, result.message, false);
    }
}

const mandarCorreo = async (rutaPDF) => {
    const FORM = new FormData();
    FORM.append('rutaPDF', rutaPDF);
    const DATA = await fetchData(PEDIDOS_API, 'enviarFactura', FORM);

    if (DATA.status) {
        sweetAlert(1, DATA.message, false);
    } else {
        sweetAlert(3, DATA.error, false);
    }
}


let idPedidoCliente; // Variable para almacenar el ID del pedido del cliente

// Función para eliminar un producto del carrito
const eliminar = async (id, cantidad) => {
    const RESPONSE = await confirmAction('¿Seguro qué quieres eliminar este producto?', 'Se eliminará de tu carrito de compras');
    if (RESPONSE.isConfirmed) {
        const FORM = new FormData();
        FORM.append('idDetallesPedido', id);
        FORM.append('cantidad', cantidad);
        const DATA = await fetchData(CARRITO_API, 'deleteRow', FORM);

        if (DATA.status) {
            sweetAlert(1, DATA.message, false);
            fillTable(); // Vuelve a cargar la tabla
        } else {
            sweetAlert(3, DATA.error, false);
        }
    }
}

// Función para manejar el evento de actualización
const actuEvent = async () => {
    const BTN_UPDATE = document.getElementById('btnUpdate');
    var textoBoton = BTN_UPDATE.textContent.trim();
    if (textoBoton == 'Actualizar') {
        // Hacer los campos de entrada editables para actualizar.
        makeFieldsReadOnly(false);
        BTN_UPDATE.textContent = 'Guardar';
    }
    else if (textoBoton == 'Guardar') {
        let cant = CANT_INPUT.value.trim();

        if (cant <= 0) {
            sweetAlert(2, 'Por favor, ingrese una cantidad, no igual a cero o menor', false);
        }

        // Verificar que el campo de cantidad no esté vacío.
        if (!cant) {
            sweetAlert(2, 'Por favor, ingrese una cantidad', false);
        }

        // Verificar que el valor sea un número y que no contenga puntos.
        else if (!/^\d+$/.test(cant)) {
            sweetAlert(2, 'Por favor, ingrese una cantidad válida sin puntos', false);
        }

        else {
            // Constante tipo objeto con los datos del formulario.
            const FORM2 = new FormData();
            FORM2.append('id_detalle_zapato', idShoes);
            // Petición para guardar los datos del formulario.

            const DATA2 = await fetchData(ZAPATOS_API, 'validationCantidad', FORM2);
            if (DATA2.status) {
                const ROW2 = DATA2.dataset;
                let cantidadStock = ROW2.cantidad_zapato;

                if ((cant > cantidadStock) || (cantidadStock < cant) || ((0 === cantidadStock) && (cant < cantdad && cant > 0))) {
                    if (((0 === cantidadStock) && (cant < cantdad && cant > 0)) || (cantidadStock < cant)) {
                        // Constante tipo objeto con los datos del formulario.
                        const FORM = new FormData();
                        FORM.append('idDetallesPedido', idDetalle);
                        FORM.append('cantidad', cant);

                        // Petición para guardar los datos del formulario.
                        const DATA = await fetchData(CARRITO_API, 'updateRow', FORM);

                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (DATA.status) {
                            // Se muestra un mensaje de éxito.
                            await sweetAlert(1, 'Se ha actualizado correctamente', true);
                            // Deshabilita la edición de los campos de entrada.
                            makeFieldsReadOnly(true);
                            BTN_UPDATE.textContent = 'Actualizar';
                            // Se carga nuevamente la tabla para visualizar los cambios.
                            fillTable();
                            DATA_MODAL.hide();
                        } else {
                            if (DATA.exception === 'Error de sintaxis en la sentencia SQL') {
                                sweetAlert(2, 'Tiene que poner una cantidad menor del stock', false);
                            }
                            else {
                                makeFieldsReadOnly(false);
                                sweetAlert(2, DATA.error, false);
                            }
                        }
                    }
                    else {
                        sweetAlert(4, `Ingrese otra cantidad, nuestro stock actual de este zapato con esa talla y color es: ${cantidadStock}`, true);
                    }

                }
                else {

                    // Constante tipo objeto con los datos del formulario.
                    const FORM = new FormData();
                    FORM.append('idDetallesPedido', idDetalle);
                    FORM.append('cantidad', cant);

                    // Petición para guardar los datos del formulario.
                    const DATA = await fetchData(CARRITO_API, 'updateRow', FORM);

                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (DATA.status) {
                        // Se muestra un mensaje de éxito.
                        await sweetAlert(1, 'Se ha actualizado correctamente', true);
                        // Deshabilita la edición de los campos de entrada.
                        makeFieldsReadOnly(true);
                        BTN_UPDATE.textContent = 'Actualizar';
                        // Se carga nuevamente la tabla para visualizar los cambios.
                        fillTable();
                        DATA_MODAL.hide();
                    } else {
                        makeFieldsReadOnly(false);
                        sweetAlert(2, DATA.error, false);
                    }
                }
            }
            else {
                sweetAlert(4, DATA2.error, true);
            }
        }
    }
}

// Función para hacer los campos de entrada solo lectura o editables
function makeFieldsReadOnly(isReadOnly) {
    CANT_INPUT.readOnly = isReadOnly;
}

let idPrecio; // Variable para almacenar el ID del precio de envío

// Función para cambiar la visualización al realizar una compra
const botonComprar = async () => {
    // Oculta el carrito de compras y muestra los detalles de compra
    DIV_CARRITO.classList.add('d-none');
    const DATA0 = await fetchData(CARRITO_API, 'leerPrecios');
    if (DATA0.status) {
        const ROW0 = DATA0.dataset;
        idPrecio = ROW0.id_costo_de_envio_por_departamento;

        let all = parseFloat(total) + parseFloat(ROW0.costo_de_envio);

        // Muestra el total a pagar, incluyendo el costo de envío
        TOTAL_PAGAR.innerHTML = `$${total} + $${ROW0.costo_de_envio} = $${all}`;

        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(CLIENTES_API, 'readCliente');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            const ROW = DATA.dataset;
            NOMBRE_INPUT.value = ROW.nombre_cliente;
            APELLIDOS_INPUT.value = ROW.apellido_cliente;
            TELEFONO_INPUT.value = ROW.telefono_cliente;
            CORREO_INPUT.value = ROW.correo_cliente;
            DIRECCION.value = ROW.direccion_cliente;

            DIV_METODO_COMPRA.classList.remove('d-none'); // Muestra el contenedor de método de compra

        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
    else {
        sweetAlert(2, DATA0.error, false);
    }
}

// Función para regresar al carrito de compras desde los detalles de compra
function regresar() {
    // Muestra el carrito de compras y oculta los detalles de compra
    DIV_CARRITO.classList.remove('d-none');
    DIV_METODO_COMPRA.classList.add('d-none');
}

// Función para mostrar una notificación de éxito después de realizar el pago
function paga() {
    Swal.fire({
        title: false,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        html: `
        <div class="lineaIzq bg-color-1blue"></div>
        <div class="contenedorImg">
            <img src="../../recursos/imagenes/pngHombreFeliz.svg" class="imgHombre">
        </div>
        <div class="contenedorCuerpo mt-4 d-flex flex-column ">
            <h2 class="titillium-web-regular m-0 p-0 title">
                ¡Compra con éxito, espéralo!
            </h2>
            <p class="m-0 p-0 titillium-web-regular clgr2 mb-4 text15 mt-2">
                Tu orden está en camino. Espera con ansias para utilizar los zapatos que te hacen sentir cómodo. 
            </p>

            <button type="button" id="seguirExplorando" onclick="closeSweet()"
                class="btn btn-primary bg-color-5blue col-12 mb-2 mt-2">
                <h6 class="titillium-web-extralight m-0 p-0 py-1">
                    Seguir explorando
                </h6>
            </button>
        </div>
    `,
    });
}

// Función para cerrar la notificación
function closeSweet() {
    Swal.close();
    location.href = "index.html";
}

// Definición de la función asíncrona para cancelar y cerrar el modal.
const botonCancelar = async () => {
    // Muestra una confirmación y, si el usuario confirma, oculta el modal.
    const RESPONSE = await confirmAction('¿Seguro qué quieres regresar?', 'Se cerrará la ventana emergente');
    if (RESPONSE.isConfirmed) {
        makeFieldsReadOnly(true);
        const BTN_UPDATE = document.getElementById('btnUpdate');
        BTN_UPDATE.textContent = 'Actualizar';
        DATA_MODAL.hide();
    }
}