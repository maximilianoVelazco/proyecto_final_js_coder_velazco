
let traerListaUsuarios = JSON.parse(localStorage.getItem("listaUsuarios"))

console.table(traerListaUsuarios)

//INGRESAR CON MAIL Y CONTRASEÑA
let mailUsuario = document.getElementById("mail");
let contrasenia = document.getElementById("contrasenia");
let ingresarDatos = document.getElementById("ingresar");

ingresarDatos.onclick = (event) =>{
    event.preventDefault()
    
    //buscar el indice del objeto en el array
    let indiceUsuarioSesion = traerListaUsuarios.findIndex( (el) => el.mail == mailUsuario.value )

    if (indiceUsuarioSesion == -1 || contrasenia.value == ""  || contrasenia.value != traerListaUsuarios[indiceUsuarioSesion].contrasenia){ 
        //mensaje de error por vacio, o mail pass incorrecto
        let errorMsj = document.getElementById("pass-error");
        errorMsj.innerHTML = "Email o contraseña incorrecto";
        errorMsj.className = "errorMsj";
        document.getElementById("login-form").appendChild(errorMsj);
        //quito el mensaje de error
        setTimeout( function(){
            errorMsj.innerHTML = "";
        }, 5000 );
       
    }else if(mailUsuario.value == traerListaUsuarios[indiceUsuarioSesion].mail && contrasenia.value === traerListaUsuarios[indiceUsuarioSesion].contrasenia){

        //con el indice encuentro el objeto usuario en el array de usuarios y lo combierto a JSON
        let usuarioSesion = JSON.stringify(traerListaUsuarios[indiceUsuarioSesion]);
        //envio el objeto usuario que se encuentra en sesion al sessionStorage
        sessionStorage.setItem("sesionActual", usuarioSesion);
       
        //redirecciono a otra pagina despues de 1 segundo
        setTimeout( function(){
            window.location.href = "./pages/jugar.html";
        }, 1000 );
        return false
    } 
} 




