/* global stations */

const allStations = stations ? stations : [];

const buttons = {
    play: "▶",
    playPause: "⏯",
    stop: "⏹",
    pause: "⏸",
    prev: "⏮",
    next: "⏭"
};

let radio = null;

function init() {
    window.addEventListener("unhandledrejection", promiseRejectionEvent => {
        console.log(promiseRejectionEvent);
    });
    const stationContainer = document.getElementById('station_container');
    let stationCount = 0;
    let bootstrapElements = "";

    allStations.forEach(station => {
        bootstrapElements += createStationElement(station);
        stationCount++;
    });
    $("#current_station_name").text(stationCount);
    stationContainer.innerHTML += bootstrapElements;

    radio = new Radio(allStations);
}
;

function createStationElement(station) {
    const stationElementId = "station_element_id_" + station.id;
    const result = '' +
            '<div tabIndex="0" class="station" id="' + stationElementId + '" onclick="radio.play(' + station.id + ');">' +
            '<img class="station_image" src="img/stations/' + station.logo + ' ' + '"alt="' + station.name + '">' +
            '<div class="">' +
            '<h5 class="card-title">' + station.name + '</h5>' +
            '<p class="card-text">' + station.id + '</p>' +
            '</div>' +
            //'<button type="button" class="btn station_play_button" ' + buttons.play + '</button>' +
            '</div>';
    return result;
}
;

function Radio(stations) {
    const context = this;
    const audioPlayer = document.getElementById("audio_player");
    const radioStations = stations;
    const activeColor = "aquamarine";
    const inactiveColor = "honeydew";

    this.currentStation = null;

    audioPlayer.onerror = () => {
        $("#station_element_id_" + this.currentStation.id + " > button").text(buttons.play);
        $("#station_element_id_" + this.currentStation.id).css("background-color", "#f00");
        context.currentStation = null;
    };
    audioPlayer.onplay = () => {
        $("#station_element_id_" + context.currentStation.id + " > button").text(buttons.stop);
        $("#station_element_id_" + context.currentStation.id).css("background-color", activeColor);
    };
    audioPlayer.onpause = () => {
        $("#station_element_id_" + context.currentStation.id + " > button").text(buttons.play);
        $("#station_element_id_" + context.currentStation.id).css("background-color", inactiveColor);
    };

    context.stop = function () {
        if (context.currentStation) {
            $("#station_element_id_" + context.currentStation.id + " > button").text(buttons.play);
            $("#station_element_id_" + context.currentStation.id).css("background-color", inactiveColor);
            context.currentStation = null;
        }
    };

    context.play = function (stationId) {
        const newStation = radioStations.find(station => {
            return station.id === stationId.toString();
        });
        if (!newStation) {
            throw "Station " + stationId + " is not found";
        }

        if (context.currentStation) {
            // same station
            if (context.currentStation.id === stationId.toString()) {
                if (audioPlayer.paused) {
                    audioPlayer.play();
                } else {
                    audioPlayer.pause();
                }
            } else {
                $("#station_element_id_" + context.currentStation.id + " > button").text(buttons.play);
                $("#station_element_id_" + context.currentStation.id).css("background-color", inactiveColor);

                this.currentStation = newStation;

                audioPlayer.src = context.currentStation.url;
                audioPlayer.play();
            }
        } else {
            context.currentStation = newStation;

            audioPlayer.src = context.currentStation.url;
            audioPlayer.play();
        }
    };
}
;