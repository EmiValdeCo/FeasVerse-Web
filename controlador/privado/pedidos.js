// Se establece el título de la página web.
document.querySelector('title').textContent = 'Feasverse - Pedidos';

// Constante para uso
const PEDIDOS_DIV = document.getElementById('pedidos');
const REPARTIDOR_DIV = document.getElementById('repartidor');;
//CONSTANTE PARA TIPOS DE CATEGORIA PARA EL RESULTADO
const CARDS_NUEVOS_PEDIDOS = document.getElementById('cardsDeNuevosPedidos');
const CARDS_PEDIDO_PROGRESO = document.getElementById('cardsDePedidosProgreso');
const CARDS_PEDIDO_ENTREGADO = document.getElementById('cardsDePedidosEntregado');
const DIV_PEDIDO_ENTREGADO = document.getElementById('divPedidosEntregados'),
    DIV_PEDIDO_PROGRESO = document.getElementById('divPedidosProgreso'),
    DIV_PEDIDO_PENDIENTE = document.getElementById('divPedidosPendientes');

const CONTENEDOR_PEDIDOS = document.getElementById('contenedorDeLasCardsDePedido'),
    CONTENEDOR_REPARTIDOR = document.getElementById('contenedorDeLasCardsDeRepatidor');

const SEARCH_FORM = document.getElementById('searchFormPedido');
const SEARCH_FORM_REPARTIDOR = document.getElementById('searchForm');


const PEDIDOS_API = 'services/privada/pedidos.php';

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();

    // Selecciona la primera pestaña y muestra el div de tabla o repartidor según la pestaña seleccionada.
    var primeraPestana = document.querySelector('#pedidos-tab');
    if (primeraPestana) {
        primeraPestana.click();
        PEDIDOS_DIV.classList.remove('d-none');
        REPARTIDOR_DIV.classList.add('d-none');
    }
    inicializarAccordion();
});

const openReportTodo = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/private/pedidos_todos.php`);
    console.log(PATH.href);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}

const openReportPendiente = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/private/pedidos_pendiente.php`);
    console.log(PATH.href);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}

const openReportEnCamino = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/private/pedidos_encamino.php`);
    console.log(PATH.href);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}

const openReportEntregados = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/private/pedidos_entregado.php`);
    console.log(PATH.href);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}

//! Funciones para mostrar el espacio de repartidor o el espacio de pedidos y cambiar colores de botones.
const ShowRepartidor = async (boton) => {
    REPARTIDOR_DIV.classList.remove('d-none');
    PEDIDOS_DIV.classList.add('d-none');

    // Restablece el color de todos los botones
    var botones = document.querySelectorAll('.boton-cambiar-color');
    botones.forEach(function (b) {
        b.style.backgroundColor = '#146A93';
    });

    // Cambia el color del botón clicado
    boton.style.backgroundColor = '#1A89BD';
    boton.style.color = 'white';

    await fillTableRepartidors();

    // Objeto para almacenar botones de acordeón y detalles correspondientes
    const accordionButtonsRepartidors = {};
    const isExpandedsReportidors = {};

    const DATA = await fetchData(PEDIDOS_API, 'readAllOrdersDeliverys');

    if (DATA.status) {

        DATA.dataset.forEach(row => {
            // Selecciona el botón de accordion correspondiente a este 'row'
            const accordionButton = document.getElementById(`accordionButtonRepartidor${row.id_trabajador}`);
            accordionButtonsRepartidors[row.id_trabajador] = accordionButton;

            // Agrega un evento click al botón del accordion
            accordionButtonsRepartidors[row.id_trabajador].addEventListener('click', function () {

                const isExpanded = accordionButtonsRepartidors[row.id_trabajador].getAttribute('aria-expanded') === 'true';

                // Cambia el estado del acordeón
                isExpandedsReportidors[row.id_trabajador] = !isExpandedsReportidors[row.id_trabajador];

                // Cambia el texto del botón según si está expandiendo o contrayendo
                if (isExpandedsReportidors[row.id_trabajador]) {
                    accordionButtonsRepartidors[row.id_trabajador].textContent = 'Ver más información';
                } else {
                    accordionButtonsRepartidors[row.id_trabajador].textContent = 'Ver menos información';
                }

            });

            accordionButtonsRepartidors[row.id_trabajador].click();
        });
    }
    else {
        await sweetAlert(2, DATA.error, true);
    }

    const DATA2 = await fetchData(PEDIDOS_API, 'readAllOrdersDeliverys');
    const actionButtonPendientes = {};
    const actionButtonEnCaminos = {};
    const actionButtonEntregados = {};
    const actionBack = {};
    const actionBack2 = {};
    const actionBack3 = {};
    const DIVPendientes = {};
    const DIVEnCaminos = {};
    const DIVEntregados = {};

    if (DATA2.status) {

        DATA2.dataset.forEach(row => {
            // Selecciona el botón de accordion correspondiente a este 'row'
            const actionButtonPendiente = document.getElementById(`divPedidosPendientes${row.id_trabajador}`);
            actionButtonPendientes[row.id_trabajador] = actionButtonPendiente;

            const divPendiente = document.getElementById(`cardsDeNuevosPedidos${row.id_trabajador}`);
            DIVPendientes[row.id_trabajador] = divPendiente;

            const actionButtonEnCamino = document.getElementById(`divPedidosProgreso${row.id_trabajador}`);
            actionButtonEnCaminos[row.id_trabajador] = actionButtonEnCamino;

            const divEnCamino = document.getElementById(`cardsDePedidosProgreso${row.id_trabajador}`);
            DIVEnCaminos[row.id_trabajador] = divEnCamino;

            const actionButtonEntregado = document.getElementById(`divPedidosEntregados${row.id_trabajador}`);
            actionButtonEntregados[row.id_trabajador] = actionButtonEntregado;

            const divEntregado = document.getElementById(`cardsDePedidosEntregado${row.id_trabajador}`);
            DIVEntregados[row.id_trabajador] = divEntregado;

            const buttonBack = document.getElementById(`botonRegresar${row.id_trabajador}`);
            actionBack[row.id_trabajador] = buttonBack;

            const buttonBack2 = document.getElementById(`botonRegresar2${row.id_trabajador}`);
            actionBack2[row.id_trabajador] = buttonBack2;

            const buttonBack3 = document.getElementById(`botonRegresar3${row.id_trabajador}`);
            actionBack3[row.id_trabajador] = buttonBack3;

            // Agrega un evento click al botón del accordion
            actionButtonPendientes[row.id_trabajador].addEventListener('click', async () => {
                // Obtener el color actual del DIV_PEDIDO_PENDIENTE
                var colorActual = window.getComputedStyle(actionButtonPendientes[row.id_trabajador]).backgroundColor;

                // Verificar el color actual y ejecutar la lógica correspondiente
                if (colorActual === 'rgb(20, 106, 147)') { // Color '#146A93' en formato RGB
                    DIVPendientes[row.id_trabajador].classList.add('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                } else {
                    // si el color no es el esperado
                    DIVPendientes[row.id_trabajador].classList.remove('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');

                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#146A93';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';

                    const FORMDATA = new FormData();
                    FORMDATA.append('idTrabajador', row.id_trabajador);
                    FORMDATA.append('estado', 1);

                    const DATA3 = await fetchData(PEDIDOS_API, 'ReadOrderOfDeliverys', FORMDATA);

                    if (DATA3.status) {
                        const CONTENEDOR_PEDIDOS_PENDIENTE = document.getElementById(`cardsDePedidoPendiente${row.id_trabajador}`);
                        CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML = '';

                        const accordionButtons = {};
                        const infoRepartidors = {};
                        const isExpandeds = {};

                        DATA3.dataset.forEach(async (row2) => {
                            var estado = row2.estado_pedido;
                            CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML += `
                            <div class="accordion detalleInformacion mt-3 mb-4" id="detalleInformacion">
                                <div class="accordion-item">
                                    <!--HEADER del accordion-->
                                    <div id="detalleInformacionHeader" class="accordion-header" data-bs-parent="#detalleInformacion">
                                        <!--Etiqueta del pedido-->
                                        <div class="col-lg-3">
                                            <p id="idPedidoNum" class="rounded-top text-center pt-2 pb-2 titillium-web-bold color-5blue">
                                                Pedido N# ${row2.id_pedido_cliente}
                                            </p>
                                        </div>
                                        <!--Contenedor del cuerpo-->
                                        <div id="contenedorDelAcordionSoloHeaderAndBody">
                                            <div class="col-lg-12 container mt-3 d-flex flex-wrap m-3 justify-content-center align-items-center" id="detallesDelPedido">
                                                ${row2.estado_pedido === 'Pendiente' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-danger pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : row2.estado_pedido === 'En camino' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-warning pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-success pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                `}
                                                <!--Info del repartidor y cliente-->
                                                <div class="infoDeRepartidor container d-none col-lg-12 d-flex justify-content-center mt-4 mb-2" id="infoDeRepartidor${row2.id_pedido_cliente}Repartidor">
                                                    <div class="col-lg-3 img1">
                                                        <img src="../../recursos/imagenes/icons/iconodeusuarioblancoyfondoazul.svg" alt="Icono de usuario">
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <h6 class="titillium-web" id="nombreCliente">
                                                            <b>Nombre del cliente:</b> ${row2.nombre_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="correoCliente">
                                                            <b>Correo del cliente:</b> ${row2.correo_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="telefonoCliente">
                                                            <b>Teléfono del cliente:</b> ${row2.telefono_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="direccionCliente">
                                                            <b>Dirección del cliente:</b> ${row2.direccion_cliente}
                                                        </h6>
                                                    </div>
                                                </div>
                                                <!--Comienzo de cards de zapato-->
                                                <div id="contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor" class="col-lg-12 d-flex flex-wrap justify-content-center mt-3">
                                                    <!-- Las tarjetas de zapato se insertarán aquí -->

                                                </div>
                                                <!-- Detalles del Más Pedido (Body) del acordion-->
                                                <div id="collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                                class="accordion-collapse collapse show col-lg-12">
                                                    <div class="accordion-body" id="detallesDeMasPedido">
                                                        <div class="col-lg-12">
                                                            <div class="container">
                                                                <!--Contenedor de boton de entrega y precio total-->
                                                                <div class="row col-lg-12">
                                                                    <!--Contenedor del boton de iniciar entrega -->
                                                                    <div class="col-lg-6 d-flex justify-content-center">
                                                                        ${row2.estado_pedido === 'Pendiente' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'En camino')">
                                                                            Iniciar entrega
                                                                        </button>
                                                                        ` : row2.estado_pedido === 'En camino' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'Entregado')">
                                                                            Entregado
                                                                        </button>
                                                                        ` : `
                                                                        `}
                                                                    </div>
                                                                    <!--Contenedor de los precios-->
                                                                    <div class="col-lg-6" id="containerTotales">
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalPediod">Total del pedido: $${row2.precio_total}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="envio">Envío: $${row2.costo_de_envio}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalCobrar">Total a cobrar: $${row2.total_cobrar}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Botón (Footer) -->
                                        <div class="offset-lg-9 col-lg-3">
                                            <button id="accordionButton${row2.id_pedido_cliente}Repartidor" 
                                            class="accordion-button rounded-bottom rounded-top-0" 
                                            type="button" data-bs-toggle="collapse" 
                                            data-bs-target="#collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                            aria-expanded="true" aria-controls="collapse${row2.id_pedido_cliente}PedidoRepartidor">
                                                Ver más información
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;

                            // Selecciona el botón de accordion correspondiente a este 'row'
                            const accordionButton = document.getElementById(`accordionButton${row2.id_pedido_cliente}Repartidor`);
                            accordionButtons[row2.id_pedido_cliente] = accordionButton;
                            // Selecciona el contenedor de detalles correspondiente a este 'row'
                            const detallesDeMasPedido = document.getElementById(`infoDeRepartidor${row2.id_pedido_cliente}Repartidor`);
                            infoRepartidors[row2.id_pedido_cliente] = detallesDeMasPedido;

                            // Agrega un evento click al botón del accordion
                            accordionButtons[row2.id_pedido_cliente].addEventListener('click', function () {

                                const isExpanded = accordionButtons[row2.id_pedido_cliente].getAttribute('aria-expanded') === 'true';

                                // Inicializa el estado del acordeón como contraído
                                isExpandeds[row2.id_pedido_cliente] = isExpanded;

                                // Cambia el estado del acordeón
                                isExpandeds[row2.id_pedido_cliente] = !isExpandeds[row2.id_pedido_cliente];

                                // Cambia el texto del botón según si está expandiendo o contrayendo
                                if (isExpandeds[row2.id_pedido_cliente]) {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver más información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.add('d-none');
                                } else {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver menos información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.remove('d-none');
                                }

                            });

                            accordionButtons[row2.id_pedido_cliente].click();

                            const FORM_ID = new FormData();
                            FORM_ID.append('idPedido', row2.id_pedido_cliente);
                            const DATA5 = await fetchData(PEDIDOS_API, 'ReadAllShoesOfOneOrder', FORM_ID);
                            if (DATA5.status) {
                                const contenedorTarjetas = document.getElementById(`contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor`);
                                contenedorTarjetas.innerHTML = '';

                                DATA5.dataset.forEach((row3) => {
                                    contenedorTarjetas.innerHTML += `
                                        <div class="containerCards col-lg-3 d-flex flex-wrap m-3">
                                            <div class="containerCard col-lg-12 flex-wrap" id="cardPedido">
                                                <div class="card">
                                                    <!--Contenedor de la imagen-->
                                                    <img src="${SERVER_URL}helpers/images/zapatos/${row3.foto_detalle_zapato}" class="card-img-top img-fluid" alt="${row2.nombre_zapato}">
                                                    <!--Contenedor del cuerpo de la card-->
                                                    <div class="card-body">
                                                        <!--Contenedor de nombre zapato-->
                                                        <div class="ContenedorNombreZapato col-lg-12">
                                                            <h4 class="titillium-web-semibold text-center" id="nombreZapato">${row3.nombre_zapato}</h4>
                                                        </div>
                                                        <!--Contenedor del color y talla-->
                                                        <div class="ContenedorColorTalla col-lg-12 d-flex">
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorColor">
                                                                <h6 class="titillium-web-extralight me-1">Color: ${row3.nombre_color}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorTalla">
                                                                <h6 class="titillium-web-extralight me-1">Talla</h6>
                                                                <div id="talla">
                                                                    <h6 id="tallaPedido">${row3.num_talla}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--Contenedor de la cantidad-->
                                                        <div class="contenedorCantidad col-lg-12 justify-content-center align-items-center mt-2">
                                                            <h6 class="titillium-web-extralight text-center" id="cantidadPedido">Cantidad: ${row3.cantidad_pedido}</h6>
                                                        </div>
                                                    </div>
                                                    <!--Contenedor del footer-->
                                                    <div class="card-footer bg-color-4blue">
                                                        <!--Contenedor del precio-->
                                                        <div class="d-flex contenedorPrecios col-lg-12">
                                                            <div class="col-lg-6 d-flex justify-content-start">
                                                                <h6 class="titillium-web-bold text-white" id="precioZapato">$${row3.precio_unitario_zapato}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex justify-content-end">
                                                                <h6 class="titillium-web-extralight text-white" id="cantidadTotal">Total: $${row3.precio_total}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                });
                            } else {
                                await sweetAlert(2, DATA5.error, true);
                            }

                        });
                    }
                    else {
                        await sweetAlert(2, DATA3.error, true);
                    }
                }
            });

            // Agrega un evento click al botón del accordion
            actionButtonEnCaminos[row.id_trabajador].addEventListener('click', async () => {
                // Obtener el color actual del DIV_PEDIDO_PENDIENTE
                var colorActual = window.getComputedStyle(actionButtonEnCaminos[row.id_trabajador]).backgroundColor;

                // Verificar el color actual y ejecutar la lógica correspondiente
                if (colorActual === 'rgb(20, 106, 147)') { // Color '#146A93' en formato RGB
                    DIVPendientes[row.id_trabajador].classList.add('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                } else {
                    // si el color no es el esperado
                    DIVEnCaminos[row.id_trabajador].classList.remove('d-none');
                    DIVPendientes[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');

                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#146A93';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';

                    const FORMDATA = new FormData();
                    FORMDATA.append('idTrabajador', row.id_trabajador);
                    FORMDATA.append('estado', 2);

                    const DATA3 = await fetchData(PEDIDOS_API, 'ReadOrderOfDeliverys', FORMDATA);

                    if (DATA3.status) {
                        const CONTENEDOR_PEDIDOS_PENDIENTE = document.getElementById(`cardsDeZapatoProgeso${row.id_trabajador}`);
                        CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML = '';
                        const accordionButtons = {};
                        const infoRepartidors = {};
                        const isExpandeds = {};

                        DATA3.dataset.forEach(async (row2) => {
                            var estado = row2.estado_pedido;
                            CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML += `
                            <div class="accordion detalleInformacion mt-3 mb-4" id="detalleInformacion">
                                <div class="accordion-item">
                                    <!--HEADER del accordion-->
                                    <div id="detalleInformacionHeader" class="accordion-header" data-bs-parent="#detalleInformacion">
                                        <!--Etiqueta del pedido-->
                                        <div class="col-lg-3">
                                            <p id="idPedidoNum" class="rounded-top text-center pt-2 pb-2 titillium-web-bold color-5blue">
                                                Pedido N# ${row2.id_pedido_cliente}
                                            </p>
                                        </div>
                                        <!--Contenedor del cuerpo-->
                                        <div id="contenedorDelAcordionSoloHeaderAndBody">
                                            <div class="col-lg-12 container mt-3 d-flex flex-wrap m-3 justify-content-center align-items-center" id="detallesDelPedido">
                                                ${row2.estado_pedido === 'Pendiente' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-danger pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : row2.estado_pedido === 'En camino' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-warning pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-success pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                `}
                                                <!--Info del repartidor y cliente-->
                                                <div class="infoDeRepartidor container d-none col-lg-12 d-flex justify-content-center mt-4 mb-2" id="infoDeRepartidor${row2.id_pedido_cliente}Repartidor">
                                                    <div class="col-lg-3 img1">
                                                        <img src="../../recursos/imagenes/icons/iconodeusuarioblancoyfondoazul.svg" alt="Icono de usuario">
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <h6 class="titillium-web" id="nombreCliente">
                                                            <b>Nombre del cliente:</b> ${row2.nombre_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="correoCliente">
                                                            <b>Correo del cliente:</b> ${row2.correo_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="telefonoCliente">
                                                            <b>Teléfono del cliente:</b> ${row2.telefono_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="direccionCliente">
                                                            <b>Dirección del cliente:</b> ${row2.direccion_cliente}
                                                        </h6>
                                                    </div>
                                                </div>
                                                <!--Comienzo de cards de zapato-->
                                                <div id="contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor" class="col-lg-12 d-flex flex-wrap justify-content-center mt-3">
                                                    <!-- Las tarjetas de zapato se insertarán aquí -->

                                                </div>
                                                <!-- Detalles del Más Pedido (Body) del acordion-->
                                                <div id="collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                                class="accordion-collapse collapse show col-lg-12">
                                                    <div class="accordion-body" id="detallesDeMasPedido">
                                                        <div class="col-lg-12">
                                                            <div class="container">
                                                                <!--Contenedor de boton de entrega y precio total-->
                                                                <div class="row col-lg-12">
                                                                    <!--Contenedor del boton de iniciar entrega -->
                                                                    <div class="col-lg-6 d-flex justify-content-center">
                                                                        ${row2.estado_pedido === 'Pendiente' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'En camino')">
                                                                            Iniciar entrega
                                                                        </button>
                                                                        ` : row2.estado_pedido === 'En camino' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'Entregado')">
                                                                            Entregado
                                                                        </button>
                                                                        ` : `
                                                                        `}
                                                                    </div>
                                                                    <!--Contenedor de los precios-->
                                                                    <div class="col-lg-6" id="containerTotales">
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalPediod">Total del pedido: $${row2.precio_total}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="envio">Envío: $${row2.costo_de_envio}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalCobrar">Total a cobrar: $${row2.total_cobrar}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Botón (Footer) -->
                                        <div class="offset-lg-9 col-lg-3">
                                            <button id="accordionButton${row2.id_pedido_cliente}Repartidor" 
                                            class="accordion-button rounded-bottom rounded-top-0" 
                                            type="button" data-bs-toggle="collapse" 
                                            data-bs-target="#collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                            aria-expanded="true" aria-controls="collapse${row2.id_pedido_cliente}PedidoRepartidor">
                                                Ver más información
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;

                            // Selecciona el botón de accordion correspondiente a este 'row'
                            const accordionButton = document.getElementById(`accordionButton${row2.id_pedido_cliente}Repartidor`);
                            accordionButtons[row2.id_pedido_cliente] = accordionButton;
                            // Selecciona el contenedor de detalles correspondiente a este 'row'
                            const detallesDeMasPedido = document.getElementById(`infoDeRepartidor${row2.id_pedido_cliente}Repartidor`);
                            infoRepartidors[row2.id_pedido_cliente] = detallesDeMasPedido;

                            // Agrega un evento click al botón del accordion
                            accordionButtons[row2.id_pedido_cliente].addEventListener('click', function () {

                                const isExpanded = accordionButtons[row2.id_pedido_cliente].getAttribute('aria-expanded') === 'true';

                                // Inicializa el estado del acordeón como contraído
                                isExpandeds[row2.id_pedido_cliente] = isExpanded;

                                // Cambia el estado del acordeón
                                isExpandeds[row2.id_pedido_cliente] = !isExpandeds[row2.id_pedido_cliente];

                                // Cambia el texto del botón según si está expandiendo o contrayendo
                                if (isExpandeds[row2.id_pedido_cliente]) {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver más información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.add('d-none');
                                } else {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver menos información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.remove('d-none');
                                }

                            });

                            accordionButtons[row2.id_pedido_cliente].click();

                            const FORM_ID = new FormData();
                            FORM_ID.append('idPedido', row2.id_pedido_cliente);
                            const DATA5 = await fetchData(PEDIDOS_API, 'ReadAllShoesOfOneOrder', FORM_ID);
                            if (DATA5.status) {
                                const contenedorTarjetas = document.getElementById(`contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor`);
                                contenedorTarjetas.innerHTML = '';
                                DATA5.dataset.forEach((row3) => {
                                    contenedorTarjetas.innerHTML += `
                                        <div class="containerCards col-lg-3 d-flex flex-wrap m-3">
                                            <div class="containerCard col-lg-12 flex-wrap" id="cardPedido">
                                                <div class="card">
                                                    <!--Contenedor de la imagen-->
                                                    <img src="${SERVER_URL}helpers/images/zapatos/${row3.foto_detalle_zapato}" class="card-img-top img-fluid" alt="${row2.nombre_zapato}">
                                                    <!--Contenedor del cuerpo de la card-->
                                                    <div class="card-body">
                                                        <!--Contenedor de nombre zapato-->
                                                        <div class="ContenedorNombreZapato col-lg-12">
                                                            <h4 class="titillium-web-semibold text-center" id="nombreZapato">${row3.nombre_zapato}</h4>
                                                        </div>
                                                        <!--Contenedor del color y talla-->
                                                        <div class="ContenedorColorTalla col-lg-12 d-flex">
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorColor">
                                                                <h6 class="titillium-web-extralight me-1">Color: ${row3.nombre_color}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorTalla">
                                                                <h6 class="titillium-web-extralight me-1">Talla</h6>
                                                                <div id="talla">
                                                                    <h6 id="tallaPedido">${row3.num_talla}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--Contenedor de la cantidad-->
                                                        <div class="contenedorCantidad col-lg-12 justify-content-center align-items-center mt-2">
                                                            <h6 class="titillium-web-extralight text-center" id="cantidadPedido">Cantidad: ${row3.cantidad_pedido}</h6>
                                                        </div>
                                                    </div>
                                                    <!--Contenedor del footer-->
                                                    <div class="card-footer bg-color-4blue">
                                                        <!--Contenedor del precio-->
                                                        <div class="d-flex contenedorPrecios col-lg-12">
                                                            <div class="col-lg-6 d-flex justify-content-start">
                                                                <h6 class="titillium-web-bold text-white" id="precioZapato">$${row3.precio_unitario_zapato}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex justify-content-end">
                                                                <h6 class="titillium-web-extralight text-white" id="cantidadTotal">Total: $${row3.precio_total}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                });
                            } else {
                                await sweetAlert(2, DATA5.error, true);
                            }

                        });
                    }
                    else {
                        await sweetAlert(2, DATA3.error, true);
                    }
                }
            });

            // Agrega un evento click al botón del accordion
            actionButtonEntregados[row.id_trabajador].addEventListener('click', async () => {
                // Obtener el color actual del DIV_PEDIDO_PENDIENTE
                var colorActual = window.getComputedStyle(actionButtonEntregados[row.id_trabajador]).backgroundColor;

                // Verificar el color actual y ejecutar la lógica correspondiente
                if (colorActual === 'rgb(20, 106, 147)') { // Color '#146A93' en formato RGB
                    DIVPendientes[row.id_trabajador].classList.add('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                } else {
                    // si el color no es el esperado
                    DIVEntregados[row.id_trabajador].classList.remove('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVPendientes[row.id_trabajador].classList.add('d-none');

                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#146A93';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';

                    const FORMDATA = new FormData();
                    FORMDATA.append('idTrabajador', row.id_trabajador);
                    FORMDATA.append('estado', 3);

                    const DATA3 = await fetchData(PEDIDOS_API, 'ReadOrderOfDeliverys', FORMDATA);

                    if (DATA3.status) {
                        const CONTENEDOR_PEDIDOS_PENDIENTE = document.getElementById(`cardsDeZapatoEntregado${row.id_trabajador}`);
                        CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML = '';

                        const accordionButtons = {};
                        const infoRepartidors = {};
                        const isExpandeds = {};

                        DATA3.dataset.forEach(async (row2) => {
                            var estado = row2.estado_pedido;
                            CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML += `
                            <div class="accordion detalleInformacion mt-3 mb-4" id="detalleInformacion">
                                <div class="accordion-item">
                                    <!--HEADER del accordion-->
                                    <div id="detalleInformacionHeader" class="accordion-header" data-bs-parent="#detalleInformacion">
                                        <!--Etiqueta del pedido-->
                                        <div class="col-lg-3">
                                            <p id="idPedidoNum" class="rounded-top text-center pt-2 pb-2 titillium-web-bold color-5blue">
                                                Pedido N# ${row2.id_pedido_cliente}
                                            </p>
                                        </div>
                                        <!--Contenedor del cuerpo-->
                                        <div id="contenedorDelAcordionSoloHeaderAndBody">
                                            <div class="col-lg-12 container mt-3 d-flex flex-wrap m-3 justify-content-center align-items-center" id="detallesDelPedido">
                                                ${row2.estado_pedido === 'Pendiente' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-danger pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : row2.estado_pedido === 'En camino' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-warning pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-success pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                `}
                                                <!--Info del repartidor y cliente-->
                                                <div class="infoDeRepartidor container d-none col-lg-12 d-flex justify-content-center mt-4 mb-2" id="infoDeRepartidor${row2.id_pedido_cliente}Repartidor">
                                                    <div class="col-lg-3 img1">
                                                        <img src="../../recursos/imagenes/icons/iconodeusuarioblancoyfondoazul.svg" alt="Icono de usuario">
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <h6 class="titillium-web" id="nombreCliente">
                                                            <b>Nombre del cliente:</b> ${row2.nombre_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="correoCliente">
                                                            <b>Correo del cliente:</b> ${row2.correo_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="telefonoCliente">
                                                            <b>Teléfono del cliente:</b> ${row2.telefono_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="direccionCliente">
                                                            <b>Dirección del cliente:</b> ${row2.direccion_cliente}
                                                        </h6>
                                                    </div>
                                                </div>
                                                <!--Comienzo de cards de zapato-->
                                                <div id="contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor" class="col-lg-12 d-flex flex-wrap justify-content-center mt-3">
                                                    <!-- Las tarjetas de zapato se insertarán aquí -->

                                                </div>
                                                <!-- Detalles del Más Pedido (Body) del acordion-->
                                                <div id="collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                                class="accordion-collapse collapse show col-lg-12">
                                                    <div class="accordion-body" id="detallesDeMasPedido">
                                                        <div class="col-lg-12">
                                                            <div class="container">
                                                                <!--Contenedor de boton de entrega y precio total-->
                                                                <div class="row col-lg-12">
                                                                    <!--Contenedor del boton de iniciar entrega -->
                                                                    <div class="col-lg-6 d-flex justify-content-center">
                                                                        ${row2.estado_pedido === 'Pendiente' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'En camino')">
                                                                            Iniciar entrega
                                                                        </button>
                                                                        ` : row2.estado_pedido === 'En camino' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'Entregado')">
                                                                            Entregado
                                                                        </button>
                                                                        ` : `
                                                                        `}
                                                                    </div>
                                                                    <!--Contenedor de los precios-->
                                                                    <div class="col-lg-6" id="containerTotales">
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalPediod">Total del pedido: $${row2.precio_total}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="envio">Envío: $${row2.costo_de_envio}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalCobrar">Total a cobrar: $${row2.total_cobrar}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Botón (Footer) -->
                                        <div class="offset-lg-9 col-lg-3">
                                            <button id="accordionButton${row2.id_pedido_cliente}Repartidor" 
                                            class="accordion-button rounded-bottom rounded-top-0" 
                                            type="button" data-bs-toggle="collapse" 
                                            data-bs-target="#collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                            aria-expanded="true" aria-controls="collapse${row2.id_pedido_cliente}PedidoRepartidor">
                                                Ver más información
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;

                            // Selecciona el botón de accordion correspondiente a este 'row'
                            const accordionButton = document.getElementById(`accordionButton${row2.id_pedido_cliente}Repartidor`);
                            accordionButtons[row2.id_pedido_cliente] = accordionButton;
                            // Selecciona el contenedor de detalles correspondiente a este 'row'
                            const detallesDeMasPedido = document.getElementById(`infoDeRepartidor${row2.id_pedido_cliente}Repartidor`);
                            infoRepartidors[row2.id_pedido_cliente] = detallesDeMasPedido;

                            // Agrega un evento click al botón del accordion
                            accordionButtons[row2.id_pedido_cliente].addEventListener('click', function () {

                                const isExpanded = accordionButtons[row2.id_pedido_cliente].getAttribute('aria-expanded') === 'true';

                                // Inicializa el estado del acordeón como contraído
                                isExpandeds[row2.id_pedido_cliente] = isExpanded;

                                // Cambia el estado del acordeón
                                isExpandeds[row2.id_pedido_cliente] = !isExpandeds[row2.id_pedido_cliente];

                                // Cambia el texto del botón según si está expandiendo o contrayendo
                                if (isExpandeds[row2.id_pedido_cliente]) {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver más información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.add('d-none');
                                } else {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver menos información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.remove('d-none');
                                }

                            });

                            accordionButtons[row2.id_pedido_cliente].click();

                            const FORM_ID = new FormData();
                            FORM_ID.append('idPedido', row2.id_pedido_cliente);
                            const DATA5 = await fetchData(PEDIDOS_API, 'ReadAllShoesOfOneOrder', FORM_ID);
                            if (DATA5.status) {
                                const contenedorTarjetas = document.getElementById(`contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor`);
                                contenedorTarjetas.innerHTML = '';
                                DATA5.dataset.forEach((row3) => {
                                    contenedorTarjetas.innerHTML += `
                                        <div class="containerCards col-lg-3 d-flex flex-wrap m-3">
                                            <div class="containerCard col-lg-12 flex-wrap" id="cardPedido">
                                                <div class="card">
                                                    <!--Contenedor de la imagen-->
                                                    <img src="${SERVER_URL}helpers/images/zapatos/${row3.foto_detalle_zapato}" class="card-img-top img-fluid" alt="${row2.nombre_zapato}">
                                                    <!--Contenedor del cuerpo de la card-->
                                                    <div class="card-body">
                                                        <!--Contenedor de nombre zapato-->
                                                        <div class="ContenedorNombreZapato col-lg-12">
                                                            <h4 class="titillium-web-semibold text-center" id="nombreZapato">${row3.nombre_zapato}</h4>
                                                        </div>
                                                        <!--Contenedor del color y talla-->
                                                        <div class="ContenedorColorTalla col-lg-12 d-flex">
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorColor">
                                                                <h6 class="titillium-web-extralight me-1">Color: ${row3.nombre_color}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorTalla">
                                                                <h6 class="titillium-web-extralight me-1">Talla</h6>
                                                                <div id="talla">
                                                                    <h6 id="tallaPedido">${row3.num_talla}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--Contenedor de la cantidad-->
                                                        <div class="contenedorCantidad col-lg-12 justify-content-center align-items-center mt-2">
                                                            <h6 class="titillium-web-extralight text-center" id="cantidadPedido">Cantidad: ${row3.cantidad_pedido}</h6>
                                                        </div>
                                                    </div>
                                                    <!--Contenedor del footer-->
                                                    <div class="card-footer bg-color-4blue">
                                                        <!--Contenedor del precio-->
                                                        <div class="d-flex contenedorPrecios col-lg-12">
                                                            <div class="col-lg-6 d-flex justify-content-start">
                                                                <h6 class="titillium-web-bold text-white" id="precioZapato">$${row3.precio_unitario_zapato}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex justify-content-end">
                                                                <h6 class="titillium-web-extralight text-white" id="cantidadTotal">Total: $${row3.precio_total}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                });
                            } else {
                                await sweetAlert(2, DATA5.error, true);
                            }

                        });
                    }
                    else {
                        await sweetAlert(2, DATA3.error, true);
                    }
                }
            });

            actionBack[row.id_trabajador].addEventListener('click', async () => {
                DIVEntregados[row.id_trabajador].classList.add('d-none');
                DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                DIVPendientes[row.id_trabajador].classList.add('d-none');
                actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
            });

            actionBack2[row.id_trabajador].addEventListener('click', async () => {
                DIVEntregados[row.id_trabajador].classList.add('d-none');
                DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                DIVPendientes[row.id_trabajador].classList.add('d-none');
                actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
            });

            actionBack3[row.id_trabajador].addEventListener('click', async () => {
                DIVEntregados[row.id_trabajador].classList.add('d-none');
                DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                DIVPendientes[row.id_trabajador].classList.add('d-none');
                actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
            });

        });
    }
    else {
        await sweetAlert(2, DATA.error, true);
    }
}

// Definición de la función llamada 'ShowPedidos'.
const ShowPedidos = async (boton) => {
    // Muestra el div de pedidos y oculta el div de repartidores.
    PEDIDOS_DIV.classList.remove('d-none');
    REPARTIDOR_DIV.classList.add('d-none');

    // Restablece el color de todos los botones.
    var botones = document.querySelectorAll('.boton-cambiar-color');
    botones.forEach(function (b) {
        b.style.backgroundColor = '#146A93';
    });

    // Cambia el color del botón clicado a un color específico.
    boton.style.backgroundColor = '#1A89BD';
    boton.style.color = 'white';
    await fillTable();

    inicializarAccordion();
}

// Función para mostrar/ocultar el icono de limpiar según si hay texto en el input
document.getElementById('buscadorInputPedidos').addEventListener('input', function () {
    var searchIcon = document.querySelector('.search-icon');
    var clearIcon = document.querySelector('.clear-icon');

    if (this.value.length > 0) {
        searchIcon.style.display = 'none';
        clearIcon.style.display = 'block';
    } else {
        searchIcon.style.display = 'block';
        clearIcon.style.display = 'none';
    }
});

// Función para limpiar el input y ocultar el icono de limpiar
function clearSearch() {
    var input = document.getElementById('buscadorInputPedidos');
    var searchIcon = document.querySelector('.search-icon');
    var clearIcon = document.querySelector('.clear-icon');

    input.value = '';
    input.focus();

    searchIcon.style.display = 'block';
    clearIcon.style.display = 'none';
}


//Función asicronicaa de cambio de estado
const cambioDeEstado = async (id_pedido_cliente, estado) => {
    const FORM2 = new FormData();
    FORM2.append('idPedido', id_pedido_cliente);
    FORM2.append('estado', estado.trim());
    // Petición para obtener los registros disponibles.
    const DATA3 = await fetchData(PEDIDOS_API, 'updateStatus', FORM2);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA3.status) {
        await sweetAlert(1, DATA3.message, true);
        fillTable();
    }
    else {
        await sweetAlert(2, DATA3.error, true);
    }
}

const SELECT_PEDIDO = document.getElementById('selectPedido');


// Definir una variable para controlar si la función handleSearch está en ejecución
let searchInProgress = false;

// Definir la función para manejar la búsqueda
async function handleSearch() {
    // Si la búsqueda ya está en progreso, salir de la función para evitar ejecuciones duplicadas
    if (searchInProgress) {
        return;
    }

    searchInProgress = true;

    try {
        const BUSCADOR_INPUT_PEDIDO = document.getElementById('buscadorInputPedidos');
        const SELECT_PEDIDO = document.getElementById('selectPedido');
        var value = parseInt(SELECT_PEDIDO.value);
        var texto = BUSCADOR_INPUT_PEDIDO.value.trim();
        var estado = '';

        if (value === 1) {
            estado = 'Entregado';
        } else if (value === 2) {
            estado = 'En camino';
        }
        else if (value === 3) {
            estado = 'Pendiente';
        }
        else {
            estado = '';
        }

        // Constante tipo objeto con los datos del formulario.
        const FORM1 = new FormData();
        FORM1.append('estado', estado);
        FORM1.append('paramentro', texto);
        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        await fillTable(FORM1);
        inicializarAccordion(FORM1);
    } finally {
        searchInProgress = false;
    }
}

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    await handleSearch();
});

// Método del evento para cuando cambia algo en el select.
SELECT_PEDIDO.addEventListener('change', async () => {
    await handleSearch();
});


const inicializarAccordion = async (form = null) => {
    (form) ? action = 'searchOrders' : action = 'readAllOrders';

    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PEDIDOS_API, action, form);

    // Objeto para almacenar botones de acordeón y detalles correspondientes
    const accordionButtons = {};
    const infoRepartidors = {};
    const isExpandeds = {};

    if (DATA.status) {

        DATA.dataset.forEach(row => {
            // Selecciona el botón de accordion correspondiente a este 'row'
            const accordionButton = document.getElementById(`accordionButton${row.id_pedido_cliente}`);
            accordionButtons[row.id_pedido_cliente] = accordionButton;
            // Selecciona el contenedor de detalles correspondiente a este 'row'
            const detallesDeMasPedido = document.getElementById(`infoDeRepartidor${row.id_pedido_cliente}`);
            infoRepartidors[row.id_pedido_cliente] = detallesDeMasPedido;

            // Agrega un evento click al botón del accordion
            accordionButtons[row.id_pedido_cliente].addEventListener('click', function () {

                const isExpanded = accordionButtons[row.id_pedido_cliente].getAttribute('aria-expanded') === 'true';

                // Inicializa el estado del acordeón como contraído
                isExpandeds[row.id_pedido_cliente] = isExpanded;

                // Cambia el estado del acordeón
                isExpandeds[row.id_pedido_cliente] = !isExpandeds[row.id_pedido_cliente];

                // Cambia el texto del botón según si está expandiendo o contrayendo
                if (isExpandeds[row.id_pedido_cliente]) {
                    accordionButtons[row.id_pedido_cliente].textContent = 'Ver más información';
                    infoRepartidors[row.id_pedido_cliente].classList.add('d-none');
                } else {
                    accordionButtons[row.id_pedido_cliente].textContent = 'Ver menos información';
                    infoRepartidors[row.id_pedido_cliente].classList.remove('d-none');
                }

            });

            accordionButtons[row.id_pedido_cliente].click();
        });
    }
}

const fillTable = async (form = null) => {
    CONTENEDOR_PEDIDOS.innerHTML = '';

    (form) ? action = 'searchOrders' : action = 'readAllOrders';

    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PEDIDOS_API, action, form);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(async (row) => {
            CONTENEDOR_PEDIDOS.innerHTML += `
            <div class="accordion detalleInformacion mt-3 mb-4" id="detalleInformacion">
                <div class="accordion-item">
                    <!--HEADER del accordion-->
                    <div id="detalleInformacionHeader" class="accordion-header" data-bs-parent="#detalleInformacion">
                        <!--Etiqueta del pedido-->
                        <div class="col-lg-3">
                            <p id="idPedidoNum" class="rounded-top text-center pt-2 pb-2 titillium-web-bold color-5blue">
                                Pedido N# ${row.id_pedido_cliente}
                            </p>
                        </div>
                        <!--Contenedor del cuerpo-->
                        <div id="contenedorDelAcordionSoloHeaderAndBody">
                            <div class="col-lg-12 container mt-3 d-flex flex-wrap m-3 justify-content-center align-items-center" id="detallesDelPedido">
                                ${row.estado_pedido === 'Pendiente' ? `
                                <!--Contenedor de la etiqueta del pedido-->
                                <div class="offset-lg-9 col-lg-3 bg-danger pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row.estado_pedido}</h6>
                                </div>
                                ` : row.estado_pedido === 'En camino' ? `
                                <!--Contenedor de la etiqueta del pedido-->
                                <div class="offset-lg-9 col-lg-3 bg-warning pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row.estado_pedido}</h6>
                                </div>
                                ` : `
                                <!--Contenedor de la etiqueta del pedido-->
                                <div class="offset-lg-9 col-lg-3 bg-success pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row.estado_pedido}</h6>
                                </div>
                                `}
                                <!--Info del repartidor y cliente-->
                                <div class="infoDeRepartidor container d-none col-lg-12 d-flex justify-content-center mt-4 mb-2" id="infoDeRepartidor${row.id_pedido_cliente}">
                                    <div class="col-lg-3 img1">
                                        <img src="../../recursos/imagenes/icons/iconodeusuarioblancoyfondoazul.svg" alt="Icono de usuario">
                                    </div>
                                    <div class="col-lg-4">
                                        <h6 class="titillium-web" id="idRepartidor">
                                            <b>ID del repartidor:</b> ${row.id_trabajador}
                                        </h6>
                                        <h6 class="titillium-web" id="nombreRepartidor">
                                            <b>Nombre del repartidor:</b> ${row.nombre_repartidor}
                                        </h6>
                                        <h6 class="titillium-web" id="nombreCliente">
                                            <b>Nombre del cliente:</b> ${row.nombre_cliente}
                                        </h6>
                                        <h6 class="titillium-web" id="correoCliente">
                                            <b>Correo del cliente:</b> ${row.correo_cliente}
                                        </h6>
                                        <h6 class="titillium-web" id="telefonoCliente">
                                            <b>Teléfono del cliente:</b> ${row.telefono_cliente}
                                        </h6>
                                        <h6 class="titillium-web" id="direccionCliente">
                                            <b>Dirección del cliente:</b> ${row.direccion_cliente}
                                        </h6>
                                    </div>
                                </div>
                                <!--Comienzo de cards de zapato-->
                                <div id="contenedorDeTarjetas${row.id_pedido_cliente}" class="col-lg-12 d-flex flex-wrap justify-content-center mt-3">
                                    <!-- Las tarjetas de zapato se insertarán aquí -->
                                    
                                </div>
                                <!-- Detalles del Más Pedido (Body) del acordion-->
                                <div id="collapse${row.id_pedido_cliente}Pedido" 
                                class="accordion-collapse collapse show col-lg-12">
                                    <div class="accordion-body" id="detallesDeMasPedido">
                                        <div class="col-lg-12">
                                            <div class="container">
                                                <!--Contenedor de boton de entrega y precio total-->
                                                <div class="row col-lg-12">
                                                    <!--Contenedor del boton de iniciar entrega -->
                                                    <div class="col-lg-6 d-flex justify-content-center">
                                                        ${row.estado_pedido === 'Pendiente' ? `
                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row.id_pedido_cliente}, 'En camino')">
                                                            Iniciar entrega
                                                        </button>
                                                        ` : row.estado_pedido === 'En camino' ? `
                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row.id_pedido_cliente}, 'Entregado')">
                                                            Entregado
                                                        </button>
                                                        ` : `
                                                        `}
                                                    </div>
                                                    <!--Contenedor de los precios-->
                                                    <div class="col-lg-6" id="containerTotales">
                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalPediod">Total del pedido: $${row.precio_total}</h6>
                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="envio">Envío: $${row.costo_de_envio}</h6>
                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalCobrar">Total a cobrar: $${row.total_cobrar}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Botón (Footer) -->
                        <div class="offset-lg-9 col-lg-3">
                            <button id="accordionButton${row.id_pedido_cliente}" 
                            class="accordion-button rounded-bottom rounded-top-0" 
                            type="button" data-bs-toggle="collapse" 
                            data-bs-target="#collapse${row.id_pedido_cliente}Pedido" 
                            aria-expanded="true" aria-controls="collapse${row.id_pedido_cliente}Pedido">
                                Ver más información
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;

            const FORM_ID = new FormData();
            FORM_ID.append('idPedido', row.id_pedido_cliente);
            const DATA2 = await fetchData(PEDIDOS_API, 'ReadAllShoesOfOneOrder', FORM_ID);
            if (DATA2.status) {
                const contenedorTarjetas = document.getElementById(`contenedorDeTarjetas${row.id_pedido_cliente}`);
                contenedorTarjetas.innerHTML = '';
                DATA2.dataset.forEach((row2) => {
                    contenedorTarjetas.innerHTML += `
                    <div class="containerCards col-lg-3 d-flex flex-wrap m-3">
                        <div class="containerCard col-lg-12 flex-wrap" id="cardPedido">
                            <div class="card">
                                <!--Contenedor de la imagen-->
                                <img src="${SERVER_URL}helpers/images/zapatos/${row2.foto_detalle_zapato}" class="card-img-top img-fluid" alt="${row2.nombre_zapato}">
                                <!--Contenedor del cuerpo de la card-->
                                <div class="card-body">
                                    <!--Contenedor de nombre zapato-->
                                    <div class="ContenedorNombreZapato col-lg-12">
                                        <h4 class="titillium-web-semibold text-center" id="nombreZapato">${row2.nombre_zapato}</h4>
                                    </div>
                                    <!--Contenedor del color y talla-->
                                    <div class="ContenedorColorTalla col-lg-12 d-flex">
                                        <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorColor">
                                            <h6 class="titillium-web-extralight me-1">Color: ${row2.nombre_color}</h6>
                                        </div>
                                        <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorTalla">
                                            <h6 class="titillium-web-extralight me-1">Talla</h6>
                                            <div id="talla">
                                                <h6 id="tallaPedido">${row2.num_talla}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <!--Contenedor de la cantidad-->
                                    <div class="contenedorCantidad col-lg-12 justify-content-center align-items-center mt-2">
                                        <h6 class="titillium-web-extralight text-center" id="cantidadPedido">Cantidad: ${row2.cantidad_pedido}</h6>
                                    </div>
                                </div>
                                <!--Contenedor del footer-->
                                <div class="card-footer bg-color-4blue">
                                    <!--Contenedor del precio-->
                                    <div class="d-flex contenedorPrecios col-lg-12">
                                        <div class="col-lg-6 d-flex justify-content-start">
                                            <h6 class="titillium-web-bold text-white" id="precioZapato">$${row2.precio_unitario_zapato}</h6>
                                        </div>
                                        <div class="col-lg-6 d-flex justify-content-end">
                                            <h6 class="titillium-web-extralight text-white" id="cantidadTotal">Total: $${row2.precio_total}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                });
            } else {
                await sweetAlert(2, DATA2.error, true);
            }
        });

        if (DATA.dataset == 0) {
            await sweetAlert(1, DATA.message, true);
        }

    } else {
        await sweetAlert(2, DATA.error, true);
    }
}

const fillTableRepartidors = async (form = null) => {
    CONTENEDOR_REPARTIDOR.innerHTML = '';
    // Petición para obtener los registros disponibles.
    (form) ? action = 'searchOrdersWorkers' : action = 'readAllOrdersDeliverys';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PEDIDOS_API, action, form);

    if (DATA.status) {

        DATA.dataset.forEach(async (row) => {
            CONTENEDOR_REPARTIDOR.innerHTML += `
            <div class="detalleInformacion accordion mt-3 mb-4" id="detalleInformacion${row.id_trabajador}">
                <div class="accordion-item">
                    <!--HEADER del accordion-->
                    <div id="detalleInformacionHeader" class="accordion-header"
                        data-bs-parent="#detalleInformacion${row.id_trabajador}">
                        <!--Contenedor del cuerpo-->
                        <div id="contenedorDelAcordionSoloHeaderAndBody">
                            <div class="col-lg-12 container mt-3 d-flex flex-wrap m-3 justify-content-center align-items-cente flex-wrap"
                                id="detallesDelRepartidor">
                                <!--Info del repartidor y cliente-->
                                <div class="container mt-4 mb-2"
                                    id="infoDeRepartidorDelApartadoDelRepartidor">
                                    <div class="col-lg-3 me-2 img1">
                                        <img src="../../recursos/imagenes/icons/iconodeusuarioblancoyfondoazul.svg"
                                            class="img-fluid" alt="Icono de usuario">
                                    </div>
                                    <div class="col-lg-4 d-flex flex-column flex-wrap">
                                        <h6 class="titillium-web"
                                            id="idRepartidorApartadoRepartidor">
                                            <b>ID del repartidor:</b> ${row.id_trabajador}
                                        </h6>
                                        <h6 class="titillium-web"
                                            id="nombreRepartidorApartadoRepartidor">
                                            <b>Nombre del repartidor:</b> ${row.nombre_trabajador} ${row.apellido_trabajador}
                                        </h6>
                                        <h6 class="titillium-web"
                                            id="correoRepartidorApartadoRepartidor">
                                            <b>Correo del repartidor:</b>
                                            ${row.correo_trabajador}
                                        </h6>
                                        <h6 class="titillium-web"
                                            id="telefonoRepartidorApartadoRepartidor">
                                            <b>Teléfono del repartidor:</b> ${row.telefono_trabajador}
                                        </h6>
                                        <h6 class="titillium-web"
                                            id="pedidosRealizadosDelRepartidor">
                                            <b>Pedidos realizados:</b> ${row.entregado}
                                        </h6>
                                    </div>
                                </div>
                                <!-- Detalles del Más Pedido (Body) del acordion-->
                                <div id="collapse${row.id_trabajador}Repartidor"
                                    class="accordion-collapse collapse show col-lg-12">
                                    <div class="accordion-body"
                                        id="detallesDeRepatidorMasPedido">
                                        <div class="col-lg-12">
                                            <div class="container">
                                                <!--Contenedor de todas las categorias del pedido-->
                                                <div id="contenedorCategoriaPedido"
                                                    class="col-lg-12 mt-5 mb-3 d-flex align-items-center">
                                                    <!--contenedor de Nuevos Pedidos-->
                                                    <div id="divPedidosPendientes${row.id_trabajador}"
                                                        class="bg-color-1blue rounded-2 ms-2 col-lg-3 d-flex 
                                                        flex-column justify-content-center align-items-center nuevosPedidos"
                                                        onclick="mostrarNuevosPedidos()">
                                                        <div
                                                            class="justify-content-center align-items-center">
                                                            <div class="img2">
                                                                <img src="../../recursos/imagenes/icons/notebook.svg"
                                                                    alt="Icono de libreta">
                                                            </div>
                                                            <h6
                                                                class="titillium-web-bold text-white text-center mt-2">
                                                                Nuevos Pedidos</h6>
                                                            <h6 class="titillium-web-extralight text-white mb-4 text-center"
                                                                id="cantidadNuevosPedidosRepartidor">
                                                                ${row.pendiente}</h6>
                                                        </div>
                                                    </div>
                                                    <!--contenedor de Pedidos en progreso-->
                                                    <div id="divPedidosProgreso${row.id_trabajador}"
                                                        class="bg-color-1blue rounded-2 col-lg-3 d-flex flex-column justify-content-center align-items-center pedidosProgreso"
                                                        onclick="mostrarPedidosProgreso()">
                                                        <div
                                                            class="justify-content-center align-items-center">
                                                            <div class="img3">
                                                                <img src="../../recursos/imagenes/icons/camion.svg"
                                                                    alt="Icono de camion">
                                                            </div>
                                                            <h6
                                                                class="titillium-web-bold text-white text-center mt-2">
                                                                Pedidos en progreso</h6>
                                                            <h6 class="titillium-web-extralight text-white mb-4 text-center"
                                                                id="cantidadProgresoPedidosRepartidor">
                                                                ${row.en_proceso}</h6>
                                                        </div>
                                                    </div>
                                                    <!--contenedor de Pedidos Entregados-->
                                                    <div id="divPedidosEntregados${row.id_trabajador}"
                                                        class="bg-color-1blue rounded-2 col-lg-3 d-flex flex-column justify-content-center align-items-center pedidosEntregados"
                                                        onclick="mostrarPedidosEntregados()">
                                                        <div
                                                            class="justify-content-center align-items-center">
                                                            <div class="img4">
                                                                <img src="../../recursos/imagenes/icons/entregado.svg"
                                                                    alt="Icono de entregado">
                                                            </div>
                                                            <h6
                                                                class="titillium-web-bold text-white text-center mt-2">
                                                                Pedidos Entregados
                                                            </h6>
                                                            <h6 class="titillium-web-extralight text-white mb-4 text-center"
                                                                id="cantidadEntregadosPedidosRepartidor">
                                                                ${row.entregado}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!--Contenedor para las card de pedidos-->
                                                <!--!NUEVOS PEDIDIOS-->
                                                <div id="cardsDeNuevosPedidos${row.id_trabajador}"
                                                    class="mt-4 col-lg-12 d-none d-flex flex-column">
                                                    <div
                                                        class="contenedorDeNuevosPedidosImagenTexto offset-lg-2 col-lg-8 bg-color-4blue d-flex justify-content-center align-items-center rounded-3">
                                                        <img id="imagenPedido"
                                                            src="../../recursos/imagenes/icons/notebook.svg"
                                                            class="img-fluid mt-3 mb-3 me-1 ms-1"
                                                            alt="Icono de libreta">
                                                        <h6 class="titillium-web-bold text-white me-1"
                                                            id="textoDelCabezado">
                                                            Nuevos Pedidos</h6>
                                                        <h6 class="titillium-web-extralight text-white me-1"
                                                            id="cantidadNuevosPedidosRepartidor">
                                                            ${row.pendiente}</h6>
                                                    </div>
                                                    <!--Comienzo de cards de zapatos-->
                                                    <div id="cardsDePedidoPendiente${row.id_trabajador}"
                                                        class="col-lg-12">
                                                        
                                                    </div>
                                                    <div>
                                                        <button type="button"
                                                            class="btn btn3 btn-primary ms-2 shadow text18 titillium-web-regular bg-color-5blue"
                                                            onclick="regresar()" id="botonRegresar${row.id_trabajador}">Regresar</button>
                                                    </div>
                                                </div>
                                                <!--!Pedidos en progreso-->
                                                <div id="cardsDePedidosProgreso${row.id_trabajador}"
                                                    class="mt-4 col-lg-12 d-none">
                                                    <div
                                                        class="contenedorDeNuevosPedidosImagenTexto offset-lg-2 col-lg-8 bg-color-4blue d-flex justify-content-center align-items-center rounded-3">
                                                        <img id="imagenPedido"
                                                            src="../../recursos/imagenes/icons/camion.svg"
                                                            class="img-fluid mt-3 mb-3 me-1 ms-1"
                                                            alt="Icono de libreta">
                                                        <h6 class="titillium-web-bold text-white me-1"
                                                            id="textoDelCabezado">
                                                            Pedidos en progreso</h6>
                                                        <h6 class="titillium-web-extralight text-white me-1"
                                                            id="cantidadNuevosPedidosRepartidor">
                                                            ${row.en_proceso}</h6>
                                                    </div>
                                                    <!--Comienzo de cards de zapatos-->
                                                    <div id="cardsDeZapatoProgeso${row.id_trabajador}"
                                                    class="col-lg-12">
                                                
                                                    </div>
                                                    <div>
                                                        <button type="button"
                                                            class="btn btn3 btn-primary ms-2 shadow text18 titillium-web-regular bg-color-5blue"
                                                            onclick="regresar()" id="botonRegresar2${row.id_trabajador}">Regresar</button>
                                                    </div>
                                                </div>
                                                <!--!Apartado de entregado-->
                                                <div id="cardsDePedidosEntregado${row.id_trabajador}"
                                                    class="mt-4 col-lg-12 d-none">
                                                    <div
                                                        class="contenedorDeNuevosPedidosImagenTexto offset-lg-2 col-lg-8 bg-color-4blue d-flex justify-content-center align-items-center rounded-3">
                                                        <img id="imagenPedido"
                                                            src="../../recursos/imagenes/icons/entregado.svg"
                                                            class="img-fluid mt-3 mb-3 me-1 ms-1"
                                                            alt="Icono de libreta">
                                                        <h6 class="titillium-web-bold text-white me-1"
                                                            id="textoDelCabezado">
                                                            Pedidos
                                                            Entregado</h6>
                                                        <h6 class="titillium-web-extralight text-white me-1"
                                                            id="cantidadNuevosPedidosRepartidor">
                                                            ${row.entregado}</h6>
                                                    </div>
                                                    <!--Comienzo de cards de zapatos-->
                                                    <div id="cardsDeZapatoEntregado${row.id_trabajador}"
                                                        class="col-lg-12">

                                                    </div>
                                                    <div>
                                                        <button type="button"
                                                            class="btn btn3 btn-primary ms-2 shadow text18 titillium-web-regular bg-color-5blue"
                                                            onclick="regresar()" id="botonRegresar3${row.id_trabajador}">Regresar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Botón (Footer) -->
                        <div class="offset-lg-9 col-lg-3">
                            <button id="accordionButtonRepartidor${row.id_trabajador}"
                                class="accordion-button rounded-bottom rounded-top-0"
                                type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapse${row.id_trabajador}Repartidor" aria-expanded="true"
                                aria-controls="collapse${row.id_trabajador}Repartidor">
                                Ver más información
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

        });

        if (DATA.dataset == 0) {
            await sweetAlert(1, DATA.message, true);
        }

    } else {
        await sweetAlert(2, DATA.error, true);
    }
}

// Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM_REPARTIDOR.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    const BUSCADOR_INPUT_PEDIDO = document.getElementById('buscadorInputRepartidor');
    var texto = BUSCADOR_INPUT_PEDIDO.value.trim();


    // Constante tipo objeto con los datos del formulario.
    const FORM1 = new FormData();
    FORM1.append('paramentro', texto);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    await fillTableRepartidors(FORM1);

    // Objeto para almacenar botones de acordeón y detalles correspondientes
    const accordionButtonsRepartidors = {};
    const isExpandedsReportidors = {};

    const DATA = await fetchData(PEDIDOS_API, 'searchOrdersWorkers', FORM1);

    if (DATA.status) {

        DATA.dataset.forEach(row => {
            // Selecciona el botón de accordion correspondiente a este 'row'
            const accordionButton = document.getElementById(`accordionButtonRepartidor${row.id_trabajador}`);
            accordionButtonsRepartidors[row.id_trabajador] = accordionButton;

            // Agrega un evento click al botón del accordion
            accordionButtonsRepartidors[row.id_trabajador].addEventListener('click', function () {

                const isExpanded = accordionButtonsRepartidors[row.id_trabajador].getAttribute('aria-expanded') === 'true';

                // Cambia el estado del acordeón
                isExpandedsReportidors[row.id_trabajador] = !isExpandedsReportidors[row.id_trabajador];

                // Cambia el texto del botón según si está expandiendo o contrayendo
                if (isExpandedsReportidors[row.id_trabajador]) {
                    accordionButtonsRepartidors[row.id_trabajador].textContent = 'Ver más información';
                } else {
                    accordionButtonsRepartidors[row.id_trabajador].textContent = 'Ver menos información';
                }

            });

            accordionButtonsRepartidors[row.id_trabajador].click();
        });
    }
    else {
    }

    const DATA2 = await fetchData(PEDIDOS_API, 'searchOrdersWorkers', FORM1);
    const actionButtonPendientes = {};
    const actionButtonEnCaminos = {};
    const actionButtonEntregados = {};
    const actionBack = {};
    const actionBack2 = {};
    const actionBack3 = {};
    const DIVPendientes = {};
    const DIVEnCaminos = {};
    const DIVEntregados = {};

    if (DATA2.status) {

        DATA2.dataset.forEach(row => {
            // Selecciona el botón de accordion correspondiente a este 'row'
            const actionButtonPendiente = document.getElementById(`divPedidosPendientes${row.id_trabajador}`);
            actionButtonPendientes[row.id_trabajador] = actionButtonPendiente;

            const divPendiente = document.getElementById(`cardsDeNuevosPedidos${row.id_trabajador}`);
            DIVPendientes[row.id_trabajador] = divPendiente;

            const actionButtonEnCamino = document.getElementById(`divPedidosProgreso${row.id_trabajador}`);
            actionButtonEnCaminos[row.id_trabajador] = actionButtonEnCamino;

            const divEnCamino = document.getElementById(`cardsDePedidosProgreso${row.id_trabajador}`);
            DIVEnCaminos[row.id_trabajador] = divEnCamino;

            const actionButtonEntregado = document.getElementById(`divPedidosEntregados${row.id_trabajador}`);
            actionButtonEntregados[row.id_trabajador] = actionButtonEntregado;

            const divEntregado = document.getElementById(`cardsDePedidosEntregado${row.id_trabajador}`);
            DIVEntregados[row.id_trabajador] = divEntregado;

            const buttonBack = document.getElementById(`botonRegresar${row.id_trabajador}`);
            actionBack[row.id_trabajador] = buttonBack;

            const buttonBack2 = document.getElementById(`botonRegresar2${row.id_trabajador}`);
            actionBack2[row.id_trabajador] = buttonBack2;

            const buttonBack3 = document.getElementById(`botonRegresar3${row.id_trabajador}`);
            actionBack3[row.id_trabajador] = buttonBack3;

            // Agrega un evento click al botón del accordion
            actionButtonPendientes[row.id_trabajador].addEventListener('click', async () => {
                // Obtener el color actual del DIV_PEDIDO_PENDIENTE
                var colorActual = window.getComputedStyle(actionButtonPendientes[row.id_trabajador]).backgroundColor;

                // Verificar el color actual y ejecutar la lógica correspondiente
                if (colorActual === 'rgb(20, 106, 147)') { // Color '#146A93' en formato RGB
                    DIVPendientes[row.id_trabajador].classList.add('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                } else {
                    // si el color no es el esperado
                    DIVPendientes[row.id_trabajador].classList.remove('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');

                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#146A93';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';

                    const FORMDATA = new FormData();
                    FORMDATA.append('idTrabajador', row.id_trabajador);
                    FORMDATA.append('estado', 1);

                    const DATA3 = await fetchData(PEDIDOS_API, 'ReadOrderOfDeliverys', FORMDATA);

                    if (DATA3.status) {
                        const CONTENEDOR_PEDIDOS_PENDIENTE = document.getElementById(`cardsDePedidoPendiente${row.id_trabajador}`);
                        CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML = '';

                        const accordionButtons = {};
                        const infoRepartidors = {};
                        const isExpandeds = {};

                        DATA3.dataset.forEach(async (row2) => {
                            var estado = row2.estado_pedido;
                            CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML += `
                            <div class="accordion detalleInformacion mt-3 mb-4" id="detalleInformacion">
                                <div class="accordion-item">
                                    <!--HEADER del accordion-->
                                    <div id="detalleInformacionHeader" class="accordion-header" data-bs-parent="#detalleInformacion">
                                        <!--Etiqueta del pedido-->
                                        <div class="col-lg-3">
                                            <p id="idPedidoNum" class="rounded-top text-center pt-2 pb-2 titillium-web-bold color-5blue">
                                                Pedido N# ${row2.id_pedido_cliente}
                                            </p>
                                        </div>
                                        <!--Contenedor del cuerpo-->
                                        <div id="contenedorDelAcordionSoloHeaderAndBody">
                                            <div class="col-lg-12 container mt-3 d-flex flex-wrap m-3 justify-content-center align-items-center" id="detallesDelPedido">
                                                ${row2.estado_pedido === 'Pendiente' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-danger pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : row2.estado_pedido === 'En camino' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-warning pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-success pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                `}
                                                <!--Info del repartidor y cliente-->
                                                <div class="infoDeRepartidor container d-none col-lg-12 d-flex justify-content-center mt-4 mb-2" id="infoDeRepartidor${row2.id_pedido_cliente}Repartidor">
                                                    <div class="col-lg-3 img1">
                                                        <img src="../../recursos/imagenes/icons/iconodeusuarioblancoyfondoazul.svg" alt="Icono de usuario">
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <h6 class="titillium-web" id="nombreCliente">
                                                            <b>Nombre del cliente:</b> ${row2.nombre_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="correoCliente">
                                                            <b>Correo del cliente:</b> ${row2.correo_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="telefonoCliente">
                                                            <b>Teléfono del cliente:</b> ${row2.telefono_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="direccionCliente">
                                                            <b>Dirección del cliente:</b> ${row2.direccion_cliente}
                                                        </h6>
                                                    </div>
                                                </div>
                                                <!--Comienzo de cards de zapato-->
                                                <div id="contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor" class="col-lg-12 d-flex flex-wrap justify-content-center mt-3">
                                                    <!-- Las tarjetas de zapato se insertarán aquí -->

                                                </div>
                                                <!-- Detalles del Más Pedido (Body) del acordion-->
                                                <div id="collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                                class="accordion-collapse collapse show col-lg-12">
                                                    <div class="accordion-body" id="detallesDeMasPedido">
                                                        <div class="col-lg-12">
                                                            <div class="container">
                                                                <!--Contenedor de boton de entrega y precio total-->
                                                                <div class="row col-lg-12">
                                                                    <!--Contenedor del boton de iniciar entrega -->
                                                                    <div class="col-lg-6 d-flex justify-content-center">
                                                                        ${row2.estado_pedido === 'Pendiente' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'En camino')">
                                                                            Iniciar entrega
                                                                        </button>
                                                                        ` : row2.estado_pedido === 'En camino' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'Entregado')">
                                                                            Entregado
                                                                        </button>
                                                                        ` : `
                                                                        `}
                                                                    </div>
                                                                    <!--Contenedor de los precios-->
                                                                    <div class="col-lg-6" id="containerTotales">
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalPediod">Total del pedido: $${row2.precio_total}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="envio">Envío: $${row2.costo_de_envio}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalCobrar">Total a cobrar: $${row2.total_cobrar}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Botón (Footer) -->
                                        <div class="offset-lg-9 col-lg-3">
                                            <button id="accordionButton${row2.id_pedido_cliente}Repartidor" 
                                            class="accordion-button rounded-bottom rounded-top-0" 
                                            type="button" data-bs-toggle="collapse" 
                                            data-bs-target="#collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                            aria-expanded="true" aria-controls="collapse${row2.id_pedido_cliente}PedidoRepartidor">
                                                Ver más información
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;

                            // Selecciona el botón de accordion correspondiente a este 'row'
                            const accordionButton = document.getElementById(`accordionButton${row2.id_pedido_cliente}Repartidor`);
                            accordionButtons[row2.id_pedido_cliente] = accordionButton;
                            // Selecciona el contenedor de detalles correspondiente a este 'row'
                            const detallesDeMasPedido = document.getElementById(`infoDeRepartidor${row2.id_pedido_cliente}Repartidor`);
                            infoRepartidors[row2.id_pedido_cliente] = detallesDeMasPedido;

                            // Agrega un evento click al botón del accordion
                            accordionButtons[row2.id_pedido_cliente].addEventListener('click', function () {

                                const isExpanded = accordionButtons[row2.id_pedido_cliente].getAttribute('aria-expanded') === 'true';

                                // Inicializa el estado del acordeón como contraído
                                isExpandeds[row2.id_pedido_cliente] = isExpanded;

                                // Cambia el estado del acordeón
                                isExpandeds[row2.id_pedido_cliente] = !isExpandeds[row2.id_pedido_cliente];

                                // Cambia el texto del botón según si está expandiendo o contrayendo
                                if (isExpandeds[row2.id_pedido_cliente]) {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver más información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.add('d-none');
                                } else {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver menos información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.remove('d-none');
                                }

                            });

                            accordionButtons[row2.id_pedido_cliente].click();

                            const FORM_ID = new FormData();
                            FORM_ID.append('idPedido', row2.id_pedido_cliente);
                            const DATA5 = await fetchData(PEDIDOS_API, 'ReadAllShoesOfOneOrder', FORM_ID);
                            if (DATA5.status) {
                                const contenedorTarjetas = document.getElementById(`contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor`);
                                contenedorTarjetas.innerHTML = '';

                                DATA5.dataset.forEach((row3) => {
                                    contenedorTarjetas.innerHTML += `
                                        <div class="containerCards col-lg-3 d-flex flex-wrap m-3">
                                            <div class="containerCard col-lg-12 flex-wrap" id="cardPedido">
                                                <div class="card">
                                                    <!--Contenedor de la imagen-->
                                                    <img src="${SERVER_URL}helpers/images/zapatos/${row3.foto_detalle_zapato}" class="card-img-top img-fluid" alt="${row2.nombre_zapato}">
                                                    <!--Contenedor del cuerpo de la card-->
                                                    <div class="card-body">
                                                        <!--Contenedor de nombre zapato-->
                                                        <div class="ContenedorNombreZapato col-lg-12">
                                                            <h4 class="titillium-web-semibold text-center" id="nombreZapato">${row3.nombre_zapato}</h4>
                                                        </div>
                                                        <!--Contenedor del color y talla-->
                                                        <div class="ContenedorColorTalla col-lg-12 d-flex">
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorColor">
                                                                <h6 class="titillium-web-extralight me-1">Color: ${row3.nombre_color}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorTalla">
                                                                <h6 class="titillium-web-extralight me-1">Talla</h6>
                                                                <div id="talla">
                                                                    <h6 id="tallaPedido">${row3.num_talla}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--Contenedor de la cantidad-->
                                                        <div class="contenedorCantidad col-lg-12 justify-content-center align-items-center mt-2">
                                                            <h6 class="titillium-web-extralight text-center" id="cantidadPedido">Cantidad: ${row3.cantidad_pedido}</h6>
                                                        </div>
                                                    </div>
                                                    <!--Contenedor del footer-->
                                                    <div class="card-footer bg-color-4blue">
                                                        <!--Contenedor del precio-->
                                                        <div class="d-flex contenedorPrecios col-lg-12">
                                                            <div class="col-lg-6 d-flex justify-content-start">
                                                                <h6 class="titillium-web-bold text-white" id="precioZapato">$${row3.precio_unitario_zapato}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex justify-content-end">
                                                                <h6 class="titillium-web-extralight text-white" id="cantidadTotal">Total: $${row3.precio_total}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                });
                            } else {
                                await sweetAlert(2, DATA5.error, true);
                            }

                        });
                    }
                    else {
                        await sweetAlert(2, DATA3.error, true);
                    }
                }
            });

            // Agrega un evento click al botón del accordion
            actionButtonEnCaminos[row.id_trabajador].addEventListener('click', async () => {
                // Obtener el color actual del DIV_PEDIDO_PENDIENTE
                var colorActual = window.getComputedStyle(actionButtonEnCaminos[row.id_trabajador]).backgroundColor;

                // Verificar el color actual y ejecutar la lógica correspondiente
                if (colorActual === 'rgb(20, 106, 147)') { // Color '#146A93' en formato RGB
                    DIVPendientes[row.id_trabajador].classList.add('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                } else {
                    // si el color no es el esperado
                    DIVEnCaminos[row.id_trabajador].classList.remove('d-none');
                    DIVPendientes[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');

                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#146A93';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';

                    const FORMDATA = new FormData();
                    FORMDATA.append('idTrabajador', row.id_trabajador);
                    FORMDATA.append('estado', 2);

                    const DATA3 = await fetchData(PEDIDOS_API, 'ReadOrderOfDeliverys', FORMDATA);

                    if (DATA3.status) {
                        const CONTENEDOR_PEDIDOS_PENDIENTE = document.getElementById(`cardsDeZapatoProgeso${row.id_trabajador}`);
                        CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML = '';
                        const accordionButtons = {};
                        const infoRepartidors = {};
                        const isExpandeds = {};

                        DATA3.dataset.forEach(async (row2) => {
                            var estado = row2.estado_pedido;
                            CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML += `
                            <div class="accordion detalleInformacion mt-3 mb-4" id="detalleInformacion">
                                <div class="accordion-item">
                                    <!--HEADER del accordion-->
                                    <div id="detalleInformacionHeader" class="accordion-header" data-bs-parent="#detalleInformacion">
                                        <!--Etiqueta del pedido-->
                                        <div class="col-lg-3">
                                            <p id="idPedidoNum" class="rounded-top text-center pt-2 pb-2 titillium-web-bold color-5blue">
                                                Pedido N# ${row2.id_pedido_cliente}
                                            </p>
                                        </div>
                                        <!--Contenedor del cuerpo-->
                                        <div id="contenedorDelAcordionSoloHeaderAndBody">
                                            <div class="col-lg-12 container mt-3 d-flex flex-wrap m-3 justify-content-center align-items-center" id="detallesDelPedido">
                                                ${row2.estado_pedido === 'Pendiente' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-danger pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : row2.estado_pedido === 'En camino' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-warning pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-success pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                `}
                                                <!--Info del repartidor y cliente-->
                                                <div class="infoDeRepartidor container d-none col-lg-12 d-flex justify-content-center mt-4 mb-2" id="infoDeRepartidor${row2.id_pedido_cliente}Repartidor">
                                                    <div class="col-lg-3 img1">
                                                        <img src="../../recursos/imagenes/icons/iconodeusuarioblancoyfondoazul.svg" alt="Icono de usuario">
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <h6 class="titillium-web" id="nombreCliente">
                                                            <b>Nombre del cliente:</b> ${row2.nombre_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="correoCliente">
                                                            <b>Correo del cliente:</b> ${row2.correo_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="telefonoCliente">
                                                            <b>Teléfono del cliente:</b> ${row2.telefono_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="direccionCliente">
                                                            <b>Dirección del cliente:</b> ${row2.direccion_cliente}
                                                        </h6>
                                                    </div>
                                                </div>
                                                <!--Comienzo de cards de zapato-->
                                                <div id="contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor" class="col-lg-12 d-flex flex-wrap justify-content-center mt-3">
                                                    <!-- Las tarjetas de zapato se insertarán aquí -->

                                                </div>
                                                <!-- Detalles del Más Pedido (Body) del acordion-->
                                                <div id="collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                                class="accordion-collapse collapse show col-lg-12">
                                                    <div class="accordion-body" id="detallesDeMasPedido">
                                                        <div class="col-lg-12">
                                                            <div class="container">
                                                                <!--Contenedor de boton de entrega y precio total-->
                                                                <div class="row col-lg-12">
                                                                    <!--Contenedor del boton de iniciar entrega -->
                                                                    <div class="col-lg-6 d-flex justify-content-center">
                                                                        ${row2.estado_pedido === 'Pendiente' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'En camino')">
                                                                            Iniciar entrega
                                                                        </button>
                                                                        ` : row2.estado_pedido === 'En camino' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'Entregado')">
                                                                            Entregado
                                                                        </button>
                                                                        ` : `
                                                                        `}
                                                                    </div>
                                                                    <!--Contenedor de los precios-->
                                                                    <div class="col-lg-6" id="containerTotales">
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalPediod">Total del pedido: $${row2.precio_total}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="envio">Envío: $${row2.costo_de_envio}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalCobrar">Total a cobrar: $${row2.total_cobrar}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Botón (Footer) -->
                                        <div class="offset-lg-9 col-lg-3">
                                            <button id="accordionButton${row2.id_pedido_cliente}Repartidor" 
                                            class="accordion-button rounded-bottom rounded-top-0" 
                                            type="button" data-bs-toggle="collapse" 
                                            data-bs-target="#collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                            aria-expanded="true" aria-controls="collapse${row2.id_pedido_cliente}PedidoRepartidor">
                                                Ver más información
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;

                            // Selecciona el botón de accordion correspondiente a este 'row'
                            const accordionButton = document.getElementById(`accordionButton${row2.id_pedido_cliente}Repartidor`);
                            accordionButtons[row2.id_pedido_cliente] = accordionButton;
                            // Selecciona el contenedor de detalles correspondiente a este 'row'
                            const detallesDeMasPedido = document.getElementById(`infoDeRepartidor${row2.id_pedido_cliente}Repartidor`);
                            infoRepartidors[row2.id_pedido_cliente] = detallesDeMasPedido;

                            // Agrega un evento click al botón del accordion
                            accordionButtons[row2.id_pedido_cliente].addEventListener('click', function () {

                                const isExpanded = accordionButtons[row2.id_pedido_cliente].getAttribute('aria-expanded') === 'true';

                                // Inicializa el estado del acordeón como contraído
                                isExpandeds[row2.id_pedido_cliente] = isExpanded;

                                // Cambia el estado del acordeón
                                isExpandeds[row2.id_pedido_cliente] = !isExpandeds[row2.id_pedido_cliente];

                                // Cambia el texto del botón según si está expandiendo o contrayendo
                                if (isExpandeds[row2.id_pedido_cliente]) {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver más información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.add('d-none');
                                } else {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver menos información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.remove('d-none');
                                }

                            });

                            accordionButtons[row2.id_pedido_cliente].click();

                            const FORM_ID = new FormData();
                            FORM_ID.append('idPedido', row2.id_pedido_cliente);
                            const DATA5 = await fetchData(PEDIDOS_API, 'ReadAllShoesOfOneOrder', FORM_ID);
                            if (DATA5.status) {
                                const contenedorTarjetas = document.getElementById(`contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor`);
                                contenedorTarjetas.innerHTML = '';
                                DATA5.dataset.forEach((row3) => {
                                    contenedorTarjetas.innerHTML += `
                                        <div class="containerCards col-lg-3 d-flex flex-wrap m-3">
                                            <div class="containerCard col-lg-12 flex-wrap" id="cardPedido">
                                                <div class="card">
                                                    <!--Contenedor de la imagen-->
                                                    <img src="${SERVER_URL}helpers/images/zapatos/${row3.foto_detalle_zapato}" class="card-img-top img-fluid" alt="${row2.nombre_zapato}">
                                                    <!--Contenedor del cuerpo de la card-->
                                                    <div class="card-body">
                                                        <!--Contenedor de nombre zapato-->
                                                        <div class="ContenedorNombreZapato col-lg-12">
                                                            <h4 class="titillium-web-semibold text-center" id="nombreZapato">${row3.nombre_zapato}</h4>
                                                        </div>
                                                        <!--Contenedor del color y talla-->
                                                        <div class="ContenedorColorTalla col-lg-12 d-flex">
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorColor">
                                                                <h6 class="titillium-web-extralight me-1">Color: ${row3.nombre_color}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorTalla">
                                                                <h6 class="titillium-web-extralight me-1">Talla</h6>
                                                                <div id="talla">
                                                                    <h6 id="tallaPedido">${row3.num_talla}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--Contenedor de la cantidad-->
                                                        <div class="contenedorCantidad col-lg-12 justify-content-center align-items-center mt-2">
                                                            <h6 class="titillium-web-extralight text-center" id="cantidadPedido">Cantidad: ${row3.cantidad_pedido}</h6>
                                                        </div>
                                                    </div>
                                                    <!--Contenedor del footer-->
                                                    <div class="card-footer bg-color-4blue">
                                                        <!--Contenedor del precio-->
                                                        <div class="d-flex contenedorPrecios col-lg-12">
                                                            <div class="col-lg-6 d-flex justify-content-start">
                                                                <h6 class="titillium-web-bold text-white" id="precioZapato">$${row3.precio_unitario_zapato}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex justify-content-end">
                                                                <h6 class="titillium-web-extralight text-white" id="cantidadTotal">Total: $${row3.precio_total}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                });
                            } else {
                                await sweetAlert(2, DATA5.error, true);
                            }

                        });
                    }
                    else {
                        await sweetAlert(2, DATA3.error, true);
                    }
                }
            });

            // Agrega un evento click al botón del accordion
            actionButtonEntregados[row.id_trabajador].addEventListener('click', async () => {
                // Obtener el color actual del DIV_PEDIDO_PENDIENTE
                var colorActual = window.getComputedStyle(actionButtonEntregados[row.id_trabajador]).backgroundColor;

                // Verificar el color actual y ejecutar la lógica correspondiente
                if (colorActual === 'rgb(20, 106, 147)') { // Color '#146A93' en formato RGB
                    DIVPendientes[row.id_trabajador].classList.add('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVEntregados[row.id_trabajador].classList.add('d-none');
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                } else {
                    // si el color no es el esperado
                    DIVEntregados[row.id_trabajador].classList.remove('d-none');
                    DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                    DIVPendientes[row.id_trabajador].classList.add('d-none');

                    actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#146A93';
                    actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                    actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';

                    const FORMDATA = new FormData();
                    FORMDATA.append('idTrabajador', row.id_trabajador);
                    FORMDATA.append('estado', 3);

                    const DATA3 = await fetchData(PEDIDOS_API, 'ReadOrderOfDeliverys', FORMDATA);

                    if (DATA3.status) {
                        const CONTENEDOR_PEDIDOS_PENDIENTE = document.getElementById(`cardsDeZapatoEntregado${row.id_trabajador}`);
                        CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML = '';

                        const accordionButtons = {};
                        const infoRepartidors = {};
                        const isExpandeds = {};

                        DATA3.dataset.forEach(async (row2) => {
                            var estado = row2.estado_pedido;
                            CONTENEDOR_PEDIDOS_PENDIENTE.innerHTML += `
                            <div class="accordion detalleInformacion mt-3 mb-4" id="detalleInformacion">
                                <div class="accordion-item">
                                    <!--HEADER del accordion-->
                                    <div id="detalleInformacionHeader" class="accordion-header" data-bs-parent="#detalleInformacion">
                                        <!--Etiqueta del pedido-->
                                        <div class="col-lg-3">
                                            <p id="idPedidoNum" class="rounded-top text-center pt-2 pb-2 titillium-web-bold color-5blue">
                                                Pedido N# ${row2.id_pedido_cliente}
                                            </p>
                                        </div>
                                        <!--Contenedor del cuerpo-->
                                        <div id="contenedorDelAcordionSoloHeaderAndBody">
                                            <div class="col-lg-12 container mt-3 d-flex flex-wrap m-3 justify-content-center align-items-center" id="detallesDelPedido">
                                                ${row2.estado_pedido === 'Pendiente' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-danger pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : row2.estado_pedido === 'En camino' ? `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-warning pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                ` : `
                                                <!--Contenedor de la etiqueta del pedido-->
                                                <div class="offset-lg-9 col-lg-3 bg-success pt-1 mb-3 rounded skew-div" id="colorDelEstadoDelPedido">
                                                    <h6 class="text-white skew-text text-center" id="nombreDelEstadoDelPedido">${row2.estado_pedido}</h6>
                                                </div>
                                                `}
                                                <!--Info del repartidor y cliente-->
                                                <div class="infoDeRepartidor container d-none col-lg-12 d-flex justify-content-center mt-4 mb-2" id="infoDeRepartidor${row2.id_pedido_cliente}Repartidor">
                                                    <div class="col-lg-3 img1">
                                                        <img src="../../recursos/imagenes/icons/iconodeusuarioblancoyfondoazul.svg" alt="Icono de usuario">
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <h6 class="titillium-web" id="nombreCliente">
                                                            <b>Nombre del cliente:</b> ${row2.nombre_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="correoCliente">
                                                            <b>Correo del cliente:</b> ${row2.correo_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="telefonoCliente">
                                                            <b>Teléfono del cliente:</b> ${row2.telefono_cliente}
                                                        </h6>
                                                        <h6 class="titillium-web" id="direccionCliente">
                                                            <b>Dirección del cliente:</b> ${row2.direccion_cliente}
                                                        </h6>
                                                    </div>
                                                </div>
                                                <!--Comienzo de cards de zapato-->
                                                <div id="contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor" class="col-lg-12 d-flex flex-wrap justify-content-center mt-3">
                                                    <!-- Las tarjetas de zapato se insertarán aquí -->

                                                </div>
                                                <!-- Detalles del Más Pedido (Body) del acordion-->
                                                <div id="collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                                class="accordion-collapse collapse show col-lg-12">
                                                    <div class="accordion-body" id="detallesDeMasPedido">
                                                        <div class="col-lg-12">
                                                            <div class="container">
                                                                <!--Contenedor de boton de entrega y precio total-->
                                                                <div class="row col-lg-12">
                                                                    <!--Contenedor del boton de iniciar entrega -->
                                                                    <div class="col-lg-6 d-flex justify-content-center">
                                                                        ${row2.estado_pedido === 'Pendiente' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'En camino')">
                                                                            Iniciar entrega
                                                                        </button>
                                                                        ` : row2.estado_pedido === 'En camino' ? `
                                                                        <button type="button" class="col-lg-4 btn btn-primary shadow text18 titillium-web-regular bg-color-5blue" id="botonDePedido" onclick="cambioDeEstado(${row2.id_pedido_cliente}, 'Entregado')">
                                                                            Entregado
                                                                        </button>
                                                                        ` : `
                                                                        `}
                                                                    </div>
                                                                    <!--Contenedor de los precios-->
                                                                    <div class="col-lg-6" id="containerTotales">
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalPediod">Total del pedido: $${row2.precio_total}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="envio">Envío: $${row2.costo_de_envio}</h6>
                                                                        <h6 class="titillium-web-extralight d-flex justify-content-end" id="totalCobrar">Total a cobrar: $${row2.total_cobrar}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Botón (Footer) -->
                                        <div class="offset-lg-9 col-lg-3">
                                            <button id="accordionButton${row2.id_pedido_cliente}Repartidor" 
                                            class="accordion-button rounded-bottom rounded-top-0" 
                                            type="button" data-bs-toggle="collapse" 
                                            data-bs-target="#collapse${row2.id_pedido_cliente}PedidoRepartidor" 
                                            aria-expanded="true" aria-controls="collapse${row2.id_pedido_cliente}PedidoRepartidor">
                                                Ver más información
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;

                            // Selecciona el botón de accordion correspondiente a este 'row'
                            const accordionButton = document.getElementById(`accordionButton${row2.id_pedido_cliente}Repartidor`);
                            accordionButtons[row2.id_pedido_cliente] = accordionButton;
                            // Selecciona el contenedor de detalles correspondiente a este 'row'
                            const detallesDeMasPedido = document.getElementById(`infoDeRepartidor${row2.id_pedido_cliente}Repartidor`);
                            infoRepartidors[row2.id_pedido_cliente] = detallesDeMasPedido;

                            // Agrega un evento click al botón del accordion
                            accordionButtons[row2.id_pedido_cliente].addEventListener('click', function () {

                                const isExpanded = accordionButtons[row2.id_pedido_cliente].getAttribute('aria-expanded') === 'true';

                                // Inicializa el estado del acordeón como contraído
                                isExpandeds[row2.id_pedido_cliente] = isExpanded;

                                // Cambia el estado del acordeón
                                isExpandeds[row2.id_pedido_cliente] = !isExpandeds[row2.id_pedido_cliente];

                                // Cambia el texto del botón según si está expandiendo o contrayendo
                                if (isExpandeds[row2.id_pedido_cliente]) {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver más información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.add('d-none');
                                } else {
                                    accordionButtons[row2.id_pedido_cliente].textContent = 'Ver menos información';
                                    infoRepartidors[row2.id_pedido_cliente].classList.remove('d-none');
                                }

                            });

                            accordionButtons[row2.id_pedido_cliente].click();

                            const FORM_ID = new FormData();
                            FORM_ID.append('idPedido', row2.id_pedido_cliente);
                            const DATA5 = await fetchData(PEDIDOS_API, 'ReadAllShoesOfOneOrder', FORM_ID);
                            if (DATA5.status) {
                                const contenedorTarjetas = document.getElementById(`contenedorDeTarjetas${row2.id_pedido_cliente}Repartidor`);
                                contenedorTarjetas.innerHTML = '';
                                DATA5.dataset.forEach((row3) => {
                                    contenedorTarjetas.innerHTML += `
                                        <div class="containerCards col-lg-3 d-flex flex-wrap m-3">
                                            <div class="containerCard col-lg-12 flex-wrap" id="cardPedido">
                                                <div class="card">
                                                    <!--Contenedor de la imagen-->
                                                    <img src="${SERVER_URL}helpers/images/zapatos/${row3.foto_detalle_zapato}" class="card-img-top img-fluid" alt="${row2.nombre_zapato}">
                                                    <!--Contenedor del cuerpo de la card-->
                                                    <div class="card-body">
                                                        <!--Contenedor de nombre zapato-->
                                                        <div class="ContenedorNombreZapato col-lg-12">
                                                            <h4 class="titillium-web-semibold text-center" id="nombreZapato">${row3.nombre_zapato}</h4>
                                                        </div>
                                                        <!--Contenedor del color y talla-->
                                                        <div class="ContenedorColorTalla col-lg-12 d-flex">
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorColor">
                                                                <h6 class="titillium-web-extralight me-1">Color: ${row3.nombre_color}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex mt-3 justify-content-center align-items-center" id="contenedorTalla">
                                                                <h6 class="titillium-web-extralight me-1">Talla</h6>
                                                                <div id="talla">
                                                                    <h6 id="tallaPedido">${row3.num_talla}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--Contenedor de la cantidad-->
                                                        <div class="contenedorCantidad col-lg-12 justify-content-center align-items-center mt-2">
                                                            <h6 class="titillium-web-extralight text-center" id="cantidadPedido">Cantidad: ${row3.cantidad_pedido}</h6>
                                                        </div>
                                                    </div>
                                                    <!--Contenedor del footer-->
                                                    <div class="card-footer bg-color-4blue">
                                                        <!--Contenedor del precio-->
                                                        <div class="d-flex contenedorPrecios col-lg-12">
                                                            <div class="col-lg-6 d-flex justify-content-start">
                                                                <h6 class="titillium-web-bold text-white" id="precioZapato">$${row3.precio_unitario_zapato}</h6>
                                                            </div>
                                                            <div class="col-lg-6 d-flex justify-content-end">
                                                                <h6 class="titillium-web-extralight text-white" id="cantidadTotal">Total: $${row3.precio_total}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                });
                            } else {
                                await sweetAlert(2, DATA5.error, true);
                            }

                        });
                    }
                    else {
                        await sweetAlert(2, DATA3.error, true);
                    }
                }
            });

            actionBack[row.id_trabajador].addEventListener('click', async () => {
                DIVEntregados[row.id_trabajador].classList.add('d-none');
                DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                DIVPendientes[row.id_trabajador].classList.add('d-none');
                actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
            });

            actionBack2[row.id_trabajador].addEventListener('click', async () => {
                DIVEntregados[row.id_trabajador].classList.add('d-none');
                DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                DIVPendientes[row.id_trabajador].classList.add('d-none');
                actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
            });

            actionBack3[row.id_trabajador].addEventListener('click', async () => {
                DIVEntregados[row.id_trabajador].classList.add('d-none');
                DIVEnCaminos[row.id_trabajador].classList.add('d-none');
                DIVPendientes[row.id_trabajador].classList.add('d-none');
                actionButtonEntregados[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonEnCaminos[row.id_trabajador].style.backgroundColor = '#1591CC';
                actionButtonPendientes[row.id_trabajador].style.backgroundColor = '#1591CC';
            });

        });
    }
    else {
    }
});