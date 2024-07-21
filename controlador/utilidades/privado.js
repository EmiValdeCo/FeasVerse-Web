/*
*   Controlador de uso general en las páginas web del sitio privado.
*   Sirve para manejar la plantilla del encabezado y pie del documento.
*/

//* Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('#mainContent');

// Constante para completar la ruta de la API.
const USER_API = 'services/privada/trabajadores.php';

/*  Función asíncrona para cargar el encabezado y pie del documento.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/

const loadTemplate = async () => {
    // Crear el elemento de encabezado con una barra de navegación.
    const DATA = await fetchData(USER_API, 'getUser');
    // Se verifica si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
    if (DATA.session) {
        // Se comprueba si existe un alias definido para el usuario, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            const header = document.createElement('header');
            header.innerHTML = `
            <nav class="navbar bg-color-5blue fixed-top position-relative">
                <div class="container-fluid m-0">
                    <div class="d-flex align-items-center collapse-div">
                        <h1 class="collapseFea">FEASVERSE - </h1>
                        <h2 class="collapseAdmin"> Administrador</h2>
                    </div>
                    <div class="linea"></div>
                    <form class="d-flex align-items-center">
                        <h1 class="navbar-brand text-white titillium-web-semibold margin-user me-3">${DATA.username}</h1>
                        <a href="detalles_usuario.html">
                            <button class="btn btn-outline-primary" type="button">
                                <img src="../../recursos/imagenes/icons/exitUser.svg" width="50px" height="50">
                            </button>
                        </a>
                    </form>
                </div>
            </nav>
            `;

            // Crear el menú deslizante lateral.
            const slideMenu = document.createElement('div');
            slideMenu.innerHTML = `
            <div class="wrapper">
                <aside id="sidebar" class="position-relative">
                    <div class="d-flex position-relative">
                        <div class="lineah"></div>
                        <div class="lineah"></div>
                        <button class="toggle-btn" type="button">
                            <i class="lni lni-grid-alt"><img src="../../recursos/imagenes/logo.svg" class="img1"
                                    alt="FeasVerseCompany" width="50" height="50"></i>
                        </button>
                    </div>
                    <ul class="sidebar-nav">
                        <li class="sidebar-item marg1">
                            <a href="panel_principal.html" class="sidebar-link">
                                <div class="contenedorItemNav">
                                    <i class="lni lni-user img"> <img src="../../recursos/imagenes/icons/houseIcon.svg"
                                            width="40" height="40" class="imgIcon"></i>
                                    <span class="text-nav text20 titillium-web-regular">Inicio</span>
                                </div>
                            </a>
                        </li>
        
                        <li class="sidebar-item">
                            <a href="trabajadores.html" class="sidebar-link">
                                <div class="contenedorItemNav">
                                    <i class="lni lni-user img"> <img src="../../recursos/imagenes/icons/workersIcon.svg"
                                            width="40" height="40"></i>
                                    <span class="text-nav text20 titillium-web-regular">Trabajadores</span>
                                </div>
                            </a>
                        </li>
        
                        <li class="sidebar-item">
                            <a href="clientes.html" class="sidebar-link">
                                <div class="contenedorItemNav">
                                    <i class="lni lni-user img"> <img src="../../recursos/imagenes/icons/clientIcon.svg"
                                            width="40" height="40"></i>
                                    <span class="text-nav text20 titillium-web-regular">Clientes</span>
                                </div>
                            </a>
                        </li>
        
                        <li class="sidebar-item">
                            <a href="zapatos.html" class="sidebar-link">
                                <div class="contenedorItemNav">
                                    <i class="lni lni-user img"> <img src="../../recursos/imagenes/icons/shoesIcon.svg"
                                            width="40" height="40"></i>
                                    <span class="text-nav text20 titillium-web-regular">Zapatos</span>
                                </div>
                            </a>
                        </li>
        
                        <li class="sidebar-item">
                            <a href="pedidos.html" class="sidebar-link">
                                <div class="contenedorItemNav">
                                    <i class="lni lni-user img"> <img src="../../recursos/imagenes/icons/pedidoIcon.svg"
                                            width="40" height="40"></i>
                                    <span class="text-nav text20 titillium-web-regular">Pedidos</span>
                                </div>
                            </a>
                        </li>
        
                        <li class="sidebar-item">
                            <a href="marcas.html" class="sidebar-link">
                                <div class="contenedorItemNav">
                                    <i class="lni lni-user img"> <img src="../../recursos/imagenes/icons/marcaIcon.svg"
                                            width="40" height="40"></i>
                                    <span class="text-nav text20 titillium-web-regular">Marcas</span>
                                </div>
                            </a>
                        </li>
        
                        <li class="sidebar-item">
                        <a href="comentarios.html" class="sidebar-link">
                                <div class="contenedorItemNav" >
                                    <i class="lni lni-user img"> <img src="../../recursos/imagenes/icons/comentIcon.svg"
                                            width="40" height="40"></i>
                                    <span class="text-nav text20 titillium-web-regular">Comentarios</span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </aside>
                <div id="contenedorMAIN" class="position-relative">
                </div>
            </div>
            `;
            // Crear el elemento de pie de página.
            const footer = document.createElement('footer');
            footer.innerHTML = `
                <nav class="z-2 position-relative">
                    <div class="text-white text-center text-lg-start py-3 bg-color-5blue z-1">
                        <div class="d-flex justify-content-left mx-5">
                            <div class="text-center copyright titillium-web-bold" style="background-color: rgba(255, 0, 0, 0);">
                                Copyright © 2024 FeasVerseCompany. All rights reserved
                                <a class="text-white titillium-web-light" href="./index.html">FeasVerse.com</a>
                            </div>
                        </div>
                    </div>
                </nav>
            `;
            // Obtener el contenedor del menú deslizante
            var contenedorSlide = document.getElementById("slide");
            contenedorSlide.appendChild(slideMenu);

            // Manejar la funcionalidad del botón hamburguesa
            const hamBurger = document.querySelector(".toggle-btn");
            hamBurger.addEventListener("click", function () {
                document.querySelector("#sidebar").classList.toggle("expand");
            });

            // Obtener el contenedor del encabezado y agregar el elemento de encabezado.
            var contenedorHeader = document.getElementById("header");
            contenedorHeader.appendChild(header);

            // Obtener el contenedor principal y agregar el contenido principal (MAIN).
            var contenedorDiv = document.getElementById("contenedorMAIN");
            contenedorDiv.appendChild(MAIN);

            // Obtener el contenedor del pie de página y agregar el elemento de pie de página.
            var contenedorFooter = document.getElementById("footer");
            contenedorFooter.appendChild(footer);
        }
        else {
            sweetAlert(4, DATA.error, false, 'index.html');
        }
    }
    else {
        // Se comprueba si la página web es la principal, de lo contrario se direcciona a iniciar sesión.
        if (location.pathname.endsWith('index.html')) {
            await sweetAlert(4, 'Inicia sesión para poder continuar', false);
        } else {
            location.href = 'index.html';
        }
    }
}
