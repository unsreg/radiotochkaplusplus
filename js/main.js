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
        radio.stationError();
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
    const audioPlayer = document.getElementById("audio_player");
    audioPlayer.onerror = function () {
        radio.stationError();
    };
    const radioStations = stations;
    const activeColor = "aquamarine";
    const inactiveColor = "honeydew";

    this.currentStation = null;

    this.stationError = function () {
        $("#station_element_id_" + this.currentStation.id + " > button").text(buttons.play);
        $("#station_element_id_" + this.currentStation.id).css("background-color", "#f00");
        this.currentStation = null;
    };

    this.stop = function () {
        if (this.currentStation) {
            $("#station_element_id_" + this.currentStation.id + " > button").text(buttons.play);
            $("#station_element_id_" + this.currentStation.id).css("background-color", inactiveColor);
            this.currentStation = null;
        }
    };

    this.play = function (stationId) {
        const newStation = radioStations.find(station => {
            return station.id === stationId.toString();
        });
        if (!newStation) {
            throw "Station " + stationId + " is not found";
        }

        if (this.currentStation) {
            // same station
            if (this.currentStation.id === stationId.toString()) {
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    $("#station_element_id_" + this.currentStation.id + " > button").text(buttons.stop);
                    $("#station_element_id_" + this.currentStation.id).css("background-color", activeColor);
                } else {
                    audioPlayer.pause();
                    $("#station_element_id_" + this.currentStation.id + " > button").text(buttons.play);
                    $("#station_element_id_" + this.currentStation.id).css("background-color", inactiveColor);
                }
            } else {
                $("#station_element_id_" + this.currentStation.id + " > button").text(buttons.play);
                $("#station_element_id_" + this.currentStation.id).css("background-color", inactiveColor);

                this.currentStation = newStation;

                audioPlayer.src = this.currentStation.url;
                audioPlayer.play();

                $("#station_element_id_" + this.currentStation.id + " > button").text(buttons.stop);
                $("#station_element_id_" + this.currentStation.id).css("background-color", activeColor);
            }
        } else {
            this.currentStation = newStation;

            audioPlayer.src = this.currentStation.url;
            audioPlayer.play();

            $("#station_element_id_" + this.currentStation.id + " > button").text(buttons.stop);
            $("#station_element_id_" + this.currentStation.id).css("background-color", activeColor);
        }
    };
}
;