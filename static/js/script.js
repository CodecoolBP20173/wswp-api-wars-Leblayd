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


function loadDataToTable(response) {
    let data = response.results;

    $('#loading-placeholder').remove();
    $.each(data, function(index, object) {
        object.population = appendUnitToLargeNumber(object.population);
        if (object.surface_water !== 'unknown') {
            object.surface_water += '%';
        }
        let tableRow =
            `<tr>
                <td>{{ name }}</td>
                <td>{{ diameter }}</td>
                <td>{{ climate }}</td>
                <td>{{ terrain }}</td>
                <td>{{ surface_water }}</td>
                <td>{{ population }}</td>
            </tr>`;
        tableRow = Mustache.render(tableRow, object);
        $('#index-table').append(tableRow);
    });
}


function getPlanetsData () {
    $.getJSON('https://swapi.co/api/planets', loadDataToTable);
}


function onLoadIndex() {
    getPlanetsData();
}




$(document).ready(onLoadIndex);