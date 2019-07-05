/* global stations */

const ALL_STATIONS = stations ? stations : [];
const CONST_BUTTON = {
    play: "▶",
    playPause: "⏯",
    stop: "⏹",
    pause: "⏸",
    prev: "⏮",
    next: "⏭"
};
const CONST_TAG = {
    activeColor: "aquamarine",
    inactiveColor: "honeydew"
};
const APP_STORAGE = new AppStorage();
let radio = null;

function AppStorage() {
    const defaultStorageObj = {
        favorite: [],
        selectedTag: []
    };
    const localStorageAppName = "rtpp_app_state";

    this.getState = function () {
        if (!localStorage.getItem(localStorageAppName)) {
            localStorage.setItem(localStorageAppName, JSON.stringify(defaultStorageObj));
        }
        return JSON.parse(localStorage.getItem(localStorageAppName));
    };
    this.setState = function (state) {
        localStorage.setItem(localStorageAppName, JSON.stringify(state));
    };
}

function onLoadBody() {
    window.addEventListener("unhandledrejection", promiseRejectionEvent => {
        console.log(promiseRejectionEvent);
    });

    let stationCount = 0;
    let stationElements = "";
    let tags = [];

    ALL_STATIONS.forEach(station => {
        station.tags.forEach(tag => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });
        if (isAnyTagSelected(station.tags)) {
            stationElements += createStationElement(station);
            stationCount++;
        }
    });

    const stationContainer = document.getElementById('station_container');
    stationContainer.innerHTML += stationElements;

    tags.sort();
    let tagElements = "";

    tags.forEach(tag => {
        tagElements += createTagElement(tag);
    });
    const tagContainer = document.getElementById('tag_container');
    tagContainer.innerHTML += tagElements;

    $("#current_station_name").text(stationCount);

    radio = new Radio(ALL_STATIONS);
}

function isAnyTagSelected(tags) {
    const appState = APP_STORAGE.getState();
    const selectedTags = appState["selectedTag"];
    let result = false;
    if (selectedTags.length === 0) {
        result = true;
    } else {
        tags.forEach(tag => {
            if (selectedTags.includes(tag)) {
                result = true;
                return;
            }
        });
    }
    return result;
}

function onClickTag(event) {
    const appState = APP_STORAGE.getState();
    const tagElement = $(event.currentTarget);
    const tagName = tagElement.text();
    let selectedTags = appState["selectedTag"];

    if (selectedTags.includes(tagName)) {
        // remove element
        selectedTags.splice(selectedTags.indexOf(tagName), 1);
        tagElement.css("background-color", CONST_TAG.inactiveColor);
    } else {
        selectedTags.push(tagName);
        tagElement.css("background-color", CONST_TAG.activeColor);
    }
    appState["selectedTag"] = selectedTags;
    APP_STORAGE.setState(appState);

    let stationCount = 0;
    $("#station_container > .station").each(function () {
        const elemId = $(this).attr('id').replace("station_element_id_", "");
        ALL_STATIONS.forEach(station => {
            if (station.id.toString() === elemId.toString()) {
                let anyTagFound = false;
                station.tags.forEach(tag => {
                    if (selectedTags.includes(tag)) {
                        anyTagFound = true;
                        return;
                    }
                });
                if (anyTagFound || selectedTags.length === 0) {
                    $(this).css('display', 'inline-block');
                    stationCount++;
                } else {
                    $(this).css('display', 'none');
                }
                return;
            }
        });
    });
    $("#current_station_name").text(stationCount);
}

function createTagElement(tagName) {
    const appState = APP_STORAGE.getState();
    let tagColor = CONST_TAG.inactiveColor;
    if (appState["selectedTag"].includes(tagName)) {
        tagColor = CONST_TAG.activeColor;
    } else {
        tagColor = CONST_TAG.inactiveColor;
    }
    const result = '' +
            '<div tabIndex="0" class="tag" onclick="onClickTag(event);" style="background-color: ' + tagColor + ';">' +
            tagName
            + '</div>';
    return result;
}

function createStationElement(station) {
    const stationElementId = "station_element_id_" + station.id;
    let favoriteStateImage;
    if (isFavorite(station.id)) {
        favoriteStateImage = "img/star_fill.svg";
    } else {
        favoriteStateImage = "img/star_empty.svg";
    }
    const result = '' +
            '<div tabIndex="0" class="station" id="' + stationElementId + '" ' + 'onclick="radio.play(' + station.id + ');">' +
            '<img class="station_favorit_star" src="' + favoriteStateImage + '" alt="Empty star" onclick="onClickStationFavorite(event, ' + station.id + ');"/>' +
            '<img class="station_image" src="img/stations/' + station.logo + ' ' + '"alt="' + station.name + '">' +
            '<div class="">' +
            '<h5 class="card-title">' + station.name + '</h5>' +
            '<p class="card-text">' + station.id + '</p>' +
            '</div>' +
            '</div>';
    return result;
}

function isFavorite(stationId) {
    const appState = APP_STORAGE.getState();
    if (appState["favorite"].includes(stationId.toString())) {
        return true;
    } else {
        return false;
    }
}

function changeFavoriteStatus(stationId) {
    const appState = APP_STORAGE.getState();
    let favoriteStationIds = appState["favorite"];
    let favoriteStateImage;
    if (favoriteStationIds.includes(stationId.toString())) {
        // remove element
        favoriteStationIds.splice(favoriteStationIds.indexOf(stationId.toString()), 1);
        appState["favorite"] = favoriteStationIds;
        favoriteStateImage = "img/star_empty.svg";
    } else {
        appState["favorite"].push(stationId.toString());
        favoriteStateImage = "img/star_fill.svg";
    }
    $("#station_element_id_" + stationId + " > .station_favorit_star").attr("src", favoriteStateImage);
    APP_STORAGE.setState(appState);
}

function onClickStationFavorite(event, stationId) {
    event.stopPropagation();
    changeFavoriteStatus(stationId);
}

function Radio(stations) {
    const context = this;
    const audioPlayer = document.getElementById("audio_player");
    const radioStations = stations;
    const activeColor = "aquamarine";
    const inactiveColor = "honeydew";

    this.currentStation = null;

    audioPlayer.onerror = () => {
        $("#station_element_id_" + this.currentStation.id).css("background-color", "#f00");
        context.currentStation = null;
    };
    audioPlayer.onplay = () => {
        $("#station_element_id_" + context.currentStation.id).css("background-color", activeColor);
    };
    audioPlayer.onpause = () => {
        $("#station_element_id_" + context.currentStation.id).css("background-color", inactiveColor);
    };

    context.stop = function () {
        if (context.currentStation) {
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