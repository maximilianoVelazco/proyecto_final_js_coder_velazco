function RegistrarUsuario(nombre, apellido, mail, contrasenia) {
    this.nombre = nombre,
        this.apellido = apellido,
        this.mail = mail,
        this.contrasenia = contrasenia
};

//Funcion que agrega objetos o variables a determinado array
const agregarAlArray = (nombreArray, datoAgregado) => { nombreArray.push(datoAgregado); }

//SIMULADOR DE REGISTRO DE USUARIO (DOM)
let nombre = document.getElementById("nombre");
let apellido = document.getElementById("apellido");
let email = document.getElementById("email");
let passw1 = document.getElementById("passw1");
let passw2 = document.getElementById("passw2");
let formularioRegistro = document.querySelector("#formularioRegistro");

function obtenerUsuarios() {
    const URLGET = "https://my-json-server.typicode.com/maximilianoVelazco/db_pruebas/usuarios";
    fetch(URLGET)
        .then(resultado => resultado.json())
        .then(datos => {
            const usuarios = datos; // objeto
            const guardarArray = (clave, valor) => { localStorage.setItem(clave, valor) }
            guardarArray("listaUsuarios", JSON.stringify(usuarios));

            //en el evento de envio pasa...
            formularioRegistro.addEventListener("submit", e => {
                e.preventDefault();
                //traigo la lista de usuario del local storage y trabajo con ella
                let traerListaUsuarios = JSON.parse(localStorage.getItem("listaUsuarios"));

                //guardo los campos del formulario en un objeto
                const NuevoUsuario = new RegistrarUsuario(
                    nombre.value.toLowerCase(),
                    apellido.value.toLowerCase(),
                    email.value.toLowerCase(),
                    passw1.value
                );

                //validar campos
                if (nombre.value == "") {
                    nombre.style.borderColor = "red";
                    siError("Por favor ingrese su nombre")
                    return false;
                }
                if (apellido.value == "") {
                    apellido.style.borderColor = "red";
                    siError("Por favor ingrese su apellido")
                    return false;
                }
                //comprobar si el email ingresado ya existe como registrado
                const comprobarEmail = traerListaUsuarios.some((el) => el.mail == email.value)
                if (comprobarEmail === true || email.value == "") {
                    email.style.borderColor = "red";
                    siError("Direccion de mail invalida o ya registrada")
                    return false;
                }
                if (passw1.value == "") {
                    passw1.style.borderColor = "red";
                    return false;
                } else if (passw1.value != passw2.value) {
                    passError()
                    return false;
                }
                //falta validar confirmacion de contraseña

                //guardo el nuevo usuario en un array y lo sumo a la lista de usuarios que traje de storage
                traerListaUsuarios.push(NuevoUsuario)
                console.table(traerListaUsuarios);

                //actualizo la lista de usuario en el storage
                guardarArray("listaUsuarios", JSON.stringify(traerListaUsuarios));

                modalCorrecto()
            });//fin ingresar registro
        })
}

obtenerUsuarios()

//confirmacion de registro y enlace al inicio
const modalCorrecto = () => {
    swal({
        title: "Registro correcto!",
        text: "felicidades!",
        icon: "success",
        button: false,
        timer: 3000,
    });
    setTimeout(function () {
        window.location.href = "../index.html";
    }, 3000);
}

//Error en la carga de datos del formulario
function siError(mensajeSiError) {
    let warningMsg = document.getElementById("warning");
    let mensajeError = document.createElement("p");

    mensajeError.innerText = mensajeSiError;
    mensajeError.style.color = "red";
    mensajeError.style.textAlign = "center"

    warningMsg.appendChild(mensajeError)

    setTimeout(function () {
        mensajeError.remove();
    }, 3000)
}

const passError = () => {
    swal({
        title: "Las contraseñas ingresadas no son iguales",
        text: "Reingresa tu contraseña",
        icon: "error",
        button: false,
        timer: 4000,
    });
}