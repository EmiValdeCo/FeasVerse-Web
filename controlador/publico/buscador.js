const BUSCADOR_API = 'services/publica/buscador.php'; // URL de la API 
const MARCA_API = 'services/publica/marcas.php'; // URL de la API 
const CARDS_ZAPATO_BODY = document.getElementById('cardsZapato'); // Cuerpo de la tabla del carrito de compras
const PAGINATION = document.getElementById('pagination'); // Contenedor de la paginación
const CARDS_TALLAS = document.getElementById('contenedorFilaTallas');
const SELECT_COLOR = document.getElementById('coloresSelect');
const BUSCADOR = document.getElementById('buscadorInputZapatos');
const BUSCADOR_INPUT = document.getElementById('buscador');

const IMAGEN_MARCA = document.getElementById('imagenMarca');
const NOMBRE_MARCA = document.getElementById('nombreDeLaMarca');
const DESCRIPCION_MARCA = document.getElementById('descripcionDeLaMarca');

let currentPage = 1;
const itemsPerPage = 6; // Número de items por página
let allZapatos = []; // Variable para almacenar todos los datos de zapatos
// Escucha el evento 'DOMContentLoaded' para ejecutar la función cuando el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Carga una plantilla asíncronamente.
    await loadTemplate();
    
    // Obtiene el botón del acordeón de tallas por su ID y simula un clic en él.
    const ACCORDION_BUTTON_TALLAS = document.getElementById('accordionTallas');
    ACCORDION_BUTTON_TALLAS.click();
    
    // Llama a varias funciones asíncronas para llenar datos en la interfaz.
    await fillTalla();
    await fillMarca();
    await fillTable();
    
    // Llama a la función para llenar un selector con colores desde una API.
    fillSelect(BUSCADOR_API, 'readColor', 'coloresSelect');
    
    // Configura los listeners de eventos para los filtros.
    setupFilterEventListeners();

    // Agrega un listener de clic a cada elemento con la clase 'cuadradoTalla'.
    document.querySelectorAll('.cuadradoTalla').forEach(element => {
        element.addEventListener('click', () => {
            // Alterna la clase 'selected' en el elemento clicado.
            element.classList.toggle('selected');
            // Llama a la función fillSearch para actualizar los resultados de la búsqueda.
            fillSearch();
        });
    });
});

// Agrega un listener de entrada al elemento con el ID 'buscadorInputZapatos'.
document.getElementById('buscadorInputZapatos').addEventListener('input', function () {
    var searchIcon = document.querySelector('.search-icon');
    var clearIcon = document.querySelector('.clear-icon');
    
    // Si hay texto en el input, muestra el icono de limpiar. Si no, muestra el icono de búsqueda.
    if (this.value.length > 0) {
        clearIcon.style.display = 'block';
    } else {
        searchIcon.style.display = 'block';
        clearIcon.style.display = 'none';
    }
});

// Función para limpiar el campo de búsqueda.
function clearSearch() {
    var input = document.getElementById('buscadorInputZapatos');
    var searchIcon = document.querySelector('.search-icon');
    var clearIcon = document.querySelector('.clear-icon');
    
    // Limpia el valor del input y lo enfoca. Ajusta la visibilidad de los iconos.
    input.value = '';
    input.focus();
    searchIcon.style.display = 'block';
    clearIcon.style.display = 'none';
}

// Función asíncrona para llenar información de la marca.
const fillMarca = async () => {
    const FORM = new FormData();
    let idMarca = Number(getQueryParam('marca')); // Obtiene el ID de la marca desde los parámetros de la URL.
    FORM.append('idMarca', idMarca);

    // Solicita datos de la marca desde una API.
    const DATA = await fetchData(MARCA_API, 'readOne', FORM);

    // Si la solicitud es exitosa, actualiza el DOM con la información de la marca.
    if (DATA.status) {
        const ROW = DATA.dataset;
        NOMBRE_MARCA.innerHTML = ROW.nombre_marca;
        DESCRIPCION_MARCA.innerHTML = ROW.descripcion_marca;
        IMAGEN_MARCA.src = `${SERVER_URL}helpers/images/marcas/${ROW.foto_marca}`;
    } else {
        //location.href = 'index.html';   
    }
}

// Función asíncrona para llenar información de tallas.
const fillTalla = async () => {
    // Solicita datos de tallas desde una API.
    const DATA = await fetchData(BUSCADOR_API, 'readTallas');
    CARDS_TALLAS.innerHTML = ''; // Limpia el contenedor de tallas.

    // Si la solicitud es exitosa, actualiza el DOM con las tallas obtenidas.
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            CARDS_TALLAS.innerHTML += `
            <div class="cuadradoTalla">
                <h5 class="titillium-web-regular m-0 p-0">
                    ${row.num_talla}
                </h5>
            </div>
            `;
        });
    } else {
        // Maneja el error (mostrar mensaje de error, etc.)
    }
}

// Función asíncrona para llenar la tabla con datos de zapatos, con paginación.
const fillTable = async (page = 1) => {
    // Si el array allZapatos está vacío, carga los datos solo una vez.
    if (allZapatos.length === 0) {
        const FORM = new FormData();
        let idMarca = Number(getQueryParam('marca')); // Obtiene el ID de la marca desde los parámetros de la URL.
        FORM.append('idMarca', idMarca);

        // Solicita datos de todos los zapatos de la marca desde una API.
        const DATA = await fetchData(BUSCADOR_API, 'readAllZapatoMarca', FORM);

        // Si la solicitud es exitosa, guarda los datos en el array allZapatos.
        if (DATA.status) {
            allZapatos = DATA.dataset;
        } else {
            // Si hay un error, muestra una alerta.
            sweetAlert(2, DATA.error, false); 
        }
    }

    // Aplica filtros a los datos de zapatos.
    const filteredZapatos = applyFiltersToData(allZapatos);

    // Limpia el contenedor de las tarjetas de zapatos.
    CARDS_ZAPATO_BODY.innerHTML = '';

    // Determina los índices de inicio y fin para la paginación.
    let start = (page - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    // Selecciona los elementos de la página actual.
    let paginatedItems = filteredZapatos.slice(start, end);

    // Itera sobre los elementos paginados y genera el HTML para cada uno.
    paginatedItems.forEach(row => {
        CARDS_ZAPATO_BODY.innerHTML += `
        <div class="col-lg-4 col-md-3 col-sm-6 mt-2 mb-2">
            <div class="card col-lg-12 col-md-12 col-sm-12" id="cardC">
                <a href="../../vistas/publico/detalle_zapato.html?zapato=${row.id_zapato}" class="text15">
                    <div class="image-wrapper2 col-lg-12">
                        <img src="${SERVER_URL}helpers/images/zapatos/${row.foto_detalle_zapato}" id="imagenZapato"
                            alt="${row.nombre_zapato}">
                    </div>
                    <div class="lineImgC"></div>
                    <div class="card-body">
                        <div class="d-flex flex-column col-lg-12 col-md-12 col-sm-12">
                            <div class="d-flex col-lg-12 col-md-12 col-sm-12">
                                <div class="d-flex flex-column col-lg-8 col-md-8 col-sm-8">
                                    <div class="col-lg-12 col-md-12 col-sm-12">
                                        <h1 class="col-lg-12 col-md-12 col-sm-12 titillium-web-bold text18 text-black mb-0"
                                            id="nombre">
                                            ${row.nombre_zapato}
                                        </h1>
                                        <p class="col-lg-12 col-md-12 col-sm-12 titillium-web-extralight text12 clgr3 mt-0"
                                            id="categoria">
                                            ${row.genero_zapato}
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex col-lg-4 col-md-4 col-sm-4">
                                    <div class="d-flex col-lg-12 col-md-12 col-sm-12 justify-content-end">
                                        <p class="col-lg-11 titillium-web-extralight text12 clgr3" id="colores">
                                            ${row.colores} colores
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex col-lg-12 col-md-12 col-sm-12">
                                <div class="col-lg-6 col-md-6 col-sm-6 d-flex flex-row align-items-center">
                                    <img src="../../recursos/imagenes/icons/starFill.svg" alt="">
                                    <p class="titillium-web-bold text12 m-0 align-baseline clYellowStar mt-1" id="calificacionZapato">
                                        ${row.estrellas !== null ? row.estrellas : 0}
                                    </p>
                                </div>
                                <div class="d-flex col-lg-6 col-md-6 col-sm-6 justify-content-end align-items-center">
                                    <h1 class="titillium-web-bold text15 text-black d-flex align-items-center mt-1" id="precioZapato">
                                        $${row.precio_unitario_zapato}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        `;
    });

    // Configura la paginación basado en la cantidad de elementos filtrados.
    setupPagination(filteredZapatos.length, itemsPerPage, page);
}

// Función que aplica filtros a los datos según los géneros seleccionados.
function applyFiltersToData(data) {
    // Obtiene todos los checkboxes seleccionados y extrae el atributo 'data-genero' de cada uno.
    const selectedGenders = Array.from(document.querySelectorAll('.form-check-input:checked'))
                                .map(cb => cb.getAttribute('data-genero'));
    
    // Si no hay géneros seleccionados, devuelve todos los datos.
    if (selectedGenders.length === 0) {
        return data;
    } else {
        // Filtra los datos para incluir solo aquellos con géneros seleccionados.
        return data.filter(item => selectedGenders.includes(item.genero_zapato));
    }
}

// Función que configura los listeners de eventos para los filtros.
function setupFilterEventListeners() {
    // Añade un listener de cambio a cada checkbox de género.
    document.querySelectorAll('.form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Llama a fillTable y reinicia a la primera página cada vez que se aplica un filtro.
            fillTable(1);
        });
    });
}

// Función que configura la paginación.
const setupPagination = (totalItems, itemsPerPage, currentPage) => {
    PAGINATION.innerHTML = ''; // Limpia el contenedor de la paginación.
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Calcula el total de páginas.

    // Crea y configura el botón "Anterior".
    let backNext = document.createElement('li');
    backNext.classList.add('page-item', 'backNext');
    backNext.innerHTML = `<a class="page-link" href="#" aria-label="ANTERIOR">&laquo; ANTERIOR</a>`;
    if (currentPage === 1) {
        backNext.classList.add('disabled');
    }
    backNext.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            fillTable(currentPage);
        }
    });
    PAGINATION.appendChild(backNext);

    // Crea los elementos de la paginación para cada página.
    for (let i = 1; i <= totalPages; i++) {
        let pageItem = document.createElement('li');
        pageItem.classList.add('page-item', 'num');
        if (i === currentPage) {
            pageItem.classList.add('active');
        }
        pageItem.innerHTML = `<a class="page-link num2" href="#">${i}</a>`;
        pageItem.addEventListener('click', () => {
            currentPage = i;
            fillTable(currentPage);
        });
        PAGINATION.appendChild(pageItem);
    }

    // Crea y configura el botón "Siguiente".
    let next = document.createElement('li');
    next.classList.add('page-item', 'backNext');
    next.innerHTML = `<a class="page-link" href="#" aria-label="SIGUIENTE">SIGUIENTE &raquo;</a>`;
    if (currentPage === totalPages) {
        next.classList.add('disabled');
    }
    next.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage += 1;
            fillTable(currentPage);
        }
    });
    PAGINATION.appendChild(next);
}

// Función para obtener un parámetro de la URL.
const getQueryParam = (param) => {
    let urlParams = new URLSearchParams(window.location.search); // Crea un objeto URLSearchParams con la búsqueda de la URL.
    return urlParams.get(param); // Devuelve el valor del parámetro solicitado.
}

// Función para obtener las tallas seleccionadas.
function getSelectedTallas() {
    // Obtiene todos los elementos con la clase 'cuadradoTalla' que también tienen la clase 'selected'.
    const selectedElements = document.querySelectorAll('.cuadradoTalla.selected');
    
    // Extrae y devuelve el texto de cada elemento seleccionado.
    const selectedTallas = Array.from(selectedElements).map(element => element.textContent.trim());
    return selectedTallas;
}
// Función asíncrona para llenar la búsqueda de zapatos con filtros y paginación.
const fillSearch = async (page = 1) => {
    // Crea un FormData para enviar los datos de búsqueda a la API.
    const FORM = new FormData();
    let idMarca = Number(getQueryParam('marca')); // Obtiene el ID de la marca desde los parámetros de la URL.
    FORM.append('idMarca', idMarca);

    // Añade el valor de búsqueda al FormData si el campo de búsqueda no está vacío.
    if (BUSCADOR.value) {
        FORM.append('value', BUSCADOR.value);
    }

    // Añade las tallas seleccionadas al FormData.
    const selectedTallas = getSelectedTallas();
    if (selectedTallas.length > 0) {
        selectedTallas.forEach(talla => {
            FORM.append('tallas[]', talla);
        });
    }

    // Añade el color seleccionado al FormData si hay uno seleccionado.
    if (SELECT_COLOR.value) {
        FORM.append('coloresSelect', SELECT_COLOR.value);
    }

    // Realiza la solicitud a la API para buscar zapatos según los filtros y la paginación.
    const DATA = await fetchData(BUSCADOR_API, 'searchZapatoMarca', FORM);
    if (DATA.status) {
        allZapatos = DATA.dataset; // Actualiza los datos de zapatos con los obtenidos de la API.
    } else {
        sweetAlert(4, DATA.error, true); // Muestra una alerta de error si la solicitud no es exitosa.
    }

    // Aplica los filtros a los datos de zapatos obtenidos.
    const filteredZapatos = applyFiltersToData(allZapatos);

    // Limpia el contenedor de las tarjetas de zapatos.
    CARDS_ZAPATO_BODY.innerHTML = '';

    // Calcula los índices de inicio y fin para la paginación.
    let start = (page - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    // Selecciona los elementos de la página actual.
    let paginatedItems = filteredZapatos.slice(start, end);

    // Itera sobre los elementos paginados y genera el HTML para cada uno.
    paginatedItems.forEach(row => {
        CARDS_ZAPATO_BODY.innerHTML += `
        <div class="col-lg-4 col-md-3 col-sm-6 mt-2 mb-2">
            <div class="card col-lg-12 col-md-12 col-sm-12" id="cardC">
                <a href="../../vistas/publico/detalle_zapato.html?zapato=${row.id_zapato}" class="text15">
                    <div class="image-wrapper2 col-lg-12">
                        <img src="${SERVER_URL}helpers/images/zapatos/${row.foto_detalle_zapato}" id="imagenZapato"
                            alt="${row.nombre_zapato}">
                    </div>
                    <div class="lineImgC"></div>
                    <div class="card-body">
                        <div class="d-flex flex-column col-lg-12 col-md-12 col-sm-12">
                            <div class="d-flex col-lg-12 col-md-12 col-sm-12">
                                <div class="d-flex flex-column col-lg-8 col-md-8 col-sm-8">
                                    <div class="col-lg-12 col-md-12 col-sm-12">
                                        <h1 class="col-lg-12 col-md-12 col-sm-12 titillium-web-bold text18 text-black mb-0"
                                            id="nombre">
                                            ${row.nombre_zapato}
                                        </h1>
                                        <p class="col-lg-12 col-md-12 col-sm-12 titillium-web-extralight text12 clgr3 mt-0"
                                            id="categoria">
                                            ${row.genero_zapato}
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex col-lg-4 col-md-4 col-sm-4">
                                    <div
                                        class="d-flex col-lg-12 col-md-12 col-sm-12 justify-content-end">
                                        <p class="col-lg-11 titillium-web-extralight text12 clgr3"
                                            id="colores">
                                            ${row.colores} colores</p>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex col-lg-12 col-md-12 col-sm-12">
                                <div
                                    class="col-lg-6 col-md-6 col-sm-6 d-flex flex-row align-items-center">
                                    <img src="../../recursos/imagenes/icons/starFill.svg"
                                        alt="">
                                    <p class="titillium-web-bold text12 m-0 align-baselin clYellowStar mt-1"
                                        id="calificacionZapato">
                                        ${row.estrellas !== null ? row.estrellas : 0}</p>
                                </div>
                                <div
                                    class="d-flex col-lg-6 col-md-6 col-sm-6 justify-content-end align-items-center">
                                    <h1 class="titillium-web-bold text15 text-black d-flex align-items-center mt-1"
                                        id="precioZapato"> $${row.precio_unitario_zapato}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        `;
    });

    // Configura la paginación basado en la cantidad de elementos filtrados.
    setupPagination(filteredZapatos.length, itemsPerPage, page);
}

// Añade un listener de cambio al selector de color para actualizar la búsqueda cuando cambia.
SELECT_COLOR.addEventListener('change', function() {
    fillSearch();
});

// Añade un listener de envío al formulario de búsqueda para actualizar la búsqueda cuando se envía el formulario.
BUSCADOR_INPUT.addEventListener('submit', async (event) => {
    // Evita que la página se recargue después de enviar el formulario.
    event.preventDefault();
    fillSearch();
});
