//Extraemos los elementos
const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

let efecto = false;
let efectoRojo = false;
let efecto3D = false;
let efectoAlpha = false;
let efectoGreenScreen = false;

function quitarEfecto() {
  efecto = !efecto;
  efectoRojo = false;
  efecto3D = false;
  efectoGreenScreen = false;
  efectoAlpha = ctx.globalAlpha = 1;
}

//Funcion para poder agarrar la camara del usuario
function ponerVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      //console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((e) => console.log(e));
}

function paintToCanvas() {
  //Agarramos la resolucion de la camara
  const width = video.videoWidth;
  const height = video.videoHeight;
  //Hacemos el canvas = a la resolucion de la camara
  canvas.width = width;
  canvas.height = height;
  return setInterval(() => {
    //Cada 20ms, pondremos una imagen de la camara en el canvas
    //De parametro se pasa la camara, y los otros serian top y left, y despues el ancho y altura
    ctx.drawImage(video, 0, 0, width, height);

    if (efecto) {
      //Extraemos los pixeles, para despues poder agregarle efectos
      let pixeles = ctx.getImageData(0, 0, width, height);
      //Agregamos el efecto
      if (efectoRojo) pixeles = redEffect(pixeles);

      if (efecto3D) pixeles = rgbSplit(pixeles);

      if (efectoAlpha) ctx.globalAlpha = 0.1;

      if (efectoGreenScreen) pixeles = eliminarColorCamara(pixeles);

      //Ponemos los nuevos valores en el canvas
      ctx.putImageData(pixeles, 0, 0);
      //La lista de pixeles que se muestra en consola, aparte de ser enorme, se basaa en red-gren-blue-alpha y asi se repite por cada pixel
    }
  }, 20);
}

function tomarFoto() {
  //snap == elemento html del boton para tomar la foto. tiene un atributo onClick que llama a esta funcion y reproduce el sonido
  //El currenttime es para que se pueda spamear el sonido, y no se tenga que esperar a que termine el otro
  snap.currentTime = 0;
  //reproducimos el video
  snap.play();

  //Sacamos la foto
  //TRANSFORMAR LA URL ES VITAL
  const data = canvas.toDataURL("image/jpeg");
  //Creamos un elemento HTML para que el usuario pueda descargar la imagen
  const link = document.createElement("A");
  //Link de descarga
  link.href = data;
  //Atributo para descargar + nombre de la imagen
  link.setAttribute("download", "handsome");
  //El objeto del enlace va a tener un imagen, donde el src es la imagen tomada
  link.innerHTML = `<img src="${data}" alt="HERMOSO PAPI"/>`;
  //La ultima imagen tomada, sera el primer hijo
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixeles) {
  //pixeles.data es la lista de los pixeles
  for (let i = 0; i < pixeles.data.length; i += 4) {
    //Creacion del efecto
    pixeles.data[i + 0] = pixeles.data[i + 0] + 20; // RED
    pixeles.data[i + 1] = pixeles.data[i + 1] - 50; // GREEN
    pixeles.data[i + 2] = pixeles.data[i + 2] * 0.5; // Blue
  }
  return pixeles;
}

function rgbSplit(pixeles) {
  //pixeles.data es la lista de los pixeles
  for (let i = 0; i < pixeles.data.length; i += 4) {
    //Creacion del efecto. Este efecto agarra los pixeles que estan del actual + o - n pixeles en X, y los hace como el actual, por eso ese efecto '3d'
    pixeles.data[i - 100] = pixeles.data[i + 0]; // RED
    pixeles.data[i + 200] = pixeles.data[i + 1]; // GREEN
    pixeles.data[i - 150] = pixeles.data[i + 2]; // Blue
  }
  return pixeles;
}

function eliminarColorCamara(pixeles) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixeles.data.length; i = i + 4) {
    red = pixeles.data[i + 0];
    green = pixeles.data[i + 1];
    blue = pixeles.data[i + 2];
    alpha = pixeles.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixeles.data[i + 3] = 0;
    }
  }

  return pixeles;
}

//ponerVideo();

//cuando el navegador ya reproduzca el video, podemos llamar la funcion painToCanvas
video.addEventListener("canplay", paintToCanvas);
