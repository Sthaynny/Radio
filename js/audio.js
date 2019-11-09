var canvas;
var canvas2;
var canvasContext;
var canvasContext2;
var width;
var height;
var width2;
var height2;
var analyser;
var analyser2;
var bufferLength;
var dataArray;
var dataArray2;


var context = AudioContext || webkitAudioContext;
var audioContext = new context();

var audio = document.querySelector("#audio");
audio.onplay = (e) => { audioContext.resume() }
var volume = document.querySelector("#volume");
var balanco = document.querySelector("#balanco");

canvas = document.querySelector("#canvas");
canvasContext = canvas.getContext("2d");

canvas2 = document.querySelector("#canvas2");
canvasContext2 = canvas2.getContext("2d");

var midia = audioContext.createMediaElementSource(audio);

var audioController = audioContext.createGain();
var balancoController = audioContext.createStereoPanner();
analyser = audioContext.createAnalyser();
analyser2 = audioContext.createAnalyser();

midia.connect(audioController);
audioController.connect(balancoController);
balancoController.connect(analyser)
analyser.connect(analyser2);
analyser2.connect(audioContext.destination);

volume.oninput = function(e) {
    audioController.gain.value = e.target.value;

}

balanco.oninput = function(e) {
    balancoController.pan.value = e.target.value;
}

midia.onend = function() {
    midia.play();
}

width = canvas.width;
height = canvas.height;

width2 = canvas2.width;
height2 = canvas2.height;


analyser.fftSize = 1024;
bufferLength = analyser.frequencyBinCount;
dataArray = new Uint8Array(bufferLength);


analyser2.fftSize = 1024;
bufferLength = analyser2.frequencyBinCount;
dataArray2 = new Uint8Array(bufferLength);


requestAnimationFrame(visualize);
requestAnimationFrame(visualize2);


function visualize() {
    canvasContext.fillStyle = "gray";
    canvasContext.fillRect(0, 0, width, height);

    analyser.getByteTimeDomainData(dataArray);

    canvasContext.lineWidth = 2;

    canvasContext.strokeStyle = "black";

    canvasContext.beginPath();

    var sliceWidth = width / bufferLength;
    var x = 0;
    for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 255;
        var y = v * height;
        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }
        x += sliceWidth;
    }
    canvasContext.stroke();
    requestAnimationFrame(visualize);
}

function visualize2() {
    canvasContext2.fillStyle = "gray";
    var height2 = canvas2.height;
    var width2 = canvas2.width;
    canvasContext2.fillRect(0, 0, width2, height2);

    analyser2.getByteFrequencyData(dataArray2);

    var x = 0;

    var barWidth = width2 / bufferLength;
    for (var i = 0; i < bufferLength; i++) {
        var v = dataArray2[i] / 255;
        var y = v * (height / 2);
        canvasContext2.fillStyle = "black";
        canvasContext2.fillRect(x, height2 / 2, barWidth, -y);
        canvasContext2.fillRect(x, height2 / 2, barWidth, y);
        x += barWidth + 2;
    }
    requestAnimationFrame(visualize2);
}