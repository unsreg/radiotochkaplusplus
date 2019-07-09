const GLOBAL = new function () {
    const context = this;
    const storageName = "rtpp_app_state_v20190706";
    const defaultStorageObj = {
        favorites: [],
        selectedTags: [],
        favoritActiveFlag: false
    };
    this.cache = new Cache();
    // ==========================================
    this.componentColor = {
        activeColor: "aquamarine",
        inactiveColor: "honeydew",
        errorColor: "#f00",
        defaultBackColor: "#fff"
    };
    this.button = {
        play: "▶",
        playPause: "⏯",
        stop: "⏹",
        pause: "⏸",
        prev: "⏮",
        next: "⏭"
    };
    // ==========================================    
    this.getAppStorage = function () {
        function AppStorage() {
            const storageCacheKey = "app_storage_cache";
            // remove old version
            if (localStorage.getItem("rtpp_app_state") !== null) {
                localStorage.removeItem("rtpp_app_state");
            }
            context.cache.set(storageCacheKey, () => {
                if (!localStorage.getItem(storageName)) {
                    localStorage.setItem(storageName, JSON.stringify(defaultStorageObj));
                }
                return JSON.parse(localStorage.getItem(storageName));
            });
            this.getState = function () {
                return context.cache.get(storageCacheKey);
            };
            this.setState = function (state) {
                localStorage.setItem(storageName, JSON.stringify(state));
                context.cache.invalidate(storageCacheKey);
            };
        }
        const appStorage = new AppStorage();
        return  () => {
            return appStorage;
        };
    }();
    // ==========================================    
    this.getAllStationElements = function () {
        const allStationElenentsCacheKey = "all_station_elements_cache_key";
        context.cache.set(allStationElenentsCacheKey, () => {
            return domUtils.getChildElementsById("station_container");
        });
        return () => {
            return context.cache.get(allStationElenentsCacheKey);
        };
    }();
    this.getAllStations = function () {
        const allStationsCacheKey = "all_stations_cache_key";
        context.cache.set(allStationsCacheKey, () => {
            return stations ? stations : [];/* global stations */
        });
        return () => {
            return context.cache.get(allStationsCacheKey);
        };
    }();
    // ==========================================
    this.getAllTags = function () {
        const allTagsCacheKey = "all_tags_cache_key";
        context.cache.set(allTagsCacheKey, () => {
            const existingTags = [];
            context.getAllStations().forEach(station => {
                station.tags.forEach(tag => {
                    if (!existingTags.includes(tag)) {
                        existingTags.push(tag);
                    }
                });
            });
            existingTags.sort();
            return existingTags;
        });
        return () => {
            return context.cache.get(allTagsCacheKey);
        };
    }();
    this.getSelectedTags = function () {
        const selectedTagsCacheKey = "selected_tags_cache_key";
        context.cache.set(selectedTagsCacheKey, () => {
            return context.getAppStorage().getState()["selectedTags"];
        });
        return () => {
            return context.cache.get(selectedTagsCacheKey);
        };
    }();
    this.setSelectedTags = function (tags) {
        const selectedTagsCacheKey = "selected_tags_cache_key";
        const state = context.getAppStorage().getState();
        state["selectedTags"] = tags;
        context.getAppStorage().setState(state);
        context.cache.invalidate(selectedTagsCacheKey);
    };
    // ==========================================
    this.getFavoriteActiveFlag = function () {
        const favoriteActiveFlagCacheKey = "favorite_active_flag_cache_key";
        context.cache.set(favoriteActiveFlagCacheKey, () => {
            return context.getAppStorage().getState()["favoritActiveFlag"];
        });
        return () => {
            return context.cache.get(favoriteActiveFlagCacheKey);
        };
    }();
    this.invertFavoritActiveFlag = function () {
        const favoriteActiveFlagCacheKey = "favorite_active_flag_cache_key";
        const state = context.getAppStorage().getState();
        state["favoritActiveFlag"] = !state["favoritActiveFlag"];
        context.getAppStorage().setState(state);
        context.cache.invalidate(favoriteActiveFlagCacheKey);
    };
    this.getFavorites = function () {
        const favoritesCacheKey = "favorites_cache_key";
        context.cache.set(favoritesCacheKey, () => {
            return context.getAppStorage().getState()["favorites"];
        });
        return () => {
            return context.cache.get(favoritesCacheKey);
        };
    }();
    this.setFavorites = function (favorites) {
        const favoritesCacheKey = "favorites_cache_key";
        const state = context.getAppStorage().getState();
        state["favorites"] = favorites;
        context.getAppStorage().setState(state);
        context.cache.invalidate(favoritesCacheKey);
    };

    function Cache() {
        const cache = {};
        this.set = function (key, getDataCallback) {
            cache[key] = {
                data: null,
                dataProvider: getDataCallback
            };
        };
        this.get = function (key) {
            if (!cache[key].data) {
                cache[key].data = cache[key]["dataProvider"]();
            }
            return cache[key].data;
        };
        this.invalidate = function (key) {
            cache[key].data = null;
        };
    }
};

let radio = null;

const domUtils = new function () {
    this.getElementById = (id) => {
        return document.getElementById(id);
    };
    this.getElementByClass = (className) => {
        return document.getElementsByClassName(className);
    };
    this.getChildElementsById = (id) => {
        return $("#" + id + " > .station");
    };
    this.addClass = (element, className) => {
        return element.classList.add(className);
    };
    this.removeClass = (element, className) => {
        return element.classList.remove(className);
    };
    this.toggleClass = (element, className) => {
        if (element.classList.contains(className)) {
            element.classList.toggle(className);
        }
    };
    this.changeStyle = (element, styleKey, styleValue) => {
        element.style[styleKey] = styleValue;
    };
}();

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
            '<span id="favorite_tag_id" tabIndex="0" class="tag common_control" onclick="onClickTag(event);" style="background-color: ' + favColor + ';">' +
            '<img class="favorit_button_image" src="img/star_fill.svg" alt="Favorite"/>' +
            '</span>';
    GLOBAL.getAllTags().forEach(tag => {
        tagElements += createElementTag(tag);
    });
    const tagContainer = domUtils.getElementById('tag_container');
    tagContainer.innerHTML += tagElements;

    radio = new Radio(GLOBAL.getAllStations());

    updateView();
}

function updateView() {
    let stationCount = 0;
    GLOBAL.getAllStationElements().each(function () {
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
    domUtils.getElementById("current_station_count").innerText = "Count: " + stationCount + "; ";
    $("#current_station_name").text("Current: ");
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
    let backColor = GLOBAL.componentColor.inactiveColor;
    if (GLOBAL.getSelectedTags().includes(tagName)) {
        backColor = GLOBAL.componentColor.activeColor;
    } else {
        backColor = GLOBAL.componentColor.inactiveColor;
    }
    const result = '' +
            '<span tabIndex="0" class="tag common_control" onclick="onClickTag(event);" style="background-color: ' + backColor + ';">' +
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
            '<div tabIndex="0" class="common_control station" id="' + stationElementId + '" ' + 'onclick="radio.play(' + station.id + ');" ondblclick="onClickStationFavorite(event, ' + station.id + ');" style="background-color: ' + backColor + ';">' +
            '<div class="station_image_container">' +
            '<img class="station_favorit_star" src="' + favoriteStateImage + '" alt="Favorite" onclick="onClickStationFavorite(event, ' + station.id + ');"/>' +
            '<img class="station_image" src="img/stations/' + station.logo + ' ' + '"alt="' + station.name + '">' +
            '</div>' +
            '<div class="station_name_and_id">' + station.name + ' (' + station.id + ')' + '</div>' +
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
    $("#station_element_id_" + stationId + " > .station_image_container > .station_favorit_star").attr("src", favoriteStateImage);
    GLOBAL.setFavorites(favoriteStationIds);
    if (GLOBAL.getFavoriteActiveFlag()) {
        updateView();
    }
}

function setMainBackgroundColor(station) {
    const container = $("#container");
    if (station) {
        let strHash = crc32Hash(station.id + station.name + station.url).toString();
        let red = parseInt(strHash.substring(0, 3), 10);
        let green = parseInt(strHash.substring(3, 6), 10);
        let blue = parseInt(strHash.substring(7, 10), 10);
        red > 255 ? red %= 255 : red;
        green > 255 ? green %= 255 : green;
        blue > 255 ? blue %= 255 : blue;
        container.css("background-color", "rgb(" + parseInt(red, 10) + ", " + parseInt(green, 10) + ", " + parseInt(blue, 10) + ", 0.2)");
    } else {
        container.css("background-color", GLOBAL.componentColor.defaultBackColor);
    }
}

function crc32Hash(string) {
    function makeCRCTable() {
        let c;
        let crcTable = [];
        for (let n = 0; n < 256; n++) {
            c = n;
            for (let k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            crcTable[n] = c;
        }
        return crcTable;
    }
    function crc32(str) {
        let crcTable = window.crcTable || (window.crcTable = makeCRCTable());
        let crc = 0 ^ (-1);
        for (let i = 0; i < str.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    }
    return crc32(string);
}

function Radio(stations) {
    const context = this;
    const audioPlayer = document.getElementById("audio_player");
    const radioStations = stations;
    const stationNameElement = $("#current_station_name");

    this.currentStation = null;

    audioPlayer.onerror = () => {
        $("#station_element_id_" + context.currentStation.id).css("background-color", GLOBAL.componentColor.errorColor);
        stationNameElement.text("Current: ");
        setMainBackgroundColor();
        context.currentStation = null;
    };
    audioPlayer.onplay = () => {
        $("#station_element_id_" + context.currentStation.id).css("background-color", GLOBAL.componentColor.activeColor);
        stationNameElement.text('Current: "' + context.currentStation.name + " (" + context.currentStation.id + ")" + '";');
        setMainBackgroundColor(context.currentStation);
    };
    audioPlayer.onpause = () => {
        $("#station_element_id_" + context.currentStation.id).css("background-color", GLOBAL.componentColor.inactiveColor);
        stationNameElement.text("Current: ");
        setMainBackgroundColor();
        context.currentStation = null;
    };
    context.stop = function () {
        if (context.currentStation) {
            if (audioPlayer.played) {
                audioPlayer.pause();
            }
        }
    };
    context.playRandomStation = function () {
        const stationIndex = Math.floor((Math.random() * radioStations.length - 1) + 1);
        context.play(radioStations[stationIndex].id);
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