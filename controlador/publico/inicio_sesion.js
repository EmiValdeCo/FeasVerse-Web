// Constante para establecer el formulario de inicio de sesión, olvidaste contraseña paso 1,2 y 3.

const LOGIN_FORM_DIV = document.getElementById('login');
const LOGIN_FORM = document.getElementById('loginForm');
const REGISTRO_FORM = document.getElementById('registroForm');
const PASSWORD1_FORM = document.getElementById('password1');
const PASSWORD2_FORM = document.getElementById('password2');
const PASSWORD3_FORM = document.getElementById('password3');
const REGISTRO_FORM_DIV = document.getElementById('registro');

const INPUTDATENOW = document.getElementById('fecharInput');



document.addEventListener('DOMContentLoaded', async () => {
    // Se muestra el formulario para iniciar sesión.
    INPUTDATENOW.readOnly = true;
    llenarFechaActual();
    LOGIN_FORM_DIV.classList.remove('d-none');

    const TODAY = new Date();

    let day = ('0' + TODAY.getDate()).slice(-2);
    // Se declara e inicializa una variable para guardar el mes en formato de 2 dígitos.
    let month = ('0' + (TODAY.getMonth() + 1)).slice(-2);
    // Se declara e inicializa una variable para guardar el año con la mayoría de edad.
    let year = TODAY.getFullYear() - 18;
    // Se declara e inicializa una variable para establecer el formato de la fecha.
    const DATE = `${year}-${month}-${day}`;
    // Se asigna la fecha como valor máximo en el campo del formulario.
    document.getElementById('fechanInput').max = DATE;
});


// Agrega el listener para el formulario de registro
REGISTRO_FORM.addEventListener('submit', async(event)  => {
    event.preventDefault();


    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombreInput').value.trim();
    const apellidos = document.getElementById('apellidosInput').value.trim();
    const dui = document.getElementById('duiInput').value.trim();
    const telefono = document.getElementById('telefonoInput').value.trim();
    const correo = document.getElementById('correoInput').value.trim();
    const fechaNacimiento = document.getElementById('fechanInput').value.trim();
    const fechaRegistro = document.getElementById('fecharInput').value.trim();
    const contrasena = document.getElementById('contraInput').value.trim();
    const confirmcontrasena = document.getElementById('confirmContraseña').value.trim();

    // Expresiones regulares para validar nombre y apellidos (solo letras y espacios)
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const apellidosRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    // Verificar que los campos no estén vacíos
    if (!nombre || !apellidos || !dui || !telefono || !correo || !fechaNacimiento || !fechaRegistro || !confirmcontrasena || !contrasena) {
        await sweetAlert(2, 'Todos los campos son obligatorios', false);
        return;
    }

    // Verificar que el nombre y apellidos solo contengan letras
    if (!nombreRegex.test(nombre) || !apellidosRegex.test(apellidos)) {
        await sweetAlert(2, 'El nombre y los apellidos solo pueden contener letras', false);
        return;
    }

    // Crear un FormData con los datos del formulario
    const form = new FormData(REGISTRO_FORM) ;

    // Llamar a la API para el registro del usuario
    const data = await fetchData(USER_API, 'signUp', form);

    // Comprobar la respuesta de la API
    if (data.status) {
        await sweetAlert(1, data.message, true);
        // Mostrar el formulario de inicio de sesión y ocultar el de registro
        LOGIN_FORM_DIV.classList.remove('d-none');
        REGISTRO_FORM_DIV.classList.add('d-none');
    } else {
        await sweetAlert(2, data.error, false);
    }
});

function llenarFechaActual(){
    // Obtener la fecha actual
    var fechaActual = new Date();
    // Formatear la fecha actual como YYYY-MM-DD
    var fechaActualFormato = fechaActual.toISOString().split('T')[0];
    // Establecer la fecha actual como el valor del campo de entrada de fecha
    fecharInput.value = fechaActualFormato;
}

LOGIN_FORM.addEventListener('submit', async(event) =>{
    event.preventDefault();

    const FORM = new FormData(LOGIN_FORM);

    const DATA = await fetchData(USER_API, 'logIn', FORM)

    if (DATA.status) {
        sweetAlert(1, DATA.message, true, 'index.html');
    } else {
        sweetAlert(2, DATA.error, false);
    }
});



function Registro() {
    // Se oculta el formulario para iniciar sesión y paso 2, 3.
    LOGIN_FORM_DIV.classList.add('d-none');
    PASSWORD1_FORM.classList.add('d-none');
    PASSWORD2_FORM.classList.add('d-none');
    PASSWORD3_FORM.classList.add('d-none');
    // Se muestra el formulario de restablecimiento de contraseña.
    REGISTRO_FORM_DIV.classList.remove('d-none');
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'FEASVERSE - Registro de Usuario';
}

function showPass1() {
    // Se oculta el formulario para iniciar sesión y paso 2, 3.
    LOGIN_FORM_DIV.classList.add('d-none');
    PASSWORD1_FORM.classList.remove('d-none');
    PASSWORD2_FORM.classList.add('d-none');
    PASSWORD3_FORM.classList.add('d-none');
    REGISTRO_FORM_DIV.classList.add('d-none');
    // Se muestra el formulario de restablecimiento de contraseña.
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'FEASVERSE - Recuperar contraseña';
}

const showPass2 = async () => {
    await sweetAlert(1, 'Se ha enviado correctamente al correo electrónico', true);
    // Se oculta el formulario para iniciar sesión y paso 1, 3
    LOGIN_FORM_DIV.classList.add('d-none');
    PASSWORD1_FORM.classList.add('d-none');
    PASSWORD2_FORM.classList.remove('d-none');
    PASSWORD3_FORM.classList.add('d-none');
    REGISTRO_FORM_DIV.classList.add('d-none');
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'FEASVERSE - Recuperar contraseña';
}

const showPass3 = async () => {
    await sweetAlert(1, 'Código ingresado correctamente', true);
    // Se oculta el formulario para iniciar sesión y paso 1, 2
    LOGIN_FORM_DIV.classList.add('d-none');
    PASSWORD1_FORM.classList.add('d-none');
    PASSWORD2_FORM.classList.add('d-none');
    PASSWORD3_FORM.classList.remove('d-none');
    REGISTRO_FORM_DIV.classList.add('d-none');
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'FEASVERSE - Recuperar contraseña';
}

function showLogIn() {
    // Se oculta el formulario para iniciar sesión y paso 1, 2
    LOGIN_FORM_DIV.classList.remove('d-none');
    REGISTRO_FORM_DIV.classList.add('d-none');
    PASSWORD1_FORM.classList.add('d-none');
    PASSWORD2_FORM.classList.add('d-none');
    PASSWORD3_FORM.classList.add('d-none');

    // Se muestra el formulario de recuperación de contraseña (paso 3).
    // Se establece el título del contenido principal.
}

function handleLoginFormSubmission(event) {
    event.preventDefault(); // Evita la recarga de la página por defecto
}

let DATA2; // Declara DATA2 en un ámbito más amplio para que sea accesible desde ambos eventos
let id;

document.getElementById("password1").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada

    const INPUTCORREO = document.getElementById("correo_electronico_paso1");

    FORM1 = new FormData();
    FORM1.append('correo_electronico_paso1', INPUTCORREO.value);

    // Lógica asíncrona para obtener los datos del usuario
    const DATA = await fetchData(USER_API, 'searchMail', FORM1);
    if (DATA.status) {
        FORM2 = new FormData();
        var resultado = DATA.dataset;
        FORM2.append('correo_electronico_paso1', INPUTCORREO.value);
        FORM2.append('nombre_destinatario', resultado.nombre_trabajador);

        id = resultado.id_cliente;

        DATA2 = await fetchData(USER_API, 'enviarCodigoRecuperacion', FORM2); // Asigna el valor de DATA2 aquí

        if (DATA2.status) {
            await sweetAlert(1, 'Se ha enviado correctamente al correo electrónico, ingrese el código enviado', true);
            showPass2();
        } else {
            sweetAlert(2, DATA2.error, false);
        }

    } else {
        sweetAlert(2, DATA.error, false);
    }
});

document.getElementById("password2").addEventListener("submit", async function (event) {
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
    LOGIN_FORM_DIV.classList.add('d-none');
    PASSWORD1_FORM.classList.add('d-none');
    PASSWORD2_FORM.classList.add('d-none');
    // Se muestra el formulario de recuperación de contraseña (paso 3).
    PASSWORD3_FORM.classList.remove('d-none');
    // Se establece el título del contenido principal.
    MAIN_TITLE.textContent = 'FEASVERSE - Recuperar contraseña';
}

function validatePassword(password) {
    // Expresión regular para validar que la contraseña cumpla con los requisitos
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/>.<,])[A-Za-z\d!@#$%^&*()_+}{":;'?/>.<,]{8,}$/;
    return regex.test(password);
}

document.getElementById("password3").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada
    const INPUTCONTRA = document.getElementById("clavePaso3").value.trim();
    const INPUTCONFIRMARCONTRA = document.getElementById("clave2_paso3").value.trim();

    // Validar que las contraseñas coincidan
    if (INPUTCONTRA === INPUTCONFIRMARCONTRA) {
        // Validar que la contraseña cumpla con los requisitos
        if (validatePassword(INPUTCONTRA)) {
            const FORM1 = new FormData();
            FORM1.append('claveCliente', INPUTCONTRA);
            FORM1.append('confirmarCliente', INPUTCONFIRMARCONTRA);
            FORM1.append('idCliente', id);

            const DATA = await fetchData(USER_API, 'changePasswordLogin', FORM1);
            if (DATA.status) {
                sweetAlert(1, 'La contraseña ha sido restablecida correctamente', true);
                showLogIn();
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

document.getElementById('telefonoInput').addEventListener('input', function () {
    var telefonoInput = this.value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
    if (telefonoInput.length > 4) {
        telefonoInput = telefonoInput.substring(0, 4) + '-' + telefonoInput.substring(4, 8);
    }
    this.value = telefonoInput;
});