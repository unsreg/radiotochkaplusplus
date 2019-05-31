function init() {    
    let mainContainer = document.getElementById('container_main');
    stations.forEach(station => {
        let stationElement = document.createElement("div");

        let stationNumber = document.createElement("div");
        stationNumber.innerHTML = station.number;
        stationElement.appendChild(stationNumber);

        let stationName = document.createElement("div");
        stationName.innerHTML = station.name;
        stationElement.appendChild(stationName);

        let stationUrl = document.createElement("a");
        stationUrl.title = station.url;
        stationUrl.innerText = station.url;
        stationUrl.href = station.url;
        stationElement.appendChild(stationUrl);

        let stationLogo = document.createElement("img");
        stationLogo.src = "stations" + station.logo;
        stationElement.appendChild(stationLogo);

        mainContainer.appendChild(stationElement);
    });    
}