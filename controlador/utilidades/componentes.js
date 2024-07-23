/*
*   Función para mostrar un mensaje de confirmación. Requiere la librería sweetalert para funcionar.
*   Parámetros: message (mensaje de confirmación).
*   Retorno: resultado de la promesa.
*/
const IP = 'http://localhost';
// Constante para establecer la ruta base del servidor.
const SERVER_URL = `${IP}/FeasVerse-Api/api/`;

const confirmAction = (title, message) => {
    // Crea una instancia personalizada de SweetAlert con estilos Bootstrap.
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",   // Estilo del botón "Sí".
            cancelButton: "btn btn-danger"      // Estilo del botón "No".
        },
        buttonsStyling: false   // Desactiva los estilos por defecto de SweetAlert.
    });

    // Muestra la modal de confirmación con los parámetros proporcionados.
    return swalWithBootstrapButtons.fire({
        title: title,               // Título de la modal.
        text: message,              // Mensaje de la modal.
        icon: 'warning',            // Ícono de advertencia.
        showCancelButton: true,      // Muestra el botón "Cancelar/No".
        confirmButtonText: "Sí",    // Texto del botón de confirmación.
        cancelButtonText: "No",     // Texto del botón de cancelación.
        closeOnClickOutside: false,  // Evita cerrar la modal al hacer clic fuera de ella.
        closeOnEsc: false,           // Evita cerrar la modal al presionar la tecla Esc.
        reverseButtons: true         // Invierte la posición de los botones.
    });
}

/*
*   Función asíncrona para manejar los mensajes de notificación al usuario. Requiere la librería sweetalert para funcionar.
*   Parámetros: type (tipo de mensaje), text (texto a mostrar), timer (uso de temporizador) y url (valor opcional con la ubicación de destino).
*   Retorno: ninguno.
*/
// Función para mostrar mensajes de alerta personalizados.
const sweetAlert = async (type, text, timer, url = null) => {
    let title, icon;
    // Se compara el tipo de mensaje a mostrar y se asignan valores correspondientes a título e ícono.
    switch (type) {
        case 1:
            title = 'Éxito';
            icon = 'success';
            break;
        case 2:
            title = 'Error';
            icon = 'error';
            break;
        case 3:
            title = 'Advertencia';
            icon = 'warning';
            break;
        case 4:
            title = 'Aviso';
            icon = 'info';
            break;
    }
    // Se define un objeto con las opciones principales para el mensaje.
    let options = {
        title: title,                    // Título del mensaje.
        text: text,                      // Texto del mensaje.
        icon: icon,                      // Ícono del mensaje.
        closeOnClickOutside: false,      // Evita cerrar la modal al hacer clic fuera de ella.
        closeOnEsc: false,               // Evita cerrar la modal al presionar la tecla Esc.
        confirmButtonText: 'Aceptar',    // Texto del botón de confirmación.
        confirmButtonColor: '#0D4560'    // Color del botón de confirmación.
    };
    // Se verifica el uso del temporizador y se ajusta el tiempo de duración del mensaje.
    options.timer = timer ? 3000 : null;
    // Se muestra el mensaje utilizando SweetAlert.
    await Swal.fire(options);
    // Se direcciona a una página web si se indica.
    (url) ? location.href = url : undefined;
};

/*
*   Función para generar un gráfico de barras verticales. Requiere la librería chart.js para funcionar.
*   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), legend (etiqueta para los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
const barGraph = (canvas, xAxis, yAxis, legend, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];

    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    xAxis.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });

    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'line',          // Tipo de gráfico (línea en este caso).
        data: {
            labels: xAxis,      // Etiquetas en el eje x.
            datasets: [{
                label: legend,   // Leyenda del conjunto de datos.
                data: yAxis,     // Datos en el eje y.

                borderColor: 'rgb(75, 192, 192)',  // Color del borde de la línea.
                tension: 0.1      // Tensión de la curva.
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title   // Título del gráfico.
                },
                legend: {
                    display: false  // No mostrar la leyenda.
                }
            }
        }
    });
}


/*
*   Función para generar un gráfico de pastel.
*   Requiere la librería chart.js para funcionar.
*   Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
const pieGraph = (canvas, legends, values, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    values.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'pie',
        data: {
            labels: legends,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

const donutGraph = (canvas, legends, values, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    values.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'doughnut',
        data: {
            labels: legends,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

/*
*   Función para generar un gráfico de BAr.
*   Requiere la librería chasrt.js para funcionar.
*   Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
const BarVerGraph = (canvas, legends, values, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    values.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'bar',
        data: {
            labels: legends,
            datasets: [{
                label: 'Estado de los pedidos',
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Ocultar la leyenda para que solo se muestren las etiquetas en el eje X
                },
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    callbacks: {
                        title: (context) => legends[context[0].dataIndex],
                        label: (context) => `${context.raw} pedidos`
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Estado'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cantidad'
                    }
                }
            }
        }
    });
};

const BarVer2Graph = (canvas, legends, values, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    values.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'bar',
        data: {
            labels: legends,
            datasets: [{
                label: 'Promedio de Calificación',
                data: values,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Calificación'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Zapatos'
                    }
                }
            }
        }
    });
};;

/*
*   Función asíncrona para cerrar la sesión del usuario.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const logOut = async () => {
    // Se muestra un mensaje de confirmación y se captura la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Está seguro de cerrar la sesión?', 'Será regresado al inicio de sesión');

    // Se verifica la respuesta del mensaje.
    if (RESPONSE.isConfirmed) {
        // Petición para eliminar la sesión.
        const DATA = await fetchData(USER_API, 'logOut');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            sweetAlert(1, 'Se cerro sesión correctamente', true, 'index.html');
        } else {
            sweetAlert(2, DATA.exception, false);
        }
    } else {
        // Si el usuario cancela, se oculta algún elemento modal (posiblemente DATA_MODAL).
        DATA_MODAL.hide();
    }

}


/*
*   Función asíncrona para intercambiar datos con el servidor.
*   Parámetros: filename (nombre del archivo), action (accion a realizar) y form (objeto opcional con los datos que serán enviados al servidor).
*   Retorno: constante tipo objeto con los datos en formato JSON.
*/
const fetchData = async (filename, action, form = null) => {
    // Se define una constante tipo objeto para establecer las opciones de la petición.
    const OPTIONS = {};
    // Se determina el tipo de petición a realizar.
    if (form) {
        OPTIONS.method = 'post';
        OPTIONS.body = form;
    } else {
        OPTIONS.method = 'get';
    }
    try {
        // Se declara una constante tipo objeto con la ruta específica del servidor.
        const PATH = new URL(SERVER_URL + filename);
        // Se agrega un parámetro a la ruta con el valor de la acción solicitada.
        PATH.searchParams.append('action', action);
        // Se define una constante tipo objeto con la respuesta de la petición.
        const RESPONSE = await fetch(PATH.href, OPTIONS);
        // Se retorna el resultado en formato JSON.
        return await RESPONSE.json();
    } catch (error) {
        // Se muestra un mensaje en la consola del navegador web cuando ocurre un problema.
        console.log(error);
    }
}


/*
*   Función asíncrona para cargar las opciones en un select de formulario.
*   Parámetros: filename (nombre del archivo), action (acción a realizar), select (identificador del select en el formulario) y selected (dato opcional con el valor seleccionado).
*   Retorno: ninguno.
*/
const fillSelect = async (filename, action, select, selected = null, form = null, Dclas = null) => {
    // Petición para obtener los datos.
    const DATA = await fetchData(filename, action, form);
    let content = '';
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje.
    if (DATA.status) {
        content += '<option value="" selected>Seleccione una opción</option>';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se obtiene el dato del primer campo.
            value = Object.values(row)[0];
            // Se obtiene el dato del segundo campo.
            text = Object.values(row)[1];
            // Se verifica cada valor para enlistar las opciones.
            if (value != selected) {
                content += `<option value="${value}">${text}</option>`;
            } else {
                content += `<option value="${value}" selected>${text}</option>`;
            }
        });
    } else {
        content += '<option>No hay opciones disponibles</option>';
    }
    if (select) {
        // Se agregan las opciones a la etiqueta select mediante el id.
        document.getElementById(select).innerHTML = content;
    }
    if (Dclas) {
        const elements = document.getElementsByClassName(Dclas);
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerHTML = content;
        }
    }
}