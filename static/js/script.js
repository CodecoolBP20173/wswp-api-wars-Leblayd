// Mustache example:
// Mustache.render("{{a}}", {a: "x"});
// returns "x"

function appendUnitToLargeNumber(num) {
    let units = ['', ' Thousand', ' Million', ' Billion', ' Trillion', 'Quadrillion', 'Quintillion'];
    let unitIndex = 0;

    // Divide the number by 1000 as long as it stays above 1
    while ( !Math.floor(num / 1000) < 1) {
        unitIndex++;
        num = num / 1000;
    }
    return num.toString() + units[unitIndex];
}


function openResidentsModal(event) {
    console.log(this);
    $('#modal-large').modal('show');
}


function appendResidentsButton(object) {
    if (object.residents.length > 0) {
        let buttonHTML = Mustache.render(
            `<button class="btn btn-primary" id="button-{{index}}-residents">
                {{residents.length}} resident(s)
            </button>`,
            object);
        $('#table-' + object.index + '-residents')
            .append(buttonHTML)
            .click(openResidentsModal);
    }
}


function loadDataToTable(response) {
    let data = response.results;

    $('#loading-placeholder').remove();
    $.each(data, function(index, object) {
        object['index'] = index;
        object.population = appendUnitToLargeNumber(object.population);
        if (object.surface_water !== 'unknown') {
            object.surface_water += '%';
        }
        let tableRow = Mustache.render(
            `<tr>
                <td id="table-{{index}}-name">{{ name }}</td>
                <td id="table-{{index}}-diameter">{{ diameter }}</td>
                <td id="table-{{index}}-climate">{{ climate }}</td>
                <td id="table-{{index}}-terrain">{{ terrain }}</td>
                <td id="table-{{index}}-surface-water">{{ surface_water }}</td>
                <td id="table-{{index}}-population">{{ population }}</td>
                <td id="table-{{index}}-residents"></td>
            </tr>`,
            object);
        $('#index-table').append(tableRow);

        appendResidentsButton(object);
    });
    console.log(data);
}


function getPlanetsData () {
    $.getJSON('https://swapi.co/api/planets', loadDataToTable);
}


function onLoadIndex() {
    getPlanetsData();
}




$(document).ready(onLoadIndex);