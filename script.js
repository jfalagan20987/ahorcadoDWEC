// Elementos del DOM que vamos a necesitar
// const arrayPalabrasClave = ['SERVIDOR', 'CLIENTE', 'RAMIS', 'PROYECTO','SOSTENIBILIDAD'];
const deportes = ['FUTBOL', 'BALONCESTO', 'HOCKEY', 'CICLISMO', 'AUTOMOVILISMO'];
const jugadores = ['VINICIUS', 'MBAPPE', 'MASTANTUONO', 'PEDRI', 'RASHFORD'];
const animales = ['ORNITORRINCO', 'BABUINO', 'MAPACHE', 'ARDILLA'];
const temas = document.getElementById('temas');
let solucion = [];
const guiones = [];
const palabraClave = document.getElementById('palabraClave');
const teclado = document.querySelector('.teclado');
const letras = document.querySelectorAll('.letra:not(.acertada):not(.erronea)');
const resultado = document.querySelector('.resultado');
const nuevaPartida = document.getElementById('nuevaPartida');

// Variables de los popups
const popup = document.getElementById('popupRegistro');
const guardarPartida = document.getElementById('guardarPartida');
const nombreJugador = document.getElementById('nombreJugador');
const verLeaderboardBtn = document.getElementById('verLeaderboard');
const popupLeaderboard = document.getElementById('popupLeaderboard');
const cerrarLeaderboardBtn = document.getElementById('cerrarLeaderboard');
const tablaLeaderboardBody = document.querySelector('#tablaLeaderboard tbody'); // Cuerpo de la tabla que hemos dejado vacío en el html

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

    // Reiniciamos el popup de guardar partida
    if (popup) {
        popup.classList.remove('popup-visible');
        popup.classList.add('popup-oculto');
        if (nombreJugador) nombreJugador.value = "";
    }
}

// No dejar que se seleccionen teclas al refrescar la página hasta que no se seleccione un tema
if(temas.value == "SELECCIONE UN TEMA"){
    teclado.classList.add('no-click');
}

// Generar palabra
temas.addEventListener('change', ()=>{

    // Si cambiamos de tema en mitad de la partida, se genera una partida totalmente nueva
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
            if(solucion.length > 0 && guiones.length > 0 && !guiones.includes('_') && solucion.length > 0){
                resultado.innerText = "¡HAS GANADO!";
                clearInterval(intervaloCrono); // Paramos el cronómetro
                clearInterval(intervaloCuentaAtras); // Paramos la cuenta atrás

                // Añado esta clase donde se anula la posibilidad de ejecutar cualquier evento para que el usuario no siga haciendo click sobre las letras
                teclado.classList.add('no-click');
                temas.classList.add('no-click');
                popup.classList.remove('popup-oculto');
                popup.classList.add('popup-visible');

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

// REGISTRO DE PARTIDAS
guardarPartida.addEventListener('click', ()=>{
    
    // Objeto partida
    const partida = {
        jugador: nombreJugador.value,
        palabra: solucion.join(''),
        errores: contador,
        tiempo: crono.innerText
    };

    // Recuperamos las partidas anteriores (si las tenemos) y guardamos la nueva
    let partidasGuardadas = JSON.parse(localStorage.getItem('partidas')) || [];

    partidasGuardadas.push(partida);

    localStorage.setItem('partidas', JSON.stringify(partidasGuardadas));

    popup.classList.remove('popup-visible');
    popup.classList.add('popup-oculto');
})

// Función para poder comparar los tiempos en el Leaderboard -- He tenido que buscarlo, porque únicamente con el crono.innexText no funcionaría, al ser texto plano
function tiempoAHoras(segundosStr){
    const partes = segundosStr.split(':').map(Number);
    return partes[0]*3600 + partes[1]*60 + partes[2];
}

// Función para generar el contenido de las mejores partidas (leaderboard)
function generarLeaderboard(){

    // Recuperamos las partidas y las clasificamos por palabra
    const partidas = JSON.parse(localStorage.getItem('partidas')) || [];
    const mejoresPorPalabra = {};

    // Recorremos el array con todas las partidas
    partidas.forEach(partida => {
        const tiempoSeg = tiempoAHoras(partida.tiempo); // Llamamos a la función para poder comparar tiempo
        const palabra = partida.palabra; // Seleccionamos la palabra

        if(!mejoresPorPalabra[palabra]){ // Si no hay mejor registro para esa palabra, se escoge el primero que se encuentre
            mejoresPorPalabra[palabra] = [{...partida, tiempoSeg}];
        } else {
            const actual = mejoresPorPalabra[palabra]; // En caso de ya existir un registro, lo guardamos como la mejor partida actual de esa palabra
            const mejorErrores = actual[0].errores; // Guardamos sus errores
            const mejorTiempo = actual[0].tiempoSeg; // Guardamos su tiempo total

            if(partida.errores < mejorErrores){
                mejoresPorPalabra[palabra] = [{...partida, tiempoSeg}]; // Si hay una con menos errores, la sustituye
            
            // Si tienen el mismo número de errores, comparamos tiempo total
            } else if(partida.errores === mejorErrores){
                if(tiempoSeg < mejorTiempo){
                    mejoresPorPalabra[palabra] = [{...partida, tiempoSeg}]; // Si hay una con menor tiempo, la sustituye
                } else if(tiempoSeg === mejorTiempo){
                    actual.push({...partida, tiempoSeg}); // Si igualan en todo, se mostrarán las dos
                }
            }
        }
    });

    // Limpiar tabla
    tablaLeaderboardBody.innerHTML = "";

    // Añadir filas -- Bucle for para iterar sobre las mejores puntuaciones
    for (const palabra in mejoresPorPalabra) {
    const puntuaciones = mejoresPorPalabra[palabra];

    // Para cada palabra, creamos una fila en la tabla del Leaderboard
    puntuaciones.forEach(puntuacion => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${puntuacion.palabra}</td>
            <td>${puntuacion.jugador}</td>
            <td>${puntuacion.errores}</td>
            <td>${puntuacion.tiempo}</td>
        `;
        tablaLeaderboardBody.appendChild(fila);
    });
}
}

// Eventos del popup
verLeaderboardBtn.addEventListener('click', ()=>{
    generarLeaderboard();
    popupLeaderboard.classList.remove('popup-oculto');
    popupLeaderboard.classList.add('popup-visible');
});

cerrarLeaderboardBtn.addEventListener('click', ()=>{
    popupLeaderboard.classList.remove('popup-visible');
    popupLeaderboard.classList.add('popup-oculto');
});