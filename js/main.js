const GLOBAL = new function () {
    const context = this;
    const storageName = "rtpp_app_state_v20190706";
    const defaultStorageObj = {
        favorites: [],
        selectedTags: [],
        favoritActiveFlag: false
    };
    const allStations = stations ? stations : [];/* global stations */
    this.componentColor = {
        activeColor: "aquamarine",
        inactiveColor: "honeydew",
        errorColor: "#f00"
    };
    this.button = {
        play: "▶",
        playPause: "⏯",
        stop: "⏹",
        pause: "⏸",
        prev: "⏮",
        next: "⏭"
    };
    this.getAllStations = function () {
        return allStations;
    };
    const existingTags = [];
    this.getAllStations().forEach(station => {
        station.tags.forEach(tag => {
            if (!existingTags.includes(tag)) {
                existingTags.push(tag);
            }
        });
    });
    existingTags.sort();
    this.getAllTags = function () {
        return existingTags;
    };
    this.getFavoriteActiveFlag = function () {
        return context.appStorage.getState()["favoritActiveFlag"];
    };
    this.invertFavoritActiveFlag = function () {
        const state = context.appStorage.getState();
        state["favoritActiveFlag"] = !state["favoritActiveFlag"];
        context.appStorage.setState(state);
    };
    this.getSelectedTags = function () {
        return context.appStorage.getState()["selectedTags"];
    };
    this.setSelectedTags = function (tags) {
        const state = context.appStorage.getState();
        state["selectedTags"] = tags;
        context.appStorage.setState(state);
    };
    this.getFavorites = function () {
        return context.appStorage.getState()["favorites"];
    };
    this.setFavorites = function (favorites) {
        const state = context.appStorage.getState();
        state["favorites"] = favorites;
        context.appStorage.setState(state);
    };
    this.appStorage = new AppStorage();
    function AppStorage() {
        // remove old version
        if (localStorage.getItem("rtpp_app_state") !== null) {
            localStorage.removeItem("rtpp_app_state");
        }
        this.getState = function () {
            if (!localStorage.getItem(storageName)) {
                localStorage.setItem(storageName, JSON.stringify(defaultStorageObj));
            }
            return JSON.parse(localStorage.getItem(storageName));
        };
        this.setState = function (state) {
            localStorage.setItem(storageName, JSON.stringify(state));
        };
    }
};

let radio = null;

function onLoadBody() {
    window.addEventListener("unhandledrejection", promiseRejectionEvent => {
        console.log(promiseRejectionEvent);
    });

    let stationElements = "";

    GLOBAL.getAllStations().forEach(station => {
        stationElements += createElementStation(station);
    });

    const stationContainer = document.getElementById('station_container');
    stationContainer.innerHTML += stationElements;

    let tagElements = "";

    let favColor = GLOBAL.componentColor.inactiveColor;
    if (GLOBAL.getFavoriteActiveFlag()) {
        favColor = GLOBAL.componentColor.activeColor;
    }
    // add favorite
    tagElements += '' +
            '<span id="favorite_tag_id" tabIndex="0" class="tag" onclick="onClickTag(event);" style="background-color: ' + favColor + ';">' +
            '<img class="favorit_button_image" src="img/star_fill.svg" alt="Favorite"/>' +
            '</span>';
    GLOBAL.getAllTags().forEach(tag => {
        tagElements += createElementTag(tag);
    });
    const tagContainer = document.getElementById('tag_container');
    tagContainer.innerHTML += tagElements;

    radio = new Radio(GLOBAL.getAllStations());

    updateView();
}

function updateView() {
    let stationCount = 0;
    $("#station_container > .station").each(function () {
        const elemId = $(this).attr('id').replace("station_element_id_", "").toString();
        GLOBAL.getAllStations().forEach(station => {
            const stationId = station.id.toString();
            if (stationId === elemId) {
                let showByFavoriteStatus = true;
                if (GLOBAL.getFavoriteActiveFlag()) {
                    if (!GLOBAL.getFavorites().includes(station.id.toString())) {
                        showByFavoriteStatus = false;
                    }
                }
                if (showByFavoriteStatus) {
                    let anyTagFound = false;
                    station.tags.forEach(tag => {
                        if (GLOBAL.getSelectedTags().includes(tag)) {
                            anyTagFound = true;
                            return;
                        }
                    });
                    if (anyTagFound || GLOBAL.getSelectedTags().length === 0) {
                        $(this).css('display', 'inline-block');
                        stationCount++;
                    } else {
                        $(this).css('display', 'none');
                    }
                    return;
                } else {
                    $(this).css('display', 'none');
                }
            }
        });
    });
    $("#current_station_count").text(stationCount);
}

function onClickTag(event) {
    const tagElement = $(event.currentTarget);

    if (tagElement.attr("id") === "favorite_tag_id") {// if favorite tag element
        GLOBAL.invertFavoritActiveFlag();
        if (GLOBAL.getFavoriteActiveFlag()) {
            tagElement.css("background-color", GLOBAL.componentColor.activeColor);
        } else {
            tagElement.css("background-color", GLOBAL.componentColor.inactiveColor);
        }
    } else {// if common tag element
        const tagName = tagElement.text();
        let selectedTags = GLOBAL.getSelectedTags();

        if (selectedTags.includes(tagName)) {
            // remove element
            selectedTags.splice(selectedTags.indexOf(tagName), 1);
            tagElement.css("background-color", GLOBAL.componentColor.inactiveColor);
        } else {
            selectedTags.push(tagName);
            tagElement.css("background-color", GLOBAL.componentColor.activeColor);
        }
        GLOBAL.setSelectedTags(selectedTags);
    }
    updateView();
}

function createElementTag(tagName) {
    const appState = GLOBAL.appStorage.getState();
    let backColor = GLOBAL.componentColor.inactiveColor;
    if (GLOBAL.getSelectedTags().includes(tagName)) {
        backColor = GLOBAL.componentColor.activeColor;
    } else {
        backColor = GLOBAL.componentColor.inactiveColor;
    }
    const result = '' +
            '<span tabIndex="0" class="tag" onclick="onClickTag(event);" style="background-color: ' + backColor + ';">' +
            tagName
            + '</span>';
    return result;
}

function createElementStation(station) {
    const backColor = GLOBAL.componentColor.inactiveColor;
    const stationElementId = "station_element_id_" + station.id;
    let favoriteStateImage;
    if (isFavorite(station.id)) {
        favoriteStateImage = "img/star_fill.svg";
    } else {
        favoriteStateImage = "img/star_empty.svg";
    }
    const result = '' +
            '<div tabIndex="0" class="station" id="' + stationElementId + '" ' + 'onclick="radio.play(' + station.id + ');" ondblclick="onClickStationFavorite(event, ' + station.id + ');" style="background-color: ' + backColor + ';">' +
            '<img class="station_favorit_star" src="' + favoriteStateImage + '" alt="Favorite" onclick="onClickStationFavorite(event, ' + station.id + ');"/>' +
            '<img class="station_image" src="img/stations/' + station.logo + ' ' + '"alt="' + station.name + '">' +
            '<div class="">' +
            '<h5 class="card-title">' + station.name + '</h5>' +
            '<p class="card-text">' + station.id + '</p>' +
            '</div>' +
            '</div>';
    return result;
}

function isFavorite(stationId) {
    if (GLOBAL.getFavorites().includes(stationId.toString())) {
        return true;
    } else {
        return false;
    }
}

function onClickStationFavorite(event, stationId) {
    event.stopPropagation();

    const favoriteStationIds = GLOBAL.getFavorites();
    let favoriteStateImage;
    if (favoriteStationIds.includes(stationId.toString())) {
        // remove element
        favoriteStationIds.splice(favoriteStationIds.indexOf(stationId.toString()), 1);
        favoriteStateImage = "img/star_empty.svg";
    } else {
        favoriteStationIds.push(stationId.toString());
        favoriteStateImage = "img/star_fill.svg";
    }
    $("#station_element_id_" + stationId + " > .station_favorit_star").attr("src", favoriteStateImage);
    GLOBAL.setFavorites(favoriteStationIds);
}

function Radio(stations) {
    const context = this;
    const audioPlayer = document.getElementById("audio_player");
    const radioStations = stations;
    const stationNameElement = $("#current_station_name");

    this.currentStation = null;

    audioPlayer.onerror = () => {
        $("#station_element_id_" + context.currentStation.id).css("background-color", GLOBAL.componentColor.errorColor);
        stationNameElement.text("");
        context.currentStation = null;
    };
    audioPlayer.onplay = () => {
        $("#station_element_id_" + context.currentStation.id).css("background-color", GLOBAL.componentColor.activeColor);
        stationNameElement.text(context.currentStation.name + " (" + context.currentStation.id + ")");
    };
    audioPlayer.onpause = () => {
        $("#station_element_id_" + context.currentStation.id).css("background-color", GLOBAL.componentColor.inactiveColor);
        stationNameElement.text("");
    };
    context.stop = function () {
        if (context.currentStation) {
            $("#station_element_id_" + context.currentStation.id).css("background-color", GLOBAL.componentColor.inactiveColor);
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
                $("#station_element_id_" + context.currentStation.id).css("background-color", GLOBAL.componentColor.inactiveColor);
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