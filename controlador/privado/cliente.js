// Se establece el título de la página web.
document.querySelector('title').textContent = 'Feasverse - Clientes';

//declaracion de las variables
const ID_INPUT = document.getElementById('idCliente'),
    NOMBRES_INPUT = document.getElementById('nombreCliente'),
    APELLIDOS_INPUT = document.getElementById('apellidosCliente'),
    DUI_INPUT = document.getElementById('duiCliente'),
    TEL_INPUT = document.getElementById('telefonoCliente'),
    CORREO_INPUT = document.getElementById('correoCliente'),
    FECHAN_INPUT = document.getElementById('fechaDeNacimientoCliente'),
    FECHAR_INPUT = document.getElementById('fechaDeRegistroCliente'),
    ESTADO_INPUT = document.getElementById('estadoCliente');
const TABLE_BODY = document.getElementById('tableBody');

const BOTON_ACTUALIZAR = document.getElementById('actualizarBtn');

const DATA_MODAL = new bootstrap.Modal('#dataModal');
const MODAL_TITLE = document.getElementById('modalTitle');
const UPDATE_FORM = document.getElementById('detailUpdateForm');
const inputBusqueda = document.getElementById('buscadorInputClientes');

const CLIENTES_API = 'services/privada/clientes.php';

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // *Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();

    // Bloquear el botón y mostrar la pestaña al cargar la página
    // Mostrar la pestaña
    document.getElementById('tabla-tab').click();
    // Bloquear el botón
    document.getElementById('tabla-tab').setAttribute('disabled', 'disabled');

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

    restoreEvrPS();
});

//Constante para abrir detalles cuando se le de doble click a la tabla
const openDetails = async (idCliente) => {
    const FORM_ID = new FormData();
    FORM_ID.append('idCliente', idCliente);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CLIENTES_API, 'readOne', FORM_ID);
    if (DATA.status) {
        // Se prepara el formulario.
        UPDATE_FORM.reset();
        // Se muestra la caja de diálogo con su título.
        DATA_MODAL.show();
        const ROW = DATA.dataset;
        ID_INPUT.value = ROW.id_cliente;
        NOMBRES_INPUT.value = ROW.nombre_cliente;
        APELLIDOS_INPUT.value = ROW.apellido_cliente;
        DUI_INPUT.value = ROW.dui_cliente;
        TEL_INPUT.value = ROW.telefono_cliente;
        CORREO_INPUT.value = ROW.correo_cliente;
        FECHAN_INPUT.value = ROW.fecha_de_nacimiento;
        FECHAR_INPUT.value = ROW.fecha_de_registro;
        if (ROW.estado_cliente == 1) {
            ESTADO_INPUT.value = 1;
            ESTADO_INPUT.selectedIndex = 1;
        }
        else if (ROW.estado_cliente == 2) {
            ESTADO_INPUT.value = 2;
            ESTADO_INPUT.selectedIndex = 2;
        }

        // Deshabilitar la edición de los campos de entrada
        NOMBRES_INPUT.readOnly = true;
        APELLIDOS_INPUT.readOnly = true;
        DUI_INPUT.readOnly = true;
        TEL_INPUT.readOnly = true;
        CORREO_INPUT.readOnly = true;
        FECHAN_INPUT.readOnly = true;
        FECHAR_INPUT.readOnly = true;
        ESTADO_INPUT.disabled = true;

        MODAL_TITLE.textContent = 'Detalles de Clientes #' + idCliente;
    }
    else {
        sweetAlert(2, DATA.error, false);
    }
};

//Funcion cuando se muestre la pestaña de la tabla
function showTableDiv(button) {
    button.style.backgroundColor = '#1A89BD';
    button.style.color = 'white';
}

//Evento cuando el modal esta oculto
DATA_MODAL._element.addEventListener('hidden.bs.modal', function () {
    // Después de que el modal se haya ocultado, cambiar el texto del botón a "Actualizar"
    BOTON_ACTUALIZAR.textContent = "Actualizar";
});

//Funcion del boton cancelar
const botonCancelar = async () => {
    //se obtiene el texto del boton sin espacios
    var textoBoton = BOTON_ACTUALIZAR.textContent.trim();

    if (textoBoton == 'Actualizar') {
        // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
        const RESPONSE = await confirmAction('¿Seguro qué quieres regresar?', 'Se cerrará la ventana emergente');
        if (RESPONSE.isConfirmed) {
            DATA_MODAL.hide();
            restoreEvrPS();
        }
    }
    else if (textoBoton == 'Guardar') {
        // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
        const RESPONSE = await confirmAction('¿Seguro qué quieres regresar?', 'Si has modificado no se guardara');
        if (RESPONSE.isConfirmed) {
            DATA_MODAL.hide();
            restoreEvrPS();
        }
    }

}

document.getElementById('duiCliente').addEventListener('input', function (event) {
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

document.getElementById('telefonoCliente').addEventListener('input', function () {
    var telefonoInput = this.value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
    if (telefonoInput.length > 4) {
        telefonoInput = telefonoInput.substring(0, 4) + '-' + telefonoInput.substring(4, 8);
    }
    this.value = telefonoInput;
});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    // Se inicializa el contenido de la tabla.
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CLIENTES_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
            <tr class="table-row" ondblclick="openDetails(${row.id_cliente})" onclick="rowSelected(${row.id_cliente}, '${row.estado_cliente}')">
                <td>${row.id_cliente}</td>
                <td>${row.apellido_cliente}</td>
                <td>${row.nombre_cliente}</td>
                <td>${row.dui_cliente}</td>
                <td>${row.telefono_cliente}-3</td>
                <td>${row.correo_cliente}</td>
                <td>${row.estado_cliente}</td>
            </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        if (DATA.dataset == 0) {
            await sweetAlert(1, DATA.message, true);
        }
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

document.getElementById('fechaDeNacimientoCliente').addEventListener('change', function () {
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

// Método del evento para cuando se envía el formulario de guardar.
UPDATE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //se obtiene el texto del boton sin espacios
    var textoBoton = BOTON_ACTUALIZAR.textContent.trim();

    if (textoBoton == 'Actualizar') {

        // habilitar la edición de los campos de entrada
        NOMBRES_INPUT.readOnly = false;
        APELLIDOS_INPUT.readOnly = false;
        DUI_INPUT.readOnly = false;
        TEL_INPUT.readOnly = false;
        CORREO_INPUT.readOnly = false;
        FECHAN_INPUT.readOnly = false;
        ESTADO_INPUT.disabled = false;

        BOTON_ACTUALIZAR.textContent = "Guardar";
    }
    else if (textoBoton == 'Guardar') {

        // Obtener los valores de los campos de nombre y apellido
        var nombre = document.getElementById('nombreCliente').value.trim();
        var apellido = document.getElementById('apellidosCliente').value.trim();

        // Validar que se haya ingresado algo en los campos de nombre y apellido
        if (nombre === '' || apellido === '') {
            await sweetAlert(2,'Por favor, completa todos los campos.', true);
        }

        // Validar que los campos de nombre y apellido no contengan números
        else if (/\d/.test(nombre) || /\d/.test(apellido)) {
            await sweetAlert(2, 'Los campos de nombre y apellido no pueden contener números.', true);
        }

        else {
            const FORM = new FormData();

            // Petición para ACTUALIZAR.
            FORM.append('idCliente', ID_INPUT.value);
            FORM.append('nombreCliente', NOMBRES_INPUT.value);
            FORM.append('apellidosCliente', APELLIDOS_INPUT.value);
            FORM.append('correoCliente', CORREO_INPUT.value);
            FORM.append('telefonoCliente', TEL_INPUT.value);
            FORM.append('duiCliente', DUI_INPUT.value);
            FORM.append('fechaDeNacimientoCliente', FECHAN_INPUT.value);
            FORM.append('estadoCliente', ESTADO_INPUT.value);

            const DATA = await fetchData(CLIENTES_API, 'updateRow', FORM);
            if (DATA.status) {
                // Deshabilitar la edición de los campos de entrada
                NOMBRES_INPUT.readOnly = true;
                APELLIDOS_INPUT.readOnly = true;
                DUI_INPUT.readOnly = true;
                TEL_INPUT.readOnly = true;
                CORREO_INPUT.readOnly = true;
                FECHAN_INPUT.readOnly = true;
                FECHAR_INPUT.readOnly = true;
                ESTADO_INPUT.disabled = true;
                await sweetAlert(1, 'Se ha actualizado correctamente', true);
                fillTable();
                DATA_MODAL.hide();
                restoreEvrPS();
            } else {
                await sweetAlert(2, DATA.error, false);
            }
        }
    }
});

// Función para encontrar el valor numérico correspondiente a un texto dado
function findNumberValue(value) {
    // Comprobar si el valor es 'Activo'
    if (value == 'Activo') {
        return 1; // Si es 'Activo', devolver 1
    } else {
        return 2; // Si no es 'Activo', devolver 2
    }
}

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
    // Verificar si se ha seleccionado un trabajador
    if (idT == null) {
        sweetAlert(3, 'Selecciona a un cliente', true); // Mostrar una alerta si no se ha seleccionado ningún trabajador
    } else {
        // Confirmar la acción de bloqueo/desbloqueo
        const RESPONSE = await confirmAction('¿Seguro qué quieres realizar la acción?', 'Se modificará el estado al cliente');
        if (RESPONSE.isConfirmed) {
            // Determinar el nuevo estado del trabajador (activar o desactivar)
            if (estadoT == 'Activo') {
                estadoC = 'Desactivo';
            } else if (estadoT == 'Desactivo') {
                estadoC = 'Activo';
            }
            // Crear un objeto FormData con el ID del trabajador y el nuevo estado
            const FORM = new FormData();
            FORM.append('idCliente', parseInt(idT));
            FORM.append('estadoCliente', findNumberValue(estadoC));

            // Realizar una solicitud para actualizar el estado del trabajador en la base de datos
            const DATA = await fetchData(CLIENTES_API, 'updateStatus', FORM);
            // Verificar si la solicitud fue exitosa
            if (DATA.status) {
                // Mostrar un mensaje de éxito
                await sweetAlert(1, 'Se ha actualizado correctamente el estado del cliente', true);
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


const generarReporteActivos = async () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/private/clientes_activos.php`);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}

const generarReporteInactivos = async () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/private/clientes_inactivos.php`);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}