// Variables globales
const NOMBREC_INPUT = document.getElementById('nombreColor');
const TALLAD_INPUT = document.getElementById('nombreTalla');
const MODAL_TITLE = document.getElementById('modalTitle');
const UPDATE_FORM = document.getElementById('updateForm');
const UPDATE_FORM_COLOR = document.getElementById('updateFromColor');
const UPDATE_FORM_TALLA = document.getElementById('updateFromTalla');
const ADD_FORM = document.getElementById('addZapato');
const MODAL_TITLE_TALLA = document.getElementById('modalTitleT');
const MODAL_TITLE_DETALLE = document.getElementById('modalTitleD');
const nombrecolor = document.getElementById('nombre_color');
const DATA_MODAL_COLORES = new bootstrap.Modal('#dataModal');
const NEW_ZAPATOS_DETALLES = new bootstrap.Modal('#addNewDetalleWOF_MODAL');
const DATA_DETALLES_MODAL = new bootstrap.Modal('#dataModalD');
const TALLAS_DETALLES_MODAL = new bootstrap.Modal('#dataModalTallas');
const MODAL_TALLAS = new bootstrap.Modal('#dataModalTallasD');
const DESCRIPCION_INPUT = document.getElementById('descripcionInput');
const FORMADD = document.getElementById('AddTallasF')
//const MODAL_VER_ZAPATO = document.getElementById('dataModalAdd');

const TALLA_INPUT = document.getElementById('idTalla');
const COLOR_INPUT = document.getElementById('Color');
const CANTIDAD_INPUT = document.getElementById('cantidad');
const IMG_INPUT = document.getElementById('selectedImageF');
const BOTON_CANCELAR_COLOR = document.getElementById('cancelarBtnColor');

const BOTON_CANCELAR_MODAL = document.getElementById('cancelarBtn3');

const BOTON_ACTUALIZAR = document.getElementById('actualizarBtn');
const BOTON_ACTUALIZAR_COLOR = document.getElementById('actualizarBtnColor');
const BOTON_ACTUALIZAR_TALLA = document.getElementById('actualizarBtnTalla');
const BOTON_ACTUALIZAR3 = document.getElementById('actualizarBtn3');
const CARDZAPATO = document.getElementById('slider');
const BOTON_ADD_COLOR = document.getElementById('btnAddColor');
const BOTON_ADD_TALLA = document.getElementById('btnAddTalla');
const ADD_COLOR = document.getElementById('AddColor');
const ADD_TALLAS = document.getElementById('addTallas');
const PASTILLA_COLOR = document.getElementById('contenedorFilaColores');
const PASTILLA_TALLAS = document.getElementById('contenedorFilaTallas');
const ID_COLOR = document.getElementById('id_color');
const SEARCH_FORM_ZAPATO = document.getElementById('searchForm');
const SEARCH_FORM_TALLA = document.getElementById('searchFormTalla');


document.querySelector('title').textContent = 'Feasverse - Zapatos';

const COLORES_DIV = document.getElementById('colores');
const AGREGAR_DIV = document.getElementById('agregar');
const PRINCIPAL = document.getElementById('container');
const NOMBRE_INPUT = document.getElementById('nombreColorInput');
const TALLA_INPUT_ADD = document.getElementById('tallaInputAdd');
const TALLAS_DIV = document.getElementById('tallas');

const FORM_EDIT_ZAPATO = document.getElementById('formZapatoEdit');
const NEW_ZAPATO_FORM = document.getElementById('addNewDetalleWOF');


const ZAPATOS_API = 'services/privada/zapatos.php';

const FOTO_ZAPATO_UPDATE = document.getElementById('customFile1');

// Inputs del modal de UPDATE zapato
const NOMBRE_ZAPATOD = document.getElementById('nombreZapatoD'),
    GENERO_ZAPATOD = document.getElementById('generoZapatoD'),
    MARCA_ZAPATOD = document.getElementById('marcaZapatoD'),
    PRECIO_ZAPATOD = document.getElementById('precioZapatoD'),
    DESCRIPCION_ZAPATOD = document.getElementById('descripcionZapatoD'),
    IMAGEN_ZAPATOD = document.getElementById('selectedImageDetalleZapato');

// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('bodyDetalleZapato');

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar plantilla
    await loadTemplate();
    // Establecer propiedades iniciales
    NOMBREC_INPUT.readOnly = true;
    document.getElementById('registrados-tab').click();
    fillSelect(ZAPATOS_API, 'readTallas', 'addTalla_new');
    fillSelect(ZAPATOS_API, 'readColores', 'Color_new');
});

const fillTableColores = async (form = null) => {
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(ZAPATOS_API, 'readAllColores');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        PASTILLA_COLOR.innerHTML = "";
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            PASTILLA_COLOR.innerHTML += `
            <div class="pastilla" onclick="openDetailsColores(${row.id_color},'${row.nombre_color}')"> 
            <h4>${row.nombre_color}</h4>
        </div>
            `;
        });
        if (DATA.dataset == 0) {
            await sweetAlert(1, DATA.message, true);
        }
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const fillTableTallas = async (form = null) => {
    // Petición para obtener los registros disponibles.
    (form) ? action = 'searchTalla' : action = 'readAllTallas';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(ZAPATOS_API, action, form);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        console.log(DATA);
        if (DATA.dataset == 0) {
            await sweetAlert(1, DATA.message, true);
        }
        else {
            if (Array.isArray(DATA.dataset)) {
                {
                    PASTILLA_TALLAS.innerHTML = "";
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    DATA.dataset.forEach(row => {
                        console.log(row.id_talla, row.num_talla);
                        PASTILLA_TALLAS.innerHTML += `
                    <div class="pastilla" onclick="openDetailsTallas(${row.id_talla},'${row.num_talla}')"> 
                    <h4>${row.num_talla}</h4>
                </div>
                    `;
                    });
                }
            } else {
                const ROW = DATA.dataset;
                console.log(ROW);
                PASTILLA_TALLAS.innerHTML = "";
                PASTILLA_TALLAS.innerHTML += `
                    <div class="pastilla" onclick="openDetailsTallas(${ROW.id_talla},'${ROW.num_talla}')"> 
                    <h4>${ROW.num_talla}</h4>
                </div>
                    `;
            }
        }
    } else {
        sweetAlert(2, DATA.error, false);
    }
}


const addTallas = async () => {
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const input = document.getElementById('tallasInput').value;
    const FORM = new FormData();
    FORM.append('tallaInputAdd', input);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ZAPATOS_API, 'addTallas', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Llama a la función 'sweetAlert' con ciertos parámetros.
        await sweetAlert(1, 'Se ha guardado correctamente', true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        // Limpia los valores de los elementos de entrada y establece una imagen de marcador de posición.
        TALLA_INPUT_ADD.value = ' ';
        fillTableTallas();
    } else {
        await sweetAlert(2, DATA.error, false);
    }
}

const addColores = async () => {
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ADD_COLOR);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ZAPATOS_API, 'addColores', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Llama a la función 'sweetAlert' con ciertos parámetros.
        await sweetAlert(1, 'Se ha guardado correctamente', true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        // Limpia los valores de los elementos de entrada y establece una imagen de marcador de posición.
        NOMBRE_INPUT.value = ' ';
        fillTableColores();
    } else {
        await sweetAlert(2, DATA.error, false);
    }
}

const addZapato = async () => {
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ADD_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ZAPATOS_API, 'createRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Llama a la función 'sweetAlert' con ciertos parámetros.
        await sweetAlert(1, 'Se ha guardado correctamente', true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        // Limpia los valores de los elementos de entrada y establece una imagen de marcador de posición.
    } else {
        await sweetAlert(2, DATA.error, false);
    }
}


const fillTableZapato = async (form = null) => {
    CARDZAPATO.innerHTML = '';
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(ZAPATOS_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            CARDZAPATO.innerHTML += `
            <div class="slide" onclick="openDetalles(${row.id_zapato})">
            <img src="${SERVER_URL}helpers/images/zapatos/${row.foto_detalle_zapato}">
            <span>${row.nombre_zapato}</span>
        </div>
            `;
        });

        if (DATA.dataset == 0) {
            await sweetAlert(1, DATA.message, true);
        }
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

SEARCH_FORM_ZAPATO.addEventListener('submit', async (event) => {
    event.preventDefault();

    const BUSCADOR = document.getElementById('buscadorZapato');
    var texto = BUSCADOR.value.trim();

    if (texto === '') {
        fillTableZapato();
    }
    else {
        // Constante tipo objeto con los datos del formulario.
        const FORM1 = new FormData();
        FORM1.append('inputBusquedaZapatos', texto);
        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        fillTableZapato(FORM1);
    }
})

SEARCH_FORM_TALLA.addEventListener('submit', async (event) => {
    event.preventDefault();

    const BUSCADOR = document.getElementById('buscadorTalla');
    var texto = BUSCADOR.value.trim();

    if (texto === '') {
        fillTableTallas();
    }
    else {
        // Constante tipo objeto con los datos del formulario.
        const FORM1 = new FormData();
        FORM1.append('nombreTalla', texto);
        // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
        fillTableTallas(FORM1);
    }
})

function clearSearch() {
    var input = document.getElementById('inputBusquedaZapatos');
    var searchIcon = document.querySelector('.search-icon');
    var clearIcon = document.querySelector('.clear-icon');

    input.value = ''; // Limpia el contenido del input
    input.focus(); // Coloca el foco en el input para seguir escribiendo

    searchIcon.style.display = 'block'; // Muestra el icono de búsqueda
    clearIcon.style.display = 'none'; // Oculta el icono de limpiar
}
let idColor = null;
let nombre_color = null;

let idTallaD = null;
let num_tallaD = null;


// Función para abrir los detalles de un trabajador.
const openDetailsColores = async (id_color, nombre_color) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('id_color', id_color);
    FORM.append('nombre_color', nombre_color);
    idColor = id_color;
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(ZAPATOS_API, 'readOneColores', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se prepara el formulario.
        DATA_MODAL_COLORES.show();
        const ROW = DATA.dataset;
        NOMBREC_INPUT.value = nombre_color;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const openDetailsTallas = async (id_talla, num_talla) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('id_talla', id_talla);
    FORM.append('num_talla', num_talla);
    idTallaD = id_talla;
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(ZAPATOS_API, 'readOneTalla', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se prepara el formulario.
        MODAL_TALLAS.show();
        const ROW = DATA.dataset;
        TALLAD_INPUT.value = num_talla;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const eliminarTalla = async () => {
    event.preventDefault(); // Se evita recargar la página web después de enviar el formulario.
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData();
    FORM.append('id_talla', parseInt(idTallaD));

    const RESPONSE = await confirmAction('Eliminar', '¿Seguro, qué quieres eliminar?');
    if (RESPONSE.isConfirmed) {
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ZAPATOS_API, 'eliminarTallas', FORM);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, 'Se ha eliminado correctamente', true);
            // Se cierra la caja de diálogo.
            MODAL_TALLAS.hide();

            fillTableTallas();
        } else {
            enableFormFields(); // Si hay error, habilita los campos nuevamente para corrección.
            sweetAlert(2, DATA.error, false);
        }
    }
    else {

    }

};

// Funciones de interacción
function showZapatos(button) {
    fillTableZapato();
    COLORES_DIV.classList.add('d-none');
    AGREGAR_DIV.classList.add('d-none');
    PRINCIPAL.classList.remove('d-none');
    TALLAS_DIV.classList.remove('d-none');
    updateButtonColors(button);
}

function showAgregar(button) {
    fillSelect(ZAPATOS_API, 'readMarcas', 'marcaInput');
    // Mostrar y ocultar divs correspondientes
    AGREGAR_DIV.classList.remove('d-none');
    PRINCIPAL.classList.add('d-none');
    COLORES_DIV.classList.add('d-none');
    TALLAS_DIV.classList.add('d-none');
    updateButtonColors(button);
}

function showColores(button) {
    fillTableColores();
    // Mostrar y ocultar divs correspondientes
    COLORES_DIV.classList.remove('d-none');
    TALLAS_DIV.classList.add('d-none');
    AGREGAR_DIV.classList.add('d-none');
    PRINCIPAL.classList.add('d-none');
    updateButtonColors(button);
}
function showTallas(button) {
    // Mostrar y ocultar divs correspondientes
    TALLAS_DIV.classList.remove('d-none');
    AGREGAR_DIV.classList.add('d-none');
    PRINCIPAL.classList.add('d-none');
    COLORES_DIV.classList.add('d-none');
    fillTableTallas();
    updateButtonColors(button);
}

function updateButtonColors(boton) {
    var botones = document.querySelectorAll('.boton-cambiar-color');
    botones.forEach(function (b) {
        b.style.backgroundColor = '#146A93';
        b.style.color = 'white';
    });
    boton.style.backgroundColor = '#1591CC';
    boton.style.color = 'white';
}

DATA_DETALLES_MODAL._element.addEventListener('hidden.bs.modal', function () {
    BOTON_ACTUALIZAR3.textContent = "Actualizar";
});


// Funciones para abrir modales
/*
async function openDetails() {
    event.preventDefault(); 
    DATA_MODAL.show();
    UPDATE_FORM.reset();
    NOMBREC_INPUT.value =
    MODAL_TITLE.textContent = 'Detalles Color: Rojo';
}*/

async function openTallas() {
    event.preventDefault();
    UPDATE_FORM.reset();
    MODAL_TITLE_TALLA.textContent = 'Tallas y Stock del Producto';
}

let id_zapatoW;

const openDetalles = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('id_zapato', id);
    id_zapatoW = id;
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(ZAPATOS_API, 'readOneZapato', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se prepara el formulario.
        FORM_EDIT_ZAPATO.reset();
        const ROW = DATA.dataset;
        NOMBRE_ZAPATOD.value = ROW.nombre_zapato;
        GENERO_ZAPATOD.value = findNumberValue(ROW.genero_Zapato);
        fillSelect(ZAPATOS_API, 'readMarcas', 'marcaZapatoD', ROW.id_marca);
        PRECIO_ZAPATOD.value = ROW.precio_unitario_zapato;
        DESCRIPCION_ZAPATOD.value = ROW.descripcion_zapato;
        // Actualiza el título del modal con el ID del zapato.
        MODAL_TITLE_DETALLE.textContent = 'Detalle del zapato #' + id;
        fillTableDetalles(id);
        // Se muestra la caja de diálogo con su título.
        DATA_DETALLES_MODAL.show();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}
const fillTableDetalles = async (id) => {
    const FORM = new FormData();
    FORM.append('id_zapato', id);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(ZAPATOS_API, 'readDetallesZapato', FORM);
    TABLE_BODY.innerHTML = '';
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        const DATA2 = await fetchData(ZAPATOS_API, 'readFto1', FORM);
        const ROW2 = DATA2.dataset;
        IMAGEN_ZAPATOD.src = `${SERVER_URL}helpers/images/zapatos/${ROW2.foto_detalle_zapato}`;
        if (DATA.dataset == 0) {
            await sweetAlert(1, DATA.message, true);
        }
        else {
            if (Array.isArray(DATA.dataset)) {
                for (let i = 0; i < DATA.dataset.length; i++) {
                    const row = DATA.dataset[i];
                    const isDisabled = row.estado_zapato === 'Desactivo';
                    // Construir fila de la tabla
                    TABLE_BODY.innerHTML += `
                        <tr>
                            <td data-labelN="N°">${row.id_detalle_zapato}</td>
                            <td data-labelT="Talla">
                                <label for="input_talla_zapato_NEW_${row.id_detalle_zapato}" class="form-label">Ingresa la talla</label>
                                <select class="form-select input_talla_zapato_NEW" aria-label="Default select example"
                                    id="input_talla_zapato_NEW_${row.id_detalle_zapato}" name="input_talla_zapato_NEW" disabled>
                                </select>
                            </td>
                            <td data-labelS="Cantidad Actual">
                                <input id="input_cantidad_zapato_NEW_${row.id_detalle_zapato}" type="text" name="input_cantidad_zapato_NEW"
                                    class="form-control editableInput" required value="${row.cantidad_zapato}"  ${isDisabled ? 'disabled' : ''}>
                            </td>
                            <td data-labelE="Color actual">${row.nombre_color}</td>
                            <td>
                                <button class="Verde" onclick="updateDetalle(${row.id_detalle_zapato})" ${isDisabled ? 'disabled' : ''}>
                                    <img class="note" src="../../recursos/imagenes/icons/notebook.svg" width="35px" height="35px">
                                </button>
                                <button class="Rojo" onclick="deleteDetalle(${row.id_detalle_zapato})">
                                    <img class="note" src="../../recursos/imagenes/basura.svg" width="35px" height="35px">
                                </button>
                            </td>
                        </tr>
                    `;

                    // Llenar el select correspondiente a esta fila
                    fillSelect(ZAPATOS_API, 'readTallas', `input_talla_zapato_NEW_${row.id_detalle_zapato}`, row.id_talla);
                }
            } else {
                const ROW = DATA.dataset;
                TABLE_BODY.innerHTML += `
                <tr> 
                    <td data-labelN="N°">${ROW.id_detalle_zapato}</td>
                    <td data-labelT="Talla"> <label for="input_talla_zapato_NEW" class="form-label">Ingresa la talla</label>
                    <select class="form-select" aria-label="Default select example" id="input_talla_zapato_NEW"
                    name="input_talla_zapato_NEW" disabled>
                    </select></td>
                        <td data-labelS="Cantidad Actual">
                        <input id="input_cantidad_zapato_NEW_" type="text" name="input_cantidad_zapato_NEW_"
                                                class="form-control editableInput" required readonly value="${ROW.cantidad_zapato}" ${isDisabled ? 'disabled' : ''}>
                                                </td>
                    <td data-labelE="Color actual">${ROW.nombre_color}</td>
                    <td>
                        <button class="Verde" onclick="updateDetalle(${ROW.id_detalle_zapato})" ${isDisabled ? 'disabled' : ''}> <img class="note"
                            src="../../recursos/imagenes/icons/notebook.svg"
                            width="35px" height="35px">
                        </button>
                        <button class="Rojo" onclick="deleteDetalle(${ROW.id_detalle_zapato})"> <img class="note"
                            src="../../recursos/imagenes/basura.svg" width="35px"
                            height="35px">
                        </button>
                    </td>
                </tr>
            `;
                fillSelect(ZAPATOS_API, 'readTallas', 'input_talla_zapato_NEW', ROW.id_talla);
            }
        }
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

const deleteDetalle = async (id_detalle) => {
    event.preventDefault();
    const FORM = new FormData();
    FORM.append('id_detalle', id_detalle);

    const RESPONSE = await confirmAction('Desactivar', '¿Seguro, qué quieres desactivar el detalle?');
    if (RESPONSE.isConfirmed) {
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ZAPATOS_API, 'deleteDetalle', FORM);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, 'Se ha desactivado correctamente', true);
            fillTableDetalles(id_detalle);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
    else {

    }

};

async function updateDetalle(id_detalle) {
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData();
    const cantidad = document.getElementById(`input_cantidad_zapato_NEW_${id_detalle}`);
    FORM.append('cantidad', cantidad.value);
    FORM.append('id_detalle', id_detalle)

    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ZAPATOS_API, 'updateDetalle', FORM);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, 'Se ha actualizado correctamente', true);
        fillTableDetalles(id_zapatoW);
    } else {
        await sweetAlert(2, DATA.error, false);
    }

}

function openAddDetalleModal() {
    NEW_ZAPATOS_DETALLES.show();
}

async function addDetalleZapato() {
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(NEW_ZAPATO_FORM);
    FORM.append('id_zapato', id_zapatoW);

    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ZAPATOS_API, 'createRowDetalle', FORM);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, 'Se ha guardado correctamente', true);
        fillTableDetalles(id_zapatoW);
        // Se carga nuevamente la tabla para visualizar los cambios.
        NEW_ZAPATOS_DETALLES.hide();
        // Resetear el formulario   
        NEW_ZAPATOS_DETALLES.reset();
    } else {
        await sweetAlert(2, DATA.error, false);
    }

}


async function hideAddDetalleModal() {
    const RESPONSE = await confirmAction('Regresar', '¿Seguro, qué quieres regresar?');
    if (RESPONSE.isConfirmed) {
        NEW_ZAPATOS_DETALLES.hide();
    }
    else { }
}

function findNumberValue(value) {
    // Comprobar si el valor es 'Activo'
    if (value == 'Unisex') {
        return 1; // Si es 'Activo', devolver 1
    } else if (value == 'Masculino') {
        return 2; // Si no es 'Activo', devolver 2
    }
    else { return 3 }
}

async function addDetalles() {
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ADD_FORM);
    FORM.append('descripcionInput', DESCRIPCION_INPUT.value);

    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ZAPATOS_API, 'createRow', FORM);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, 'Se ha guardado correctamente', true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        TALLAS_DETALLES_MODAL.show();
        fillSelect(ZAPATOS_API, 'readTallas', 'idTalla');
        fillSelect(ZAPATOS_API, 'readColores', 'Color');
        // Resetear el formulario   
        document.getElementById('addZapato').reset();
    } else {
        await sweetAlert(2, DATA.error, false);
    }
}

async function createRowPT2() {
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(FORMADD);

    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ZAPATOS_API, 'createRowPT2', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra un mensaje de éxito.
        const RESPONSE = await confirmAction('Guardado Exitosamente', '¿Desea agregar otro detalle?');

        // Se verifica la respuesta del mensaje.
        if (RESPONSE.isConfirmed) {
            // Resetear el formulario
            TALLA_INPUT.value = ' ';
            COLOR_INPUT.value = ' ';
        } else {
            // Si el usuario cancela, se oculta algún elemento modal (posiblemente DATA_MODAL).
            TALLAS_DETALLES_MODAL.hide();
        }

    } else {
        await sweetAlert(2, DATA.error, false);
    }
}


// Función para mostrar imágenes seleccionadas
function displaySelectedImage(event, elementId) {
    const selectedImage = document.getElementById(elementId);
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            selectedImage.src = e.target.result;
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}
function enableFormFields() {
    NOMBREC_INPUT.readOnly = false;
}
function disableFormFields() {
    NOMBREC_INPUT.readOnly = true;

}

// Funciones para actualizar y cancelar en modales
const botonActualizarColor = async () => {
    const textoBoton = BOTON_ACTUALIZAR_COLOR.textContent.trim();
    event.preventDefault(); // Se evita recargar la página web después de enviar el formulario.

    if (textoBoton === 'Actualizar') {
        // Habilita la edición de los campos de entrada.
        enableFormFields(); // Suponemos que habilita todos los campos incluido NOMBREC_INPUT.
        NOMBREC_INPUT.readOnly = false; // Asegura que el campo específico también es editable.
        BOTON_ACTUALIZAR_COLOR.textContent = "Guardar";
    } else if (textoBoton === 'Guardar') {
        // Deshabilita la edición de los campos de entrada.
        disableFormFields(); // Suponemos que deshabilita todos los campos.

        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(UPDATE_FORM_COLOR);
        FORM.append('id_color', idColor);
        FORM.append('nombreColor', NOMBREC_INPUT.value);

        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ZAPATOS_API, 'ActColores', FORM);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, 'Se ha actualizado correctamente', true);
            // Se cierra la caja de diálogo.
            DATA_MODAL_COLORES.hide();
            restoreEvrPS();
            fillTableColores();
        } else {
            enableFormFields(); // Si hay error, habilita los campos nuevamente para corrección.
            sweetAlert(2, DATA.error, false);
        }
    }
};

async function showCancelConfirmation1(message, submessage) {
    const RESPONSE = await confirmAction(message, submessage);
    if (RESPONSE.isConfirmed) {
        DATA_DETALLES_MODAL.hide();
    }
}

async function botonCancelar3() {

    await showCancelConfirmation1('¿Seguro qué quieres regresar?', 'Se cerrará la ventana emergente');
}

// Funciones para actualizar y cancelar en otros modales (similar a las anteriores)
async function botonActualizar2() {
    const textoBoton = BOTON_ACTUALIZAR2.textContent.trim();

    if (textoBoton === 'Actualizar') {
        BOTON_ACTUALIZAR2.textContent = "Guardar";
    } else if (textoBoton === 'Guardar') {
        await sweetAlert(1, 'Se ha actualizado correctamente', true);

        DATA_DETALLES_MODAL.show();
    }
}

async function botonCancelar2() {
    const textoBoton = BOTON_ACTUALIZAR2.textContent.trim();

    if (textoBoton === 'Actualizar') {
        const RESPONSE = await confirmAction('¿Seguro que quieres regresar?', 'Se cerrará la ventana emergente');
        if (RESPONSE.isConfirmed) {

            DATA_DETALLES_MODAL.show();
        }
    } else if (textoBoton === 'Guardar') {
        const RESPONSE = await confirmAction('¿Seguro que quieres regresar?', 'Si has modificado, no se guardará');
        if (RESPONSE.isConfirmed) {
            DATA_TALLAS_MODAL.hide();
            DATA_DETALLES_MODAL.show();
        }
    }
}

async function botonActualizar3() {
    const textoBoton = BOTON_ACTUALIZAR3.textContent.trim();
    if (textoBoton === 'Actualizar') {
        BOTON_ACTUALIZAR3.textContent = "Guardar";
    } if (textoBoton === 'Guardar') {
        event.preventDefault();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(FORM_EDIT_ZAPATO);
        //FORM.append('foto_zapato', VALUE_FTO);
        FORM.append('id_zapato', id_zapatoW);
        FORM.append('generoZapatoD', GENERO_ZAPATOD.value);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ZAPATOS_API, 'updateRowZapato', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, 'Se ha actualizado correctamente', true);
            DATA_DETALLES_MODAL.hide();
            // Resetear el formulario
            FORM_EDIT_ZAPATO.reset();
            fillTableZapato();
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    }
}

async function showCancelConfirmation(message, submessage) {
    const RESPONSE = await confirmAction(message, submessage);
    if (RESPONSE.isConfirmed) {
        DATA_MODAL_COLORES.hide();
    }
}

async function showCancelConfirmation2(message, submessage) {
    const RESPONSE = await confirmAction(message, submessage);
    if (RESPONSE.isConfirmed) {
        MODAL_TALLAS.hide();
        TALLAS_DETALLES_MODAL.hide();
    }
}



async function botonCancelarColor() {
    await showCancelConfirmation('¿Seguro qué quieres regresar?', 'Se cerrará la ventana emergente');
}

async function botonCancelarTalla() {
    await showCancelConfirmation2('¿Seguro qué quieres regresar?', 'Se cerrará la ventana emergente');
}

const botonActualizarTalla = async () => {
    const textoBoton = BOTON_ACTUALIZAR_TALLA.textContent.trim();
    event.preventDefault(); // Se evita recargar la página web después de enviar el formulario.

    if (textoBoton === 'Actualizar') {
        // Habilita la edición de los campos de entrada.
        enableFormFields(); // Suponemos que habilita todos los campos incluido NOMBREC_INPUT.
        TALLAD_INPUT.readOnly = false; // Asegura que el campo específico también es editable.
        BOTON_ACTUALIZAR_TALLA.textContent = "Guardar";
    } else if (textoBoton === 'Guardar') {
        // Deshabilita la edición de los campos de entrada.
        disableFormFields(); // Suponemos que deshabilita todos los campos.

        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData();
        FORM.append('id_talla', idTallaD);
        FORM.append('nombreTalla', TALLAD_INPUT.value);

        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(ZAPATOS_API, 'ActTallas', FORM);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, 'Se ha actualizado correctamente', true);
            // Se cierra la caja de diálogo.
            MODAL_TALLAS.hide();

            fillTableTallas();
        } else {
            enableFormFields(); // Si hay error, habilita los campos nuevamente para corrección.
            sweetAlert(2, DATA.error, false);
        }
    }
};

var container = document.getElementById('container');
var slider = document.getElementById('slider');
var slides = document.getElementsByClassName('slide').length;
var buttons = document.getElementsByClassName('btn');

var currentPosition = 0;
var slidesPerPage = 0;
var slidesCount = slides - slidesPerPage;
var containerWidth = container.offsetWidth;

window.addEventListener("resize", checkWidth);

function checkWidth() {
    containerWidth = container.offsetWidth;
    setParams(containerWidth);
}

function setParams(w) {
    if (w < 551) {
        slidesPerPage = 1;
    } else if (w < 901) {
        slidesPerPage = 2;
    } else if (w < 1101) {
        slidesPerPage = 3;
    } else {
        slidesPerPage = 4;
    }
    slidesCount = slides - slidesPerPage;
    currentPosition = Math.min(currentPosition, slidesCount);
    currentPosition = Math.max(currentPosition, 0);
    slider.style.transform = 'translateX(-' + currentPosition * (100 / slidesPerPage) + '%)';
    updateButtons();
}

function updateButtons() {
    buttons[0].classList.toggle('inactive', currentPosition <= 0);
    buttons[1].classList.toggle('inactive', currentPosition >= slidesCount - slidesPerPage);
}

setParams();

function slideRight() {
    currentPosition = Math.min(currentPosition + 1, slidesCount - slidesPerPage);
    slider.style.transform = 'translateX(-' + currentPosition * (100 / slidesPerPage) + '%)';
    updateButtons();
}

function slideLeft() {
    currentPosition = Math.max(currentPosition - 1, 0);
    slider.style.transform = 'translateX(-' + currentPosition * (100 / slidesPerPage) + '%)';
    updateButtons();
}