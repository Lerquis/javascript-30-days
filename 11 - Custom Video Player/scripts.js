//Seleccion de elementos
const divVideo = document.querySelector(".player");

const video = divVideo.querySelector(".viewer");

const barraDuracion = divVideo.querySelector(".progress");
const barraLlenarDuracion = divVideo.querySelector(".progress__filled");

const play = divVideo.querySelector(".toggle");
const adelantar = divVideo.querySelectorAll("[data-skip]");
const rango = divVideo.querySelectorAll(".player__slider");

//Funciones

function playMetodo() {
  //Se explica solo, manda huevo
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function cambiarTextoBotonPlay() {
  //Si el video esta en pausa, ponemos la flecha, sino esta en pausa, ponemos los palos
  const icono = this.paused ? "►" : "❚ ❚";
  //Cambiamos el texto del boton
  play.textContent = icono;
}

//ASI SE HACE PERO EL VIDEO ESTA BUGGEADO SEGUN INTENERT
function adelantarMetodo() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function rangoMetodo() {
  //Son varios rangos, el volumen y la velocidad del video
  //Entonces tenemos ver bien cual es el que el usuario esta manipulando, creando la variable siguiente, guardando el nombre del elemento y su valor
  video[this.name] = this.value;
}

function manejoDuracionVideo() {
  //Sacamos el % que llevamos del video
  const porcentaje = (video.currentTime / video.duration) * 1000;
  //Agregamos estilos a la barra, que va a estar en constante actualizacion gracias al eventListener de timeupdate
  barraLlenarDuracion.style.flexBasis = `${porcentaje}%`;
}

function controlVideoBarra(e) {
  //Funcion que desde la barra de duracion, podamos mover el video
  //Sacamos el % de donde se click en la barra y despues lo multiplicamos por la duracion del video, lo que nos dara el segundo en el que el usuario dio click
  const moverDuracionA = (e.offsetX / this.offsetWidth) * video.duration;
  //Lo seteamos pero el video esta bug
  video.currentTime = moverDuracionA;
}

//Agregamos los eventListeners

//Listeners de reproduccion
video.addEventListener("click", playMetodo);
//Cuando el video se este reproduciendo, actualizamos el texto del boton
video.addEventListener("play", cambiarTextoBotonPlay);
//Cada que el video este corriendo, se llama la funcion
video.addEventListener("timeupdate", manejoDuracionVideo);
//Cuando el video se pausa, actualizamos el texto del boton
video.addEventListener("pause", cambiarTextoBotonPlay);

play.addEventListener("click", playMetodo);

//Listeners de adelantar

adelantar.forEach((boton) => {
  boton.addEventListener("click", adelantarMetodo);
});

barraDuracion.addEventListener("click", controlVideoBarra);
//Variable para que cuando el usuario este en la barra, pueda dragear para ver el video drageando en la barra
let clickeando = false;
barraDuracion.addEventListener("mousedown", () => (clickeando = true));
barraDuracion.addEventListener("mouseup", () => (clickeando = false));
barraDuracion.addEventListener("mousemove", function (e) {
  //Si el usuario esta clickeando encima de la barra, puede moverse por ella y ver el video
  if (clickeando) controlVideoBarra(e);
});

//Listeners del volumen
rango.forEach((rango) => {
  rango.addEventListener("change", rangoMetodo);
});
