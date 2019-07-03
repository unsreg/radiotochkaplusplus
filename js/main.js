const btnSmblStart = "▶";
const btnSmblStop = "⏹";
const btnSmblPause = "⏸";
const btnSmblPrev = "⏮";
const btnSmblNext = "⏭";

var allStations;
if (stations) {
    allStations = stations;
} else {
    allStations = [];
}

const currentRadioState = {
    "currentRadioStation": null
};

function init() {
    let stationContainer = document.getElementById('station_container');
    let bootstrapElements = '<div class="row">';
    allStations.forEach(station => {
        let bootstrapElement = '' +
                '<div class="col station" style="text-align: center;">' +
                '<img class="card-img-top" style="width: 82px;" src="img/stations/' + station.logo + ' ' + '"alt="' + station.name + '">' +
                '<div class="span3">' +
                '<h5 class="card-title">' + station.name + '</h5>' +
                '<p class="card-text">' + station.number + '</p>' +
                '<button type="button" class="btn btn-dark" style="font-family: initial;" onclick="play(' + station.number + ');">' + btnSmblStart + '</button>' +
                '</div>' +
                '</div>';
        bootstrapElements += bootstrapElement;
    });
    bootstrapElements += '</div>';
    stationContainer.innerHTML += bootstrapElements;
}

function play(stationNumber) {
    try {
        let station = allStations.find(station => {
            return station.number === stationNumber.toString();
        });
        if (currentRadioState.currentRadioStation === null) {
            currentRadioState.currentRadioStation = station;
        } else {

        }
        let audioPlayer = document.getElementById("audio_player");
        audioPlayer.src = currentRadioState.currentRadioStation.url;
        audioPlayer.play();
    } catch (exception) {
        alert("Failed to start stream\n" + exception);
    }
}
