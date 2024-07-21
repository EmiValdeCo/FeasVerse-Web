/*
*   Controladores de uso general en las páginas web del sitio público.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/
const USER_API = 'services/publica/cliente.php';
const CARRITO_API = 'services/publica/carrito.php';
//* Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');

/* Función asíncrona para cargar el encabezado y pie del documento.
*   Parámetros: ninguno.
*   Retorno: ninguno.*/

const loadTemplate = async () => {
    const DATA = await fetchData(USER_API, 'getUser');
    const marcasHtml = await getMarcas();
    // Header template
    const headerTemplate = (session, username = '') => `
    <header class="sticky-top">
        <nav class="navbar navbar-expand-lg bg-color-3blue shadow">
            <div class="container-fluid">
                <div class="d-flex flex-row m-3 me-5">
                    <a class="navbar-brand" href="index.html">
                        <h2 class="text-white titillium-web-black m-0 p-0">FEASVERSE</h2>
                    </a>
                    <img src="../../recursos/imagenes/logo.svg" class="img1" alt="FeasVerseCompany" width="50" height="50">
                </div>
                <button class="navbar-toggler mb-3" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 nav-underline">
                        ${session ? `
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle space" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <h5 class="text-white titillium-web-regular m-0 p-0">${username}</h5>
                            </a>
                            <ul class="dropdown-menu bg-color-4blue">
                                <li><a class="dropdown-item my-2" href="configuraciones.html">
                                    <h6 class="text-white titillium-web-regular m-0 p-0 py-1">Configuraciones</h6>
                                </a></li>
                                <li><a class="dropdown-item my-2" href="#" onclick="logOut()">
                                    <h6 class="text-white titillium-web-regular m-0 p-0 py-1">Cerrar sesión</h6>
                                </a></li>
                            </ul>
                        </li>` : `
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle space" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <h5 class="text-white titillium-web-regular m-0 p-0">Ingresar</h5>
                            </a>
                            <ul class="dropdown-menu bg-color-4blue">
                                <li><a class="dropdown-item my-2" href="inicio_sesion_registro.html">
                                    <h6 class="text-white titillium-web-regular m-0 p-0 py-1">Iniciar Sesión</h6>
                                </a></li>
                            </ul>
                        </li>`}
                        <li class="nav-item">
                            <a class="nav-link space" aria-current="page" href="sobre_nosotros.html">
                                <h5 class="text-white titillium-web-regular m-0 p-0">Sobre Nosotros</h5>
                            </a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle space" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <h5 class="text-white titillium-web-regular m-0 p-0">Marcas</h5>
                            </a>
                            <ul class="dropdown-menu bg-color-4blue">
                                <div class="d-flex flex-column">
                                    <div class="d-flex flex-row flex-wrap contenedorMarcas">
                                        ${marcasHtml}
                                    </div>
                                </div>
                            </ul>
                        </li>
                    </ul>
                    <div class="d-flex">
                        <button class="btn btn-outline-primary" type="button" onclick="gotoCarrito()">
                            <img src="../../recursos/imagenes/carrito.svg" width="50px" height="50">
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    </header>`;

    // Footer template
    const footerTemplate = `
    <footer class="text-center text-lg-start text-white bg-color-3blue">
        <section class="d-flex justify-content-between p-4 topFooter">
            <div>
                <a href="" class="text-white me-4"><i class="fab fa-facebook-f"></i></a>
                <a href="" class="text-white me-4"><i class="fab fa-twitter"></i></a>
                <a href="" class="text-white me-4"><i class="fab fa-google"></i></a>
                <a href="" class="text-white me-4"><i class="fab fa-instagram"></i></a>
                <a href="" class="text-white me-4"><i class="fab fa-linkedin"></i></a>
                <a href="" class="text-white me-4"><i class="fab fa-github"></i></a>
            </div>
        </section>
        <section class="">
            <div class="container text-center text-md-start mt-5">
                <div class="row mt-3">
                    <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                        <h5 class="text-white titillium-web-bold">FEASVERSE</h5>
                        <hr class="mb-4 mt-0 d-inline-block mx-auto" />
                        <h6 class="titillium-web-regular">
                            Trabajando por la calidad de nuestros productos desde 2024,
                            garantizando la mejor calidad que no encontrarás en otro lado
                        </h6>
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                        <h5 class="text-white titillium-web-bold">Desarrolladores</h5>
                        <hr class="mb-4 mt-0 d-inline-block mx-auto" />
                        <h6 class="titillium-web-regular">
                            <a href="#!" class="text-white">Josué Emiliano Valdés Jacobo</a>
                        </h6>
                        <h6 class="titillium-web-regular mt-3">
                            <a href="#!" class="text-white">Adriana Paola Mejía Méndez</a>
                        </h6>
                        <h6 class="titillium-web-regular mt-3">
                            <a href="#!" class="text-white">Fernando José Gomez Martinez</a>
                        </h6>
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                        <h5 class="text-white titillium-web-bold">Donde estamos ubicados</h5>
                        <hr class="mb-4 mt-0 d-inline-block mx-auto" />
                        <h6 class="titillium-web-regular">Norte y, 83 Avenida Sur, San Salvador</h6>
                        <button type="button" onclick="gotoAboutUs()"
                            class="btn border shadow bg-color-4blue col-10 rounded-pill p-3 text15 text-white titillium-web-bold m-4">
                            Sobre Nosotros
                        </button>
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                        <h5 class="text-white titillium-web-bold">Nuestras Redes</h5>
                        <hr class="mb-4 mt-0 d-inline-block mx-auto" />
                        <h6 class="titillium-web-regular">
                            <a href="#!" class="text-white">Facebook</a>
                        </h6>
                        <h6 class="titillium-web-regular mt-3">
                            <a href="#!" class="text-white">Twitter</a>
                        </h6>
                        <h6 class="titillium-web-regular mt-3">
                            <a href="#!" class="text-white">Instagram</a>
                        </h6>
                    </div>
                </div>
            </div>
        </section>
    </footer>`;

    // Insert header and footer into the document
    document.body.insertAdjacentHTML('afterbegin', headerTemplate(DATA.session, DATA.username));
    document.body.insertAdjacentHTML('beforeend', footerTemplate);

    if (DATA.session) {
        comprobarCarrito();
    } else {

    }
};

// Función para redirigir a la página "Sobre Nosotros"
function gotoAboutUs() {
    location.href = "sobre_nosotros.html";
}

// Función para redirigir a la página del "Carrito"
function gotoCarrito() {
    location.href = "carrito.html";
}

const comprobarCarrito = async () => {
    const DATA0 = await fetchData(CARRITO_API, 'readAllCarrito');

    if (DATA0.status) {

    }
    else {
        const FORM1 = new FormData();
        FORM1.append('estado_pedido', 4);

        const DATA2 = await fetchData(CARRITO_API, 'createRow', FORM1);

        if (DATA2.status) {
            sweetAlert(4, DATA.error, true);
        } else {
            sweetAlert(4, DATA.error, true);
        }
    }
}

const getMarcas = async () => {
    const MARCAS_API = 'services/publica/marcas.php';
    let marcasHtml = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(MARCAS_API, 'readAll');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            marcasHtml += `
            <li><a class="dropdown-item pointer-hover py-2 px-3" href="../../vistas/publico/buscador.html?marca=${row.id_marca}">
            <img width="100px" height="100px" src="${SERVER_URL}helpers/images/marcas/${row.foto_marca}">
            </a></li>`;
        });
    } else {
        // Si no hay marcas o hay un error, puedes manejarlo aquí
        marcasHtml = '<li>No hay marcas disponibles</li>';
    }
    return marcasHtml;
}
