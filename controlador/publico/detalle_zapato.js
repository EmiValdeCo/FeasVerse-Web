const CONTAINER_TITLE = document.getElementById('Container_Title');
const CONTAINER_PRECIO_CALIFICACION = document.getElementById('Container_Precio_Calificacion');
const CONTAINER_DESCRIPCION = document.getElementById('Container_Descripcion');
const CONTAINER_IMAGEN = document.getElementById('Container_Imagen');
const CONTAINER_TALLAS = document.getElementById('Container_Tallas');
const CONTAINER_RESEGNAS = document.getElementById('Container_Resegnas');
const CONTAINER_PODRIA_GUSTARTE = document.getElementById('Container_Podria_Gustarte');
const CONTAINER_CANTIDAD_DISPONIBLE = document.getElementById('Container_Cantidad_Disponible');
const ZAPATOS_API = 'services/publica/zapatos.php';
const PEDIDOS_API = 'services/publica/pedidos.php';
// Seleccionar el elemento input
const cantidadInput = document.getElementById('cantidadInput');


// Evento que se dispara cuando el documento HTML ha cargado completamente
document.addEventListener('DOMContentLoaded', async () => {
    // Llama a una función para cargar el encabezado y el pie de página del documento
    loadTemplate();
    fillTable();
});

const fillTable = async () => {
    CONTAINER_TITLE.innerHTML = '';
    CONTAINER_PRECIO_CALIFICACION.innerHTML = '';
    CONTAINER_DESCRIPCION.innerHTML = '';
    CONTAINER_IMAGEN.innerHTML = '';
    const FORM = new FormData();
    // Obtener los parámetros de la URL
    let id_zapato = Number(getQueryParam('zapato'));
    FORM.append('id_zapato', id_zapato);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(ZAPATOS_API, 'readOneDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        fillSelect(ZAPATOS_API, 'readOneColoresZapato', 'coloresInput', '', FORM);
        DATA.dataset.forEach(row => {
            PRECIO_ZAPATO = row.precio_unitario_zapato;
            CONTAINER_TITLE.innerHTML += `
            <!--NOMBRE-->
            <h1 class="m-0 p-0 titillium-web-regular">
                ${row.nombre_marca} ${row.nombre_zapato}
            </h1>
            <!--GENERO-->
            <h6 class="m-0 p-0 titillium-web-regular clgr2">
                Zapatos tipo ${row.genero_zapato} 
            </h6>
            `;
            CONTAINER_PRECIO_CALIFICACION.innerHTML += `
            <!-- PRECIO-->
            <h3 class="m-0 p-0 titillium-web-bold">
                $${row.precio_unitario_zapato}
            </h3>
            <!-- CALIFICACION-->
            <div class="contenedorCalificacion d-flex flex-row align-items-center ms-4">
                <img src="../../recursos/imagenes/icons/starFill.svg" alt="">
                <p class="titillium-web-bold text25 m-0 align-baselin clYellowStar2">${row.estrellas !== null ? row.estrellas : 0}</p>
            </div>
            `;
            CONTAINER_DESCRIPCION.innerHTML += `
            <div class="tituloDescripcion">
                <h4 class="m-0 p-0 titillium-web-bold">
                    Descripción
                </h4>
                <p class="m-0 p-0 titillium-web-regular mt-2">
                    ${row.descripcion_zapato}
                </p>
            </div>
            `;
            CONTAINER_IMAGEN.innerHTML += `
            <img src="${SERVER_URL}helpers/images/zapatos/${row.foto_detalle_zapato}" class="imgShoe">
            `;
        });
        fillTallas();
        fillResegnas();
        fillSlider();
    } else {
        location.href = 'index.html';
    }
}

const fillSlider = async () => {
    CONTAINER_PODRIA_GUSTARTE.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(ZAPATOS_API, 'readAllEspecial');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            CONTAINER_PODRIA_GUSTARTE.innerHTML += `
            <div class="card col-4 cardC">
                <!-- Enlace a la página de detalles del zapato -->
                <a href="../../vistas/publico/detalle_zapato.html?zapato=${row.id_zapato}" class="text15">
                    <!-- Contenedor de la imagen del zapato -->
                    <div class="image-wrapper2">
                        <img  src="${SERVER_URL}helpers/images/zapatos/${row.foto_detalle_zapato}">
                        <!-- Imagen del zapato -->
                    </div>
                    <!-- Línea decorativa debajo de la imagen -->
                    <div class="lineImgC"></div>
                    <!-- Cuerpo de la tarjeta -->
                    <div class="card-body">
                        <!-- División de dos columnas -->
                        <div class="d-flex flex-row justify-content-between">
                            <!-- Columna 1 -->
                            <div class="column1 ps-3">
                                <!-- Nombre del zapato -->
                                <h1 class="titillium-web-bold text25 text-black">${row.nombre_zapato}
                                    <!-- Descripción del zapato -->
                                    <p class="titillium-web-extralight text18 clgr3 mt-2">Zapato ${row.genero_zapato}</p>
                                </h1>
                                <!-- División para icono de estrella y calificación -->
                                <div class="d-flex flex-row align-items-center mt-2 ">
                                    <!-- Icono de estrella -->
                                    <img src="../../recursos/imagenes/icons/starFill.svg" alt="">
                                    <!-- Calificación del zapato -->
                                    <p class="titillium-web-bold text25 m-0 align-baselin clYellowStar">${row.estrellas !== null ? row.estrellas : 0}</p>
                                </div>
                            </div>
                            <!-- Columna 2 -->
                            <div class="column2 align-items-center">
                                <!-- Número de colores disponibles -->
                                <p class="titillium-web-extralight text18 mb-5 clgr3">${row.colores} colores</p>
                                <!-- Precio del zapato -->
                                <h1 class="titillium-web-bold text25 text-black fit"> $${row.precio_unitario_zapato}</h1>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            `;
        });
    } else {
        //sweetAlert(2, DATA.error, false);
    }
}

const fillResegnas = async () => {
    CONTAINER_RESEGNAS.innerHTML = '';
    const FORM = new FormData();
    let id_zapato = Number(getQueryParam('zapato'));
    FORM.append('id_zapato', id_zapato);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(ZAPATOS_API, 'readOneReseñas', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            // Generar las estrellas según la calificación
            let estrellas = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= row.calificacion_comentario) {
                    estrellas += `<svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.2521 1.53521L15.7546 8.80013L15.8708 9.13729H16.2274H24.2415L17.7835 13.563L17.4694 13.7782L17.5934 14.1383L20.0759 21.3449L13.5347 16.8621L13.2521 16.6684L12.9694 16.8621L6.42827 21.3449L8.91072 14.1383L9.03473 13.7782L8.72063 13.563L2.26268 9.13729H10.2768H10.6334L10.7495 8.80013L13.2521 1.53521Z" fill="#FFC700" stroke="#FFC700"/>
                                </svg>`;
                } else {
                    estrellas += `<svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.2521 1.53521L15.7546 8.80013L15.8708 9.13729H16.2274H24.2415L17.7835 13.563L17.4694 13.7782L17.5934 14.1383L20.0759 21.3449L13.5347 16.8621L13.2521 16.6684L12.9694 16.8621L6.42827 21.3449L8.91072 14.1383L9.03473 13.7782L8.72063 13.563L2.26268 9.13729H10.2768H10.6334L10.7495 8.80013L13.2521 1.53521Z" fill="none" stroke="#FFC700"/>
                                </svg>`;
                }
            }

            // Crear el comentario con las estrellas generadas
            CONTAINER_RESEGNAS.innerHTML += `
            <div class="comentario mt-5 shadow p-3"> <!-- *Comentario 1-->
                <div class="comentarioHeader d-flex flex-row flex-wrap  justify-content-between align-items-center">
                    <!--DIV del nombre del usuario-->
                    <div class="comentarioUser">
                        <h6 class="m-0 p-0 titillium-web-regular text-black">
                            ${row.nombre_cliente} ${row.apellido_cliente}
                        </h6>
                    </div>
                    <!--DIV de la fecha del comentario-->
                    <div class="comentarioFecha">
                        <h6 class="m-0 p-0 titillium-web-regular color-gray1">
                            ${row.fecha_del_comentario}
                        </h6>
                    </div>
                </div>

                <div class="comentarioBody d-flex flex-column mt-4 pt-2">
                    <!--DIV del titulo del comentario-->
                    <div class="comentarioTitulo">
                        <h5 class="titillium-web-bold">
                            ${row.titulo_comentario}
                        </h5>
                    </div>
                    <!--DIV de la descripcion del comentario-->
                    <div class="comentarioDesc">
                        <p class="titillium-web-regular">
                        ${row.descripcion_comentario}
                        </p>
                    </div>
                </div>

                <div class="comentarioFooter d-flex flex-row justify-content-end flex-wrap">
                    <!--DIV de las estrellas-->
                    <div class="estrellasImg">
                        <p class="titillium-web-bold text25 m-0 align-baselin clYellowStar2"> ${estrellas} ${row.calificacion_comentario}</p>
                    </div>
                    <!--DIV del numero de la calificacion-->
                    <div class="estrellasNum">
                        <div class="d-flex flex-row-reverse align-items-center mt-2 ">
                            <img src="../../recursos/imagenes/icons/starFill.svg" alt="">
                            <p class="titillium-web-bold text25 m-0 align-baselin clYellowStar2">${row.calificacion_comentario}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
    } else {
        //sweetAlert(2, DATA.error, false);
    }
}

const fillTallas = async () => {
    CONTAINER_TALLAS.innerHTML = '';
    const FORM = new FormData();
    let id_zapato = Number(getQueryParam('zapato'));
    FORM.append('id_zapato', id_zapato);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(ZAPATOS_API, 'readOneTallas', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        //DATA.dataset.forEach(row => {
            CONTAINER_TALLAS.innerHTML += `
                <h5 class="titillium-web-regular m-0 p-0">
                    Seleccione un color
                </h5>
            `;
        //});
    } else {
        //sweetAlert(2, DATA.error, false);
    }
}

let btnAcept = `
<button type="button" id="seguirExplorando" onclick="closeSweet()"
    class="btn btn-primary bg-color-5blue col-12 mb-2 mt-2">
    <h6 class="titillium-web-extralight m-0 p-0 py-1">
        Aceptar
    </h6>
</button>`;

let btnGotoCarrito = `
<button type="button" id="irAlCarrito" onclick="gotoCar()"
    class="btn btn-primary shadow col-12 btn2">
    <h6 class="titillium-web-extralight m-0 p-0 py-1">
        Ir Al carrito
    </h6>
</button>`;

let btnGotoLogin = `
<button type="button" id="irAlCarrito" onclick="gotoLogin()"
    class="btn btn-primary shadow col-12 btn2">
    <h6 class="titillium-web-extralight m-0 p-0 py-1">
        Iniciar Sesión
    </h6>
</button>`;

let TALLA_INPUT = 0;
let PRECIO_ZAPATO = 0;
const COLOR_INPUT = document.getElementById('coloresInput');
const CANTIDAD_INPUT = document.getElementById('cantidadInput');
const CONTAINER_COLORES = document.getElementById('coloresContainer'); // Contenedor para los colores

async function setNumTalla(talla, div, STOCK) {
    // Resetear el color de fondo de todos los elementos
    restoreCuadroTallas();
    // Establecer el color de fondo del div seleccionado
    div.style.backgroundColor = 'SkyBlue';
    TALLA_INPUT = talla;

    console.log(STOCK + " " + "Cantidad maxima")
    cantidadInput.max = STOCK;
    // Obtener y mostrar los colores disponibles para la talla seleccionada
    //await fetchColoresDisponibles(talla);
}

const fetchColoresDisponibles = async (id_talla) => {
    console.log(id_talla);
    COLOR_INPUT.innerHTML = ''; // Limpiar los colores anteriores
    const FORM = new FormData();
    let id_zapato = Number(getQueryParam('zapato'));
    FORM.append('id_zapato', id_zapato);
    FORM.append('id_talla', id_talla); // Asegúrate de añadir id_talla aquí
    const DATA = await fetchData(ZAPATOS_API, 'readColoresDisponiblesForTalla', FORM);
    if (DATA.status) {
        const ROW = DATA.dataset
        cantidadInput.max = ROW.cantidad_zapato;
        // Petición para obtener los colores disponibles para la talla seleccionada
        fillSelect(ZAPATOS_API, 'readColoresDisponiblesForTalla', 'coloresInput', '', FORM);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

COLOR_INPUT.addEventListener('change', function() {
    var selectedValue = COLOR_INPUT.value;
    fetchTallasDisponibles(selectedValue);
});

const fetchTallasDisponibles = async (id_color) => {
    console.log(id_color);
    CONTAINER_TALLAS.innerHTML = ''; // Limpiar las tallas anteriores
    const FORM = new FormData();
    let id_zapato = Number(getQueryParam('zapato'));
    FORM.append('id_zapato', id_zapato);
    FORM.append('id_color', id_color); // Asegúrate de añadir id_talla aquí
    const DATA = await fetchData(ZAPATOS_API, 'readTallasDisponiblesForColor', FORM);
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            CONTAINER_TALLAS.innerHTML += `
            <div class="cuadradoTalla" onclick="setNumTalla(${row.id_talla}, this, ${row.cantidad_zapato})">
                <h5 class="titillium-web-regular m-0 p-0">
                    ${row.num_talla}
                </h5>
                <input type="hidden" name="id_talla" value="${row.id_talla}">
            </div>
            `;
        });
    } else {
        fillTallas();
    }
}

// Función para mostrar una notificación de éxito cuando se agrega un artículo al carrito
const AddCarrito = async () => {
    let message, titleMessage, buttons;
    let COLOR = COLOR_INPUT.value;
    let CANTIDAD = CANTIDAD_INPUT.value;
    let TALLA = TALLA_INPUT;
    let ID_DETALLE;

    if (TALLA == 0 || COLOR == '' || CANTIDAD == '' || CANTIDAD <= 0) {
        console.log(TALLA, COLOR, CANTIDAD)
        message = 'Seleccione una talla, un color y la cantidad';
        titleMessage = '¡Especifique su pedido!';
        buttons = btnAcept;
    }
    else {
        // Constante tipo objeto con los datos del formulario.
        const FORM1 = new FormData();
        FORM1.append('id_talla', TALLA);
        FORM1.append('id_color', COLOR);
        FORM1.append('id_zapato', Number(getQueryParam('zapato')));
        console.log(TALLA, COLOR + " " + "Search detalle")
        // Petición para guardar los datos del formulario.
        const DATA1 = await fetchData(ZAPATOS_API, 'searchDetalle', FORM1);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA1.status) {
            const ROW1 = DATA1.dataset;
            ID_DETALLE = ROW1.id_detalle_zapato;

            // Constante tipo objeto con los datos del formulario.
            const FORM2 = new FormData();
            FORM2.append('id_detalle_zapato', ID_DETALLE);
            // Petición para guardar los datos del formulario.

            const DATA2 = await fetchData(ZAPATOS_API, 'validationCantidad', FORM2);
            if (DATA2.status) {
                const ROW2 = DATA2.dataset;
                let cantidadStock = ROW2.cantidad_zapato;

                if (CANTIDAD > cantidadStock) {
                    console.log(TALLA, COLOR, CANTIDAD);
                    message = `Ingrese otra cantidad, nuestro stock actual de este zapato con esa talla y color es: ${cantidadStock}`;
                    titleMessage = 'La cantidad supera el stock';

                    buttons = btnAcept;
                }
                else {
                    const FORM3 = new FormData();
                    FORM3.append('id_detalle_zapato', ID_DETALLE);
                    FORM3.append('cantidad_pedido', CANTIDAD);
                    FORM3.append('precio_del_zapato', PRECIO_ZAPATO);
                    // Petición para guardar los datos del formulario.
                    const DATA3 = await fetchData(PEDIDOS_API, 'createDetallePedido', FORM3);
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (DATA3.status) {
                        message = `El zapato ha sido exitosamente añadido al carrito de compras.`;
                        titleMessage = '¡Se ha agregado al carrito!';
                        buttons = btnAcept + btnGotoCarrito;
                    }
                    else {
                        titleMessage = `Algo salió mal`;
                        message = 'No se puedo agregar al carrito error: ' + DATA3.error;
                        buttons = btnAcept;
                    }
                }
            }
            else {
                sweetAlert(4, DATA2.error, true);
            }
        } else {
            if (DATA1.error === 'Acción no disponible dentro de la sesión') {
                titleMessage = 'Debe iniciar sesión'
                message = `Cree una cuenta e inicie sesión para poder comprar`
                buttons = btnAcept + btnGotoLogin;
            }
            else {
                console.log(TALLA, COLOR, CANTIDAD, ID_DETALLE)
                titleMessage = 'Sin stock'
                message = `No hay zapato de esa talla y ese color :c selecciona otra talla u otro color`
                buttons = btnAcept;
            }
        }
    }
    Swal.fire({
        title: false,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        html: `
        <div class="lineaIzq bg-color-1blue"> </div>
        <div class="contenedorImg">
            <img src="../../recursos/imagenes/pngHombreFeliz.svg" class="imgHombre">
        </div>
        <div class="contenedorCuerpo mt-4 d-flex flex-column ">
            <h2 class="titillium-web-regular m-0 p-0 title">
                ${titleMessage}
            </h2>
            <p class="m-0 p-0 titillium-web-regular clgr2 mb-4 text15 mt-2">
                ${message}
            </p>
        ${buttons}
        </div>
`,
    });
}

// Función para cerrar la notificación
function closeSweet() {
    restoreValues();
    Swal.close();
}

// Función para redirigir al usuario al carrito de compras
function gotoCar() {
    restoreValues();
    location.href = "../../vistas/publico/carrito.html";
}

function gotoLogin() {
    restoreValues();
    location.href = "../../vistas/publico/inicio_sesion_registro.html";
}


function restoreValues() {
    const FORM = new FormData();
    let id_zapato = Number(getQueryParam('zapato'));
    FORM.append('id_zapato', id_zapato);
    fillSelect(ZAPATOS_API, 'readOneColoresZapato', 'coloresInput', '', FORM);
    fillTallas();
    TALLA_INPUT = 0;
    COLOR_INPUT.value = '';
    CANTIDAD_INPUT.value = '';
    restoreCuadroTallas();
}

function restoreCuadroTallas() {
    const tallas = document.querySelectorAll('.cuadradoTalla');
    tallas.forEach(tallaDiv => {
        tallaDiv.style.backgroundColor = '';
    });
}

// Función para obtener un parámetro específico de la URL
function getQueryParam(Param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(Param);
}

document.getElementById('cantidadInput').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

