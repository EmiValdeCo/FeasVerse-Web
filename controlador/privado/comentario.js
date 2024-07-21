// Se establece el título de la página web.
document.querySelector('title').textContent = 'Feasverse - Comentarios';
//Declaracion de variables

const COMENTARIOS_DIV = document.getElementById('rectanguloP'),
    DCOMENTARIOS_DIV = document.getElementById('idComentario'),
    estado = document.getElementById('estado_comentario');
NUMBERCALIFICACION = document.getElementById('NumberCalificacion'),
    DESCRIPCIONCOMENTARIO = document.getElementById('DescripcionComentario'),
    ID_COMENTARIO = document.getElementById('idComentario1'),
    BOTON_ESTADO = document.getElementById('btnRetirar'),
    FECHA = document.getElementById('Fecha'),
    TITULOCOMENTARIO = document.getElementById('TituloComentario');

const COMENTARIO_BODY = document.getElementById('ComentarioC');
const DCOMENTARIOS_BODY = document.getElementById('idComentario')

const COMENTARIOS_API = 'services/privada/comentarios.php';

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // *Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
    COMENTARIOS_DIV.classList.remove('d-none');
    DCOMENTARIOS_DIV.classList.add('d-none');
    fillComents('readAll');
});

const fillComents = async (action) => {
    COMENTARIO_BODY.innerHTML = '';
    // Obtén los datos de la API
    const DATA = await fetchData(COMENTARIOS_API, action);

    // Verifica si la respuesta es satisfactoria
    if (DATA.status) {
        if (DATA.dataset.length === 0) {
            await sweetAlert(1, "No hay comentarios disponibles.", true);
        } else {
            // Manejar los datos de comentarios
            DATA.dataset.forEach(row => {
                COMENTARIO_BODY.innerHTML += `
                <div class="ComentarioC mt-3" id="ComentarioC_${row.id_comentario}"  onclick="ShowComentario(${row.id_comentario}, '${row.estado_comentario}')">
                    <div class="Calificacion d-flex align-items: center; justify-content-end" id="estado_comentario"_${row.estado_comentario}">
                        <input type="number" class="d-none" id="Fecha_${row.id_comentario}" name="Fecha">
                        <p style="font-size: 23px;" class=" d-flex justify-content-end flex-row"
                            id="NumberCalificacion_${row.id_comentario}">${row.calificacion_comentario}</p>
                        <a href="#" class="bi-star-fill estrella d-flex justify-content-end mt-2"></a>
                    </div>
                    <h5 class="comentarioT" id="TituloComentario_${row.id_comentario}">${row.titulo_comentario}</h5>
                    <p class="comentarioD" id="DescripcionComentario_${row.idComentario}">${row.descripcion_comentario}</p>
                </div>`
            });
        }
    } else {
        await sweetAlert(4, DATA.error, true);
    }
};

let idC = null;
let estadoC = null;

const ShowComentario = async (idComentario, estado) => {
    // Creamos un FormData y añadimos el id del comentario
    const formData = new FormData();
    formData.append('idComentario', idComentario);
    formData.append('estado_comentario', estado);
    DCOMENTARIOS_BODY.innerHTML = '';
    // Mostramos el contenedor de comentarios
    DCOMENTARIOS_DIV.classList.remove('d-none');
    // Ocultamos el contenedor de comentarios después de realizar todas las operaciones
    COMENTARIOS_DIV.classList.add('d-none');
    // Obtenemos los datos del comentario específico usando la API
    const DATA = await fetchData(COMENTARIOS_API, 'readOneComentario', formData);
    // Verificamos si la respuesta es exitosa
    if (DATA.status) {
        // Verificamos si hay datos en el conjunto de datos
        if (DATA.dataset.length === 0) {
            await sweetAlert(1, "No hay comentarios disponibles.", true);
        } else {
            const row = DATA.dataset;
            // Iteramos sobre cada comentario en el conjunto de datos
            // Construimos el HTML para mostrar el comentario
            DCOMENTARIOS_BODY.innerHTML += `
            <div class="nav-link idComentario z-0 d-flex flex-column " id="idComentario">
                    <div class="d-flex flex-row flex-wrap contenedorElemento1 justify-content-between" i>
                        <div class="container p-0 m-0" id="idComentario2">
                            <button class="btn" type="button" onclick="volver()">
                                <img src="../../recursos/imagenes/flecha.png" width="25px" height="30px">
                            </button> <!--Boton para volver a la pagina de comentarios-->
                        </div>
                        <div class="d-flex flex-column justify-content-center flex-wrap mx-5 me-5 ms-5 mb-2 contenedorInfoCliente">
                            <h3 class="fw-normal titillium-web-regular mb-5 color-4blue">Información del comentario</h3>
                            <p class="titillium-web-regular">
                                <span class="fw-bold">Nombre del cliente:</span> ${row.nombre_cliente}, ${row.apellido_cliente}
                            </p>
                            <p class="titillium-web-regular">
                                <span class="fw-bold">Correo del cliente:</span> ${row.correo_cliente}
                            </p>
                            <p class="titillium-web-regular">
                                <span class="fw-bold">Teléfono del cliente:</span> ${row.telefono_cliente}
                            </p>
                        </div>
                        <div class="d-flex flex-column contedorDataZapato flex-wrap">
                            <div class="detalleZapato d-flex flex-column flex-wrap justify-content-evenly">
                                <h5 class="titillium-web-extralight color-3blue"> Producto Comentado</h5>
                                <img src="${SERVER_URL}helpers/images/zapatos/6646c0ddb4197.png" alt="zapatoC" width="150px" height="150px" class="">
                                <p class=" m-0 fw-semi-bold">${row.nombre_zapato}</p>
                                <p class="m-0">Zapato ${row.genero_zapato}</p>
                                <p class="m-0">2 Colores ${row.nombre_color}</p>
                                <p class=" m-0 fw-bold">$${row.precio_unitario_zapato}</p>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column flex-wrap contenedorComentario ms-5">
                        <h6 class="titillium-web-semibold color-3blue Texto">Descripcion del comentario:</h6>
                        <p class="Texto ">${row.descripcion_comentario}</p>
                        <div class="container p-0 m-0 mt-4">
                            ${row.estado_comentario === 'Activo' ? `
                            <button type="button" class="btn btn1 btn-primary" id="btnRetirar" onclick="RetirarComentario()">
                            Retirar Comentario
                            </button>
                            ` : row.estado_comentario === 'Desactivo' ? `
                            <button type="button" class="btn btn1 btn-primary" id="btnRetirar" onclick="RetirarComentario()">
                            Activar Comentario
                            </button>
                            ` : `
                            `}
                        </div>
                    </div>
                </div>
            </div>`;

            idC = idComentario;
            estadoC = estado;
        }
    } else {
        // Si hay un error, mostramos una alerta
        await sweetAlert(4, DATA.error, true);
    }
};

function volver() {
    search();
    COMENTARIOS_DIV.classList.remove('d-none');
    // Se oculta el formulario de tabla.
    DCOMENTARIOS_DIV.classList.add('d-none');
}

const RetirarComentario = async () => {
    let estadoCOM;
    if (idC == null) {
        await sweetAlert(3, 'Selecciona un comentario', true);
    } else {
        const RESPONSE = await confirmAction('¿Seguro qué quieres realizar la acción?', 'Se modificará el estado del comentario');
        if (RESPONSE.isConfirmed) {
            // Determinar el nuevo estado del comentario (activar o desactivar)
            if (estadoC == 'Activo') {
                estadoCOM = 'Desactivo';
            } else if (estadoC == 'Desactivo') {
                estadoCOM = 'Activo';
            }
            // Crear un objeto FormData con el ID del trabajador y el nuevo estado
            const FORM = new FormData();
            FORM.append('idComentario', parseInt(idC));
            FORM.append('estado_comentario', findNumberValue(estadoCOM));

            // Realizar una solicitud para actualizar el estado del trabajador en la base de datos
            const DATA = await fetchData(COMENTARIOS_API, 'bloqDesbloqRow', FORM);
            // Verificar si la solicitud fue exitosa
            if (DATA.status) {
                // Mostrar un mensaje de éxito
                await sweetAlert(1, 'Se ha actualizado correctamente', true);
                // Actualizar la tabla de trabajadores para reflejar los cambios
                volver();
                restoreEvrPS();
                // Restablecer las variables globales y el texto del botón y elemento de información
            } else {
                sweetAlert(2, DATA.error, false); // Mostrar un mensaje de error si la solicitud falla
            }
        } else {
            // Cancelar la acción si el usuario no confirma
        }
    }
}

function restoreEvrPS() {
    idC = null;
    estadoC = null;
}

function findNumberValue(value) {
    // Comprobar si el valor es 'Activo'
    if (value == 'Activo') {
        return 1; // Si es 'Activo', devolver 1
    } else {
        return 2; // Si no es 'Activo', devolver 2
    }
}

// Obtener el elemento select por su ID
const CMBX_ESTADO = document.getElementById('cmbxEstado');
// Agregar un evento de cambio al elemento select
CMBX_ESTADO.addEventListener('change', function () {
    search();
});

function search() {
    // Obtener el valor seleccionado
    var selectedValue = CMBX_ESTADO.value;
    if (selectedValue == 1) { fillComents('searchRowsActive'); }
    else if (selectedValue == 2) { fillComents('searchRowsDesactive'); }
    else { fillComents('readAll'); };
}