// Elementos del DOM que vamos a necesitar
const arrayPalabrasClave = ['SERVIDOR', 'CLIENTE', 'RAMIS', 'ORNITORRINCO', 'MASTANTUONO', 'PROYECTO', 'TERROR', 'SOSTENIBILIDAD', 'CANGREJO'];
const solucion = arrayPalabrasClave[Math.floor(Math.random()*arrayPalabrasClave.length)].split(''); //Método para seleccionar una palabra aleatoria del array de palabras clave
const guiones = [];
const palabraClave = document.getElementById('palabraClave');
const teclado = document.querySelector('.teclado');
const letras = document.querySelectorAll('.letra:not(.acertada):not(.erronea)');
const resultado = document.querySelector('.resultado');

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

// Variables cuenta atrás
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

// Timer
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
                
                // Añado esta clase donde se anula la posibilidad de ejecutar cualquier evento para que el usuario no siga haciendo click sobre las letras
                teclado.classList.add('no-click');
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
            }
        }
    }
})

// Llamamos a la función para volver a rellenar por si ha habido aciertos
rellenarPalabra();