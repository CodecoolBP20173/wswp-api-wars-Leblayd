function loadDataToTable(response) {
    let data = response.results;
    console.log(data);
}


function getPlanetsData () {
    $.getJSON('https://swapi.co/api/planets', loadDataToTable);
}


function onLoadIndex() {
    getPlanetsData();
}


$(document).ready(onLoadIndex);