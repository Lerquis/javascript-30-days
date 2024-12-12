let countdown;
const mostrarCountdown = document.querySelector(".display__time-left");
const mostrarHoraFinal = document.querySelector(".display__end-time");
const botones = document.querySelectorAll("[data-time]");

function timer(segundos) {
  //La fecha actual que esta en milisegundos
  const actualidad = Date.now();
  //La hora a la que termina la alarma
  const horaAlarma = actualidad + segundos * 1000;

  mostrarTiempoFinal(horaAlarma);
  //Llamamos esta funcion aqui, porque el interval se come su lapso de tiempo estimado (este caso un segundo), entonces lo mostramos aqui para que no se coma ese segundo
  mostrarTiempoFaltante(segundos);
  //El interval tiene esa variable para poder matar el intervalo y no se vuelva a reproducir
  countdown = setInterval(() => {
    const segundosFaltantes = Math.round((horaAlarma - Date.now()) / 1000);
    if (segundosFaltantes < 0) {
      clearInterval(countdown);
      return;
    }
    mostrarTiempoFaltante(segundosFaltantes);
  }, 1000);
}

function mostrarTiempoFaltante(segundos) {
  //Si ya existe alguna alarma, la eliminamos para que cree otra nueva
  clearInterval(countdown);
  //Agarramos el primer valor que nos interesa, que serian los minutos
  const minutos = Math.floor(segundos / 60);
  //Agarramos los segundos faltantes
  let segundosFaltantes = segundos % 60;
  if (segundosFaltantes < 10) segundosFaltantes = "0" + segundosFaltantes;
  const mostrar = `${minutos}:${segundosFaltantes}`;
  mostrarCountdown.innerHTML = mostrar;

  //Cambiamos el titulo de la pestana del navegador al countdown
  document.title = mostrar;
}

function mostrarTiempoFinal(horaFinal) {
  //Convierte los milisegundos pasados en una fecha
  const final = new Date(horaFinal);
  //Extraemos los datos necesarios
  let hora = final.getHours();
  if (hora > 12) hora -= 12;
  let minutos = final.getMinutes();
  if (minutos < 10) minutos = "0" + minutos;

  mostrarHoraFinal.innerHTML = `Termina a las ${hora}:${minutos}`;
}

function empezarAlarma() {
  const segundos = parseInt(this.dataset.time);
  timer(segundos);
}

botones.forEach((boton) => {
  boton.addEventListener("click", empezarAlarma);
});

document.customForm.addEventListener("submit", function (e) {
  //Prevenimos que el formulario recargue la pagina
  e.preventDefault();
  //Obtenemos minutos
  const minutos = this.minutes.value;
  //Pasamos los minutos a la funcion como segundos
  timer(minutos * 60);
  //limpiamos el formulario
  this.reset();
});
