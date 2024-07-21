// Constantes para establecer el contenido y las URL de la API
const CONTAINER_MARCAS = document.getElementById('carousel_inner');
const CONTAINER_RECIENTE = document.getElementById('container_coleccion_reciente');
const CONTAINER_ESPECIAL = document.getElementById('container_coleccion_especial');
const MARCAS_API = 'services/publica/marcas.php';
const ZAPATOS_API = 'services/publica/zapatos.php';

// Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', async () => {
    // Llamada a la función para cargar el encabezado y pie del documento
    loadTemplate();
    // Llamada a la función para llenar la tabla con registros disponibles
    fillTable();
});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const fillTable = async () => {
    // Llama a las funciones para leer y mostrar marcas, colección reciente y selección especial
    readMarcas();
    readColeccionReciente();
    readSeleccionEspecial();
}

// Función asíncrona para leer y mostrar la colección especial de zapatos
const readSeleccionEspecial = async () => {
    // Limpia el contenedor antes de añadir nuevos elementos
    CONTAINER_ESPECIAL.innerHTML = '';
    // Realiza una petición para obtener los registros de la colección especial
    const DATA = await fetchData(ZAPATOS_API, 'readAllEspecial');
    // Verifica si la respuesta es satisfactoria
    if (DATA.status) {
        // Itera sobre los datos y agrega elementos al contenedor
        DATA.dataset.forEach(row => {
            CONTAINER_ESPECIAL.innerHTML += `
            <!-- Tarjeta de zapato especial -->
            <div class="card col-4 cardC">
                <!-- Enlace a la página de detalles del zapato -->
                <a href="../../vistas/publico/detalle_zapato.html?zapato=${row.id_zapato}" class="text15">
                    <!-- Contenedor de la imagen del zapato -->
                    <div class="image-wrapper2">
                        <img  src="${SERVER_URL}helpers/images/zapatos/${row.foto_detalle_zapato}">
                    </div>
                    <!-- Línea decorativa debajo de la imagen -->
                    <div class="lineImgC"></div>
                    <!-- Cuerpo de la tarjeta -->
                    <div class="card-body">
                        <!-- División de dos columnas -->
                        <div class="d-flex flex-row justify-content-between">
                            <!-- Columna 1 -->
                            <div class="column1 ps-3">
                                <!-- Nombre y descripción del zapato -->
                                <h1 class="titillium-web-bold text25 text-black">${row.nombre_zapato}</h1>
                                <p class="titillium-web-extralight text18 clgr3 mt-2">Zapato ${row.genero_zapato}</p>
                                <!-- División para icono de estrella y calificación -->
                                <div class="d-flex flex-row align-items-center mt-2 ">
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
    }
}

// Función asíncrona para leer y mostrar la colección reciente de zapatos
const readColeccionReciente = async () => {
    // Limpia el contenedor antes de añadir nuevos elementos
    CONTAINER_RECIENTE.innerHTML = '';
    // Realiza una petición para obtener los registros de la colección reciente de zapatos
    const DATA = await fetchData(ZAPATOS_API, 'readAllReciente');
    // Verifica si la respuesta es satisfactoria
    if (DATA.status) {
        // Itera sobre los datos y agrega elementos al contenedor
        DATA.dataset.forEach(row => {
            CONTAINER_RECIENTE.innerHTML += `
            <!-- Tarjeta de zapato reciente -->
            <div class="card col-4 cardC">
                <!-- Enlace a la página de detalles del zapato -->
                <a href="../../vistas/publico/detalle_zapato.html?zapato=${row.id_zapato}" class="text15">
                    <!-- Contenedor de la imagen del zapato -->
                    <div class="image-wrapper2">
                        <img src="${SERVER_URL}helpers/images/zapatos/${row.foto_detalle_zapato}">
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
                                <h1 class="titillium-web-bold text25 text-black">${row.nombre_zapato}</h1>
                                <!-- Descripción del zapato -->
                                <p class="titillium-web-extralight text18 clgr3 mt-2">Zapato ${row.genero_zapato}</p>
                                <!-- División para icono de estrella y calificación -->
                                <div class="d-flex flex-row align-items-center mt-2">
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
                                <h1 class="titillium-web-bold text25 text-black fit">$${row.precio_unitario_zapato}</h1>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            `;
        });
    } else {
        // Si hay un error, se podría manejar mostrando una alerta, pero está comentado
        //sweetAlert(2, DATA.error, false);
    }
}

// Función asincrónica para leer y mostrar las marcas
const readMarcas = async () => {
    // Limpia el contenido del contenedor de marcas
    CONTAINER_MARCAS.innerHTML = '';
    // Realiza una petición para obtener los registros de marcas disponibles
    const DATA = await fetchData(MARCAS_API, 'readAll');
    // Verifica si la respuesta de la petición es satisfactoria
    if (DATA.status) {
        let carouselItem = ''; // Cadena para almacenar el HTML del carrusel
        let count = 0; // Contador para controlar el número de tarjetas por carrusel

        // Itera sobre cada fila de datos en el conjunto de datos recibido
        DATA.dataset.forEach((row, index) => {
            // Si el índice es múltiplo de 4, crea un nuevo carousel-item y cards-wrapper
            if (count % 4 === 0) {
                if (count !== 0) {
                    // Cierra el cards-wrapper y carousel-item previos
                    carouselItem += `</div></div>`;
                }
                // Abre un nuevo carousel-item y cards-wrapper
                carouselItem += `<div class="carousel-item ${count === 0 ? 'active' : ''}">
                                    <div class="cards-wrapper">`;
            }

            // Añade la tarjeta al cards-wrapper actual
            carouselItem += `
                <div class="card cardM">
                    <div class="image-wrapper">
                        <a href="../../vistas/publico/buscador.html?marca=${row.id_marca}"><img
                                src="${SERVER_URL}helpers/images/marcas/${row.foto_marca}" alt="${row.nombre}"></a>
                    </div>
                </div>
            `;

            count++; // Incrementa el contador de tarjetas

            // Si es el último elemento, cierra el cards-wrapper y carousel-item
            if (index === DATA.dataset.length - 1) {
                carouselItem += `</div></div>`;
            }
        });

        // Agrega el HTML generado al contenedor de marcas
        CONTAINER_MARCAS.innerHTML = carouselItem;

        // Si no hay marcas disponibles, muestra un mensaje de alerta
        if (DATA.dataset.length === 0) {
            await sweetAlert(1, DATA.message, true);
        }

    } else {
        // Si la respuesta no es satisfactoria, se puede mostrar un mensaje de error
        // Pero en este caso, la línea está comentada
        //sweetAlert(2, DATA.error, false);
    }
}
