// Se establece el título de la página web.
document.querySelector('title').textContent = 'FeasVerse - Admin';
const MAIN_TITLE = document.getElementById('mainTitle');

// Constante para establecer el formulario de inicio de sesión, olvidaste contraseña paso 1,2 y 3.
const LOGIN_FORM = document.getElementById('loginForm');
const FORGOT_PASSWORD_FORM = document.getElementById('forgetpasswordstepone');
const FORGOT_PASSWORD_STEP_TWO_FORM = document.getElementById('forgetpasswordsteptwo');
const FORGOT_PASSWORD_STEP_THREE_FORM = document.getElementById('forgetPasswordStepThree');

document.addEventListener('DOMContentLoaded', async () => {

    loadTemplate();

    const DATA = await fetchData(USER_API, 'getUser');


    if (DATA.session) {
        // Se direcciona a la página web de bienvenida.
        location.href = 'panel_principal.html';
    } else {
        // Se establece el título del contenido principal.
        MAIN_TITLE.textContent = 'FEASVERSE - Inicio de sesión';
        // Se muestra el formulario para iniciar sesión.
        LOGIN_FORM.classList.remove('d-none');
        // Se establece el título del contenido principal.
        MAIN_TITLE.textContent = 'FEASVERSE';
        // Se oculta el formulario de restablecimiento de contraseña (paso 1 y 2).
        FORGOT_PASSWORD_FORM.classList.add('d-none');
        FORGOT_PASSWORD_STEP_TWO_FORM.classList.add('d-none');
    }
});

function showLoginForm() {
    // Se muestra el formulario para iniciar sesión.
    LOGIN_FORM.classList.remove('d-none');
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'FEASVERSE - Inicio de sesión';
    // Se oculta el formulario de restablecimiento de contraseña (paso 1 y 2 y 3).
    FORGOT_PASSWORD_FORM.classList.add('d-none');
    FORGOT_PASSWORD_STEP_TWO_FORM.classList.add('d-none');
    FORGOT_PASSWORD_STEP_THREE_FORM.classList.add('d-none');
}

const showForgotPasswordForm = async () => {
    // Se oculta el formulario para iniciar sesión y paso 2, 3.
    LOGIN_FORM.classList.add('d-none');
    FORGOT_PASSWORD_STEP_TWO_FORM.classList.add('d-none');
    FORGOT_PASSWORD_STEP_THREE_FORM.classList.add('d-none');
    // Se muestra el formulario de restablecimiento de contraseña.
    FORGOT_PASSWORD_FORM.classList.remove('d-none');
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'FEASVERSE - Recuperar contraseña';
}

let DATA2; // Declara DATA2 en un ámbito más amplio para que sea accesible desde ambos eventos
let id;

document.getElementById("forgetpasswordstepone").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada

    const INPUTCONTRA = document.getElementById("correo_electronico_paso1");

    FORM1 = new FormData();
    FORM1.append('correo_electronico_paso1', INPUTCONTRA.value);

    // Lógica asíncrona para obtener los datos del usuario
    const DATA = await fetchData(USER_API, 'searchMail', FORM1);
    if (DATA.status) {
        FORM2 = new FormData();
        var resultado = DATA.dataset;
        FORM2.append('correo_electronico_paso1', INPUTCONTRA.value);
        FORM2.append('nombre_destinatario', resultado.nombre_trabajador);

        id = resultado.id_trabajador;

        DATA2 = await fetchData(USER_API, 'enviarCodigoRecuperacion', FORM2); // Asigna el valor de DATA2 aquí

        if (DATA2.status) {
            await sweetAlert(1, 'Se ha enviado correctamente al correo electrónico, ingrese el código enviado', true);
            showForgotPasswordStepTwoForm();
        } else {
            sweetAlert(2, DATA2.error, false);
        }

    } else {
        sweetAlert(2, DATA.error, false);
    }
});



const showForgotPasswordStepTwoForm = async () => {
    // Se oculta el formulario para iniciar sesión y paso 1, 3
    LOGIN_FORM.classList.add('d-none');
    FORGOT_PASSWORD_FORM.classList.add('d-none');
    FORGOT_PASSWORD_STEP_THREE_FORM.classList.add('d-none');
    // Se muestra el formulario de recuperación de contraseña (paso 2).
    FORGOT_PASSWORD_STEP_TWO_FORM.classList.remove('d-none');
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'FEASVERSE - Recuperar contraseña';
}


document.getElementById("forgetpasswordsteptwo").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada

    const INPUTCODIGO = document.getElementById("codigoPaso2").value;
    if (INPUTCODIGO.trim() === DATA2.codigo) {
        showForgotPasswordStepThreeForm();
    } else {
        await sweetAlert(2, 'El código no coincide con el que se le envió en el correo.', true);
    }
});

const showForgotPasswordStepThreeForm = async () => {
    await sweetAlert(1, 'Código ingresado correctamente', true);
    // Se oculta el formulario para iniciar sesión y paso 1, 2
    LOGIN_FORM.classList.add('d-none');
    FORGOT_PASSWORD_FORM.classList.add('d-none');
    FORGOT_PASSWORD_STEP_TWO_FORM.classList.add('d-none');
    // Se muestra el formulario de recuperación de contraseña (paso 3).
    FORGOT_PASSWORD_STEP_THREE_FORM.classList.remove('d-none');
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'FEASVERSE - Recuperar contraseña';
}

function validatePassword(password) {
    // Expresión regular para validar que la contraseña cumpla con los requisitos
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/>.<,])[A-Za-z\d!@#$%^&*()_+}{":;'?/>.<,]{8,}$/;
    return regex.test(password);
}

document.getElementById("forgetPasswordStepThree").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada
    const INPUTCONTRA = document.getElementById("clavePaso3").value.trim();
    const INPUTCONFIRMARCONTRA = document.getElementById("clave2_paso3").value.trim();

    // Validar que las contraseñas coincidan
    if (INPUTCONTRA === INPUTCONFIRMARCONTRA) {
        // Validar que la contraseña cumpla con los requisitos
        if (validatePassword(INPUTCONTRA)) {
            const FORM1 = new FormData();
            FORM1.append('claveTrabajador', INPUTCONTRA);
            FORM1.append('confirmarTrabajador', INPUTCONFIRMARCONTRA);
            FORM1.append('idTrabajador', id);

            const DATA = await fetchData(USER_API, 'changePasswordLogin', FORM1);
            if (DATA.status) {
                sweetAlert(1, 'La contraseña ha sido restablecida correctamente', true);
                showLoginForm();
            } else {
                sweetAlert(2, DATA.error, false);
            }
        } else {
            sweetAlert(2, 'La contraseña debe tener al menos 8 caracteres, incluir letras mayúsculas y minúsculas, dígitos y caracteres especiales.', true);
        }
    } else {
        sweetAlert(2, 'Los campos de contraseña no coinciden.', true);
    }
});

function handleLoginFormSubmission(event) {
    event.preventDefault(); // Evita la recarga de la página por defecto
}

//Funcion de mostrar la dashboard
const showDashboard = async () => {
    await sweetAlert(1, 'Se ha iniciado correctamente la sesión', true);
    location.href = 'panel_principal.html';
}

// Método del evento para cuando se envía el formulario de inicio de sesión.
LOGIN_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(LOGIN_FORM);
    // Petición para iniciar sesión.
    const DATA = await fetchData(USER_API, 'logIn', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        sweetAlert(1, DATA.message, true, 'panel_principal.html');
    } else {
        sweetAlert(2, DATA.error, false);
    }
});