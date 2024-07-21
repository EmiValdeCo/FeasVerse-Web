//Declaracion de las variables
const NOMBRE_INPUT = document.getElementById('nombreMarca'),
    DESC_INPUT = document.getElementById('descripcionMarca'),
    IMG_INPUT = document.getElementById('selectedImage');

const NOMBRED_INPUT = document.getElementById('nombreMarcaD'),
    DESCD_INPUT = document.getElementById('descripcionMarcaD'),
    IMGD_INPUT = document.getElementById('selectedImageD');

const DATA_MODAL = new bootstrap.Modal('#dataModal'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    UPDATE_FORM = document.getElementById('updateFrom');

var primeraPestana = document.querySelector('#marcas-tab');

const BOTON_ACTUALIZAR = document.getElementById('actualizarBtn');
const ADD_FORM = document.getElementById('AddForm');

const MARCAS_API = 'services/privada/marcas.php';

// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody');
const inputBusqueda = document.getElementById('inputBusqueda');
let textoIngresado;

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // *Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();

    if (primeraPestana) {
        primeraPestana.click();
        // Se muestra el div de tabla
        MARCA_DIV.classList.remove('d-none');
        ADD_DIV.classList.add('d-none');
    }
    // Llamada a la función para llenar la tabla con los registros existentes.
    fillTable();
    inputBusqueda.addEventListener("input", function (event) {
        textoIngresado = event.target.value.trim();
        search();
    });

});

const search = async () => {
    TABLE_BODY.innerHTML = '';
    const FORM = new FormData();
    FORM.append('search', textoIngresado);
    const DATA = await fetchData(MARCAS_API, 'searchRows', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            TABLE_BODY.innerHTML += `
            <div>
                <div class="card sizeCard" onclick="openDetails(${row.id_marca})">
                <img src="${SERVER_URL}helpers/images/marcas/${row.foto_marca}" />
                </div> 
                <button type="button" class="btn z-3 my-0 btnSeeReport" onclick="openReport(${row.id_marca})">
                    <i class="p-0 m-0 text-white"> <img src="../../recursos/imagenes/icons/IconPdf.svg" class="IconImage" /> </i>
                </button>
            </div> 
            `;
        });
    } else if (inputBusqueda.value == '') { fillTable(); }
    else {
        sweetAlert(2, 'No se han encontrado coincidencias', false);
        inputBusqueda.value = '';
        fillTable();
    }
}

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    TABLE_BODY.innerHTML = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(MARCAS_API, 'readAll');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            TABLE_BODY.innerHTML += `
            <div>
                <div class="card sizeCard" onclick="openDetails(${row.id_marca})">
                <img src="${SERVER_URL}helpers/images/marcas/${row.foto_marca}" />
                </div> 
                <button type="button" class="btn z-3 my-0 btnSeeReport" onclick="openReport(${row.id_marca})">
                <i class="p-0 m-0 text-white">  <img src="../../recursos/imagenes/icons/IconPdf.svg" class="IconImage" /> </i>
                </button>
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

// Constante para establecer el espacio de tabla y el espacio de agregar.
const MARCA_DIV = document.getElementById('marcas');
const ADD_DIV = document.getElementById('agregar');

//Funcion que muestra el div de agregar marca y cambio de color
function showAddDiv(boton) {
    // Se muestra el div para agregar marca.
    ADD_DIV.classList.remove('d-none');
    // Se oculta la visualizacion de las marcas.
    MARCA_DIV.classList.add('d-none');
    // Restablece el color de todos los botones
    var botones = document.querySelectorAll('.boton-cambiar-color');
    botones.forEach(function (b) {
        b.style.backgroundColor = '#146A93';
    });

    // Cambia el color del botón clicado
    boton.style.backgroundColor = '#1A89BD';
    boton.style.color = 'white';
}

//Funcion que muestra el div de marca y oculta el de la agregar y cambia los colores a como estaban
function ShowMarcasDiv(boton) {
    // Se muestra el div para visualizacion de marca.
    MARCA_DIV.classList.remove('d-none');
    // Se oculta el div de agregar marca.
    ADD_DIV.classList.add('d-none');

    // Restablece el color de todos los botones
    var botones = document.querySelectorAll('.boton-cambiar-color');
    botones.forEach(function (b) {
        b.style.backgroundColor = '#146A93';
    });

    // Cambia el color del botón clicado
    boton.style.backgroundColor = '#1A89BD';
    boton.style.color = 'white';
}

// Función para mostrar la imagen seleccionada en un elemento de imagen.
function displaySelectedImage(event, elementId) {
    // Obtiene el elemento de imagen según su ID.
    const selectedImage = document.getElementById(elementId);
    // Obtiene el elemento de entrada de archivo del evento.
    const fileInput = event.target;

    // Verifica si hay archivos seleccionados y al menos uno.
    if (fileInput.files && fileInput.files[0]) {
        // Crea una instancia de FileReader para leer el contenido del archivo.
        const reader = new FileReader();

        // Define el evento que se ejecutará cuando la lectura sea exitosa.
        reader.onload = function (e) {
            // Establece la fuente de la imagen como el resultado de la lectura (base64).
            selectedImage.src = e.target.result;
        };

        // Inicia la lectura del contenido del archivo como una URL de datos.
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// Se agrega un evento al elemento subyacente del modal que se dispara después de que se haya ocultado.
DATA_MODAL._element.addEventListener('hidden.bs.modal', function () {
    // Después de que el modal se haya ocultado, realiza la siguiente acción:

    // Cambia el texto del botón con el ID 'actualizarBtn' a "Actualizar".
    BOTON_ACTUALIZAR.textContent = "Actualizar";
});

// Definición de la función asíncrona llamada 'returnBack'.
const returnBack = async () => {
    // Llamada a una función para mostrar un mensaje de confirmación, capturando la respuesta en una constante llamada 'RESPONSE'.
    const RESPONSE = await confirmAction('¿Seguro qué quieres cancelar?', 'Los datos ingresados no serán guardados');

    // Verifica si el usuario ha confirmado la acción.
    if (RESPONSE.isConfirmed) {
        // Limpia los valores de los elementos de entrada y establece una imagen de marcador de posición.
        NOMBRE_INPUT.value = ' ';
        DESC_INPUT.value = ' ';

        // Simula un clic en la primera pestaña para cambiar a la vista de tabla.
        primeraPestana.click();

        // Muestra el div de la tabla y oculta el div de agregar.
        MARCA_DIV.classList.remove('d-none');
        ADD_DIV.classList.add('d-none');
    }
}

let id_marca = null;

// Definición de la función asíncrona llamada 'openDetails'.
const openDetails = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('IdMarca', id);
    id_marca = id;
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(MARCAS_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Muestra la caja de diálogo modal con su título.
        DATA_MODAL.show();
        MODAL_TITLE.textContent = 'Actualizar producto';
        // Prepara el formulario de actualización reseteándolo a sus valores por defecto.
        UPDATE_FORM.reset();

        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        NOMBRED_INPUT.value = ROW.nombre_marca,
            DESCD_INPUT.value = ROW.descripcion_marca,
            IMGD_INPUT.src = `${SERVER_URL}helpers/images/marcas/${ROW.foto_marca}`;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Método del evento para cuando se envía el formulario de guardar. 
const addSave = async () => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ADD_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(MARCAS_API, 'createRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Llama a la función 'sweetAlert' con ciertos parámetros.
        await sweetAlert(1, 'Se ha guardado correctamente', true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        // Limpia los valores de los elementos de entrada y establece una imagen de marcador de posición.
        NOMBRE_INPUT.value = ' ';
        DESC_INPUT.value = ' ';
        inputBusqueda.value = '';
        fillTable();
    } else {
        await sweetAlert(2, DATA.error, false);
    }
};


// Definición de la función asíncrona llamada 'botonActualizar'.
const botonActualizar = async () => {
    // Obtiene el texto contenido en el botón de actualización y elimina los espacios en blanco al principio y al final.
    var textoBoton = BOTON_ACTUALIZAR.textContent.trim();
    // Verifica si el texto del botón es 'Actualizar'.
    if (textoBoton == 'Actualizar') {
        // Si es 'Actualizar', habilita la edición de ciertos campos del formulario.
        NOMBRED_INPUT.readOnly = false;
        DESCD_INPUT.readOnly = false;
        // Cambia el texto del botón a 'Guardar'.
        BOTON_ACTUALIZAR.textContent = "Guardar";
    }
    // Verifica si el texto del botón es 'Guardar'.
    else if (textoBoton == 'Guardar') {
        // Deshabilita la edición de los campos de entrada.
        NOMBRED_INPUT.readOnly = true;
        DESCD_INPUT.readOnly = true;
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(UPDATE_FORM);
        FORM.append('id_marca', id_marca);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(MARCAS_API, 'updateRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, 'Se ha actualizado correctamente', true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            // Se cierra la caja de diálogo.
            DATA_MODAL.hide();
            inputBusqueda.value = '';
            fillTable();
        } else {
            NOMBRED_INPUT.readOnly = false;
            DESCD_INPUT.readOnly = false;
            sweetAlert(2, DATA.error, false);
        }
    }
}

// Definición de la función asíncrona llamada 'botonCancelar'.
const botonCancelar = async () => {
    // Obtiene el texto contenido en el botón de actualización y elimina los espacios en blanco al principio y al final.
    var textoBoton = BOTON_ACTUALIZAR.textContent.trim();

    // Verifica si el texto del botón es 'Actualizar'.
    if (textoBoton == 'Actualizar') {
        // Si es 'Actualizar', llama a una función para mostrar un mensaje de confirmación y captura la respuesta en una constante llamada 'RESPONSE'.
        const RESPONSE = await confirmAction('¿Seguro qué quieres regresar?', 'Se cerrará la ventana emergente');

        // Verifica si el usuario ha confirmado la acción y, si es así, oculta el modal.
        if (RESPONSE.isConfirmed) {
            DATA_MODAL.hide();
        }
    }
    // Verifica si el texto del botón es 'Guardar'.
    else if (textoBoton == 'Guardar') {
        // Si es 'Guardar', llama a una función para mostrar un mensaje de confirmación y captura la respuesta en una constante llamada 'RESPONSE'.
        const RESPONSE = await confirmAction('¿Seguro qué quieres regresar?', 'Si has modificado no se guardará');

        // Verifica si el usuario ha confirmado la acción y, si es así, oculta el modal.
        if (RESPONSE.isConfirmed) {
            DATA_MODAL.hide();
        }
    }
}


/*
*   Función para abrir un reporte parametrizado de productos de una categoría.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openReport = (id) => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/private/marcas.php`);
    // Se agrega un parámetro a la ruta con el valor del registro seleccionado.
    PATH.searchParams.append('id_marca', id);
    console.log(PATH.href);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}