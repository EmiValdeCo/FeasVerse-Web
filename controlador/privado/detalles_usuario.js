// Obtener referencias a elementos del formulario por su ID
const NOMBRES_INPUT = document.getElementById('nombreInputTrabajador'),
    APELLIDOS_INPUT = document.getElementById('apellidosInputTrabajador'),
    DUI_INPUT = document.getElementById('duiInputTrabajador'),
    TEL_INPUT = document.getElementById('telefonoInputTrabajador'),
    CORREO_INPUT = document.getElementById('correoInputTrabajador'),
    FECHAN_INPUT = document.getElementById('fechanInputTrabajador');

const nombre = document.getElementById('nombreDeUsuario');
const correo = document.getElementById('correoDeUsuario');

const forms = document.querySelectorAll('form');
const PASSWORD_FORM = document.getElementById('passwordForm');
const CONTRA_WRITTEN = document.getElementById('contraActual');

const INFO_FORM = document.getElementById('infoForm');

// Declaración de constantes para el modal, el título del modal y el formulario de comentario.
const DATA_MODAL = new bootstrap.Modal('#dataModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
const TRABAJADORES_API = 'services/privada/trabajadores.php';
// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    fillTable();
});

let id_worker = null;

const fillTable = async () => {
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(TRABAJADORES_API, 'readAdmin');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        const ROW = DATA.dataset;
        nombre.innerHTML = ROW.nombre_trabajador + ' ' + ROW.apellido_trabajador;
        correo.innerHTML = ROW.correo_trabajador;
        NOMBRES_INPUT.value = ROW.nombre_trabajador;
        APELLIDOS_INPUT.value = ROW.apellido_trabajador;
        DUI_INPUT.value = ROW.dui_trabajador;
        TEL_INPUT.value = ROW.telefono_trabajador;
        CORREO_INPUT.value = ROW.correo_trabajador;
        FECHAN_INPUT.value = ROW.fecha_de_nacimiento;

        id_worker = ROW.id_trabajador;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Función para mostrar el formulario de usuario.
function showFormUser() {
    const FROM_DIV = document.getElementById('formDiv');
    const MAIN = document.getElementById('ContenedorMain');

    // Se muestra el div para agregar trabajador.
    FROM_DIV.classList.remove('d-none');
    // Se oculta el formulario de tabla.
    MAIN.classList.add('d-none');
}

// Función para regresar a la página anterior con confirmación.
const returnBack = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Seguro qué quieres regresar?', 'Los datos modificados no serán guardados');
    if (RESPONSE.isConfirmed) {
        location.href = 'detalles_usuario.html'
    }
}

// Función para agregar o guardar datos con SweetAlert integrado.
const addSave = async () => {
    const btnUpdate = document.getElementById('btnUpdate');
    var textoBoton = btnUpdate.textContent.trim();
    if (textoBoton == 'Actualizar') {
        // Hacer los campos de entrada editables para actualizar.
        makeFieldsReadOnly(false);
        btnUpdate.textContent = 'Guardar';
    }
    else if (textoBoton == 'Guardar') {
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(INFO_FORM);
        FORM.append('id_trabajador', id_worker);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(TRABAJADORES_API, 'editProfile', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, 'Se ha actualizado correctamente', true);
            // Deshabilita la edición de los campos de entrada.
            makeFieldsReadOnly(true);
            btnUpdate.textContent = 'Actualizar';
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            makeFieldsReadOnly(false);
            sweetAlert(2, DATA.error, false);
        }
    }
}

// Función para hacer los campos de entrada de solo lectura o editables.
function makeFieldsReadOnly(isReadOnly) {
    NOMBRES_INPUT.readOnly = isReadOnly;
    APELLIDOS_INPUT.readOnly = isReadOnly;
    DUI_INPUT.readOnly = isReadOnly;
    TEL_INPUT.readOnly = isReadOnly;
    CORREO_INPUT.readOnly = isReadOnly;
    FECHAN_INPUT.readOnly = isReadOnly;
}

// Evento para validar el formulario antes de enviarlo.
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }
        form.classList.add('was-validated')
    }, false)
})

// Definición de la función asíncrona para abrir los detalles en el modal.
const showConDetails = async () => {
    // Muestra el modal y resetea el formulario de comentario.
    DATA_MODAL.show();
    PASSWORD_FORM.reset();
}
// Definición de la función asíncrona para cancelar y cerrar el modal.
const botonCancelar = async () => {
    // Muestra una confirmación y, si el usuario confirma, oculta el modal.
    const RESPONSE = await confirmAction('¿Seguro qué quieres regresar?', 'Se cerrará la ventana emergente');
    if (RESPONSE.isConfirmed) {
        DATA_MODAL.hide();
    }
}

// Definición de la función asíncrona para agregar y cerrar el modal.
const botonRestablecer = async () => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(PASSWORD_FORM);
    // Petición para actualizar la constraseña.
    const DATA = await fetchData(TRABAJADORES_API, 'changePassword', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra un mensaje de éxito.
        sweetAlert(1, 'La contraseña ha sido modificada exitosamente', true);
        DATA_MODAL.hide();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

document.getElementById('fechanInputTrabajador').addEventListener('change', function () {
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