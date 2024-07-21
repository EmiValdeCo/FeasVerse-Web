// Selecciona el botón de actualizar por su ID.
const BOTON_ACTUALIZAR = document.getElementById('actualizarBtn');

// Selecciona los elementos de entrada del formulario por sus respectivos IDs.
const NOMBRES_INPUT = document.getElementById('nombreTrabajador'),
    APELLIDOS_INPUT = document.getElementById('apellidosTrabajador'),
    DUI_INPUT = document.getElementById('duiTrabajador'),
    TEL_INPUT = document.getElementById('telefonoTrabajador'),
    CORREO_INPUT = document.getElementById('correoTrabajador'),
    FECHAN_INPUT = document.getElementById('fechanTrabajador'),
    FECHAR_INPUT = document.getElementById('fecharTrabajador'),
    ESTADO_INPUT = document.getElementById('estadoInputD'),
    NIVEL_INPUT = document.getElementById('nivelInputD');

const INPUTDATENOW = document.getElementById('fecharInput');

// Selecciona elementos relacionados con el modal y el formulario de actualización.
const DATA_MODAL = new bootstrap.Modal('#dataModal'),
    MODAL_TITLE = document.getElementById('modalTitle'),
    UPDATE_FORM = document.getElementById('updateFrom'),
    ADD_FORM = document.getElementById('AddForm');

// Constantes para establecer el espacio de tabla y el espacio de agregar.
const TABLE_DIV = document.getElementById('tabla');
const ADD_DIV = document.getElementById('agregar');

// Selecciona todos los formularios con la clase 'needs-validation'.
const forms = document.querySelectorAll('.needs-validation')

// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody');

const TRABAJADORES_API = 'services/privada/trabajadores.php';
const inputBusqueda = document.getElementById('inputBusqueda');

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();

    // Selecciona la primera pestaña y la muestra.
    var primeraPestana = document.querySelector('#tabla-tab');
    if (primeraPestana) {
        primeraPestana.click();
        // Muestra el div de la tabla y oculta el div de agregar.
        TABLE_DIV.classList.remove('d-none');
        ADD_DIV.classList.add('d-none');
    }
    INPUTDATENOW.readOnly = true;
    // Llamada a la función para llenar la tabla con los registros existentes.
    fillTable();

    // Función para filtrar los registros de la tabla según el texto de búsqueda
    const filtrarRegistros = (texto) => {
        // Seleccionar todas las filas de la tabla
        const filas = document.querySelectorAll("#tableBody tr");
        
        // Iterar sobre cada fila
        filas.forEach(fila => {
            let coincidencia = false; // Inicializar la variable coincidencia como false
            
            // Iterar sobre cada columna de la fila
            fila.querySelectorAll("td").forEach(columna => {
                const valorColumna = columna.textContent.toLowerCase(); // Obtener el texto de la columna en minúsculas
                // Verificar si el texto de la columna incluye el texto de búsqueda
                if (valorColumna.includes(texto.toLowerCase())) {
                    coincidencia = true; // Si hay coincidencia, establecer coincidencia como true
                }
            });
            
            // Establecer el estilo de visualización de la fila
            fila.style.display = coincidencia ? "table-row" : "none";
        });
    };

    // Agregar un controlador de eventos de entrada al campo de búsqueda
    inputBusqueda.addEventListener("input", function (event) {
        filtrarRegistros(event.target.value); // Llamar a la función filtrarRegistros con el valor del campo de búsqueda
    });

});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(TRABAJADORES_API, action);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            TABLE_BODY.innerHTML += `
            <tr class="table-row" ondblclick="openDetails(${row.id_trabajador})" onclick="rowSelected(${row.id_trabajador}, '${row.estado_trabajador}')">
                <td>${row.id_trabajador}</td>
                <td>${row.apellido_trabajador}</td>
                <td>${row.nombre_trabajador}</td>
                <td>${row.dui_trabajador}</td>
                <td>${row.telefono_trabajador}</td>
                <td>${row.correo_trabajador}</td>
                <td>${row.nivel}</td>
                <td>${row.estado_trabajador}</td>
            </tr>
            `;
        });

        if (DATA.dataset == 0) {
            await sweetAlert(1, DATA.message, true);
        }

    } else {
        sweetAlert(4, DATA.error, true);
    }
}

const addSave = async () => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    // Validación de cada campo del formulario
    const nombre = document.getElementById('nombreInput').value;
    const apellidos = document.getElementById('apellidosInput').value;
    const dui = document.getElementById('duiInput').value;
    const telefono = document.getElementById('telefonoInput').value;
    const correo = document.getElementById('correoInput').value;
    const fechaNacimiento = document.getElementById('fechanInput').value;
    const fechaRegistro = document.getElementById('fecharInput').value;
    const estado = document.getElementById('estadoInput').value;
    const nivel = document.getElementById('nivelInput').value;
    const contrasena = document.getElementById('contraInput').value;

    // Validación de nombre y apellidos (solo letras)
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const apellidosRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    // Verificar que los campos no estén vacíos
    if (nombre.trim() === '' || apellidos.trim() === '' || dui.trim() === '' || telefono.trim() === '' || correo.trim() === '' || fechaNacimiento.trim() === '' || fechaRegistro.trim() === '' || estado.trim() === '' || nivel.trim() === '' || contrasena.trim() === '') {
        await sweetAlert(2, 'Debes de llenar todos los campos son obligatorios', false);
        return;
    }
    else if (!nombreRegex.test(nombre) || !apellidosRegex.test(apellidos)) {
        await sweetAlert(2, 'El nombre y los apellidos solo pueden contener letras', false);
        return;
    }
    else {
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(ADD_FORM);

        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(TRABAJADORES_API, 'createRow', FORM);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, 'Se ha guardado correctamente', true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
            // Resetear el formulario
            document.getElementById('AddForm').reset();
            //EVENTO DE LLENAR FECHA ACTUAL
            llenarFechaActual();
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    }

};

// Función para encontrar el valor numérico correspondiente a un texto dado
function findNumberValue(value) {
    // Comprobar si el valor es 'Activo'
    if (value == 'Activo') {
        return 1; // Si es 'Activo', devolver 1
    } else {
        return 2; // Si no es 'Activo', devolver 2
    }
}

function llenarFechaActual(){
    // Obtener la fecha actual
    var fechaActual = new Date();
    // Formatear la fecha actual como YYYY-MM-DD
    var fechaActualFormato = fechaActual.toISOString().split('T')[0];
    // Establecer la fecha actual como el valor del campo de entrada de fecha
    fecharInput.value = fechaActualFormato;
}

let id_worker = null;

// Función para abrir los detalles de un trabajador.
const openDetails = async (id) => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('id_trabajador', id);
    id_worker = id;
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(TRABAJADORES_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        DATA_MODAL.show();
        // Se prepara el formulario.
        UPDATE_FORM.reset();

        const ROW = DATA.dataset;
        NOMBRES_INPUT.value = ROW.nombre_trabajador;
        APELLIDOS_INPUT.value = ROW.apellido_trabajador;
        DUI_INPUT.value = ROW.dui_trabajador;
        TEL_INPUT.value = ROW.telefono_trabajador;
        CORREO_INPUT.value = ROW.correo_trabajador;
        FECHAN_INPUT.value = ROW.fecha_de_nacimiento;
        FECHAR_INPUT.value = ROW.fecha_de_registro;
        fillSelect(TRABAJADORES_API, 'readNivel', 'nivelInputD', ROW.id_nivel);
        ESTADO_INPUT.value = findNumberValue(ROW.estado_trabajador);

        // Deshabilita la edición de los campos de entrada.
        NOMBRES_INPUT.readOnly = true;
        APELLIDOS_INPUT.readOnly = true;
        DUI_INPUT.readOnly = true;
        TEL_INPUT.readOnly = true;
        CORREO_INPUT.readOnly = true;
        FECHAN_INPUT.readOnly = true;
        FECHAR_INPUT.readOnly = true;
        ESTADO_INPUT.disabled = true;
        NIVEL_INPUT.disabled = true;
        // Actualiza el título del modal con el ID del trabajador.
        MODAL_TITLE.textContent = 'Detalles Trabajador #' + id;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Evento cuando se oculta el modal.
DATA_MODAL._element.addEventListener('hidden.bs.modal', function () {
    // Después de que el modal se haya ocultado, cambia el texto del botón a "Actualizar".
    BOTON_ACTUALIZAR.textContent = "Actualizar";
});

// Función que se ejecuta al hacer clic en el botón de actualizar.
const botonActualizar = async () => {
    var textoBoton = BOTON_ACTUALIZAR.textContent.trim();
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    if (textoBoton == 'Actualizar') {
        // Habilita la edición de los campos de entrada.
        enableFormFields();
        // Cambia el texto del botón a "Guardar".
        BOTON_ACTUALIZAR.textContent = "Guardar";
    } else if (textoBoton == 'Guardar') {
        // Deshabilita la edición de los campos de entrada.
        disableFormFields();
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(UPDATE_FORM);
        FORM.append('nivelInputD', NIVEL_INPUT.value);
        FORM.append('estadoInputD', ESTADO_INPUT.value);
        FORM.append('id_trabajador', id_worker);

        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(TRABAJADORES_API, 'updateRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, 'Se ha actualizado correctamente', true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            // Se cierra la caja de diálogo.
            DATA_MODAL.hide();
            restoreEvrPS();
            fillTable();
        } else {
            enableFormFields();
            sweetAlert(2, DATA.error, false);
        }
    }
}

// Función que se ejecuta al hacer clic en el botón de cancelar.
const botonCancelar = async () => {
    var textoBoton = BOTON_ACTUALIZAR.textContent.trim();

    if (textoBoton == 'Actualizar') {
        // Muestra una confirmación antes de cerrar el modal.
        await showCancelConfirmation('¿Seguro qué quieres regresar?', 'Se cerrará la ventana emergente');
    } else if (textoBoton == 'Guardar') {
        // Muestra una confirmación antes de cerrar el modal, advirtiendo sobre la pérdida de cambios no guardados.
        await showCancelConfirmation('¿Seguro qué quieres regresar?', 'Si has modificado no se guardará');
    }
}

// Función que se ejecuta al hacer clic en el botón de regresar.
const returnBack = async () => {
    // Muestra una confirmación antes de regresar, advirtiendo sobre la pérdida de datos no guardados.
    await showCancelConfirmation('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán guardados');
    // Oculta el modal y vuelve a la primera pestaña de la tabla.
    hideModalAndSwitchTab();
}

// Función para mostrar el div de agregar trabajador y ocultar el div de la tabla.
function showAddDiv(boton) {
    fillSelect(TRABAJADORES_API, 'readNivel', 'nivelInput');
    ADD_DIV.classList.remove('d-none');
    TABLE_DIV.classList.add('d-none');
    // Obtener la fecha actual
    llenarFechaActual();
    updateButtonColors(boton);
}

// Función para mostrar el div de la tabla y ocultar el div de agregar trabajador.
function showTableDiv(boton) {
    TABLE_DIV.classList.remove('d-none');
    ADD_DIV.classList.add('d-none');
    updateButtonColors(boton);
}

// Agrega validación a los formularios.
// Convierte la colección de formularios en un array y para cada formulario en el array...
Array.from(forms).forEach(form => {
    // Agrega un event listener para el evento de enviar el formulario.
    form.addEventListener('submit', event => {
        // Verifica si el formulario no pasa la validación.
        if (!form.checkValidity()) {
            // Previene la acción por defecto de enviar el formulario.
            event.preventDefault();
            // Detiene la propagación del evento para prevenir que se propague a otros elementos.
            event.stopPropagation();
        }
        // Agrega la clase 'was-validated' al formulario para aplicar estilos de validación.
        form.classList.add('was-validated');
    }, false);
});

// Función para habilitar la edición de campos del formulario.
function enableFormFields() {
    NOMBRES_INPUT.readOnly = false;
    APELLIDOS_INPUT.readOnly = false;
    DUI_INPUT.readOnly = false;
    TEL_INPUT.readOnly = false;
    CORREO_INPUT.readOnly = false;
    FECHAN_INPUT.readOnly = false;
    ESTADO_INPUT.disabled = false;
    NIVEL_INPUT.disabled = false;
}

// Función para deshabilitar la edición de campos del formulario.
function disableFormFields() {
    NOMBRES_INPUT.readOnly = true;
    APELLIDOS_INPUT.readOnly = true;
    DUI_INPUT.readOnly = true;
    TEL_INPUT.readOnly = true;
    CORREO_INPUT.readOnly = true;
    FECHAN_INPUT.readOnly = true;
    ESTADO_INPUT.disabled = true;
    NIVEL_INPUT.disabled = true;
}

// Función para cambiar el color de los botones según el que se haya clicado.
function updateButtonColors(boton) {
    var botones = document.querySelectorAll('.boton-cambiar-color');
    botones.forEach(function (b) {
        b.style.backgroundColor = '#146A93';
        b.style.color = 'white';
    });
    boton.style.backgroundColor = '#1A89BD';
    boton.style.color = 'white';
}

// Función para mostrar confirmación antes de cerrar el modal.
async function showCancelConfirmation(message, submessage) {
    const RESPONSE = await confirmAction(message, submessage);
    if (RESPONSE.isConfirmed) {
        DATA_MODAL.hide();
        restoreEvrPS();
    }
}

// Función para ocultar el modal y cambiar a la primera pestaña de la tabla.
function hideModalAndSwitchTab() {
    // Oculta el modal.
    DATA_MODAL.hide();

    // Busca el elemento con el ID 'tabla-tab'.
    var primeraPestana = document.querySelector('#tabla-tab');

    // Verifica si se encontró la primera pestaña.
    if (primeraPestana) {
        // Limpia los campos del formulario llamando a una función 'clearFormInputs'.
        clearFormInputs();

        // Simula un clic en la primera pestaña.
        primeraPestana.click();

        // Muestra el div de la tabla y oculta el div de agregar.
        TABLE_DIV.classList.remove('d-none');
        ADD_DIV.classList.add('d-none');
    }
}


// Función para limpiar los campos del formulario de agregar trabajador.
function clearFormInputs() {
    document.getElementById('nombreInput').value = '';
    document.getElementById('apellidosInput').value = '';
    document.getElementById('duiInput').value = '';
    document.getElementById('telefonoInput').value = '';
    document.getElementById('correoInput').value = '';
    document.getElementById('fechanInput').value = '';
    document.getElementById('fecharInput').value = '';
    document.getElementById('nivelInput').value = '';
    document.getElementById('contraInput').value = '';
}

// Función para ocultar el modal y cambiar a la primera pestaña de la tabla.
function hideModalAndSwitchTab() {
    // Oculta el modal.
    DATA_MODAL.hide();

    // Busca el elemento con el ID 'tabla-tab'.
    var primeraPestana = document.querySelector('#tabla-tab');

    // Verifica si se encontró la primera pestaña.
    if (primeraPestana) {
        // Limpia los campos del formulario.
        clearFormInputs();

        // Simula un clic en la primera pestaña.
        primeraPestana.click();

        // Muestra el div de la tabla y oculta el div de agregar.
        TABLE_DIV.classList.remove('d-none');
        ADD_DIV.classList.add('d-none');
    }
}

// Itera sobre una colección de formularios y añade un event listener para el evento de enviar el formulario.
Array.from(forms).forEach(form => {
    // Añade un event listener al evento submit del formulario.
    form.addEventListener('submit', event => {
        // Verifica si el formulario no pasa la validación.
        if (!form.checkValidity()) {
            // Previene la acción por defecto de enviar el formulario.
            event.preventDefault();
            // Detiene la propagación del evento para prevenir que se propague a otros elementos.
            event.stopPropagation();
        }
        // Añade la clase 'was-validated' al formulario para aplicar estilos de validación.
        form.classList.add('was-validated');
    }, false);
});

document.getElementById('duiInput').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 9 dígitos
    inputValue = inputValue.slice(0, 9);

    // Formatear el número agregando el guión antes del último dígito si hay al menos dos dígitos
    if (inputValue.length > 1) {
        inputValue = inputValue.slice(0, -1) + '-' + inputValue.slice(-1);
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});

document.getElementById('telefonoTrabajador').addEventListener('input', function () {
    var telefonoInput = this.value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
    if (telefonoInput.length > 4) {
        telefonoInput = telefonoInput.substring(0, 4) + '-' + telefonoInput.substring(4, 8);
    }
    this.value = telefonoInput;
});

document.getElementById('duiTrabajador').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 9 dígitos
    inputValue = inputValue.slice(0, 9);

    // Formatear el número agregando el guión antes del último dígito si hay al menos dos dígitos
    if (inputValue.length > 1) {
        inputValue = inputValue.slice(0, -1) + '-' + inputValue.slice(-1);
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});

//FORMETEO DE QUE EN EL INOUT DE TELEFONO
document.getElementById('telefonoInput').addEventListener('input', function () {
    // Selecciona el elemento del campo de entrada del teléfono y agrega un evento 'input'
    var telefonoInput = this.value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos del valor del campo
    if (telefonoInput.length > 4) {
        // Si la longitud del valor del campo es mayor que 4
        telefonoInput = telefonoInput.substring(0, 4) + '-' + telefonoInput.substring(4, 8);
        // Formatea el número de teléfono añadiendo un guion después del cuarto dígito
    }
    this.value = telefonoInput; // Asigna el valor formateado de vuelta al campo de entrada
});


document.getElementById('fechanInput').addEventListener('change', function () {
    // Obtener la fecha de nacimiento seleccionada por el usuario
    var fechaNacimiento = new Date(this.value);

    // Obtener la fecha actual
    var fechaActual = new Date();

    // Calcular la diferencia de tiempo entre la fecha actual y la fecha de nacimiento
    var edadMilisegundos = fechaActual - fechaNacimiento;

    // Calcular la edad en años
    var edad = Math.floor(edadMilisegundos / (365.25 * 24 * 60 * 60 * 1000));

    // Comprobar si la edad es menor de 18 años
    if (edad < 18) {
        // Mostrar Sweet Alert con el mensaje de error
        sweetAlert(2, 'Fecha incorrecta, debes ser mayor de 18 años para ingresar.', true);
        // Limpiar el campo de entrada de fecha
        this.value = '';
    }
});

// Variables globales para almacenar el ID y el estado del trabajador seleccionado
let idT = null;
let estadoT = null;

// Referencias a elementos del DOM
const boton = document.getElementById('btnBloq'); // Botón de bloqueo
const texto = document.getElementById('textoInfo'); // Elemento de texto para mostrar información

// Función llamada al seleccionar una fila de la tabla de trabajadores
const rowSelected = async (id, estado) => {
    var variante;
    // Actualizar el texto del botón y del elemento de texto según el estado del trabajador seleccionado
    if (estado == 'Activo') {
        boton.textContent = "Bloquear"; // Cambiar el texto del botón a "Bloquear"
        variante = 'no ha sido bloqueado';

        // Actualizar el texto del elemento de información con el ID y estado del trabajador
        texto.textContent = `El trabajador de ID ${id} está activo, ${variante}`;
    } else if (estado == 'Desactivo') {
        boton.textContent = "Desbloquear"; // Cambiar el texto del botón a "Desbloquear"
        variante = 'ha sido bloqueado';
        
        // Actualizar el texto del elemento de información con el ID y estado del trabajador
        texto.textContent = `El trabajador de ID ${id} está desactivo, ${variante}`;
    }
    // Almacenar el ID y estado del trabajador seleccionado en variables globales
    idT = id;
    estadoT = estado;
}

// Función llamada al hacer clic en el botón de bloqueo
const botonBloquear = async () => {
    let estadoC;
    let estadoCC;
    // Verificar si se ha seleccionado un trabajador
    if (idT == null) {
        sweetAlert(3, 'Selecciona a un trabajador', true); // Mostrar una alerta si no se ha seleccionado ningún trabajador
    } else {
        // Confirmar la acción de bloqueo/desbloqueo
        const RESPONSE = await confirmAction('¿Seguro qué quieres realizar la acción?', 'Se modificará el estado al trabajador');
        if (RESPONSE.isConfirmed) {
            // Determinar el nuevo estado del trabajador (activar o desactivar)
            if (estadoT == 'Activo') {
                estadoC = 'Desactivo';
            } else if (estadoT == 'Desactivo') {
                estadoC = 'Activo';
            }
            // Crear un objeto FormData con el ID del trabajador y el nuevo estado
            const FORM = new FormData();
            FORM.append('id_trabajador', parseInt(idT));
            FORM.append('estado', findNumberValue(estadoC));

            // Realizar una solicitud para actualizar el estado del trabajador en la base de datos
            const DATA = await fetchData(TRABAJADORES_API, 'bloqDesbloqRow', FORM);
            // Verificar si la solicitud fue exitosa
            if (DATA.status) {
                // Mostrar un mensaje de éxito
                await sweetAlert(1, 'Se ha actualizado correctamente', true);
                // Actualizar la tabla de trabajadores para reflejar los cambios
                fillTable();
                restoreEvrPS(); // Restablecer las variables globales y el texto del botón y elemento de información
            } else {
                sweetAlert(2, DATA.error, false); // Mostrar un mensaje de error si la solicitud falla
            }
        } else {
            // Cancelar la acción si el usuario no confirma
        }
    }
}

// Restablecer las variables globales y el texto del botón y elemento de información
function restoreEvrPS() {
    idT = null;
    estadoT = null;
    boton.textContent = "Bloquear"; // Restaurar el texto del botón a "Bloquear"
    texto.textContent = ''; // Eliminar el texto del elemento de información
}

