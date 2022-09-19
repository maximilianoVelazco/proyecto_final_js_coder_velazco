
function obtenerPreguntas(){
    const URLGET = "https://my-json-server.typicode.com/maximilianoVelazco/db_preguntas/preguntas";
    fetch(URLGET)
        .then(preguntas => preguntas.json())
        .then(datos => {
            const arrayDePreguntas = datos;
            const preguntasArray = (clave, valor) => { localStorage.setItem(clave, valor) }
            preguntasArray("listadoPreguntas", JSON.stringify(arrayDePreguntas))
        })
}
obtenerPreguntas()

//GIRAR LA RUEDA Y JUGAR
const categoriaAleatoria = (arrayEvaluado) => {
    let largoArray = parseInt(arrayEvaluado.length);
    let al = Math.floor(Math.random() * largoArray);
    return al;
}

//Numero aleatorio de giro para el transform en css
let radioDeGiro = Math.round(Math.random() * 360);
radioDeGiro += 1800;

//esto por lo que entiendo devuelve el html en si
let rootElement = document.documentElement;
//le doy a la variable el valor de radioDeGiro y le asigno deg para grados
let variableCss = radioDeGiro + "deg";
//establecemos una propiedad en el html (una variable css) y le asignamos el valor de variableCss
//despues la usamos como valor en transform rotate para la ruleta
rootElement.style.setProperty("--girar", variableCss);

//hago visible al popup y doy overflow hidden al body
let popup = document.getElementById("popup-container");
let cuerpoBody = document.getElementById("home");

const mostrarPopUp = () => {
    popup.className = "visible";
    cuerpoBody.className = "pantalla-completa";
};

//JUGAR AL HACER CLICK
let jugar = document.getElementById("jugar");
jugar.onclick = () => {

    //hago girar la ruleta con un click
    let hacerGirar = document.getElementById("hacerGirar");
    hacerGirar.className = "rotar";

    //retraso la aparicion del popup hasta que termine de girar la rueda
    setTimeout("mostrarPopUp()", 3000);

    //determino la categoria de la pregunta segun el radio de giro
    if (radioDeGiro > 2116 || radioDeGiro <= 1845) { //2116 - 1845 -- 316-45
        verCategoria("categoriaGeografia", "geografia");

    } else if (radioDeGiro > 1845 && radioDeGiro <= 1935) { // 1845 - 1935 -- 45-135
        verCategoria("categoriaHistoria", "historia");

    } else if (radioDeGiro > 1935 && radioDeGiro <= 2025) { // 1845 - 2025 -- 135-225
        verCategoria("categoriaCiencia", "ciencia");

    } else if (radioDeGiro > 2025 && radioDeGiro <= 2116) { // 2025 - 2116 -- 225-316
        verCategoria("categoriaDeportes", "deportes");
    }
}

//MANIPULACION DEL DOM
//guardamos en variables los nodos donde van a mostrarse los datos de los objetos que contienen las preguntas
let visualizarPregunta = document.getElementById("pregunta");

//funcion que muestra e imprime la categoria , pregunta y respuesta en pantalla
function verCategoria(categoriaVar, categoriaStr) {

    let traerPreguntas = JSON.parse(localStorage.getItem("listadoPreguntas"))
            console.table(traerPreguntas)

    categoriaVar = traerPreguntas.filter((el) => el.categoria === categoriaStr); //-->cambiar nombre a arrayPreguntas
    let preguntaAleatoria = categoriaVar[categoriaAleatoria(categoriaVar)];

    //los visualizamos en pantalla de acuerdo a lo que caiga en la ruleta
    visualizarPregunta.innerText = preguntaAleatoria.pregunta;

    //************************************************* */
    //*********** respuestas falsas dinamicas ********* */

    //Reordeno las opciones
    let reordenarPreguntas = preguntaAleatoria.respuestas.sort(function () {
        return Math.random() - 0.5
    });

    for (const respuestasTodas of reordenarPreguntas) {
        const respuestaContainer = document.getElementById("respuesta-container");
        let respuesta = document.createElement("div");

        respuesta.innerHTML = `<h3> ${respuestasTodas[0]} </h3>`
        respuesta.className = "respuesta";
        respuestaContainer.appendChild(respuesta);

        //comprobar si se eligio la respuesta correcta
        respuesta.onclick = () => {
            if (respuestasTodas.length > 1) {
                respuesta.style.background = "#49F477";
                taparPantalla();
                modalCorrecto();
                toasty("++4 puntos", bgcSuccess);
                sumarPuntaje();
            } else {
                respuesta.style.background = "#F45142";
                taparPantalla();
                modalIncorrecto();
                restarPuntaje();
                toasty("--3 puntos", bgcError);
            }
        }
    }

    //************************************************* */
    //agrego un nodo que muestre la categoria a la que pertenece la pregunta
    let padreTextoFantasma = document.getElementById("pregunta-inner");//asigno el padre a una variable
    let textoFantasma = document.createElement("h2"); //hijo creado
    textoFantasma.innerText = categoriaStr; //de doy un valor a la variable segun la categoria
    padreTextoFantasma.appendChild(textoFantasma);//asigno el hijo al padre
}

//no permitir interactuar despues de elegir una opcion
let noTocar = document.getElementById("no-tocar");
//funcion que impide que se elija otra respuesta despues de elegir la primera
const taparPantalla = () => { noTocar.className = "impedir-tocar"; }

//Funcion para sumar o restar puntos
const sumarPuntaje = () => {
    let puntoGanado = 4;
    let puntajeAcumulado = puntoGanado + JSON.parse(sessionStorage.getItem("puntajeAlDia"));
    JSON.stringify(sessionStorage.setItem("puntajeAlDia", puntajeAcumulado))
}
const restarPuntaje = () => {
    let puntoPerdido = 3;
    let puntajeAcumulado = JSON.parse(sessionStorage.getItem("puntajeAlDia")) - puntoPerdido;
    JSON.stringify(sessionStorage.setItem("puntajeAlDia", puntajeAcumulado))
}

//TRAIGO EL USUARIO QUE INICIO SESION
let usuarioActual = JSON.parse(sessionStorage.getItem("sesionActual")); // --> tiene los datos del usuario que inicio sesion

//muestro sus datos por pantalla
let nombreUsuario = document.getElementById("nombre-usuario");
nombreUsuario.innerHTML = usuarioActual.nombre;

//agrego los puntos ganados al usuario que ingreso
usuarioActual = {
    ...usuarioActual,
    puntos: JSON.parse(sessionStorage.getItem("puntajeAlDia"))
}

let mostrarPuntos = document.getElementById("contador-puntos")
mostrarPuntos.innerHTML = usuarioActual.puntos

//SWEET ALERT
const modalCorrecto = () => {
    swal({
        title: "Perfecto!",
        text: "Seguí así!",
        icon: "success",
        button: false,
        timer: 2100,
    });
}

const modalIncorrecto = () => {
    swal({
        title: "Que pena!",
        text: "Mejor suerte la proxima!",
        icon: "error",
        button: false,
        timer: 2100,
    });
}

const toasty = (mensaje, bg) => {
    Toastify({
        text: mensaje,
        duration: 3500,
        style: {
            background: bg,
            boxShadow: "2px 3px 0px 2px rgba(0, 0, 0, 0.3)",
        }
    }).showToast();
}

let bgcError = "#FE6F9B";
let bgcSuccess = "#4FA3A5"

//borrar storage ( MODIFICAR Y BORRAR SOLO EL USUARIO )
const borrarStorage = document.getElementById("borraTodo")

//salir de sesion
borrarStorage.onclick = () => {
    sessionStorage.clear();
}
