// Elementos del DOM que vamos a necesitar
// const arrayPalabrasClave = ['SERVIDOR', 'CLIENTE', 'RAMIS', 'PROYECTO','SOSTENIBILIDAD'];
const deportes = ['FUTBOL', 'BALONCESTO', 'HOCKEY', 'CICLISMO', 'AUTOMOVILISMO'];
const jugadores = ['VINICIUS', 'MBAPPE', 'MASTANTUONO', 'PEDRI', 'RASHFORD'];
const animales = ['ORNITORRINCO', 'BABUINO', 'MAPACHE', 'ARDILLA'];
const temas = document.getElementById('temas');
let solucion = "";
const guiones = [];
const palabraClave = document.getElementById('palabraClave');
const teclado = document.querySelector('.teclado');
const letras = document.querySelectorAll('.letra:not(.acertada):not(.erronea)');
const resultado = document.querySelector('.resultado');
const nuevaPartida = document.getElementById('nuevaPartida');

// Función para reiniciar la partida
function resetearPartida() {

    // Reiniciar variables correspondientes a la palabra clave
    solucion = [];
    guiones.length = 0;
    palabraClave.innerText = "";

    // Reiniciar intentos y errores
    maxIntentos = 6;
    contador = 0;
    intentos.innerHTML = maxIntentos;
    errores.innerHTML = contador;

    // Reiniciar cronómetro
    clearInterval(intervaloCrono);
    intervaloCrono = null;
    tiempo = 0;
    crono.innerText = "00:00:00";

    // Reiniciar cuenta atrás
    clearInterval(intervaloCuentaAtras);
    intervaloCuentaAtras = null;
    tiempoRestante = 10;
    cuentaAtras.innerText = tiempoRestante;

    // Restaurar teclas
    document.querySelectorAll('.letra').forEach(letra => {
        letra.classList.remove('acertada', 'erronea');
    });

    // Habilitar clicks nuevamente
    teclado.classList.remove('no-click');
    temas.classList.remove('no-click');

    // Limpiar mensaje de victoria o derrota
    resultado.innerText = "";

    // Esconder botón de nueva partida
    //nuevaPartida.style.display = "none"; -- NO NECESARIO FINALMENTE
}

// No dejar que se seleccionen teclas al refrescar la página hasta que no se seleccione un tema
if(temas.value == "SELECCIONE UN TEMA"){
    teclado.classList.add('no-click');
}

// Generar palabra
temas.addEventListener('change', ()=>{

    resetearPartida();
    
    if(temas.value == 'deportes'){
        solucion = deportes[Math.floor(Math.random()*deportes.length)].split('');
        rellenarPalabra();
    } else if(temas.value == 'jugadores'){
        solucion = jugadores[Math.floor(Math.random()*jugadores.length)].split('');
        rellenarPalabra();
    } else if(temas.value == 'animales'){
        solucion = animales[Math.floor(Math.random()*animales.length)].split('');
        rellenarPalabra();
    }else{
        //Evitar que se pueda hacer click en el teclado cuando no hay un tema seleccionado
        teclado.classList.add('no-click');
    }
})

// Variables para el contador de intentos
const intentos = document.getElementById('intentos');
let maxIntentos = 6;
intentos.innerHTML = +maxIntentos;

// Variables para el contador de errores
const errores = document.getElementById('errores');
let contador = 0;

// Variables para el cronómetro
const crono = document.querySelector('.timer');
let intervaloCrono = null;
let tiempo = 0;

// Función cronómetro
function iniciarCrono(){
    tiempo++; //Determinamos el incremento

    // Variables
    const horas = Math.floor(tiempo / 3600);
    const minutos = Math.floor((tiempo % 3600) / 60);
    const segundos = tiempo % 60;

    // Ajustamos el formato de las variable para que aparezcan ceros a la izquierda y el cronómetro no luzca así: 0:0:1
    const formatoHoras = horas.toString().padStart(2, '0');
    const formatoMinutos = minutos.toString().padStart(2, '0');
    const formatoSegundos = segundos.toString().padStart(2, '0');

    crono.innerText = `${formatoHoras}:${formatoMinutos}:${formatoSegundos}`;
}

// Variables cuenta atrás para los intentos
const cuentaAtras = document.querySelector('.cuenta-atras span');
let tiempoRestante = 10;
let intervaloCuentaAtras = null;

// Función para controlar la cuenta atrás y el final de la partida cuando los intentos llegan a 0 a causa de esto
function iniciarCuentaAtras(){
    tiempoRestante--;
    cuentaAtras.innerText = tiempoRestante;

    if(tiempoRestante == 0){
        maxIntentos--;
        intentos.innerHTML = +maxIntentos;
        tiempoRestante = 10;
    }

    if(maxIntentos == 0){
        resultado.innerText = "¡HAS PERDIDO!";
        clearInterval(intervaloCrono);
        clearInterval(intervaloCuentaAtras);
        teclado.classList.add('no-click');
        nuevaPartida.style.display="initial";
    }
}

// REGISTRO DE PARTIDAS

// Guardar partida
function registrarPartida(palabraClave, erroresCometidos, tiempoFinal){
    localStorage.setItem('palabraClave', palabraClave);
    localStorage.setItem('erroresCometidos', erroresCometidos);
    localStorage.setItem('tiempoFinal', tiempoFinal);
}

// Recuperar partidas


// Relleno el campo de la palabra clave con un guión bajo por cada caracter de solucion
function rellenarPalabra(){
    palabraClave.innerText = ""; //Limpio el contenido cada vez que tengo que rellenar, para evitar duplicación
    for (let i = 0 ; i < solucion.length ; i++){
        guiones[i] = "_"
        //palabraClave.innerText += "\t"+guiones[i]+"\t";
    }
    actualizarPalabra();
};

// Añadir todos los elementos del array guiones al String de la palabra clave, especificando el separador
function actualizarPalabra(){
    palabraClave.innerText = guiones.join(' ');
}

// Modificar serie de guiones ante un acierto
function letraAcertada(index, letra){
    guiones[index] = letra;
    actualizarPalabra();
};

// Evento al hacer click en cualquier letra del teclado que no tenga clase acertada o erronea
teclado.addEventListener('click',(e)=>{

    // Condición para que el crónometro solo se inicie si está a cero y si pulsamos una letra
    if (!intervaloCrono && e.target.classList.contains('letra')) {
        intervaloCrono = setInterval(iniciarCrono, 1000);

        // Añaidmos también el inicio de la cuenta atrás, que no empezará hasta que no empiece la partida
        intervaloCuentaAtras = setInterval(iniciarCuentaAtras, 1000);
    }


    // Jugamos con el target para que el evento solo se ejecute al hacer click en una letra que no se haya seleccionado previamente
    if(e.target.classList.contains('letra') && !e.target.classList.contains('acertada') && !e.target.classList.contains('erronea')){

        // Cada vez que realizamos un intento, reiniciamos el contador de cuenta atrás para el intento
        tiempoRestante = 10;
        
        // Añadimos el valor (letra) del div clickado a una variable
        let caracter = e.target.innerText;

        // Condición para buscar que la palabra clave contenga esa letra
        if (solucion.includes(caracter)){
            e.target.classList.toggle('acertada'); // Añadimos la clase "acertada" (fondo verde) a esa letra
            for(let i = 0 ; i < solucion.length ; i++){
                if (solucion[i] == caracter){
                    letraAcertada(i, caracter); // Llamamos a la función para sustituir el guión o guiones por la letra correcta
                }
            }

            // Si detectamos que no quedan guiones en la palabra, es que el jugador ha ganado la partida
            if(!guiones.includes('_')){
                resultado.innerText = "¡HAS GANADO!";
                clearInterval(intervaloCrono); // Paramos el cronómetro
                clearInterval(intervaloCuentaAtras); // Paramos la cuenta atrás

                // Añado esta clase donde se anula la posibilidad de ejecutar cualquier evento para que el usuario no siga haciendo click sobre las letras
                teclado.classList.add('no-click');
                temas.classList.add('no-click');
                nuevaPartida.style.display="initial";
            }
        }else{
            e.target.classList.toggle('erronea'); // Si falla, se añada la clase "erronea" (fondo rojo) a esa letra
            maxIntentos--; // Se reduce el número de intentos restantes
            contador++; // Se añade un error al contador
            intentos.innerHTML = +maxIntentos;
            errores.innerHTML = +contador;

            // Condición para la derrota
            if(maxIntentos == 0){
                resultado.innerText = "¡HAS PERDIDO!";
                clearInterval(intervaloCrono);
                clearInterval(intervaloCuentaAtras);
                teclado.classList.add('no-click');
                temas.classList.add('no-click');
                nuevaPartida.style.display="initial";
            }
        }
    }
})

nuevaPartida.addEventListener('click', ()=> window.location.href = 'index.html');

// Llamamos a la función para volver a rellenar por si ha habido aciertos
rellenarPalabra();